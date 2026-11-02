---
title: Late Chunking
category: embedder
type: paper
source_name: arXiv
source_url: https://arxiv.org/abs/2409.04701
published_at: "2024-09"
collected_at: "2026-11-02"
collected_by: manual
summarized_by: Claude
reviewed_by: ""
status: published
summary: 문서 전체의 토큰을 먼저 임베딩한 뒤 청크로 묶어, 청크가 주변 문맥을 잃는 문제를 줄입니다.
tldr:
  - 문서를 먼저 자른 뒤 각각 임베딩하면 청크가 주변 문맥을 잃을 수 있습니다.
  - Late Chunking은 긴 문맥 임베딩 모델로 모든 토큰을 임베딩하고, mean pooling 직전에 청크를 나눕니다.
  - 추가 학습 없이 적용할 수 있고, 효과를 높이기 위한 전용 파인튜닝 방법도 함께 제안합니다.
---

## 왜 중요한가

짧은 청크는 검색에 유리하지만 문맥을 잃기 쉽습니다. 이 방법은 청크 분할 시점을 임베딩 뒤로 옮겨 두 요구를 함께 다룹니다. 논문은 여러 검색 과제에서 더 나은 결과를 보고합니다.
