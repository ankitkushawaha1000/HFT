# Data Structures for HFT Coding Interviews

Research date: 2026-07-24

Interviewers use data-structure questions to test whether you can map a problem to the right representation quickly. For HFT-oriented roles, the best answer also considers implementation details in C++ and practical performance, not just textbook complexity.

## Arrays and strings

Arrays and vectors are the default choice when data is contiguous or indexable. Common techniques:

- **two pointers:** partitioning, deduplication, pair finding in sorted arrays
- **sliding window:** substrings, subarrays, rate/limit windows
- **prefix sums:** range aggregates and balance checks

C++ notes:

- prefer `std::vector<T>` for dynamic contiguous storage
- reserve capacity when size is known approximately
- use `std::string_view` for non-owning string slices when lifetimes are safe

Complexities are usually O(n) scans with O(1) extra space, though string slicing or output storage may add more.

## Linked lists

Linked lists appear in interviews because they force pointer reasoning. Common patterns:

- reversal
- cycle detection via Floyd’s tortoise and hare
- merge of sorted lists
- middle-node finding

C++ notes:

- be precise about ownership; interview snippets often use raw pointers for simplicity, but mention RAII in real code
- remember that singly linked lists make deletion of a known node harder without predecessor access

Linked lists are rarely cache-friendly, so a strong candidate may note that although they are good interview exercises, vectors often win in production unless stable splicing is essential.

## Stacks and queues

Stacks are useful for:

- parsing and delimiter matching
- monotonic stack problems
- DFS on explicit state

Queues are useful for:

- BFS in graphs or grids
- level-order tree traversal
- producer/consumer pipelines

C++ notes:

- `std::stack` and `std::queue` are container adaptors; sometimes using `std::vector` or `std::deque` directly is clearer
- for ring-buffer-style performance, a custom bounded queue may be better than a general-purpose adaptor

## Trees

### Binary search trees

BSTs support ordered search, predecessor/successor queries, and range operations. Interviewers may ask about insert, search, delete, balancing issues, and traversal orders.

### Balanced trees

Red-black or AVL trees maintain O(log n) operations. In C++, `std::map` and `std::set` are usually tree-based.

### Traversals

- preorder for serialization-like tasks
- inorder for sorted order in BSTs
- postorder for cleanup or bottom-up calculations
- level order via queue

C++ notes:

- recursion is concise but can hit depth limits
- iterative traversals are worth knowing for control and stack safety

## Graphs

Graphs model dependencies, networks, and reachability.

### BFS

Best for shortest path in unweighted graphs or level-by-level exploration. Complexity is O(V + E).

### DFS

Good for connectivity, cycle detection, topological preparation, and exhaustive exploration. Also O(V + E).

### Shortest path

Dijkstra’s algorithm is the default answer for non-negative weighted graphs. In C++, this typically uses `std::priority_queue` with careful handling of stale entries.

## Hash tables

Hash maps are powerful for membership tests, counting, grouping, and ID lookups.

Topics worth mentioning:

- collision handling conceptually: chaining or open addressing
- expected O(1) operations, not worst-case guarantees
- memory overhead and poorer locality than arrays or sorted vectors

C++ notes:

- `std::unordered_map` is convenient but may need `reserve()`
- custom hash functions matter for compound keys
- iterator invalidation on rehash must be understood

## Priority queues / heaps

Use heaps when repeatedly extracting the smallest or largest element:

- top-K problems
- best-first search
- scheduling and timers
- Dijkstra

C++ notes:

- `std::priority_queue` is a max-heap by default
- use a comparator for min-heap behavior
- no efficient arbitrary delete; if needed, consider other structures or lazy invalidation

## Practical interview advice

When choosing a structure, say why alternatives lose. Example: “I could use a tree for ordered updates, but because I only need repeated max extraction, a heap gives simpler code and lower constant factors.” That reasoning is often more valuable than the final container name.

## Complexity summary table

| Structure | Typical use | Access/Search | Insert/Delete |
|---|---|---:|---:|
| Array / `vector` | contiguous data | O(1) index | O(n) middle shift |
| Linked list | pointer exercises, splicing | O(n) | O(1) with node access |
| Stack | LIFO workflows | O(1) top | O(1) push/pop |
| Queue | FIFO workflows | O(1) front | O(1) push/pop |
| BST / `map` | ordered keys | O(log n) | O(log n) |
| Hash map | membership / counts | O(1) expected | O(1) expected |
| Heap | repeated min/max | O(1) top | O(log n) push/pop |

A senior candidate uses this table as a starting point, then layers on memory layout, iteration patterns, and correctness needs.

## Memory layout and locality

For HFT interviews, it is worth adding that locality can outweigh theoretical elegance. A sorted `vector` with binary search may outperform a tree for read-heavy workloads because contiguous memory is cache-friendly. Likewise, dense arrays indexed by handles can beat hash maps when keys can be normalized into small integer ranges.

## How to choose under pressure

A strong practical pattern is: start with the operations, note whether ordering matters, note whether deletions from the middle matter, then choose the simplest structure that supports those operations efficiently. Saying this out loud demonstrates disciplined reasoning rather than memorized templates.
