---
title: "Contrastive Prompting"
category: embedder
type: paper
source_name: arXiv
source_url: https://arxiv.org/abs/2505.12831
published_at: "2025-05"
collected_at: "2025-08-25"
collected_by: manual
summarized_by: jhwang
reviewed_by: jhwang
tldr_by: Claude
status: published
summary: "보조 프롬프트와의 대조로 LLM 문장 임베딩에서 불필요한 정보를 줄이는 추론 시점 기법을 제안합니다."
tldr:
  - "기존 방식은 마지막 토큰에 불필요한 정보까지 인코딩되는 문제가 있습니다."
  - "불필요한 정보를 끌어내는 보조 프롬프트를 추가하고 활성값 차이로 steering vector를 만듭니다."
  - "추가 학습 없이 추론 시점에 기존 프롬프트 기반 방법과 결합할 수 있습니다."
---

![Contrastive Prompting 그림 1](../../images/contrastive-prompting/figure-1.png)

- 동기
    - 기존 방식의 LLM의 문장 임베딩은 마지막 토큰의 임베딩 값에 과도한 비-필수 정보가 인코딩되는 문제가 존재함
- 요약
    1. 대조 프롬프팅 (Contrastive Prompting, CP) 제안
        - 일반 프롬프트 이외에 보조 프롬프트 도입
        - 보조 프롬프트는 불필요한 정보를 요청하는 프롬프트
        - 추론 시점에 순전파 활성화 값 차이를 비교
    2. 추론시점 활성화 조정 (Inference-Time Steering)
        1. Activation Steering 기술
        2. LLM의 출력을 수정하는 steering vector를 사용
        3. positive 와 negative samples의 차이를 학습
- 개념도
    ![Contrastive Prompting 그림 2](../../images/contrastive-prompting/figure-2.png)
- Auxiliary Prompt
    ![Contrastive Prompting 그림 3](../../images/contrastive-prompting/figure-3.png)
- 1단계) Contrastive Activation Steering
    - Normal Prompt의 입력 시퀀스
        ![Contrastive Prompting 그림 4](../../images/contrastive-prompting/figure-4.png)
    - Auxiliary Prompt의 입력 시퀀스
        ![Contrastive Prompting 그림 5](../../images/contrastive-prompting/figure-5.png)
    - LLM에 주입하여 forward propagation 수행
    - Transformer의 L번째 계층의 MHA으로부터 contextualized value vector 얻기
        ![Contrastive Prompting 그림 6](../../images/contrastive-prompting/figure-6.png)
    - Transformer의 L번째 계층의 MHA으로부터 contextualized value vector 얻기
        ![Contrastive Prompting 그림 7](../../images/contrastive-prompting/figure-7.png)
    - Activation Steering Vector얻기
        - 문장별 마지막 토큰 값만 사용
            ![Contrastive Prompting 그림 8](../../images/contrastive-prompting/figure-8.png)
- 2단계) Norm Adjustment
    1. Norm Scaling (NS)
        ![Contrastive Prompting 그림 9](../../images/contrastive-prompting/figure-9.png)
        - 알파: activation 값의 scale을 조정하는 하이퍼파라미터
    2. Norm Recovering (NR)
        ![Contrastive Prompting 그림 10](../../images/contrastive-prompting/figure-10.png)
        - 후속 출력 matrix가 안정적인 입력을 받도록 L2 정규화 수행
- 최종결과) Final Activation Vector
    ![Contrastive Prompting 그림 11](../../images/contrastive-prompting/figure-11.png)
- 성능
    ![Contrastive Prompting 그림 12](../../images/contrastive-prompting/figure-12.png)
- 보조 프롬프트 실험
    ![Contrastive Prompting 그림 13](../../images/contrastive-prompting/figure-13.png)
