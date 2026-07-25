# CPU Cache and NUMA

Many HFT performance problems are memory problems in disguise. The CPU is fast; missing cache, bouncing cache lines, or reading remote NUMA memory is not. Interviews therefore focus on practical cache behavior rather than textbook definitions alone.

## Cache hierarchy

Modern servers typically have private L1 and L2 caches per core and a larger shared last-level cache (often L3) per socket or cluster. Exact sizes vary by generation, but the qualitative model matters:
- L1: smallest, fastest;
- L2: larger, still fast;
- L3: larger, slower, often shared;
- DRAM: much slower again.

The cost jump from cache hit to DRAM miss is large enough that data layout often matters more than instruction count.

## Cache line size

A cache line is typically 64 bytes on mainstream x86-64 servers. Coherence and transfers happen at cache-line granularity, not at field granularity.

This explains false sharing: two unrelated variables in the same line still interfere if different cores write them.

## False sharing

False sharing occurs when independent data used by different threads resides in the same cache line and is frequently written. The line bounces between cores under the coherence protocol, causing latency and bandwidth waste.

Avoid it by:
- padding frequently written fields to cache-line boundaries;
- separating producer and consumer indices;
- partitioning data per thread/core.

## Cache-friendly data structures

Cache-friendly structures are compact, contiguous, and traversal-predictable. Examples:
- arrays and vectors instead of linked lists;
- structure splitting so hot fields sit together and cold fields move elsewhere;
- flat sorted vectors when update rates are low and lookup iteration dominates.

The best structure is the one whose access pattern matches the cache, not the one with the prettiest asymptotic complexity.

## NUMA architecture

NUMA means Non-Uniform Memory Access. A multi-socket machine has memory physically closer to some CPUs than others. Local memory access is faster and often higher-bandwidth than remote access through inter-socket links.

Treat each socket as a locality domain. If a feed handler runs on socket 0 but its buffers are allocated on socket 1, every access pays a tax.

## CPU affinity for NUMA awareness

Pinning threads without considering memory placement is incomplete. To be NUMA-aware, you often want:
- thread pinning to chosen cores;
- first-touch allocation by the owning thread;
- NIC interrupt steering aligned to the same socket;
- per-socket data structures when sharing is avoidable.

## Prefetching

Hardware prefetchers detect simple patterns and pull data into cache ahead of use. They work well for linear access and sometimes for regular strides. Software prefetching can help for irregular but predictable access, though misuse can waste bandwidth and pollute cache.

A strong interview answer notes that prefetching is workload-specific and should be driven by profiling, not folklore.

## MESI and cache invalidation

Coherence protocols such as MESI keep cached copies consistent across cores. Modified/Exclusive/Shared/Invalid state transitions matter because writes to a shared line trigger invalidations or ownership transfers.

Lock contention and heavily shared atomics therefore have costs beyond the instruction itself: they generate coherence traffic and stall other cores.

## HFT implications

- Keep hot per-thread data local and padded.
- Minimize shared writable state.
- Prefer linear scans over pointer chasing when the working set fits cache.
- Align network processing, memory allocation, and thread affinity with NUMA topology.
- Measure LLC misses, remote accesses, and coherence behavior with performance tools.

## Interview questions with answers

**Why can a linear scan on a vector beat a theoretically better structure?**  
Because contiguous cache-friendly access can dominate algorithmic complexity at realistic sizes.

**What is false sharing?**  
Unrelated variables in the same cache line cause coherence traffic when written from different cores.

**Why is 64-byte alignment often mentioned?**  
Because a cache line is typically 64 bytes, so alignment and padding decisions are often made at that granularity.

**What does NUMA change?**  
Memory access latency and bandwidth depend on which CPU/socket accesses which memory.

**Why are atomics sometimes slow even without locking?**  
Shared cache lines still need coherence coordination, especially for writes and read-modify-write operations.

**When would software prefetch help?**  
Occasionally for predictable but nontrivial access patterns where hardware prefetchers do not detect the pattern well.
## Practical measurement cues

    If throughput is acceptable but p99 latency is unstable, suspect cache and NUMA issues early. Useful signs include high LLC miss rates, elevated remote-memory traffic, cross-socket migrations, and contention on shared cache lines. Aligning threads, memory allocation, and NIC queues to the same socket often produces outsized gains relative to micro-optimizing arithmetic.

## One practical rule

If two threads write it, assume the cache protocol matters until measurement proves otherwise.

## Extra pitfalls

Hyper-thread siblings share some core resources, so pinning two hot threads to sibling logical CPUs can hurt even if NUMA placement is correct. Another common pitfall is optimizing a data structure for size while accidentally interleaving hot write-heavy and cold read-mostly fields on the same lines.
