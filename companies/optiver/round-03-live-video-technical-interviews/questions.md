# Optiver — Round 3: Live Video Technical Interviews

**What this round assesses:** Live coding/debugging, C++ depth, system design, requirements clarification, edge-case reasoning, runtime/memory awareness, and tradeoff discussion.

## Format

Usually 2–4 live video rounds, 45–60 minutes each, with coding, C++/systems depth, design, and behavioral discussion depending on seniority.

## Representative questions

1. How do you choose between `raw pointer`, `unique_ptr`, `shared_ptr`, and `weak_ptr` in performance-sensitive code? `[inferred]`
2. When would you use placement new or a memory pool, and what correctness risks come with it? `[inferred]`
3. Explain acquire-release memory ordering with a concrete producer/consumer example. `[inferred]`
4. What is false sharing and how do you fix it? `[inferred]`
5. Why avoid dynamic allocation (`malloc`/`new`) on the hot path in an HFT system? `[inferred]`
6. What is the ABA problem in lock-free programming? How do you handle memory reclamation? `[inferred]`
7. Implement a SPSC ring buffer in C++ using atomics. `[anecdotal]`
8. What is copy elision / RVO? When can adding `std::move` actually hurt? `[inferred]`
9. Debug this code: explain what undefined behavior exists and how you would fix it. `[anecdotal]`
10. Walk me through the vtable layout for a class hierarchy with multiple inheritance. `[anecdotal]`
11. Design a low-latency market-data feed handler for a multicast exchange feed, including gap detection and recovery. `[inferred]`
12. Design an in-memory limit order book for top-of-book and depth updates. `[inferred]`
13. Design a pre-trade risk system that enforces limits without adding unacceptable latency. `[inferred]`
14. Design an order management system that accepts strategy orders, applies checks, routes to venues, and tracks fills. `[inferred]`

## Sources

- `content/optiver/interview-overview.md`
- `data/questions.json`
- `data/cpp-questions.json`
- `data/design-questions.json`
- `content/low-latency/low-latency-question-bank.md`
- `content/systems/systems-question-bank.md`
- https://optiver.com/insights/category/technology/
- Glassdoor (anecdotal), Blind (anecdotal)
