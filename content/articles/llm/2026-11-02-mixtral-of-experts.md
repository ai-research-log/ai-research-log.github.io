---
title: Mixtral of Experts
category: llm
type: paper
source_name: arXiv
source_url: https://arxiv.org/abs/2401.04088
published_at: "2024-01"
collected_at: "2026-11-02"
collected_by: manual
summarized_by: Claude
reviewed_by: ""
status: published
summary: 토큰마다 전문가 8개 중 2개만 쓰는 Sparse Mixture of Experts 모델로, Apache 2.0으로 공개했습니다.
tldr:
  - Mixtral 8x7B는 Mistral 7B와 구조가 같지만 각 층에 8개의 피드포워드 블록을 둡니다.
  - 라우터 네트워크가 토큰과 층마다 2개를 골라, 전체 47B 파라미터 중 추론에는 13B만 활성화됩니다.
  - 평가한 모든 벤치마크에서 Llama 2 70B와 GPT-3.5를 능가하거나 비슷하다고 보고합니다.
---

## 왜 중요한가

추론에 쓰는 파라미터를 전체의 일부로 제한하면서 더 큰 모델과 경쟁할 수 있음을 보여 줍니다. 기본 모델과 Instruct 모델이 모두 Apache 2.0 라이선스로 공개되었습니다.
