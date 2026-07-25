# Akuna Capital — Round 3: Technical Onsite / Virtual Day

**What this round assesses:** Deep C++17/20, concurrency, cache behaviour, low-latency systems, probability, EV reasoning, and options market-making intuition.

## Format

Back-to-back technical interviews over video or onsite. Sessions may cover C++ systems, probability/brainteasers, and options/trading scenarios.

## Representative questions

1. Walk me through what happens when you call new in C++. What does the allocator do, why is heap allocation slow for HFT, and how would you design around it? `inferred`
2. What is false sharing? Write a struct that would cause false sharing between two threads and then fix it. `inferred`
3. Explain the C++ memory model. What guarantees does std::atomic<int> with memory_order_acquire give compared to memory_order_relaxed? `inferred`
4. How does the CPU cache hierarchy affect order-book performance? What data layout would minimise cache misses when iterating bids? `inferred`
5. What is the virtual dispatch cost? How would you eliminate it in a hot path? `inferred`
6. Implement a lock-free SPSC ring buffer and walk through your memory-ordering decisions. `anecdotal`
7. You flip a biased coin with P(H)=0.6. What is the probability of at least 3 heads in 5 flips? `anecdotal`
8. You are playing a die game: roll a die; if you get 6, you win $10; otherwise you pay X. What is the maximum X for positive EV? `anecdotal`
9. Expected number of cards you must draw from a shuffled 52-card deck to see the first ace. `anecdotal`
10. Explain how implied volatility relates to option price. If IV jumps, what happens to your delta-hedged position? `inferred`
11. What is gamma risk? Why is being long gamma sometimes described as buying insurance? `inferred`

## Sources

- https://github.com/garymmmjw/QuantGym/blob/main/src/features/companies/companyProfiles.js
- https://github.com/hieptran1812/my-website/blob/main/content/blog/trading/quant-careers/online-assessments-and-screens-decoded.md
- https://github.com/cybergeekgyan/Quant-Developers-Resources/blob/main/README.md
