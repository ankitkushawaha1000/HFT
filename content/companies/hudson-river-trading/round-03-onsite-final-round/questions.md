# Hudson River Trading — Round 3: Onsite / Final Round

**What this round assesses:** Software engineering, algorithms, system design, C++/systems depth, experienced-candidate design judgment, and behavioral/culture fit.

## Format

Half-day block, typically 4–5 interviews.

## Representative questions

1. Design and implement a concurrent hash map, or explain the design tradeoffs. `[anecdotal]`
2. Implement a least-recently-used (LRU) eviction cache in O(1) for both operations. `[anecdotal]`
3. Given a stream of integers, maintain the top-K most frequent elements. `[anecdotal]`
4. Implement a lock-free SPSC queue in C++ with acquire/release ordering. `[inferred]`
5. Compare arena allocation vs pool allocators vs the general heap. When would you choose each? `[inferred]`
6. Explain MESI protocol and why false sharing is particularly harmful in SPSC-style lock-free queues. `[inferred]`
7. What is NUMA? How does first-touch policy affect memory allocation? `[inferred]`
8. What is kernel bypass networking? When would it be worth the operational complexity? `[inferred]`
9. Design a market-data system that subscribes to exchange feeds and publishes normalized book updates to internal strategies. `[inferred]`
10. How would you design resilient venue gateways with safe reconnect and sequence management? `[inferred]`
11. Design a monitoring and kill-switch system for an automated trading system. `[anecdotal]`
12. Tell me about a time you improved the performance of a system by 2× or more. `[anecdotal]`
13. What is the most complex system you've designed end-to-end? `[anecdotal]`
14. Describe how you debug latency regressions in a production system. `[anecdotal]`

## Sources

- https://www.hudsonrivertrading.com/hrtbeat/interview-at-hrt/
- https://www.hudsonrivertrading.com/hrtbeat/engineering-and-interviewing-at-hrt/
- `research/company-evidence-matrix.md:23`
- `content/low-latency/low-latency-question-bank.md`
- `content/systems/systems-question-bank.md`
- `data/design-questions.json`
- Glassdoor (anecdotal), Blind (anecdotal)
