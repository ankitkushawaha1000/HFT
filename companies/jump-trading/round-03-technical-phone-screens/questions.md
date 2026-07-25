# Jump Trading — Round 3: Technical Phone Screen(s)

**What this round assesses:** Live coding, systems depth, low-level C++ reasoning, and concepts from the lowest levels of the stack.

## Format

Live technical screen(s), usually 1–2 rounds.

## Representative questions

1. Implement a generic circular buffer (ring buffer) with fixed capacity. `[anecdotal]`
2. Implement a basic expression evaluator with stack-based parsing. `[anecdotal]`
3. Implement binary tree lowest common ancestor. `[anecdotal]`
4. Find the longest substring without repeating characters, or solve a similar sliding-window problem. `[anecdotal]`
5. How do you implement a lock-free SPSC queue? Walk through the memory ordering. `[inferred]`
6. Explain RAII, and how would you implement a scope-guard type? `[anecdotal]`
7. What is the difference between `std::mutex` and a spinlock? When would you prefer one? `[inferred]`
8. Explain why `std::vector` can be faster than `std::list` even for the same algorithm. When can this not hold? `[inferred]`
9. What is RDMA? At a high level, how does it reduce latency compared to a traditional socket? `[inferred]`
10. What is multicast and why does it matter for market-data distribution? `[inferred]`

## Sources

- https://www.jumptrading.com/technology
- https://www.jumptrading.com/careers/roles/
- `content/low-latency/low-latency-question-bank.md`
- `content/systems/systems-question-bank.md`
- Glassdoor (anecdotal)
