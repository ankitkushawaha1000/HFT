# Millennium Management — Round 6: On-site — Domain / Trading Systems Design

**What this round assesses:** Trading infrastructure knowledge, latency-aware design, and order lifecycle understanding.

## Format

Whiteboard/discussion round translating trading requirements into performant C++ system architecture.

## Representative questions

1. Walk through an order lifecycle from strategy signal to exchange acknowledgment. `inferred`
2. Design a real-time market data aggregation system consuming normalized feeds from 8 exchanges. `anecdotal`
3. What is market impact and how would you model it programmatically in a risk pre-trade check? `inferred`
4. How would you reduce latency in a risk calculation that fires on every fill event at 10K fills/sec? `anecdotal`
5. What is the difference between multicast and unicast for market data distribution? `inferred`
6. Design a persistent order book for replay/backtesting with exact microsecond ordering. `inferred`
7. How do you instrument nanosecond-precision latency without perturbing the hot path? `anecdotal`

## Sources

- https://www.mlp.com/careers/
- https://www.glassdoor.com/Interview/Millennium-Management-Interview-Questions-E268418.htm
