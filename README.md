# ai-research-log.github.io

Embedder, LLM, Compression, Inference Optimization, Agent, Ontology 분야의 AI 기술 동향을 모아 요약하는 정적 사이트입니다.

## 실행

```bash
npm ci
npm run preview
```

`main` 브랜치에 push하면 GitHub Actions가 사이트를 빌드해 GitHub Pages에 배포합니다.

## 기사 추가

`content/articles/<category>/YYYY-MM-DD-<slug>.md` 파일을 추가합니다.

```markdown
---
title: 기사 제목
category: llm
type: paper
source_name: arXiv
source_url: https://arxiv.org/abs/0000.00000
published_at: "2026-11"
collected_at: "2026-11-02"
collected_by: manual
summarized_by: 작성자
reviewed_by: ""
status: published
summary: 목록에 표시할 한 줄 요약
tldr:
  - 첫째 줄
  - 둘째 줄
  - 셋째 줄
---

## 왜 중요한가

본문
```

- `category`: `embedder`, `llm`, `compression`, `inference`, `agent`, `ontology`
- `type`: `paper`, `release`, `guide`
- `collected_by`: `auto`, `manual`. `manual`은 사람이 쓴 글입니다. 사이트에 `전체 사람 작성`으로 표시되고, `tldr_by`가 있으면 `본문 사람 작성`으로 표시됩니다.
- `status`: `draft`(게시 안 함), `published`
- `reviewed_by`: 검토자 이름. 비워 두면 사이트에 `검토 전`으로 표시됩니다.
- `tldr_by`: 한 줄 소개와 세 줄 요약을 작성한 사람이 본문 작성자와 다를 때 쓰는 선택 항목입니다.

본문에 `## 왜 중요한가`, `## 코멘트` 같은 제목으로 내용을 씁니다. 필수 항목이 빠지면 빌드가 실패합니다.

운영자 이름과 소개는 `site.config.json`에서 바꿉니다.
