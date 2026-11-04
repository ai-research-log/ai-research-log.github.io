const CATEGORIES = ['전체', 'Embedder', 'LLM', '경량화', 'Agent'];
const VIAS = ['전체', '자동 수집', '수동 등록'];
const PAGE_SIZE = 10;

const params = new URLSearchParams(location.search);
const pick = (value, allowed) => (allowed.includes(value) ? value : '전체');
const state = {
  category: pick(params.get('category'), CATEGORIES),
  via: pick(params.get('via'), VIAS),
  page: Math.max(1, Number.parseInt(params.get('page'), 10) || 1),
};
let articles = [];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function syncUrl() {
  const next = new URLSearchParams();
  if (state.category !== '전체') next.set('category', state.category);
  if (state.via !== '전체') next.set('via', state.via);
  if (state.page > 1) next.set('page', String(state.page));
  const query = next.toString();
  history.replaceState(null, '', query ? `?${query}` : location.pathname);
}

function select(key, value) {
  state[key] = value;
  state.page = 1;
  syncUrl();
  render();
}

function goToPage(page) {
  state.page = page;
  syncUrl();
  render();
  document.getElementById('archive').scrollIntoView({ block: 'start' });
}

// 페이지가 많으면 처음·끝과 현재 주변만 보여 주고 나머지는 '…'로 줄입니다.
function pageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  const start = Math.max(2, Math.min(current - 1, total - 4));
  const end = Math.min(total - 1, Math.max(current + 1, 5));
  if (start > 2) pages.push('…');
  for (let p = start; p <= end; p += 1) pages.push(p);
  if (end < total - 1) pages.push('…');
  pages.push(total);
  return pages;
}

function pageButton(label, page, { current = false, disabled = false, ariaLabel } = {}) {
  const button = el('button', 'page-button', label);
  button.type = 'button';
  if (ariaLabel) button.setAttribute('aria-label', ariaLabel);
  if (current) button.setAttribute('aria-current', 'page');
  button.disabled = disabled || current;
  if (!button.disabled) button.addEventListener('click', () => goToPage(page));
  return button;
}

function pagination(totalPages) {
  if (totalPages <= 1) return [];
  const current = state.page;
  return [
    pageButton('이전', current - 1, { disabled: current === 1, ariaLabel: '이전 페이지' }),
    ...pageNumbers(current, totalPages).map((p) =>
      p === '…'
        ? el('span', 'page-gap', '…')
        : pageButton(String(p), p, { current: p === current, ariaLabel: `${p}페이지` }),
    ),
    pageButton('다음', current + 1, { disabled: current === totalPages, ariaLabel: '다음 페이지' }),
  ];
}

function filterButton(key, value, count) {
  const button = el('button', 'filter-button');
  button.type = 'button';
  button.setAttribute('aria-pressed', String(state[key] === value));
  button.append(el('span', '', value));
  if (count !== undefined) button.append(el('span', 'count', String(count)));
  button.addEventListener('click', () => select(key, value));
  return button;
}

function articleItem(article) {
  const item = el('article', 'item');
  const meta = el('div', 'item-meta');
  meta.append(
    el('span', 'item-category', article.category),
    el('span', '', article.type),
    el('span', '', article.source),
    el('span', '', article.date),
  );
  const heading = el('h3');
  const link = el('a', '', article.title);
  link.href = `articles/${article.slug}/`;
  heading.append(link);
  item.append(meta, heading, el('p', '', article.summary));
  return item;
}

function render() {
  const byVia = articles.filter((a) => state.via === '전체' || a.via === state.via);
  const visible = byVia.filter((a) => state.category === '전체' || a.category === state.category);
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  if (state.page > totalPages) {
    state.page = totalPages;
    syncUrl();
  }
  const pageItems = visible.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

  document.getElementById('category-filter').replaceChildren(
    ...CATEGORIES.map((category) =>
      filterButton(
        'category',
        category,
        category === '전체' ? byVia.length : byVia.filter((a) => a.category === category).length,
      ),
    ),
  );
  document.getElementById('via-filter').replaceChildren(...VIAS.map((via) => filterButton('via', via)));
  document.getElementById('result-label').textContent = `articles: ${visible.length}건 · 원문 발표일 순`;
  document
    .getElementById('article-list')
    .replaceChildren(
      ...(visible.length
        ? pageItems.map(articleItem)
        : [el('p', 'empty', articles.length ? '이 조건에 맞는 기사가 없습니다. 다른 필터를 선택해 보세요.' : '아직 게시한 기사가 없습니다.')]),
    );
  const nav = document.getElementById('pagination');
  nav.replaceChildren(...pagination(totalPages));
  nav.hidden = totalPages <= 1;
}

fetch('data/articles.json')
  .then((response) => {
    if (!response.ok) throw new Error(String(response.status));
    return response.json();
  })
  .then((data) => {
    articles = data;
    render();
  })
  .catch(() => {
    document.getElementById('result-label').textContent = '기사 목록을 불러오지 못했습니다. 새로고침해 주세요.';
  });
