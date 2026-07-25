# Squarepoint Capital — Round 4: On-site / Virtual — C++ Deep Dive

**What this round assesses:** Advanced C++: memory layout, ABI, templates, concurrency, undefined behavior, and performance.

## Format

Very heavy C++ technical discussion.

## Representative questions

1. Walk through the memory layout of a C++ class with multiple virtual base classes. `anecdotal`
2. How does std::atomic_thread_fence differ from operations on std::atomic<T>? `anecdotal`
3. What is the as-if rule in C++ and how does it interact with volatile and atomic? `anecdotal`
4. Explain CRTP and a use case replacing virtual dispatch. `anecdotal`
5. What is type erasure in C++? Implement a simple any_invocable wrapper. `anecdotal`
6. How does placement new work and what are the alignment requirements? `anecdotal`
7. Compare std::launch::async and std::launch::deferred. `anecdotal`
8. What does restrict do in C, and are there C++ compiler-specific equivalents? `anecdotal`
9. How does LTO interact with inline functions and cross-translation-unit optimization? `anecdotal`

## Sources

- https://www.squarepoint-capital.com/careers
- https://www.glassdoor.com/Interview/Squarepoint-Capital-Interview-Questions-E1057523.htm
