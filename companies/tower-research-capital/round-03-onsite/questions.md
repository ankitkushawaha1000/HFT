# Tower Research Capital — Round 3: Onsite

**What this round assesses:** Hard algorithms, extreme C++ performance engineering, low-latency trading systems design, probability/math, and hardware-aware optimization.

## Format

3–5 technically demanding onsite rounds over about 4–5 hours. Reported emphasis is on C++ performance, hardware, algorithms, systems design, and probability/math.

## Representative questions

1. "Implement a segment tree with lazy propagation for range sum updates and queries." `anecdotal`
2. "You are given a stream of quotes (bid, ask, symbol, timestamp). Design and implement a data structure for real-time best-bid-offer aggregation across N symbols." `anecdotal`
3. "Implement a Fenwick tree (Binary Indexed Tree). Now use it to solve the 'count inversions' problem." `anecdotal`
4. "Implement a suffix array." `anecdotal`
5. "Explain false sharing in detail. Write a struct that demonstrates false sharing on a dual-core system and then fix it using `alignas(64)`." `anecdotal`
6. "What are SIMD intrinsics? Write a function using AVX2 that computes the dot product of two arrays of floats faster than scalar code." `anecdotal`
7. "What is kernel bypass? Compare DPDK vs. RDMA vs. Solarflare OpenOnload for ultra-low-latency trading. When would you choose each?" `anecdotal`
8. "Write a non-blocking, single-producer single-consumer (SPSC) queue using only `std::atomic` with appropriate memory orderings. Minimize latency." `anecdotal`
9. "Design a co-location market data feed handler with target latency < 500ns for ITCH protocol messages." `anecdotal`
10. "What is the role of a sequencer in an HFT architecture? How do you ensure total order of messages across multiple threads?" `anecdotal`
11. "What is the Kelly Criterion? Derive it from first principles. How would you apply it to position sizing?" `anecdotal`
12. "You have a fair coin. You play a game: flip until tails. You win $2^N$ where N is the number of heads before the tails. How much would you pay to play? (St. Petersburg paradox)" `anecdotal`
13. "A random variable X ~ Uniform(0,1). What is E[X | X > 0.5]?" `anecdotal`

## Sources

- https://www.glassdoor.com/Interview/Tower-Research-Capital-Interview-RVW.htm
- https://www.blind.com (search "Tower Research onsite algorithms")
- https://www.glassdoor.com/Interview/Tower-Research-Capital-Software-Engineer-Interview-Questions-EI_IE278258.0,22_KO23,40.htm
- https://www.blind.com (search "Tower Research C++ performance round")
- https://www.reddit.com/r/algotrading/ (search "Tower Research interview")
- https://www.blind.com (search "Tower Research systems design")
- Reddit r/algotrading
- Blind "Tower Research math"
