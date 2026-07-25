# Bloomberg — Round 4: Onsite — C++ Language Depth

**What this round assesses:** Core C++ semantics, memory model, lifecycle, templates, concurrency primitives, and design patterns.

## Format

1–2 discussion-heavy rounds, 45–60 min each, sometimes with live coding of small snippets.

## Representative questions

1. Implement `std::shared_ptr<T>` from scratch: control block, reference count, weak count, deleter. `anecdotal`
2. Explain the vtable mechanism and draw a vtable layout for a class hierarchy. `anecdotal`
3. What happens if you throw an exception in a destructor? What is `noexcept` and why does it matter? `anecdotal`
4. Implement a thread-safe singleton using `std::call_once`; why is double-checked locking with a raw pointer broken without `std::atomic`? `anecdotal`
5. Explain template specialization and write a partial specialization for pointer types. `anecdotal`
6. What is CRTP? Implement an object instance counter using CRTP. `anecdotal`
7. Explain `std::enable_if` and SFINAE; write a template function only for arithmetic types. `anecdotal`
8. Implement compile-time Fibonacci using `constexpr` or template recursion. `anecdotal`
9. What is copy elision/RVO and when is it guaranteed in C++17? `anecdotal`
10. Implement a fixed-size memory pool allocator and integrate it with STL containers via a custom allocator. `anecdotal`
11. Explain `std::atomic<int>` memory ordering: relaxed, acquire/release, sequentially consistent. `anecdotal`
12. Write a producer-consumer queue using `std::mutex` and `std::condition_variable`; how would you make it lock-free? `anecdotal`
13. Explain the diamond inheritance problem, virtual inheritance, and overhead. `anecdotal`
14. What are `std::vector` guarantees when `push_back` exceeds capacity, and how does this affect iterators and pointers? `anecdotal`

## Sources

- Glassdoor Bloomberg C++ interview `anecdotal`
- LeetCode discuss Bloomberg C++ `anecdotal`
- https://www.bloomberg.com/company/stories/engineering/ `official`
