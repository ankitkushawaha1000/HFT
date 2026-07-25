# DRW — Round 4: Onsite

**What this round assesses:** Systems coding, deep C++ internals, low-latency infrastructure design, debugging/profiling, and team fit.

## Format

4–5 rounds over about 4–5 hours, covering coding, C++ deep dive, trading infrastructure system design, and behavioral/team-fit discussion.

## Representative questions

1. "Implement a concurrent, thread-safe order book supporting add, cancel, and query best bid/ask." `anecdotal`
2. "Write a memory pool allocator in C++ for fixed-size objects. Now make it thread-safe using lock-free techniques." `anecdotal`
3. "Implement a publish-subscribe message bus in C++ with type-safe subscription handlers." `anecdotal`
4. "Given a time-series of price ticks, implement an online algorithm for computing the EWMA (exponentially weighted moving average)." `anecdotal`
5. "What is the difference between `new`, `::operator new`, and placement new? Implement a custom allocator using `operator new`." `anecdotal`
6. "What is `std::launder`? When do you need it and what UB does it avoid?" `anecdotal`
7. "How do you profile a C++ program for CPU hotspots? Describe using `perf` on Linux." `anecdotal`
8. "Design a low-latency FIX protocol parser and order router for connecting to 10 different exchanges." `anecdotal`
9. "How would you design a risk management system that validates orders in < 1 microsecond?" `anecdotal`
10. "Tell me about a time you had to learn a new technology very quickly for a critical project." `anecdotal`
11. "DRW values intellectual curiosity. What have you learned on your own in the last 6 months outside of work?" `anecdotal`

## Sources

- https://www.glassdoor.com/Interview/DRW-Interview-RVW.htm
- https://www.blind.com (search "DRW onsite coding")
- https://www.glassdoor.com/Interview/DRW-Software-Engineer-Interview-Questions-EI_IE242042.0,3_KO4,21.htm
- https://www.blind.com (search "DRW systems round")
- https://www.blind.com (search "DRW systems design onsite")
- Reddit r/algotrading
