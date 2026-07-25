
const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const normalize = (value) => value.toLowerCase().trim();

export class SearchController {
  constructor({ elements, onResults }) {
    this.elements = elements;
    this.onResults = onResults;
    this.questions = [];
    this.contentDocuments = [];
    this.debounceHandle = null;
  }

  async initialize({ questions, contentDocuments }) {
    this.questions = questions;
    this.contentDocuments = contentDocuments;
    this.#bind();
    this.search();
  }

  #bind() {
    const debounced = () => {
      window.clearTimeout(this.debounceHandle);
      this.debounceHandle = window.setTimeout(() => this.search(), 180);
    };

    this.elements.input.addEventListener('input', debounced);
    this.elements.company.addEventListener('change', () => this.search());
    this.elements.difficulty.addEventListener('change', () => this.search());
    this.elements.topic.addEventListener('change', () => this.search());
    this.elements.clear.addEventListener('click', () => {
      this.elements.input.value = '';
      this.elements.company.value = 'all';
      this.elements.difficulty.value = 'all';
      this.elements.topic.value = 'all';
      this.search();
    });
  }

  getFilters() {
    return {
      query: normalize(this.elements.input.value),
      company: this.elements.company.value,
      difficulty: this.elements.difficulty.value,
      topic: this.elements.topic.value
    };
  }

  #tokens(query) {
    return query.split(/\s+/).filter(Boolean);
  }

  #highlight(text, tokens) {
    if (!tokens.length) return escapeHtml(text);
    const escapedTokens = tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
    return escapeHtml(text).replace(pattern, '<mark>$1</mark>');
  }

  #matchScore(text, tokens, weight) {
    const haystack = normalize(text);
    return tokens.reduce((score, token) => {
      if (!haystack.includes(token)) return score;
      const count = haystack.split(token).length - 1;
      return score + count * weight;
    }, 0);
  }

  #matchesFilters(item, filters) {
    const topicOk = filters.topic === 'all' || item.topic === filters.topic;
    const companyOk = filters.company === 'all' || (item.companies ?? []).includes(filters.company);
    const difficultyOk = filters.difficulty === 'all' || item.difficulty === filters.difficulty || item.kind === 'content';
    return topicOk && companyOk && difficultyOk;
  }

  #questionResult(question, filters, tokens) {
    if (!this.#matchesFilters(question, filters)) return null;
    const baseScore = tokens.length === 0 ? 1 : 0;
    const score = baseScore
      + this.#matchScore(question.title, tokens, 8)
      + this.#matchScore(question.prompt, tokens, 6)
      + this.#matchScore(question.answer, tokens, 3)
      + this.#matchScore((question.tags || []).join(' '), tokens, 4)
      + this.#matchScore((question.companies || []).join(' '), tokens, 2);
    if (tokens.length && score === 0) return null;

    return {
      id: question.id,
      kind: 'question',
      topic: question.topic,
      difficulty: question.difficulty,
      companies: question.companies,
      title: this.#highlight(question.title, tokens),
      summary: this.#highlight(question.summary, tokens),
      prompt: this.#highlight(question.prompt, tokens),
      score,
      source: question
    };
  }

  #contentResult(document, filters, tokens) {
    if (filters.topic !== 'all' && document.topic !== filters.topic) return null;
    if (filters.company !== 'all' || filters.difficulty !== 'all') {
      if (tokens.length === 0) return null;
    }
    const body = document.body || '';
    const score = (tokens.length === 0 ? 0.5 : 0)
      + this.#matchScore(document.title, tokens, 7)
      + this.#matchScore(document.excerpt || '', tokens, 4)
      + this.#matchScore(body, tokens, 2);
    if (tokens.length && score === 0) return null;

    const snippetSource = body.slice(0, 240).replace(/\s+/g, ' ').trim() || document.excerpt;
    return {
      id: document.id,
      kind: 'content',
      topic: document.topic,
      title: this.#highlight(document.title, tokens),
      summary: this.#highlight(snippetSource, tokens),
      score,
      source: document
    };
  }

  search() {
    const filters = this.getFilters();
    const tokens = this.#tokens(filters.query);

    const results = [
      ...this.questions.map((question) => this.#questionResult(question, filters, tokens)).filter(Boolean),
      ...this.contentDocuments.map((document) => this.#contentResult(document, filters, tokens)).filter(Boolean)
    ].sort((left, right) => right.score - left.score || left.topic.localeCompare(right.topic));

    this.onResults({
      filters,
      results,
      questionResults: results.filter((result) => result.kind === 'question'),
      contentResults: results.filter((result) => result.kind === 'content')
    });
  }
}
