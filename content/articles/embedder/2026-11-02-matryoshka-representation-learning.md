---
title: Matryoshka Representation Learning
category: embedder
type: paper
source_name: arXiv
source_url: https://arxiv.org/abs/2205.13147
published_at: "2022-05"
collected_at: "2026-11-02"
collected_by: manual
summarized_by: Claude
reviewed_by: ""
status: published
summary: 하나의 임베딩에 여러 세밀도의 정보를 담아, 과제별 계산 제약에 맞출 수 있게 합니다.
tldr:
  - 고정 크기 표현은 과제에 따라 너무 크거나 작을 수 있습니다.
  - MRL은 거친 정보부터 세밀한 정보까지 담는 표현을 학습해 하나의 임베딩이 여러 제약에 대응하게 합니다.
  - ImageNet-1K 분류에서 같은 정확도 기준으로 임베딩 크기를 최대 14배 줄였다고 보고합니다.
---

## 왜 중요한가

기존 학습 파이프라인을 조금만 수정하면 되고 추론과 배포에 추가 비용이 들지 않는다고 논문은 설명합니다. 저장 비용과 검색 속도를 임베딩 크기로 조절해야 하는 시스템에 참고할 만합니다.
