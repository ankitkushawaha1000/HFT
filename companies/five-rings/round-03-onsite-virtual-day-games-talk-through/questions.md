# Five Rings Capital — Round 3: Onsite / Virtual Day (Games + Talk-Through)

**What this round assesses:** Deeper probability, communication under pressure, EV-based decision-making, and for developer-track candidates C++ and data structures.

## Format

Multiple sessions covering harder derivations, structured puzzles, trading games, and sometimes C++/systems for developer-track candidates.

## Games / probability

Harder probability derivations and trading-game talk-throughs; developer-track candidates may also see C++ systems questions.

## Representative questions

1. Secretary problem: interview N candidates sequentially and decide immediately. What strategy maximises selecting the best candidate? `anecdotal`
2. Gambler’s ruin: start with k, win/lose $1 with probability p/1−p, and try to reach N. Derive success probability. `anecdotal`
3. Random walk on integers: start at 0 and move +1 or −1 each step with equal probability. What is the expected time to return to 0? `anecdotal`
4. Roll a 6-sided die. If you get 1, pay $1; if you get 6, receive $6; otherwise nothing. Is this positive EV? What is the fair price? `anecdotal`
5. Minimum of n Uniform(0,1) random variables: derive E[min]. `anecdotal`
6. Implement a thread-safe bounded queue without std::mutex; walk through memory ordering. `inferred`
7. What are the rules for special member functions in C++? Implement a non-copyable, movable resource handle. `inferred`
8. What is the purpose of [[likely]] / [[unlikely]] in C++20, and how do they interact with branch prediction? `inferred`

## Sources

- https://github.com/yongjinhuang/yongjinhuang.github.io/blob/main/public/vaults/interviews/quant-trading/17-CAREER-INTERVIEWS.md
