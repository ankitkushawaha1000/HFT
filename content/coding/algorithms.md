# Algorithms for HFT Coding Interviews

Research date: 2026-07-24

Algorithm questions at HFT firms typically emphasize fast, clean reasoning rather than obscure tricks. The strongest candidates know the standard families, when each applies, and how to translate them into solid C++.

## Sorting

### Comparison sorts

- `std::sort` is the default answer for general in-memory sorting. It gives O(n log n) average complexity and is highly optimized.
- `std::stable_sort` matters when equal-element order must be preserved.
- Merge sort is useful conceptually for stability and linked-list sorting.
- Heap sort is less common in interviews unless discussing worst-case guarantees or in-place behavior.

### Non-comparison sorts

Counting sort, radix sort, and bucket sort matter when keys are constrained. In HFT contexts, integer price ticks or bounded IDs can make these relevant in specialized pipelines.

## Binary search and variations

Binary search is more than “find x in a sorted array.” Common variants:

- first occurrence
- last occurrence
- lower bound / upper bound
- answer-space binary search on a monotonic predicate

C++ note: `std::lower_bound` and `std::upper_bound` are worth using when appropriate.

## Two pointers and sliding window

These techniques turn nested loops into linear passes when structure exists.

- two pointers on sorted arrays for pair-sum or deduplication
- fast/slow pointer for compaction or cycle detection
- sliding window for substring and subarray constraints

Senior candidates explain the maintained invariant: what the current window means and why moving one pointer preserves correctness.

## Graph algorithms

### BFS

Use for unweighted shortest path, state-space exploration, and layered processing.

### DFS

Use for reachability, cycle detection, connected components, and recursive structure exploration.

### Dijkstra

Use when edge weights are non-negative and you need shortest paths. In C++, mention stale heap entries or a visited/dist check.

### Topological sort

Use for dependency graphs and DAG scheduling. Both Kahn’s algorithm and DFS-based ordering are valid answers.

## Dynamic programming

DP is often feared unnecessarily. A good process is:

1. define the state clearly
2. define the recurrence
3. identify base cases
4. choose top-down memoization or bottom-up tabulation
5. optimize space if possible after correctness

### Top-down versus bottom-up

- **Top-down memoization:** easier to derive, good when many states are unreachable.
- **Bottom-up:** explicit ordering, no recursion overhead, often easier to optimize space.

Interviewers care more about state definition than about using the fanciest DP variant.

## Greedy algorithms

Greedy works when a local best choice leads to a global optimum. Common examples include interval scheduling and some covering problems. The interview challenge is usually proving or at least explaining why the greedy choice is safe.

## String algorithms

Important categories:

- pattern frequency and counting with hash maps
- prefix/suffix reasoning
- rolling techniques or two-pointer windows
- trie discussions for prefix-heavy problems

For senior roles, it is enough to be strong on common string techniques; exotic algorithms are less frequently the deciding factor unless the role is very specialized.

## C++ STL algorithm usage

Strong C++ candidates use the standard library effectively:

- `std::sort`, `std::nth_element`, `std::partition`
- `std::accumulate`, `std::transform`
- `std::binary_search`, `std::lower_bound`
- `std::all_of`, `std::any_of`, `std::find_if`

Using STL well signals practical competence. Just be able to explain complexity and iterator requirements.

## Interview advice

For any algorithmic solution, explicitly state:

- why the input structure suggests the algorithm
- complexity in time and space
- the critical invariant or correctness idea
- one alternative you considered and rejected

That is often what separates a senior answer from a merely correct one.

## Interval algorithms

Intervals appear frequently in trading-flavored interviews through scheduling, overlap detection, and aggregation problems. Common tools are sorting by start time, merging overlaps, sweep-line logic, and min-heaps for tracking current active intervals.

## Recursion and backtracking

Even when the role is systems-heavy, interviewers may test recursive reasoning. Good answers define the recursive state, base case, and pruning rule clearly. In C++, mention stack-depth risk and when you would switch to an explicit stack in production.

## Bit manipulation and numeric care

Bit tricks are not the center of most senior interviews, but engineers should be comfortable with masks, powers of two, and overflow-safe midpoint calculations. This matters in ring buffers, flags, and performance-sensitive code.

## Algorithm selection framework

When stuck, ask: Is the input ordered? Is there a graph? Can I trade time for memory with hashing? Is there overlapping substructure suggesting DP? Is there a greedy choice with a proof sketch? This framework helps you recover quickly without guessing.

## Common failure patterns

Candidates often reach for dynamic programming when a greedy or sorting solution is enough, or they use hashing when ordered structure is essential. Another frequent miss is implementing an algorithm correctly but forgetting the dominant sort or heap cost when discussing complexity. Stating these tradeoffs explicitly helps interviewers trust your judgment.

## Testing algorithmic solutions

After coding, run a tiny hand simulation and one adversarial case. For graph algorithms, test disconnected nodes; for binary search, test boundaries; for DP, test the smallest base cases. This prevents many avoidable interview bugs.
