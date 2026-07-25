# STL Internals and Performance

STL knowledge at senior level is mostly about cost models: memory layout, iterator invalidation, allocation behavior, and what the CPU actually sees. In HFT interviews, “which container would you use?” is usually shorthand for “do you understand branch prediction, cache locality, stability guarantees, and update/query patterns?”

## `std::vector`

`std::vector` is a contiguous dynamic array: pointer, size, and capacity. Its strengths are excellent cache locality, very low per-element overhead, and compatibility with SIMD-friendly loops.

Growth is amortized O(1) for `push_back`, but a growth step reallocates a larger block and moves or copies all elements. The standard does not mandate the growth factor; many implementations roughly grow by 1.5x to 2x.

Reallocation invalidates:
- all iterators;
- all references and pointers to elements;
- the `data()` pointer.

Erasing in the middle shifts later elements, so complexity is linear. In market-data code, `vector` is often the right default when maximum size is bounded or reservable.

## `std::deque`

`std::deque` is typically a segmented array: a map of block pointers plus fixed-size blocks. It supports O(1) amortized insertion/removal at both ends without relocating all elements like a vector would.

It is useful for queue-like workloads, but random access, while constant time, is less locality-friendly than vector because the data is not fully contiguous. If you care about cache-line efficiency in scanning, `deque` usually loses to `vector`.

## `std::list`

`std::list` is a doubly linked list. Each node stores payload plus prev/next pointers, requiring separate allocations unless a custom allocator/pool is used.

Pros:
- stable iterators and references;
- O(1) splicing and insertion/erase given an iterator.

Cons:
- poor cache locality;
- high allocation overhead;
- branch-heavy traversal.

Many developers overuse `list` because of asymptotic complexity arguments while ignoring hardware cost. In most modern workloads, especially HFT, `list` is a niche tool.

## `std::map` vs `std::unordered_map`

`std::map` is usually a red-black tree. Operations are O(log n), keys remain ordered, iterators are stable except for erased elements, and in-order traversal is natural.

`std::unordered_map` is a hash table with average O(1) lookup/insert/erase, but performance depends on hash quality, load factor, and collision behavior. Iteration order is unspecified.

Use `map` when:
- order matters;
- you need predecessor/successor queries;
- stable iteration order aids determinism/debugging;
- worst-case behavior matters more than average-case speed.

Use `unordered_map` when:
- keys are well-hashed;
- lookup dominates;
- ordering is irrelevant;
- memory overhead and rehash behavior are acceptable.

In very latency-sensitive code, even `unordered_map` may be too unpredictable compared with flat or sorted-vector structures.

## `std::set`, `std::multimap`, `std::multiset`

`set` is a tree of unique keys. `multiset` allows duplicates. `multimap` allows repeated keys associated with multiple values. Their semantics are useful for order books, ranking structures, or interval indexes where sorted traversal and range queries matter.

But remember the cost: node-based allocation and poor spatial locality versus flat structures.

## Hash quality and collisions

Hash tables are only as good as the hash distribution. A weak hash causes clustering, more equality checks, longer chains or probing sequences, and tail-latency spikes.

Good hash functions:
- mix entropy from all relevant key bits;
- are cheap enough for the key size and access pattern;
- avoid adversarial clustering if input can be hostile.

For internal HFT keys, inputs are typically not malicious, but poor hashing still causes performance cliffs.

## Custom comparators and hash functions

Ordered containers accept custom comparators that must impose a strict weak ordering. Violating that requirement breaks container invariants and yields undefined behavior.

```cpp
struct ByPriceTime {
    bool operator()(const Order& a, const Order& b) const {
        if (a.price != b.price) return a.price > b.price;
        return a.seq < b.seq;
    }
};
```

Hash-based containers need both a hash and equality function consistent with each other: if `a == b`, hashes must match.

## `std::string` and SSO

Many standard library implementations use Small String Optimization: short strings are stored inline inside the `std::string` object without heap allocation. The exact capacity is implementation-specific.

SSO means moving or copying short strings can be cheaper than expected, but you must not write code that depends on a particular inline size. In protocols and symbol handling, fixed-size arrays or interned symbols may still be preferable when predictability matters.

## Iterator invalidation summary

- `vector`: reallocation invalidates everything; middle erase invalidates from erase point onward.
- `deque`: insert/erase invalidation rules are more complex; references often survive end operations better than iterators.
- `list`/`map`/`set`: iterators and references usually remain valid except for erased elements.
- `unordered_map`: rehash invalidates iterators; references/pointers to elements usually remain valid across rehash in common implementations, but know the exact standard guarantees you rely on.

## Performance heuristics for HFT

1. Start from contiguous containers.
2. Reserve capacity whenever realistic.
3. Prefer bounded structures in hot paths.
4. Measure branch misses and LLC misses, not just algorithmic complexity.
5. Be wary of node-based containers under bursty traffic.

## Interview questions with performance answers

**Why is `vector` often faster than `list` even when insertion is O(n)?**  
Because contiguous memory and predictable iteration usually dominate pointer-chasing costs on modern CPUs.

**What is the real cost of `vector` growth?**  
A reallocation copies or moves every element and invalidates all pointers, references, and iterators.

**When would you choose `map` over `unordered_map`?**  
When order, range queries, stable traversal, or more predictable worst-case behavior matter.

**What makes a bad hash function dangerous?**  
Collisions destroy average O(1) behavior and create latency spikes via long chains or probe sequences.

**Why is `deque` not just a better `vector`?**  
It gives cheap end insertions without wholesale relocation, but sacrifices contiguity and some locality benefits.

**What is SSO and why should you care?**  
Small String Optimization stores short strings inline, often avoiding allocation, which affects copies, moves, and memory layout.
