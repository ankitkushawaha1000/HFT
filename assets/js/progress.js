
const DEFAULT_STATE = {
  completed: {},
  scores: {},
  bookmarks: {},
  quizResults: []
};

export class ProgressController {
  constructor({ storageKey = 'hft-interview-progress' } = {}) {
    this.storageKey = storageKey;
    this.state = this.#load();
  }

  #load() {
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) return structuredClone(DEFAULT_STATE);
      return {
        ...structuredClone(DEFAULT_STATE),
        ...JSON.parse(raw)
      };
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }

  #persist() {
    window.localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    window.dispatchEvent(new CustomEvent('progress:updated', { detail: this.state }));
  }

  getQuestionState(questionId) {
    return {
      completed: Boolean(this.state.completed[questionId]),
      score: this.state.scores[questionId] ?? null,
      bookmarked: Boolean(this.state.bookmarks[questionId])
    };
  }

  toggleComplete(questionId, value = !this.state.completed[questionId]) {
    this.state.completed[questionId] = Boolean(value);
    this.#persist();
    return this.getQuestionState(questionId);
  }

  setScore(questionId, score) {
    const normalized = Number(score);
    if (Number.isFinite(normalized) && normalized >= 1 && normalized <= 5) {
      this.state.scores[questionId] = normalized;
      this.#persist();
    }
    return this.getQuestionState(questionId);
  }

  toggleBookmark(questionId) {
    this.state.bookmarks[questionId] = !this.state.bookmarks[questionId];
    this.#persist();
    return this.getQuestionState(questionId);
  }

  saveQuizResult(result) {
    this.state.quizResults.unshift({
      ...result,
      savedAt: new Date().toISOString()
    });
    this.state.quizResults = this.state.quizResults.slice(0, 30);
    this.#persist();
  }

  getQuizResults() {
    return [...this.state.quizResults];
  }

  getCompletionStats(questions) {
    const total = questions.length;
    const completedCount = questions.filter((question) => this.state.completed[question.id]).length;
    const scoredQuestions = questions.filter((question) => this.state.scores[question.id] != null);
    const averageScore = scoredQuestions.length
      ? scoredQuestions.reduce((sum, question) => sum + this.state.scores[question.id], 0) / scoredQuestions.length
      : 0;

    const byCategory = questions.reduce((accumulator, question) => {
      const topic = question.topic;
      if (!accumulator[topic]) {
        accumulator[topic] = { total: 0, completed: 0 };
      }
      accumulator[topic].total += 1;
      if (this.state.completed[question.id]) accumulator[topic].completed += 1;
      return accumulator;
    }, {});

    return {
      total,
      completedCount,
      completionPct: total ? Math.round((completedCount / total) * 100) : 0,
      averageScore,
      bookmarkedCount: Object.values(this.state.bookmarks).filter(Boolean).length,
      byCategory,
      bookmarks: questions.filter((question) => this.state.bookmarks[question.id])
    };
  }

  exportProgress() {
    const blob = new Blob([JSON.stringify(this.state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'hft-progress-export.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  resetProgress() {
    const confirmed = window.confirm('Reset all completion state, bookmarks, scores, and mock interview history?');
    if (!confirmed) return false;
    this.state = structuredClone(DEFAULT_STATE);
    this.#persist();
    return true;
  }
}
