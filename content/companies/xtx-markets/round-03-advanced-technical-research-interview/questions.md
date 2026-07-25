# XTX Markets — Round 3: Advanced Technical / Research Interview

**What this round assesses:** Expert-level systems knowledge, latency measurement, Linux/networking awareness, ML system design, and research rigour.

## Format

Depth interview; SWE candidates may cover concurrent C++, Linux internals, and latency, while research/ML candidates cover modelling and validation.

## Representative questions

1. Walk me through how you would benchmark C++ code to measure latency at nanosecond granularity. What measurement artefacts exist and how do you mitigate them? `inferred`
2. Explain kernel bypass networking such as DPDK or RDMA. Why would XTX care about this? `inferred`
3. You have a model trained on 2 years of data with backtested Sharpe 2.5. How do you validate it before live deployment, and what are the failure modes? `inferred`
4. Explain how a transformer architecture works. Could you apply it to limit order book data, and what would the input representation be? `inferred`
5. Design a real-time feature engineering pipeline for high-frequency financial data. How do you handle late-arriving data and time alignment? `inferred`

## Sources

- https://www.xtxmarkets.com/insight/technology/
