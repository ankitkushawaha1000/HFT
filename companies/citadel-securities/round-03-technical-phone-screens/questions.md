# Citadel Securities — Round 3: Technical Phone Screen(s)

**What this round assesses:** Live coding, C++ and systems depth, low-latency tradeoffs, and reasoning while coding in a shared editor.

## Format

Usually 1–2 live technical screens, 45–60 minutes each.

## Representative questions

1. Implement a hash map from scratch, or explain internals of `std::unordered_map`. `[anecdotal]`
2. How would you think about allocator strategy for standard containers in a low-latency application? `[inferred]`
3. What is the ABA problem, and how would you address memory reclamation in a lock-free stack? `[inferred]`
4. How do you think about exceptions in a low-latency C++ codebase? `[inferred]`
5. Implement a thread-safe queue, or describe the design tradeoffs between SPSC and MPMC queues. `[anecdotal]`
6. Explain the MESI cache coherence protocol and its implications for concurrent data structures. `[inferred]`
7. What is false sharing, and how do you avoid it? `[inferred]`
8. Implement a function to find all two-sum pairs in an array, or serialize/deserialize a binary tree. `[anecdotal]`

## Sources

- https://www.citadelsecurities.com/careers/details/c-software-engineer-2/
- https://www.citadelsecurities.com/innovation/
- `data/cpp-questions.json`
- `content/systems/systems-question-bank.md`
- Glassdoor (anecdotal), Blind (anecdotal), LeetCode Discuss (anecdotal)
