# XTX Markets — Round 2: Technical Interview (Coding + Systems / Research)

**What this round assesses:** C++/Python programming, DSA depth, low-latency systems for SWE, and quantitative research methodology for research roles.

## Format

Engineer or researcher interview split between coding and systems for SWE, or coding and statistics/ML for research.

## Representative questions

1. Implement an order book with O(1) best-bid/best-ask retrieval and O(log n) insertion. What data structure? `inferred`
2. What is the difference between std::deque, std::list, and std::vector from a cache-performance perspective? Which would you use for a price level in an order book? `inferred`
3. Explain mechanical sympathy. Give an example of code that is correct but cache-unfriendly. `inferred`
4. How does std::shared_ptr work internally? What is the cost per dereference and why is it a problem in latency-sensitive code? `inferred`
5. Design a market data normalisation system that handles multiple exchange feeds with different formats and timestamps. `inferred`
6. Explain overfitting in a trading context. How do you detect it in a backtest? `inferred`
7. What is the multiple comparisons problem? How does it apply when testing 100 trading signals? `inferred`
8. Derive the OLS estimator and explain what assumptions are required for it to be BLUE. `inferred`

## Sources

- https://github.com/hieptran1812/my-website/blob/main/content/blog/trading/quant-careers/quant-compensation-demystified.md
- https://github.com/yongjinhuang/yongjinhuang.github.io/blob/main/public/vaults/interviews/quant-trading/17-CAREER-INTERVIEWS.md
- https://www.xtxmarkets.com/insight/technology/
