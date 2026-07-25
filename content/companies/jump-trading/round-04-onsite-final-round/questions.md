# Jump Trading — Round 4: Onsite / Final Round

**What this round assesses:** Algorithms, C++ depth, systems design, networking/hardware awareness, collaboration between researchers and engineers, and behavioral/culture fit.

## Format

Most in-depth stage, typically 3–6 interviews.

## Representative questions

1. Implement a thread-safe LRU cache with template types. `[anecdotal]`
2. Given a list of intervals, merge overlapping ones. `[anecdotal]`
3. Find the k-th largest element in an unsorted array with O(n) average complexity. `[anecdotal]`
4. Design and implement a simple order matching engine. `[anecdotal]`
5. Design a custom memory allocator for fixed-size objects used in an order book. `[inferred]`
6. Explain the C++ object memory model: vtable, virtual dispatch overhead, and alternatives such as CRTP and type erasure. `[inferred]`
7. What is `std::memory_order_seq_cst` vs `acquire/release`? Give a case where `acquire/release` is insufficient. `[inferred]`
8. How does kernel bypass networking, such as DPDK or Solarflare OpenOnload, work, and when is the CPU overhead trade-off worth it? `[inferred]`
9. Explain FPGA-based order entry at a high level: what does the FPGA replace vs what stays in software? `[anecdotal]`
10. Design a low-latency order entry gateway that handles FIX/ITCH protocol, throttling, and reconnect. `[inferred]`
11. Design an exchange-connectivity platform handling multiple venues with different protocols. `[inferred]`
12. How would you design a monitoring + kill-switch system for automated trading? `[inferred]`
13. Design a multi-venue market-data normalization pipeline. `[inferred]`
14. What was the most technically challenging system you've built? What would you change? `[anecdotal]`
15. Describe a time you caught a serious bug before it hit production. `[anecdotal]`
16. How do you stay current with hardware/networking developments relevant to trading systems? `[anecdotal]`

## Sources

- https://www.jumptrading.com/technology
- https://www.jumptrading.com/ai-ml
- https://www.jumptrading.com/careers/roles/
- `research/company-evidence-matrix.md`
- `data/cpp-questions.json`
- `data/design-questions.json`
- `content/design/exchange-gateway.md`
- `content/design/monitoring-and-kill-switches.md`
- Glassdoor (anecdotal), Blind (anecdotal)
