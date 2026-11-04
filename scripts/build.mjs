import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { Marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articlesDir = path.join(root, 'content/articles');
const dist = path.join(root, 'dist');

const CATEGORIES = { embedder: 'Embedder', llm: 'LLM', compression: 'Compression', inference: 'Inference Optimization', agent: 'Agent', ontology: 'Ontology' };
const TYPES = { paper: '논문', release: '릴리스', guide: '가이드' };
const VIAS = { auto: '자동 수집', manual: '수동 등록' };
const STATUSES = ['draft', 'published'];

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

// 본문에는 에이전트가 외부 자료를 요약한 글이 들어오므로 원시 HTML은 글자로 표시한다.
const markdown = new Marked({
  renderer: {
    html: ({ text }) => escapeHtml(text),
    image: ({ href, text }) => `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}" loading="lazy">`,
  },
});

// YAML 파서는 따옴표 없는 날짜를 Date로 읽는다.
const dateText = (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? ''));

function validate(data, file) {
  const fail = (message) => {
    throw new Error(`${file}: ${message}`);
  };
  for (const key of ['title', 'source_name', 'published_at', 'collected_at', 'summarized_by', 'summary']) {
    if (!data[key]) fail(`${key} 값이 없습니다`);
  }
  if (!CATEGORIES[data.category]) fail(`알 수 없는 category: ${data.category}`);
  if (!TYPES[data.type]) fail(`알 수 없는 type: ${data.type}`);
  if (!VIAS[data.collected_by]) fail(`알 수 없는 collected_by: ${data.collected_by}`);
  if (!STATUSES.includes(data.status)) fail(`알 수 없는 status: ${data.status}`);
  if (!/^https?:\/\//.test(data.source_url ?? '')) fail('source_url은 http(s) 주소여야 합니다');
  if (!Array.isArray(data.tldr) || data.tldr.length === 0) fail('tldr 목록이 없습니다');
  if (path.basename(path.dirname(file)) !== data.category) fail('폴더와 category가 다릅니다');
  if (data.collected_by === 'manual' && /claude/i.test(data.summarized_by)) {
    fail('수동 등록 글의 summarized_by는 사람이어야 합니다');
  }
}

async function loadArticles() {
  const files = (await readdir(articlesDir, { recursive: true })).filter((f) => f.endsWith('.md'));
  const seen = new Set();
  const articles = [];
  for (const file of files) {
    const { data, content } = matter(await readFile(path.join(articlesDir, file), 'utf8'));
    validate(data, file);
    if (data.status !== 'published') continue;
    const slug = path.basename(file, '.md').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    if (seen.has(slug)) throw new Error(`${file}: slug가 중복됩니다: ${slug}`);
    seen.add(slug);
    articles.push({
      ...data,
      slug,
      published_at: dateText(data.published_at),
      collected_at: dateText(data.collected_at),
      reviewed_by: data.reviewed_by || '',
      body: await markdown.parse(content),
    });
  }
  return articles.sort(
    (a, b) => b.published_at.localeCompare(a.published_at) || a.slug.localeCompare(b.slug),
  );
}

// 수동 등록 글은 사람이 쓴 글이다. 요약에 AI 초안이 있으면 범위를 본문으로 한정한다.
const authorship = (article) => {
  if (article.collected_by !== 'manual') return '';
  return article.tldr_by ? '본문 사람 작성' : '전체 사람 작성';
};

const page = ({ title, description, base, config, body }) => `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&amp;family=IBM+Plex+Sans+KR:wght@400;500;600;700&amp;display=swap">
<link rel="stylesheet" href="${base}assets/site.css">
</head>
<body>
${body}
<footer class="footer">© ${new Date().getFullYear()} ${escapeHtml(config.handle)} · 요약은 원문을 대체하지 않습니다.</footer>
</body>
</html>
`;

function renderIndex(articles, config) {
  const owner = config.ownerName || config.handle;
  const fallback = articles
    .map((a) => `<li><a href="articles/${a.slug}/">${escapeHtml(a.title)}</a></li>`)
    .join('');
  return page({
    title: `${config.handle} / ${config.siteName}`,
    description: 'Embedder, LLM, Compression, Inference Optimization, Agent, Ontology 분야의 AI 기술 동향 요약 아카이브',
    base: '',
    config,
    body: `<header class="topbar">
  <a class="brand" href="./">${escapeHtml(config.handle)} / ${escapeHtml(config.siteName)}</a>
  <nav aria-label="주요 메뉴"><a href="#archive">아카이브</a><a href="#about">소개</a></nav>
</header>
<main class="wrap stack">
  <section class="hero">
    <h1>AI Research Trends</h1>
    <p>주요 AI 최신 기사 및 논문들을 자동, 수동 수집합니다</p>
  </section>
  <section id="archive" class="archive" aria-label="기사 아카이브">
    <aside class="panel filters" aria-label="필터">
      <div><h2>category</h2><div id="category-filter" class="filter-list"></div></div>
      <div><h2>collected_by</h2><div id="via-filter" class="filter-row"></div></div>
    </aside>
    <div class="panel results">
      <div id="result-label" class="result-label" role="status">기사를 불러오는 중입니다</div>
      <div id="article-list"></div>
      <nav id="pagination" class="pagination" aria-label="페이지" hidden></nav>
      <noscript><ul class="fallback">${fallback}</ul></noscript>
    </div>
  </section>
  <section id="about" class="about">
    <div>
      <h2>이 아카이브를 운영하는 사람</h2>
      <p>${escapeHtml(owner)} · ${escapeHtml(config.ownerSummary)}</p>
    </div>
    <a href="mailto:${escapeHtml(config.ownerEmail)}">${escapeHtml(config.ownerEmail)}</a>
  </section>
</main>
<script src="assets/app.js" defer></script>`,
  });
}

function renderArticle(article, articles, config) {
  const related = articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 2);
  const reviewNote = [
    !article.reviewed_by
      ? `이 요약은 ${article.summarized_by}이(가) 작성했으며 아직 운영자가 검토하지 않았습니다.`
      : article.reviewed_by === article.summarized_by
        ? `이 요약은 ${article.summarized_by}이(가) 작성했습니다.`
        : `이 요약은 ${article.summarized_by}이(가) 작성하고 ${article.reviewed_by}이(가) 검토했습니다.`,
    article.tldr_by ? `한 줄 소개와 세 줄 요약은 ${article.tldr_by}이(가) 초안을 작성했습니다.` : '',
    article.body.includes('<img') ? '본문의 그림, 표, 수식은 원 논문 등 출처 자료에서 인용했으며 저작권은 원저자에게 있습니다.' : '',
    '정확한 내용은 원문을 확인해 주세요.',
  ]
    .filter(Boolean)
    .join(' ');
  const meta = [
    ['출처', article.source_name],
    ['발표', article.published_at],
  ];
  return page({
    title: `${article.title} | ${config.handle}`,
    description: article.summary,
    base: '../../',
    config,
    body: `<header class="topbar topbar-plain">
  <a class="brand" href="../../">${escapeHtml(config.handle)} / ${escapeHtml(config.siteName)}</a>
  <a href="../../#archive">아카이브로 돌아가기</a>
</header>
<div class="detail">
  <article class="detail-main">
    <header class="detail-head">
      <div class="eyebrow">${CATEGORIES[article.category]} · ${TYPES[article.type]}</div>
      <h1>${escapeHtml(article.title)}</h1>
      <p>${escapeHtml(article.summary)}</p>
    </header>
    <section class="tldr" aria-labelledby="tldr-h">
      <h2 id="tldr-h">세 줄 요약</h2>
      <ul>${article.tldr.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
    </section>
    <div class="prose">${article.body}</div>
    <a class="source-button" href="${escapeHtml(article.source_url)}" rel="noopener">원문 읽기</a>
  </article>
  <aside class="detail-side" aria-label="기사 정보">
    <dl>${meta.map(([k, v]) => `<dt>${k}</dt><dd>${escapeHtml(v)}</dd>`).join('')}</dl>
    <p class="note">${escapeHtml(reviewNote)}</p>
    ${
      related.length
        ? `<section aria-labelledby="related-h"><h2 id="related-h">관련 기사</h2>${related
            .map((a) => `<a href="../${a.slug}/">${escapeHtml(a.title)}</a>`)
            .join('')}</section>`
        : ''
    }
  </aside>
</div>`,
  });
}

const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
const articles = await loadArticles();

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'assets'), { recursive: true });
await mkdir(path.join(dist, 'data'), { recursive: true });
await cp(path.join(root, 'src'), path.join(dist, 'assets'), { recursive: true });
await cp(path.join(root, 'content/images'), path.join(dist, 'images'), { recursive: true });
await writeFile(path.join(dist, 'index.html'), renderIndex(articles, config));
await writeFile(
  path.join(dist, 'data/articles.json'),
  JSON.stringify(
    articles.map((a) => ({
      slug: a.slug,
      title: a.title,
      category: CATEGORIES[a.category],
      type: TYPES[a.type],
      source: a.source_name,
      date: a.published_at,
      via: VIAS[a.collected_by],
      summary: a.summary,
      reviewed: Boolean(a.reviewed_by),
      authorship: authorship(a),
    })),
  ),
);
for (const article of articles) {
  const dir = path.join(dist, 'articles', article.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), renderArticle(article, articles, config));
}
console.log(`dist/에 기사 ${articles.length}건을 빌드했습니다.`);
