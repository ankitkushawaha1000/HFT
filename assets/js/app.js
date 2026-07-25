
import { SearchController } from './search.js';
import { ProgressController } from './progress.js';
import { QuizController } from './quiz.js';

// Static routes for panels that are not driven by content-index.json
const STATIC_ROUTES = {
  home: { panel: 'home' },
  'mock-interviews': { panel: 'mock-interviews' },
  'question-bank': { panel: 'question-bank' }
};

// Legacy section routes kept for backward compatibility (redirect to first sub-page)
const LEGACY_SECTION_ROUTES = new Set([
  'study-plans', 'behavioral', 'cpp', 'systems', 'low-latency', 'design', 'trading', 'coding',
  'optiver', 'research'
]);

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const fallbackMarkdown = (markdown) => markdown
  .split(/\n{2,}/)
  .map((block) => {
    if (block.startsWith('### ')) return `<h3>${escapeHtml(block.slice(4))}</h3>`;
    if (block.startsWith('## ')) return `<h2>${escapeHtml(block.slice(3))}</h2>`;
    if (block.startsWith('# ')) return `<h1>${escapeHtml(block.slice(2))}</h1>`;
    if (block.startsWith('- ')) {
      const items = block.split('\n').map((line) => `<li>${escapeHtml(line.replace(/^-\s*/, ''))}</li>`).join('');
      return `<ul>${items}</ul>`;
    }
    return `<p>${escapeHtml(block)}</p>`;
  })
  .join('');

class App {
  constructor() {
    this.elements = {
      body: document.documentElement,
      sidebar: document.getElementById('sidebar'),
      overlay: document.getElementById('sidebar-overlay'),
      sidebarOpen: document.getElementById('sidebar-open'),
      sidebarClose: document.getElementById('sidebar-close'),
      navLinks: [...document.querySelectorAll('.nav-link')],
      themeToggle: document.getElementById('theme-toggle'),
      progressiveRevealToggle: document.getElementById('progressive-reveal-toggle'),
      contentTitle: document.getElementById('content-title'),
      contentDescription: document.getElementById('content-description'),
      contentArticle: document.getElementById('content-article'),
      routePanels: [...document.querySelectorAll('.route-panel')],
      questionList: document.getElementById('question-list'),
      searchResults: document.getElementById('search-results'),
      searchSummary: document.getElementById('search-summary'),
      metricCompleted: document.getElementById('metric-completed'),
      metricCompletedDetail: document.getElementById('metric-completed-detail'),
      metricScore: document.getElementById('metric-score'),
      metricBookmarks: document.getElementById('metric-bookmarks'),
      categoryProgress: document.getElementById('category-progress'),
      exportProgress: document.getElementById('export-progress'),
      resetProgress: document.getElementById('reset-progress')
    };
    this.questions = [];
    this.contentIndex = [];
    this.contentCache = new Map();
    this.contentRouteMap = new Map();
    this.currentRoute = 'home';
    this.latestQuestionResults = [];
  }

