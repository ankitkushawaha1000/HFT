# Apple — Round 4: Onsite — Coding / Algorithm

**What this round assesses:** Efficient algorithm design, clean C++ code, and tradeoff discussion.

## Format

2–3 shared-environment coding rounds, 45–60 min each; practical problems plus C++ depth for systems teams.

## Online assessment details

Platform: shared live coding environment. Number/type: 2–3 coding rounds. Topics: heaps, trees, topological sort, schedulers, tries, cycle detection, vector/function internals, lock-free queues. `anecdotal`

## Representative questions

1. Merge K Sorted Lists — min-heap/priority queue. `anecdotal`
2. Binary Tree Diameter. `anecdotal`
3. Course Schedule — topological sort and cycle detection. `anecdotal`
4. Design a Task Scheduler — heap and frequency counting. `anecdotal`
5. Word Search II — trie plus DFS/backtracking. `anecdotal`
6. Find Duplicate Number — Floyd's cycle detection. `anecdotal`
7. Implement `std::vector<T>` from scratch: growth, move/copy constructors, exception safety. `anecdotal`
8. Implement a memory allocator with free-list management. `anecdotal`
9. Implement `std::function<>` using type erasure. `anecdotal`
10. Moving Average from Data Stream. `anecdotal`
11. Lowest Common Ancestor of BST. `anecdotal`
12. Implement a lock-free SPSC queue using `std::atomic` with acquire/release ordering; explain why audio callbacks must not allocate. `anecdotal`
13. Explain `[[nodiscard]]` and why it matters for API design. `anecdotal`
14. What is type erasure in C++? How do `std::any` and `std::function` work? `anecdotal`
15. What is undefined behavior in C++? Give examples and explain optimizer exploitation. `anecdotal`
16. Explain `constexpr` vs. `const` and C++20 guarantees. `anecdotal`
17. Explain `std::launch::async` vs. `std::launch::deferred`. `anecdotal`
18. Explain object alignment, `alignas`, and `alignof`; when does misalignment crash vs. hurt performance? `anecdotal`
19. Explain the LLVM IR compilation pipeline: front-end, middle-end, code generation. `anecdotal`

## Sources

- https://webkit.org/contributing-code/ `official`
- https://llvm.org/docs/CodingStandards.html `official`
- LeetCode discuss Apple `anecdotal`
- Glassdoor Apple SWE `anecdotal`
