---
title: "M3-Embedding"
category: embedder
type: paper
source_name: arXiv
source_url: https://arxiv.org/abs/2402.03216
published_at: "2024-02"
collected_at: "2025-08-25"
collected_by: manual
summarized_by: jhwang
reviewed_by: jhwang
tldr_by: Claude
status: published
summary: "하나의 모델로 다국어, 다양한 입력 길이, dense·sparse·multi-vector 검색을 함께 지원합니다."
tldr:
  - "100개 이상의 언어와 짧은 문장부터 8,192토큰 문서까지의 입력을 지원합니다."
  - "dense, sparse, multi-vector 검색을 동시에 수행하고 점수를 통합할 수 있습니다."
  - "세 검색 방식의 점수를 합친 값을 교사 신호로 쓰는 self-knowledge distillation을 제안합니다."
---

![M3-Embedding 그림 1](../../images/m3-embedding/figure-1.png)

- github
    - [https://huggingface.co/BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3)
    - [https://github.com/FlagOpen/FlagEmbedding](https://github.com/FlagOpen/FlagEmbedding)
- huggingface
    - [https://huggingface.co/BAAI/bge-m3-retromae](https://huggingface.co/BAAI/bge-m3-retromae)
- article
    - [https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings](https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings)
- 요약
    - Multi-Linguality : 100개 이상의 언어에 대한 시맨틱 검색 지원
    - Multi-Granularity : 다양한 Granularity의 입력 처리 (짧은 문장 부터 8,192개 토큰의 긴 문서까지)
    - Multi-Functionality : 3가지 검색 (dense retrieval, sparse retrieval, multi-vector retrieval)을 동시 수행 가능 하며 이들 검색기능의 관련성 점수를 통합하여 학습 품질 향상
- 개념도
    ![M3-Embedding 그림 2](../../images/m3-embedding/figure-2.png)
- 대표도
    ![M3-Embedding 그림 3](../../images/m3-embedding/figure-3.png)
- Text Encoder
    - XLM-RoBERTa (2020)
- M3-Embedding의 문서검색
    ![M3-Embedding 그림 4](../../images/m3-embedding/figure-4.png)
    - 쿼리 = q^x
    - 문서 = D^y
    - 함수 f_n^* = dense, lexical 또는 multi-vector retrieval함수 중의 하나
    - x와 y는 임의의 언어로서, 동일 언어 또는 다른 언어
- 3가지 Retrieval 기법
    1. Dense Retrieval
        1. Query q와 Passage p
        2. H_q = Query의 토큰 시퀀스의 특수 토큰 ‘[CLS]’의 Hidden State
            ![M3-Embedding 그림 5](../../images/m3-embedding/figure-5.png)
            ![M3-Embedding 그림 6](../../images/m3-embedding/figure-6.png)
        3. **score s_dense** : 임베딩 간 내적 계산
            ![M3-Embedding 그림 7](../../images/m3-embedding/figure-7.png)
    2. Lexical Retrieval (Sparse)
        1. 용어 Weight계산
            ![M3-Embedding 그림 8](../../images/m3-embedding/figure-8.png)
        2. W_lex : Hidden state 를 float 단일값 매핑 행렬
        3. **score s_lex** : Query와 Passage에 co-exist하는 용어의 가중치 합
            ![M3-Embedding 그림 9](../../images/m3-embedding/figure-9.png)
    3. Multi-vector Retrieval
        1. Query와 Passage의 모든 Hidden States를 사용 → E_q ( Lq x d ), E_p ( Lp x d )
            ![M3-Embedding 그림 10](../../images/m3-embedding/figure-10.png)
            ![M3-Embedding 그림 11](../../images/m3-embedding/figure-11.png)
        2. **score s_mul**
            ![M3-Embedding 그림 12](../../images/m3-embedding/figure-12.png)
            - N : Query의 길이
            - M : Passage의 길이
- Reranking 기법
    - 3가지 Retrieval 기법을 개별로 수행하여 Candidates를 추출
    - 통합 relevance score 계산
        ![M3-Embedding 그림 13](../../images/m3-embedding/figure-13.png)
        - w1,2,3은 다운스트림 시나리오에 따라 다르게 설정할 수 있음
- 개별 임베딩 학습
    - 데이터셋 : Positive Samples (p^*) , Negative Samples (p^’)
    - s(.)함수 : s_dense, s_lex, s_mul 중의 하나
    - InfoNCE loss
        ![M3-Embedding 그림 14](../../images/m3-embedding/figure-14.png)
        - https://velog.io/@hsbc/InfoNCE-Information-Noise-Contrastive-Estimation
            - 대조학습에 많이 이용되는 손실함수
            - Positive Sample간의 유사도는 최대로, Negative Sample과의 유사도는 최소가 되도록
- 통합 임베딩 학습-1 (self-knowledge distillation 없는)
    - 서로 다른 성질(heterogeneous)의 score를 통합하기 위한 앙상블 기법
    - s_inter (통합 스코어) : 개별 score들의 가중합
        ![M3-Embedding 그림 15](../../images/m3-embedding/figure-15.png)
    - L (통합 Loss) : 개별 loss들의 가중합
        ![M3-Embedding 그림 16](../../images/m3-embedding/figure-16.png)
- 통합 임베딩 학습-2 (self-knowledge distillation 기반)
    - s_inter : teacher (XLM-RoBERTa)
    - s_* : 개별 score
    - CrossEntropy loss
        ![M3-Embedding 그림 17](../../images/m3-embedding/figure-17.png)
        - https://velog.io/@cha-suyeon/%EC%86%90%EC%8B%A4%ED%95%A8%EC%88%98loss-function-Cross-Entropy-Loss
        - 두 score의 분포 사이의 entropy값이 최소가 되도록
    - L (통합 Loss) : 개별 knowledge distillation loss의 가중합
        ![M3-Embedding 그림 18](../../images/m3-embedding/figure-18.png)
- Final Loss계산
    - Linear combination
        ![M3-Embedding 그림 19](../../images/m3-embedding/figure-19.png)
- 실험1
    - 데이터셋
        - MIRACL 다국어 검색 평가셋 : 18개 언어
    - 평가지표
        - nDCG@10 : 정보검색평가 위한 순위 평가 지표
            - 순위가 높을 수록 더 큰 가중치 부여
            - 사용자가 빠르게 필요한 정보를 얻는데 초점을 맞춘 평가 지표
                ![M3-Embedding 그림 20](../../images/m3-embedding/figure-20.png)
- 실험2
    - 데이터셋
        - MLDR (Multilingual Long-Doc Retrieval)
            ![M3-Embedding 그림 21](../../images/m3-embedding/figure-21.png)
