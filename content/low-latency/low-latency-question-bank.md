# Low-Latency Interview Question Bank

Research date: 2026-07-24

This bank contains representative low-latency interview questions for senior engineering roles at high-frequency trading firms. Each item includes a full answer, likely follow-ups, and what the interviewer is assessing.

## Latency fundamentals

### 1. What is latency in an HFT system?
**Answer:** Latency is the elapsed time between a defined start event and a defined end event on a business-relevant path. Good answers define the boundary explicitly: wire-to-wire, market-data-to-decision, or strategy-to-order. In HFT, ambiguity about boundaries usually means the number is not actionable.

**Follow-ups:** Which clock would you use? Which stages belong inside the measurement?

**Assessed:** Precision, systems thinking, understanding of boundaries.

### 2. Why is average latency not enough?
**Answer:** Average hides the rare slow events that often matter most during market bursts. Tail metrics such as p99 and p99.9 capture stalls caused by contention, page faults, IRQ noise, or queue buildup. In trading, those rare events can be disproportionately expensive.

**Follow-ups:** When would max matter? How do you monitor tails in production?

**Assessed:** Operational maturity.

### 3. Explain jitter.
**Answer:** Jitter is variability in latency. Two systems with the same average can have very different usefulness if one is tightly distributed and the other has large variance. Jitter usually comes from shared resources, interrupts, contention, cache effects, or burstiness.

**Follow-ups:** How do you reduce it? Which layers contribute most?

**Assessed:** Practical performance knowledge.

### 4. Wire-to-wire versus strategy-to-order?
**Answer:** Wire-to-wire measures ingress at the host boundary to egress at the host boundary. Strategy-to-order measures from the strategy’s actionable state or decision to outbound order emission. The first is infrastructure-centric; the second is business-logic-centric.

**Follow-ups:** Which would you use to evaluate a risk-check rewrite?

**Assessed:** Measurement scope discipline.

### 5. What is a latency budget?
**Answer:** It is an allocation of allowable latency across the stages of a path, such as parse, book update, strategy, risk, and encode. It turns a top-level business target into component-level engineering goals.

**Follow-ups:** How do you revise it after measurement?

**Assessed:** Design planning.

### 6. When is batching good or bad?
**Answer:** Batching improves throughput by amortizing fixed costs, but it usually worsens individual-item latency. It is good on throughput-oriented or non-urgent paths and dangerous on microsecond-sensitive decision loops.

**Follow-ups:** Can batching ever improve latency? Yes, if it reduces queue contention enough at system level.

**Assessed:** Tradeoff reasoning.

### 7. Why do microseconds matter in HFT?
**Answer:** Because signal half-life can be extremely short and queue position changes quickly. A delay that is trivial in web systems can erase trading edge.

**Follow-ups:** When would milliseconds be acceptable?

**Assessed:** Business-awareness.

### 8. List four common latency sources.
**Answer:** Application logic, kernel scheduling/interrupt behavior, network delay or loss, and hardware effects such as cache misses, NUMA penalties, or power-state changes.

**Follow-ups:** Which of these usually creates jitter rather than fixed cost?

**Assessed:** Breadth.

## Memory and allocation

### 9. Why avoid `malloc` in the hot path?
**Answer:** General allocators have unpredictable tails from metadata work, contention, fragmentation, and page mapping. In HFT, unpredictability is often worse than modest constant overhead.

**Follow-ups:** What if the allocator is jemalloc or tcmalloc? Still measure; improvements help, but hot-path predictability remains the main goal.

**Assessed:** Low-level pragmatism.

### 10. What is a pool allocator?
**Answer:** A pre-allocated store of fixed-size blocks with fast allocate/deallocate operations, usually via a free list. It gives bounded memory usage and stable latency.

**Follow-ups:** When is it a bad fit?

**Assessed:** Data-structure design.

### 11. What is an arena allocator?
**Answer:** A bump-pointer allocator where many objects share a common lifetime and are discarded together. It is ideal for scratch memory or batch-scoped work.

**Follow-ups:** What tradeoff does it make? Coarse lifetime granularity.

**Assessed:** Allocation strategy knowledge.

### 12. What is zero-copy?
**Answer:** Avoiding unnecessary duplication by passing pointers, views, spans, or ownership of pre-existing buffers instead of copying payloads between stages.

**Follow-ups:** What are the risks? Lifetime bugs and accidental shared mutability.

**Assessed:** Ownership thinking.

### 13. Stack versus heap?
**Answer:** Stack allocation is typically fast and thread-local but limited in lifetime and size. Heap allocation supports dynamic lifetimes but requires stronger control in low-latency paths.

**Follow-ups:** Can large stack objects be a problem? Yes, for cache footprint and stack exhaustion.

**Assessed:** Nuance.

### 14. Why pre-touch memory?
**Answer:** To force page mapping and avoid first-use page faults during live trading. Pre-touching is part of turning startup cost into controlled initialization cost.

**Follow-ups:** Would you use it for all memory? Focus on critical working sets.

**Assessed:** Systems operations knowledge.

### 15. What is slab allocation?
**Answer:** A set of caches for fixed-size object classes, effectively several pools with good locality and reduced fragmentation versus a general allocator.

**Follow-ups:** Why pair it with per-thread caches?

**Assessed:** Scalable allocator understanding.

### 16. How do you handle pool exhaustion?
**Answer:** Make it explicit: reject work, shed load, or switch to a slower bounded fallback according to business policy. Silent general-allocation fallback on the hot path is dangerous.

**Follow-ups:** What would you alert on?

**Assessed:** Production judgment.

## Lock-free programming

