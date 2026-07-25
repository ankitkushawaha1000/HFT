# Citadel Securities — Round 4: Superday / Final Onsite

**What this round assesses:** Algorithms, C++ and systems depth, system design, production judgment, and behavioral fit.

## Format

Full day of back-to-back interviews, typically 4–6 rounds. Anecdotal reports describe 2 coding/algorithms rounds, 1–2 C++/systems rounds, 1 system design round, and 1 behavioral/fit round.

## Representative questions

1. Design and implement a LRU cache. `[anecdotal]`
2. Given a stream of market data, implement a sliding window order book summary. `[anecdotal]`
3. Implement a min-heap or priority queue from scratch. `[anecdotal]`
4. Explain `std::move` semantics and when the move constructor is implicitly defined. `[anecdotal]`
5. What is the object memory layout for a class with virtual functions, and how does the vtable work? `[anecdotal]`
6. What are the rules of zero, three, and five in C++, and when do they apply? `[inferred]`
7. How do `std::unique_ptr` and `std::shared_ptr` differ in terms of cost on hot code paths? `[inferred]`
8. Design a multicast market-data feed handler including gap detection, recovery, and downstream publication. `[inferred]`
9. Design a pre-trade risk system that enforces limits without adding latency to order flow. `[inferred]`
10. Design an order management system with multi-venue state machines and session management. `[inferred]`
11. Tell me about a time you disagreed with a technical decision and what you did. `[anecdotal]`
12. Describe a production incident you owned end-to-end. `[anecdotal]`
13. How have you balanced performance against correctness in a real system? `[inferred]`

## Sources

- https://www.citadelsecurities.com/careers/
- https://www.citadelsecurities.com/innovation/
- `research/company-evidence-matrix.md:24-28`
- `data/cpp-questions.json`
- `data/design-questions.json`
- Glassdoor (anecdotal), Blind (anecdotal), LeetCode Discuss (anecdotal)
