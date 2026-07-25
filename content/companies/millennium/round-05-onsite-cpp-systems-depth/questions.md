# Millennium Management — Round 5: On-site — C++ and Systems Depth

**What this round assesses:** C++ mastery, undefined behavior, atomics, cache effects, and production performance reasoning.

## Format

Discussion-heavy interview focused on language mechanics, memory model, concurrency, and systems.

## Representative questions

1. Explain the C++ memory model: what does std::memory_order_acquire guarantee vs std::memory_order_seq_cst? `anecdotal`
2. What is false sharing, how would you reproduce it in a benchmark, and how do you fix it? `anecdotal`
3. Walk through what happens when a virtual function is called, including vtable lookup and performance implications. `anecdotal`
4. When would you use std::atomic<T> rather than a mutex? `anecdotal`
5. Explain template specialization vs function overloading. `anecdotal`
6. Give three examples of undefined behavior that could corrupt a trading system. `anecdotal`
7. How does cache-line alignment affect concurrent data structures? `anecdotal`
8. Describe a custom memory pool/arena allocator for a low-latency execution path. `anecdotal`

## Sources

- https://www.glassdoor.com/Interview/Millennium-Management-Software-Engineer-Interview-Questions-EI_IE268418.0,21_KO22,39.htm
- https://www.mlp.com/careers/
