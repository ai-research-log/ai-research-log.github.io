---
title: Building Effective Agents
category: agent
type: guide
source_name: Anthropic
source_url: https://www.anthropic.com/engineering/building-effective-agents
published_at: "2024-12"
collected_at: "2026-11-02"
collected_by: manual
summarized_by: Claude
reviewed_by: ""
status: published
summary: 가장 단순한 해법에서 시작해 필요할 때만 복잡도를 높이라고 권하며, 조합 가능한 패턴을 정리합니다.
tldr:
  - 가장 단순한 해법을 찾고, 필요할 때만 복잡도를 높이라고 권합니다.
  - 프롬프트 체이닝, 라우팅, 병렬화, 오케스트레이터-워커, 평가자-최적화 패턴을 정리합니다.
  - 프레임워크는 내부 프롬프트와 응답을 가려 디버깅을 어렵게 할 수 있으므로 LLM API 직접 사용부터 제안합니다.
---

## 왜 중요한가

에이전트 구현에서 무엇을 먼저 시도할지 판단하는 기준을 제공합니다. 다만 원문에는 2024년 12월 이후 도구가 많이 바뀌었다는 안내가 있으므로, 구체적인 도구 추천은 최신 자료와 함께 확인해야 합니다.
