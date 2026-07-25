# Tower Research Capital — Round 2: Technical Phone Screen

**What this round assesses:** C++17, concurrency, low-latency reasoning, live coding, and algorithms.

## Format

60-minute technical screen combining live coding and C++ knowledge questions via CoderPad or phone.

## Representative questions

1. "Implement a generic thread-safe queue in C++17 using condition variables. Now analyze the latency characteristics." `anecdotal`
2. "What is the difference between `std::atomic<T>` with `memory_order_relaxed` vs. `seq_cst`? Demonstrate the performance difference." `anecdotal`
3. "Explain what happens when you call a virtual function: vtable lookup, instruction cache implications, branch predictor behavior." `anecdotal`
4. "Implement a compile-time type list (variadic templates). Implement `TypeAt<N, List>` to get the N-th type." `anecdotal`
5. "What is the strict aliasing rule? Give a concrete example where violating it causes UB with GCC's `-O2`." `anecdotal`
6. "Given N segments on a number line, find the maximum number of overlapping segments at any point." `anecdotal`
7. "Write a function to find the median of two sorted arrays in O(log(m+n))." `anecdotal`

## Sources

- https://www.glassdoor.com/Interview/Tower-Research-Capital-Software-Engineer-Interview-Questions-EI_IE278258.0,22_KO23,40.htm
- https://www.blind.com (search "Tower Research phone screen C++")
