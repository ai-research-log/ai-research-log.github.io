---
title: "XLM-Roberta"
category: embedder
type: paper
source_name: arXiv
source_url: https://arxiv.org/abs/1911.02116
published_at: "2019-11"
collected_at: "2025-09-12"
collected_by: manual
summarized_by: jhwang
reviewed_by: jhwang
tldr_by: Claude
status: published
summary: "100개 언어의 대규모 데이터로 사전학습해 교차 언어 과제의 성능을 높입니다."
tldr:
  - "100개 언어, 2TB 이상의 CommonCrawl 데이터로 Transformer 기반 MLM을 학습합니다."
  - "XNLI, MLQA, NER 등에서 multilingual BERT보다 높은 성능을 보고합니다."
  - "데이터가 적은 언어에서도 성능 향상이 크다고 보고합니다."
---

![XLM-Roberta 그림 1](../../images/xlm-roberta/figure-1.png)

- huggingface
    - [https://huggingface.co/docs/transformers/model_doc/xlm-roberta](https://huggingface.co/docs/transformers/model_doc/xlm-roberta)
    - [https://huggingface.co/FacebookAI/xlm-roberta-base](https://huggingface.co/FacebookAI/xlm-roberta-base)
- Article
    - [https://dacon.io/competitions/official/235875/codeshare/4539](https://dacon.io/competitions/official/235875/codeshare/4539)
    - [https://nuevo-devo.tistory.com/31](https://nuevo-devo.tistory.com/31)
    - [https://ariz1623.tistory.com/309](https://ariz1623.tistory.com/309)
- 모델
    ![XLM-Roberta 그림 2](../../images/xlm-roberta/figure-2.png)
- 데이터
    ![XLM-Roberta 그림 3](../../images/xlm-roberta/figure-3.png)
    ![XLM-Roberta 그림 4](../../images/xlm-roberta/figure-4.png)
- 언어별 비율
    ![XLM-Roberta 그림 5](../../images/xlm-roberta/figure-5.png)

## Evaluation

- Cross-lingual classification
    ![XLM-Roberta 그림 6](../../images/xlm-roberta/figure-6.png)
- NER
    ![XLM-Roberta 그림 7](../../images/xlm-roberta/figure-7.png)
- Question Answering
    ![XLM-Roberta 그림 8](../../images/xlm-roberta/figure-8.png)
