# G-Research — Round 3: Technical Interview (C++ / Systems / Mathematics)

**What this round assesses:** Production C++ expertise, systems understanding, mathematical rigour, and probabilistic reasoning.

## Format

Engineer interview with C++, systems, and mathematics/probability content.

## Representative questions

1. Explain move semantics in C++11. What problem do they solve, and what happens to the moved-from object? `inferred`
2. What is a race condition? Give an example in C++ and show how to fix it with std::atomic or std::mutex. `inferred`
3. What is the strict aliasing rule? How can it bite you in a serialisation context, and how do you fix it? `inferred`
4. What is template argument deduction in C++17? Give an example of CTAD. `inferred`
5. Describe the lifetime of a C++ object from construction through destruction. What is the constructor/destructor order in inheritance? `inferred`
6. How does Linux scheduling work? What is the difference between SCHED_FIFO and SCHED_OTHER, and when would you use CPU affinity in a trading system? `inferred`
7. Explain NUMA. How would you design data structures to be NUMA-aware on a multi-socket server? `inferred`
8. Derive the Black-Scholes formula delta. What does it represent intuitively? `inferred`
9. You observe a time series of returns. How would you test whether they are autocorrelated, and what strategy would you build if they were? `inferred`
10. Given n independent Poisson processes with rates λ₁, …, λₙ, what is the rate of the merged process? `anecdotal`

## Sources

- https://github.com/sgoel97/blog/blob/main/content/blog/quant-interview/index.md
- https://github.com/cybergeekgyan/Quant-Developers-Resources/blob/main/README.md
- https://github.com/yongjinhuang/yongjinhuang.github.io/blob/main/public/vaults/interviews/quant-trading/17-CAREER-INTERVIEWS.md
