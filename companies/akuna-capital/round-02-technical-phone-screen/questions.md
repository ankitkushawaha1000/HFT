# Akuna Capital — Round 2: Technical Phone Screen

**What this round assesses:** Clean C++ implementation, core data structures, memory/value semantics, and basic options or trading interest.

## Format

Engineer-led phone or video screen, often with shared-document coding and verbal C++ discussion.

## Representative questions

1. What is the difference between std::move and std::copy? In what situation would you move vs copy? `inferred`
2. Explain RAII. Write a class that owns a resource and correctly implements the Rule of Three / Rule of Five. `inferred`
3. What is undefined behaviour in C++? Give two examples that commonly appear in production trading code. `inferred`
4. Implement a function to find the k-th largest element in an unsorted array. What is the complexity, and can you do better than sort? `anecdotal`
5. What is a delta-neutral position? If you are long 100 calls with delta 0.5, what hedge is needed? `anecdotal`
6. A fair die is rolled repeatedly. What is the expected number of rolls until you see a 6? `anecdotal`
7. Explain the difference between stack and heap allocation. When would you choose each in a latency-sensitive system? `inferred`

## Sources

- https://github.com/garymmmjw/QuantGym/blob/main/src/features/companies/companyProfiles.js
- https://akunacapital.com/careers
