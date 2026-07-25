
# Coding Interview Foundations

Coding rounds for HFT-adjacent roles often test disciplined implementation more than trick puzzles. The bar is high for correctness, clarity, and handling edge cases without losing pace.

## Recommended Flow

1. Restate the problem and confirm constraints.
2. Start with a simple correct solution.
3. Improve data structures only when the bottleneck is clear.
4. Narrate invariants while coding.
5. Test edge cases before declaring success.

## Edge Cases to Check by Default

- Empty inputs
- Duplicate values
- Integer overflow or signed/unsigned mismatches
- Ownership and lifetime issues in C++
- Off-by-one boundaries in circular structures or sliding windows

## Strong Candidate Habit

Mention what you would change if the problem moved from interview scale to production scale: memory pooling, preallocation, instrumentation, or concurrency strategy.
