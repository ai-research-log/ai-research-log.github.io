---
title: Introducing the Model Context Protocol
category: agent
type: release
source_name: Anthropic
source_url: https://www.anthropic.com/news/model-context-protocol
published_at: "2024-11"
collected_at: "2026-11-02"
collected_by: manual
summarized_by: Claude
reviewed_by: ""
status: published
summary: 데이터 소스와 AI 도구를 양방향으로 연결하는 개방형 표준입니다. 소스마다 만들던 연동을 하나의 프로토콜로 대체합니다.
tldr:
  - MCP는 데이터 소스와 AI 도구 사이의 안전한 양방향 연결을 위한 개방형 표준입니다.
  - 데이터는 MCP 서버로 노출하고, AI 애플리케이션은 MCP 클라이언트로 동작합니다.
  - 사양과 SDK, Claude Desktop 앱의 로컬 서버 지원, 사전 구축 서버 오픈소스 저장소를 함께 공개했습니다.
---

## 왜 중요한가

새 데이터 소스마다 별도로 구현해야 했던 연동을 하나의 프로토콜로 대체하려는 시도입니다. 공개 시점에 Google Drive, Slack, GitHub, Git, Postgres, Puppeteer용 서버가 제공되었습니다.
