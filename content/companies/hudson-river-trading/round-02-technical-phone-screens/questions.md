# Hudson River Trading — Round 2: Technical Phone Screen(s)

**What this round assesses:** Live coding, CS fundamentals, algorithms, software engineering depth, C++, Linux, and systems topics.

## Format

Usually 1–2 live technical screens of 45–60 minutes each.

## Online assessment details

- **Platform:** Not officially documented; some candidates report HackerRank.
- **Number/type of problems:** Anecdotally 1–2 algorithmic problems before the phone screen for some roles.
- **Representative OA topics:** Algorithmic coding and fundamentals; exact structure is role-dependent and not officially published.

## Representative questions

1. Implement a binary search tree with insert, delete, and find operations. `[anecdotal]`
2. Implement merge sort and analyze its time/space complexity. `[anecdotal]`
3. Given two sorted arrays, find the median in O(log n). `[anecdotal]`
4. Implement a rate limiter using a sliding window. `[anecdotal]`
5. Implement `std::vector` from scratch, including constructor, push_back, reserve, size, and capacity. `[anecdotal]`
6. What happens during a `std::vector` reallocation? When would you use `reserve`? `[inferred]`
7. Explain the C++ memory model: what is a data race, and how do you detect one? `[inferred]`
8. What is `std::atomic<T>` and what guarantees does it provide? When would `memory_order_relaxed` be appropriate? `[inferred]`
9. Describe RAII and give a concrete example of a resource type that benefits from it. `[anecdotal]`
10. What is UB in C++? Name three common sources and how to detect them. `[inferred]`
11. What is the difference between a process and a thread in Linux? `[inferred]`
12. Explain `epoll` and when you'd use it over `select`/`poll`. `[inferred]`
13. What is a futex? How does it differ from a kernel mutex? `[inferred]`
14. What is a page fault, and why is a major page fault catastrophic in production HFT code? `[inferred]`
15. Why would you pin threads to CPU cores, and why is pinning alone incomplete? `[inferred]`

## Sources

- https://www.hudsonrivertrading.com/hrtbeat/interview-at-hrt/
- https://www.hudsonrivertrading.com/hrtbeat/engineering-and-interviewing-at-hrt/
- `content/systems/systems-question-bank.md`
- Glassdoor (anecdotal), LeetCode Discuss (anecdotal), Blind (anecdotal)