  async initialize() {
    this.progress = new ProgressController();
    this.#bindShell();
    this.#applyTheme(window.localStorage.getItem('hft-theme') || 'dark');

    // Bind routing immediately so deep links work even if data loading is slow
    window.addEventListener('hashchange', () => this.#route());

    await this.#loadData();
    // Re-run routing now that contentRouteMap is populated
    this.#route();

    const contentDocuments = await this.#loadContentDocuments();
    this.search = new SearchController({
      elements: {
        input: document.getElementById('search-input'),
        company: document.getElementById('filter-company'),
        difficulty: document.getElementById('filter-difficulty'),
        topic: document.getElementById('filter-topic'),
        clear: document.getElementById('clear-search')
      },
      onResults: (payload) => this.#handleSearchResults(payload)
    });
    await this.search.initialize({ questions: this.questions, contentDocuments });

    this.quiz = new QuizController({
      elements: {
        timer: document.getElementById('quiz-timer'),
        stage: document.getElementById('quiz-stage'),
        timerOptions: document.getElementById('timer-options'),
        topicFilter: document.getElementById('quiz-topic-filter'),
        companyFilter: document.getElementById('quiz-company-filter'),
        startButton: document.getElementById('start-quiz'),
        reviewButton: document.getElementById('review-quiz-results')
      },
      renderMarkdown: (markdown) => this.renderMarkdown(markdown),
      progress: this.progress
    });
    this.quiz.initialize(this.questions);

    window.addEventListener('progress:updated', () => {
      this.#updateDashboard();
      if (this.currentRoute === 'question-bank') {
        this.#renderQuestionBank(this.latestQuestionResults.length ? this.latestQuestionResults : this.questions);
      }
    });

    this.#updateDashboard();
    this.#registerServiceWorker();
  }

  async #loadData() {
    // Fetch both resources in parallel but handle failures independently
    const [questionsResult, contentIndexResult] = await Promise.allSettled([
      fetch('data/questions.json'),
      fetch('data/content-index.json')
    ]);

    // Load questions — warn and continue with empty bank if unavailable
    try {
      const questionsResponse = questionsResult.status === 'fulfilled' ? questionsResult.value : null;
      if (!questionsResponse?.ok) throw new Error('Unable to load question bank.');
      const questionsData = await questionsResponse.json();
      // Support both array format and {meta, questions} object format
      const rawQuestions = Array.isArray(questionsData)
        ? questionsData
        : (Array.isArray(questionsData.questions) ? questionsData.questions : []);

      // Normalize field names so JS can use consistent property names
      this.questions = rawQuestions.map((q) => ({
        id: q.id,
        title: q.title,
        prompt: q.prompt ?? q.question ?? '',
        answer: q.answer ?? q.sampleAnswer ?? '',
        topic: q.topic ?? q.category ?? 'general',
        tags: q.tags ?? q.topics ?? [],
        companies: Array.isArray(q.companies) ? q.companies : [],
        difficulty: q.difficulty ?? 'medium',
        summary: q.summary ?? (Array.isArray(q.answerOutline) && q.answerOutline.length ? q.answerOutline[0] : ''),
        rubric: q.rubric ?? {}
      }));
    } catch (error) {
      console.warn('Question bank unavailable; continuing without it.', error);
      this.questions = [];
    }

    // Load content index — must succeed for routing to work
    try {
      const contentIndexResponse = contentIndexResult.status === 'fulfilled' ? contentIndexResult.value : null;
      if (!contentIndexResponse?.ok) throw new Error('Unable to load content index.');
      const rawIndex = await contentIndexResponse.json();
      this.contentIndex = Array.isArray(rawIndex) ? rawIndex : [];
    } catch (error) {
      console.warn('Content index unavailable; navigation to content pages will not work.', error);
      this.contentIndex = [];
    }

    // Build a fast lookup map: route → content entry
    this.contentRouteMap = new Map(this.contentIndex.map((entry) => [entry.route, entry]));
  }

  async #loadContentDocuments() {
    return Promise.all(this.contentIndex.map(async (entry) => {
      try {
        return { ...entry, body: await this.#fetchText(entry.path) };
      } catch (error) {
        console.warn(`Could not preload content file: ${entry.path}`, error);
        return { ...entry, body: '' };
      }
    }));
  }

