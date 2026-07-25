# Point72 Asset Management (incl. Cubist Systematic Strategies) — Round 6: On-site — C++ / Systems Deep Dive

**What this round assesses:** Senior-level C++ and systems mastery for trading infrastructure.

## Format

Discussion-heavy interview on C++ mechanics, concurrency, memory, and Linux systems.

## Representative questions

1. Implement a lock-free single-producer single-consumer ring buffer in C++; what memory orderings are required? `anecdotal`
2. Explain volatile in C++; is it sufficient for thread synchronization? `anecdotal`
3. What are context-switch costs and how do they affect latency? `anecdotal`
4. Design a custom allocator for a fixed-size object pool with no dynamic allocation on the critical path. `anecdotal`
5. What is the ABI layout of a C++ class with virtual functions? `anecdotal`
6. How can mmap and huge pages reduce TLB miss rates in a market data application? `anecdotal`
7. How does the C++ optimizer interact with std::atomic? `anecdotal`
8. Explain CPU branch prediction and hot-path latency impact. `anecdotal`

## Sources

- https://cubist.com/careers
- https://www.glassdoor.com/Interview/Point72-Asset-Management-Interview-Questions-E476491.htm
