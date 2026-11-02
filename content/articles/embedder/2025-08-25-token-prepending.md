---
title: "Token Prepending"
category: embedder
type: paper
source_name: arXiv
source_url: https://arxiv.org/abs/2412.11556
published_at: "2024-12"
collected_at: "2025-08-25"
collected_by: manual
summarized_by: jhwang
reviewed_by: jhwang
tldr_by: Claude
status: published
summary: "층마다 문장 임베딩을 입력 앞에 붙여, causal attention에서도 앞 토큰이 문장 전체를 참조하게 합니다."
tldr:
  - "디코더 전용 모델에서는 앞쪽 토큰이 뒤쪽 토큰을 참조할 수 없어 인코딩이 편향됩니다."
  - "각 층에서 디코딩한 문장 임베딩을 다음 층 입력의 맨 앞에 추가합니다."
  - "학습 없이 기존 프롬프트 기반 문장 임베딩 방법에 결합할 수 있습니다."
---

![Token Prepending 그림 1](../../images/token-prepending/figure-1.png)

- 동기
    - 인과적 어텐션 사용하는 디코더 전용 모델에서 현재 토큰은 후방 토큰을 참조할 수 없기 때문에 편향된 인코딩과 최종 토큰에 연쇄효과가 발생
- 제안
    - 전방토큰이 후방토큰을 참조할 수 있도록 디코더 Layer별로 이전 Layer의 후방토큰 결과를 다음 Layer의 첫번째 토큰으로 입력하도록 하여 최종 토큰에 전체 문장 정보를 참조할 수 있도록 함
- 개념도
    ![Token Prepending 그림 2](../../images/token-prepending/figure-2.png)
- 대표도
    ![Token Prepending 그림 3](../../images/token-prepending/figure-3.png)
- 성능
    ![Token Prepending 그림 4](../../images/token-prepending/figure-4.png)