  async #fetchText(path) {
    if (this.contentCache.has(path)) return this.contentCache.get(path);
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Missing content file: ${path}`);
    const text = await response.text();
    this.contentCache.set(path, text);
    return text;
  }

  renderMarkdown(markdown) {
    const api = window.marked?.parse ? window.marked : window.marked?.marked;
    if (api?.parse) {
      return api.parse(markdown);
    }
    return fallbackMarkdown(markdown);
  }

  #bindShell() {
    this.elements.sidebarOpen.addEventListener('click', () => this.#toggleSidebar(true));
    this.elements.sidebarClose.addEventListener('click', () => this.#toggleSidebar(false));
    this.elements.overlay.addEventListener('click', () => this.#toggleSidebar(false));
    this.elements.themeToggle.addEventListener('click', () => {
      const next = this.elements.body.dataset.theme === 'dark' ? 'light' : 'dark';
      this.#applyTheme(next);
    });
    this.elements.progressiveRevealToggle.addEventListener('change', () => {
      if (this.currentRoute === 'question-bank') {
        this.#renderQuestionBank(this.latestQuestionResults.length ? this.latestQuestionResults : this.questions);
      }
    });
    this.elements.exportProgress.addEventListener('click', () => this.progress.exportProgress());
    this.elements.resetProgress.addEventListener('click', () => {
      if (this.progress.resetProgress()) this.quiz.initialize(this.questions);
    });
    this.elements.questionList.addEventListener('click', (event) => this.#handleQuestionActions(event));
    this.elements.questionList.addEventListener('change', (event) => this.#handleQuestionActions(event));
  }

  #toggleSidebar(open) {
    this.elements.sidebar.classList.toggle('is-open', open);
    this.elements.overlay.hidden = !open;
  }

  #applyTheme(theme) {
    this.elements.body.dataset.theme = theme;
    window.localStorage.setItem('hft-theme', theme);
  }

  #route() {
    const requested = window.location.hash.replace('#', '') || 'home';

    // 1. Static non-content panels (home, question-bank, mock-interviews)
    if (STATIC_ROUTES[requested]) {
      this.currentRoute = requested;
      this.#showPanel(STATIC_ROUTES[requested].panel);
      this.#updateNavActive(requested);
      this.#toggleSidebar(false);
      if (requested === 'question-bank') {
        this.#renderQuestionBank(this.latestQuestionResults.length ? this.latestQuestionResults : this.questions);
      }
      return;
    }

    // 2. Dynamic content routes from content-index.json
    const contentEntry = this.contentRouteMap?.get(requested);
    if (contentEntry) {
      this.currentRoute = requested;
      this.#showPanel('content');
      this.#updateNavActive(requested);
      this.#toggleSidebar(false);
      this.#renderContentEntry(contentEntry);
      return;
    }

    // 3. Legacy section routes (e.g. #behavioral, #cpp) — find their canonical entry
    if (LEGACY_SECTION_ROUTES.has(requested)) {
      const fallback = this.contentRouteMap?.get(requested);
      if (fallback) {
        this.currentRoute = requested;
        this.#showPanel('content');
        this.#updateNavActive(requested);
        this.#toggleSidebar(false);
        this.#renderContentEntry(fallback);
        return;
      }
    }

    // 4. Fallback to home
    if (requested !== 'home') {
      console.warn(
        'Route not found — falling back to home.',
        { route: requested, contentMapSize: this.contentRouteMap.size }
      );
    }
    this.currentRoute = 'home';
    this.#showPanel('home');
    this.#updateNavActive('home');
    this.#toggleSidebar(false);
  }

  #showPanel(panelId) {
    for (const panel of this.elements.routePanels) {
      panel.hidden = panel.dataset.panel !== panelId;
    }
  }

  #updateNavActive(route) {
    for (const link of this.elements.navLinks) {
      link.classList.toggle('is-active', link.dataset.route === route);
    }

    // Auto-open the parent <details> section for the active sub-page
    for (const link of this.elements.navLinks) {
      if (link.dataset.route === route) {
        const details = link.closest('details.nav-section');
        if (details) details.open = true;
        break;
      }
    }
  }

  async #renderContentEntry(entry) {
    const topicLabel = entry.topic.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    this.elements.contentTitle.textContent = entry.title;
    this.elements.contentDescription.textContent = entry.excerpt ?? '';
    this.elements.contentArticle.innerHTML = '<p class="muted">Loading content…</p>';

    // Build breadcrumb
    const breadcrumbEl = document.getElementById('content-breadcrumb');
    if (breadcrumbEl) {
      const section = entry.route.split('/')[0];
      const sectionEntry = this.contentRouteMap?.get(section);
      breadcrumbEl.innerHTML = `
        <a href="#home">Home</a>
        <span aria-hidden="true">›</span>
        ${sectionEntry
          ? `<a href="#${sectionEntry.route}">${escapeHtml(topicLabel)}</a>`
          : `<span>${escapeHtml(topicLabel)}</span>`}
        ${entry.route.includes('/') ? `<span aria-hidden="true">›</span><span>${escapeHtml(entry.title)}</span>` : ''}
      `;
    }

    // Build prev/next navigation
    const pagesInSection = this.contentIndex.filter((e) => e.topic === entry.topic);
    const idx = pagesInSection.findIndex((e) => e.route === entry.route);
    const prevEntry = idx > 0 ? pagesInSection[idx - 1] : null;
    const nextEntry = idx < pagesInSection.length - 1 ? pagesInSection[idx + 1] : null;
    const prevNextEl = document.getElementById('content-prev-next');
    if (prevNextEl) {
      prevNextEl.innerHTML = `
        ${prevEntry ? `<a class="button button--ghost" href="#${prevEntry.route}">← ${escapeHtml(prevEntry.title)}</a>` : '<span></span>'}
        ${nextEntry ? `<a class="button button--ghost" href="#${nextEntry.route}">${escapeHtml(nextEntry.title)} →</a>` : ''}
      `;
    }

    try {
      const markdown = await this.#fetchText(entry.path);
      this.elements.contentArticle.innerHTML = this.renderMarkdown(markdown);
      // Scroll to top of content
      this.elements.contentArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      this.elements.contentArticle.innerHTML = `<div class="error-card">${escapeHtml(error.message)}</div>`;
    }
  }

  #handleSearchResults({ filters, results, questionResults, contentResults }) {
    this.latestQuestionResults = questionResults.map((result) => result.source);
    const filterSummary = [filters.company, filters.difficulty, filters.topic].filter((value) => value !== 'all').join(' · ');
    this.elements.searchSummary.textContent = results.length
      ? `Found ${results.length} result(s)${filterSummary ? ` for ${filterSummary}` : ''}.`
      : 'No results yet. Try broader filters or a different keyword.';

    this.#renderSearchResults(results.slice(0, 8));
    if (this.currentRoute === 'question-bank') {
      this.#renderQuestionBank(questionResults.map((entry) => entry.source));
    }
    if (this.currentRoute === 'home' && filters.query) {
      this.#renderQuestionBank(questionResults.slice(0, 3).map((entry) => entry.source));
    }
  }

  #renderSearchResults(results) {
    if (!results.length) {
      this.elements.searchResults.innerHTML = '<div class="empty-state">Search results will appear here.</div>';
      return;
    }

    this.elements.searchResults.innerHTML = results.map((result) => `
      <article class="result-card">
        <div class="result-card__header">
          <div>
            <p class="result-card__label">${result.kind}</p>
            <h3>${result.title}</h3>
          </div>
          <span class="badge">${result.topic}</span>
        </div>
        <div class="result-card__meta">
          ${result.difficulty ? `<span class="badge">${result.difficulty}</span>` : ''}
          ${(result.companies || []).map((company) => `<span class="badge">${company}</span>`).join('')}
        </div>
        <p>${result.summary}</p>
        ${result.kind === 'content' ? `<a class="button button--ghost" href="#${result.source.route}">Open note</a>` : `<a class="button button--ghost" href="#question-bank">Open question</a>`}
      </article>
    `).join('');
  }

  #renderQuestionBank(questions) {
    if (!questions.length) {
      this.elements.questionList.innerHTML = '<div class="empty-state">No questions match the current search and filters.</div>';
      return;
    }

    const progressiveReveal = this.elements.progressiveRevealToggle.checked;
    this.elements.questionList.innerHTML = questions.map((question) => {
      const state = this.progress.getQuestionState(question.id);
      const rubric = Object.entries(question.rubric)
        .map(([score, text]) => `<li><strong>${score}</strong> — ${escapeHtml(text)}</li>`)
        .join('');
      const answerVisible = !progressiveReveal;
      return `
        <article class="question-card" data-question-id="${question.id}">
          <div class="question-card__header">
            <div>
              <p class="question-card__label">${escapeHtml(question.topic)} · ${escapeHtml(question.difficulty)}</p>
              <h3>${escapeHtml(question.title)}</h3>
              <p>${escapeHtml(question.prompt)}</p>
            </div>
            <button class="bookmark-button ${state.bookmarked ? 'is-active' : ''}" data-action="bookmark">${state.bookmarked ? 'Bookmarked' : 'Bookmark'}</button>
          </div>
          <div class="question-card__meta">
            ${question.companies.map((company) => `<span class="badge">${escapeHtml(company)}</span>`).join('')}
            ${question.tags.slice(0, 4).map((tag) => `<span class="badge">${escapeHtml(tag)}</span>`).join('')}
          </div>
          <p><strong>Summary:</strong> ${escapeHtml(question.summary)}</p>
          <button class="button button--ghost reveal-button" data-action="reveal">${answerVisible ? 'Hide answer' : 'Reveal answer'}</button>
          <section class="question-answer" ${answerVisible ? '' : 'hidden'}>
            ${this.renderMarkdown(question.answer)}
            <h4>Rubric</h4>
            <ul class="rubric-list">${rubric}</ul>
            <div class="question-card__actions">
              <button class="button ${state.completed ? 'button--ghost' : ''}" data-action="complete">${state.completed ? 'Completed' : 'Mark complete'}</button>
              <label class="field">
                <span>Score</span>
                <select data-action="score">
                  <option value="">No score</option>
                  ${[1, 2, 3, 4, 5].map((score) => `<option value="${score}" ${state.score === score ? 'selected' : ''}>${score}</option>`).join('')}
                </select>
              </label>
            </div>
          </section>
        </article>
      `;
    }).join('');
  }

  #handleQuestionActions(event) {
    const card = event.target.closest('[data-question-id]');
    if (!card) return;
    const questionId = card.dataset.questionId;
    const action = event.target.dataset.action;

    if (action === 'reveal') {
      const answer = card.querySelector('.question-answer');
      const hidden = answer.hidden;
      answer.hidden = !hidden;
      event.target.textContent = hidden ? 'Hide answer' : 'Reveal answer';
      return;
    }

    if (action === 'bookmark') {
      const state = this.progress.toggleBookmark(questionId);
      event.target.classList.toggle('is-active', state.bookmarked);
      event.target.textContent = state.bookmarked ? 'Bookmarked' : 'Bookmark';
      this.#updateDashboard();
      return;
    }

    if (action === 'complete') {
      const state = this.progress.toggleComplete(questionId);
      event.target.textContent = state.completed ? 'Completed' : 'Mark complete';
      event.target.classList.toggle('button--ghost', state.completed);
      this.#updateDashboard();
      return;
    }

    if (action === 'score') {
      const value = Number(event.target.value);
      if (!Number.isFinite(value)) return;
      this.progress.setScore(questionId, value);
      this.#updateDashboard();
    }
  }

  #updateDashboard() {
    const stats = this.progress.getCompletionStats(this.questions);
    this.elements.metricCompleted.textContent = `${stats.completionPct}%`;
    this.elements.metricCompletedDetail.textContent = `${stats.completedCount} of ${stats.total} questions complete`;
    this.elements.metricScore.textContent = stats.averageScore.toFixed(1);
    this.elements.metricBookmarks.textContent = String(stats.bookmarkedCount);
    this.elements.categoryProgress.innerHTML = Object.entries(stats.byCategory).map(([topic, detail]) => {
      const pct = detail.total ? Math.round((detail.completed / detail.total) * 100) : 0;
      return `
        <article class="progress-card">
          <div class="question-card__header">
            <strong>${escapeHtml(topic)}</strong>
            <span>${pct}%</span>
          </div>
          <div class="progress-bar" aria-hidden="true"><span style="width:${pct}%"></span></div>
          <p class="muted">${detail.completed} of ${detail.total} questions complete</p>
        </article>
      `;
    }).join('');
  }

  async #registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    try {
      await navigator.serviceWorker.register('sw.js');
    } catch (error) {
      console.warn('Service worker registration failed.', error);
    }
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const app = new App();
    await app.initialize();
  } catch (error) {
    document.getElementById('content-article').innerHTML = `<div class="error-card">${escapeHtml(error.message)}</div>`;
  }
});
