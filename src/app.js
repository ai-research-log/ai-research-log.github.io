const CATEGORIES = ['전체', 'Embedder', 'LLM', '경량화', 'Agent'];
const VIAS = ['전체', '자동 수집', '수동 등록'];

const params = new URLSearchParams(location.search);
const pick = (value, allowed) => (allowed.includes(value) ? value : '전체');
const state = {
  category: pick(params.get('category'), CATEGORIES),
  via: pick(params.get('via'), VIAS),
};
let articles = [];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function select(key, value) {
  state[key] = value;
  const next = new URLSearchParams();
  if (state.category !== '전체') next.set('category', state.category);
  if (state.via !== '전체') next.set('via', state.via);
  const query = next.toString();
  history.replaceState(null, '', query ? `?${query}` : location.pathname);
  render();
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
  const tags = el('div', 'item-tags');
  tags.append(
    el('span', '', article.via),
    el('span', '', article.authorship || (article.reviewed ? '사람 검토 완료' : '검토 전')),
  );
  meta.append(tags);
  item.append(meta, heading, el('p', '', article.summary));
  return item;
}

function render() {
  const byVia = articles.filter((a) => state.via === '전체' || a.via === state.via);
  const visible = byVia.filter((a) => state.category === '전체' || a.category === state.category);

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
        ? visible.map(articleItem)
        : [el('p', 'empty', articles.length ? '이 조건에 맞는 기사가 없습니다. 다른 필터를 선택해 보세요.' : '아직 게시한 기사가 없습니다.')]),
    );
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