### 17. What is lock-free?
**Answer:** A system-wide progress guarantee: some thread completes in a finite number of steps. It does not guarantee per-thread bounded completion time.

**Follow-ups:** Contrast with wait-free.

**Assessed:** Concurrency theory basics.

### 18. Why is SPSC easier than MPMC?
**Answer:** Because each cursor has one writer, reducing contention and simplifying memory ordering. MPMC introduces CAS races, fairness concerns, and often reclamation complexity.

**Follow-ups:** How would you redesign a system to use SPSC instead?

**Assessed:** Architecture over dogma.

### 19. Why is acquire/release enough for SPSC?
**Answer:** The producer needs to publish slot contents before publishing the tail, and the consumer needs to observe tail publication before reading the slot. Acquire/release encodes that dependency without stronger ordering than needed.

**Follow-ups:** Where can relaxed loads still be used?

**Assessed:** Memory-model competence.

### 20. What is the ABA problem?
**Answer:** A CAS sees the same pointer value again after an intermediate change, missing that the underlying object changed or was reused. It is especially dangerous in pointer-based lock-free structures.

**Follow-ups:** Solutions? Tagged pointers, hazard pointers, epochs.

**Assessed:** Lock-free depth.

### 21. Why is memory reclamation hard in lock-free code?
**Answer:** Because another thread may still hold a reference even after a node is logically removed. Reuse or free too early and you get use-after-free corruption.

**Follow-ups:** Compare hazard pointers and epoch reclamation.

**Assessed:** Real-world concurrency maturity.

### 22. What is false sharing?
**Answer:** Independent variables on the same cache line are written by different cores, causing cache-line ping-pong. It looks like contention even without logical sharing.

**Follow-ups:** How do you fix it? Padding, alignment, ownership redesign.

**Assessed:** Hardware awareness.

### 23. Why might a mutex beat a lock-free structure in practice?
**Answer:** At low contention or off the hot path, a simple mutex can be easier to reason about and even faster than a complicated CAS-heavy structure with retries and poor cache behavior.

**Follow-ups:** What metric would change your decision?

**Assessed:** Engineering judgment.

### 24. How do you benchmark a lock-free queue?
**Answer:** Measure throughput and full latency distributions under representative producer/consumer placement, core pinning, burst traffic, and queue occupancy patterns. Avoid isolated single-thread tests that ignore contention and cache effects.

**Follow-ups:** What topologies would you test?

**Assessed:** Performance rigor.

## Data structures

### 25. Why use integer ticks instead of floating-point prices?
**Answer:** Integer ticks avoid rounding ambiguity, make comparisons exact, and simplify array indexing or map keys for order-book structures.

**Follow-ups:** How do you handle instruments with different tick sizes?

**Assessed:** Domain and implementation awareness.

### 26. AoS versus SoA?
**Answer:** AoS is convenient when using most fields together per record. SoA is better when scanning one or two fields across many records, improving cache density and SIMD opportunities.

**Follow-ups:** Give an HFT example of each.

**Assessed:** Data-layout reasoning.

### 27. Why do trees often underperform flat arrays in low-latency code?
**Answer:** Pointer chasing and branch mispredictions dominate. If the domain bounds are controlled, flat indexed structures have much better locality.

**Follow-ups:** When is a tree still justified?

**Assessed:** Constant-factor thinking.

### 28. How would you store price levels in an order book?
**Answer:** It depends on the price range and product. Dense arrays work well for narrow ranges; sparse maps or hybrids fit wider ranges. The right answer discusses workload, memory budget, and top-of-book access.

**Follow-ups:** How do you maintain FIFO at a level?

**Assessed:** Design tradeoffs.

### 29. What is hot/cold splitting?
**Answer:** Separating always-used fields from rarely used metadata so the hot path pulls fewer cache lines.

**Follow-ups:** Give a concrete struct example.

**Assessed:** Cache-conscious design.

### 30. Why use intrusive lists at a price level?
**Answer:** They can avoid separate node allocation and let orders participate in queues using embedded links, improving locality and deletion behavior when order objects are pool-allocated.

**Follow-ups:** What are the downsides?

**Assessed:** Systems data-structure literacy.

## Benchmarking

### 31. When would you use `rdtsc`?
**Answer:** For very short code sections where clock API overhead matters, on hardware with stable invariant TSC and disciplined core placement.

**Follow-ups:** What can go wrong across cores?

**Assessed:** Measurement depth.

### 32. What is coordinated omission?
**Answer:** A benchmarking flaw where the load generator stops issuing work while the system is stalled, making latency look better than a real externally paced workload would experience.

**Follow-ups:** How do HDR Histogram tools help?

**Assessed:** Statistical rigor.

### 33. Why does warmup matter in C++?
**Answer:** Even without a JIT, caches, predictors, allocators, and page tables need to settle. Otherwise the benchmark mixes startup artifacts with steady-state performance.

**Follow-ups:** When would you intentionally measure cold start?

**Assessed:** Experimental design.

### 34. Why can `--no-inline` be useful in microbenchmarks?
**Answer:** It helps isolate call overhead and confirm whether an optimization changed the algorithm or merely changed inlining decisions. It is a diagnostic technique, not usually a production build setting.

**Follow-ups:** What must you re-check afterward? End-to-end behavior with production flags.

**Assessed:** Compiler awareness.

### 35. Which metrics do you report from a latency benchmark?
**Answer:** At minimum mean, p50, p95, p99, p99.9, max, sample count, workload description, and environment details. In HFT, percentiles and reproducibility matter more than a single best number.

**Follow-ups:** Why not standard deviation alone?

**Assessed:** Communication and rigor.
