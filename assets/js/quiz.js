
const formatDuration = (seconds) => {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainder = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${remainder}`;
};

const shuffle = (items) => {
  const cloned = [...items];
  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }
  return cloned;
};

export class QuizController {
  constructor({ elements, renderMarkdown, progress }) {
    this.elements = elements;
    this.renderMarkdown = renderMarkdown;
    this.progress = progress;
    this.questions = [];
    this.activeDurationMinutes = 2;
    this.timerHandle = null;
    this.remainingSeconds = 120;
    this.currentQuestion = null;
    this.pool = [];
    this.results = [];
  }

  initialize(questions) {
    this.questions = questions;
    if (!this.isBound) {
      this.#bind();
      this.isBound = true;
    }
    this.#renderReviewList();
  }

  #bind() {
    this.elements.timerOptions.addEventListener('click', (event) => {
      const button = event.target.closest('[data-minutes]');
      if (!button) return;
      for (const chip of this.elements.timerOptions.querySelectorAll('[data-minutes]')) {
        chip.classList.toggle('is-active', chip === button);
      }
      this.activeDurationMinutes = Number(button.dataset.minutes);
      this.remainingSeconds = this.activeDurationMinutes * 60;
      this.#updateTimer();
    });

    this.elements.startButton.addEventListener('click', () => this.start());
    this.elements.reviewButton.addEventListener('click', () => this.#renderReviewList(true));
  }

  #updateTimer() {
    this.elements.timer.textContent = formatDuration(this.remainingSeconds);
  }

  #pickPool() {
    const topic = this.elements.topicFilter.value;
    const company = this.elements.companyFilter.value;
    const filtered = this.questions.filter((question) => {
      const topicOk = topic === 'all' || question.topic === topic;
      const companyOk = company === 'all' || question.companies.includes(company);
      return topicOk && companyOk;
    });
    return shuffle(filtered);
  }

  start() {
    this.pool = this.#pickPool();
    if (!this.pool.length) {
      this.elements.stage.innerHTML = '<div class="error-card">No questions match the current mock interview filters.</div>';
      return;
    }

    this.results = [];
    this.remainingSeconds = this.activeDurationMinutes * 60;
    this.#updateTimer();
    this.#startTimer();
    this.#nextQuestion();
  }

  #startTimer() {
    window.clearInterval(this.timerHandle);
    this.timerHandle = window.setInterval(() => {
      this.remainingSeconds -= 1;
      this.#updateTimer();
      if (this.remainingSeconds <= 0) {
        this.finish('timebox-expired');
      }
    }, 1000);
  }

  #nextQuestion() {
    this.currentQuestion = this.pool.shift();
    if (!this.currentQuestion) {
      this.finish('question-pool-exhausted');
      return;
    }

    const rubric = Object.entries(this.currentQuestion.rubric)
      .map(([score, text]) => `<li><strong>${score}</strong> — ${text}</li>`)
      .join('');

    this.elements.stage.innerHTML = `
      <div class="quiz-card">
        <p class="eyebrow">${this.currentQuestion.topic} · ${this.currentQuestion.difficulty}</p>
        <h3>${this.currentQuestion.title}</h3>
        <p>${this.currentQuestion.prompt}</p>
        <div class="quiz-stage__actions">
          <button class="button reveal-answer">Reveal answer</button>
          <button class="button button--ghost next-question" disabled>Next question</button>
        </div>
        <div class="question-answer" hidden>
          ${this.renderMarkdown(this.currentQuestion.answer)}
          <h4>Self-scoring rubric</h4>
          <ul class="rubric-list">${rubric}</ul>
          <label class="field">
            <span>Your score</span>
            <select class="quiz-score-select">
              <option value="">Select score</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
        </div>
      </div>
    `;

    const revealButton = this.elements.stage.querySelector('.reveal-answer');
    const nextButton = this.elements.stage.querySelector('.next-question');
    const answer = this.elements.stage.querySelector('.question-answer');
    const scoreSelect = this.elements.stage.querySelector('.quiz-score-select');

    revealButton.addEventListener('click', () => {
      answer.hidden = false;
      revealButton.disabled = true;
      revealButton.textContent = 'Answer revealed';
      nextButton.disabled = false;
    });

    scoreSelect.addEventListener('change', () => {
      const score = Number(scoreSelect.value);
      if (!Number.isFinite(score) || !this.currentQuestion) return;
      this.progress.setScore(this.currentQuestion.id, score);
      this.progress.toggleComplete(this.currentQuestion.id, true);
      const existing = this.results.find((entry) => entry.id === this.currentQuestion.id);
      if (existing) {
        existing.score = score;
      } else {
        this.results.push({
          id: this.currentQuestion.id,
          title: this.currentQuestion.title,
          topic: this.currentQuestion.topic,
          score
        });
      }
    });

    nextButton.addEventListener('click', () => this.#nextQuestion());
  }

  finish(reason) {
    window.clearInterval(this.timerHandle);
    this.timerHandle = null;
    const averageScore = this.results.length
      ? this.results.reduce((sum, result) => sum + result.score, 0) / this.results.length
      : 0;

    const payload = {
      reason,
      durationMinutes: this.activeDurationMinutes,
      answeredCount: this.results.length,
      averageScore,
      filters: {
        topic: this.elements.topicFilter.value,
        company: this.elements.companyFilter.value
      },
      results: this.results
    };
    this.progress.saveQuizResult(payload);
    this.#renderSummary(payload);
  }

  #renderSummary(payload) {
    this.elements.stage.innerHTML = `
      <div class="quiz-card">
        <p class="eyebrow">Mock session saved</p>
        <h3>Session complete</h3>
        <p>Reason: <strong>${payload.reason.replaceAll('-', ' ')}</strong></p>
        <p>Answered <strong>${payload.answeredCount}</strong> question(s) with an average score of <strong>${payload.averageScore.toFixed(1)}</strong>.</p>
        <button class="button" id="restart-quiz">Start another session</button>
      </div>
    `;
    this.elements.stage.querySelector('#restart-quiz').addEventListener('click', () => this.start());
    this.#renderReviewList();
  }

  #renderReviewList(force = false) {
    const history = this.progress.getQuizResults();
    if (!force && !history.length) return;
    if (!history.length) {
      this.elements.stage.innerHTML = '<div class="empty-state">No saved mock sessions yet.</div>';
      return;
    }

    this.elements.stage.innerHTML = `
      <div class="review-list">
        ${history.map((session) => `
          <article class="result-card">
            <div class="result-card__header">
              <div>
                <p class="result-card__label">${new Date(session.savedAt).toLocaleString()}</p>
                <h3>${session.durationMinutes}-minute mock · ${session.filters.topic} · ${session.filters.company}</h3>
              </div>
              <span class="badge">Avg ${session.averageScore.toFixed(1)}</span>
            </div>
            <p class="muted">Answered ${session.answeredCount} question(s); ended because ${session.reason.replaceAll('-', ' ')}.</p>
            <ul>
              ${session.results.map((result) => `<li>${result.title} — score ${result.score}</li>`).join('') || '<li>No scored answers recorded.</li>'}
            </ul>
          </article>
        `).join('')}
      </div>
    `;
  }
}
