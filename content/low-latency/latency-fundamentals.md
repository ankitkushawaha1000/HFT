# Latency Fundamentals for HFT

Research date: 2026-07-24

Latency in high-frequency trading is the elapsed time between a causative event and the system response that matters economically. For a market data path, the causative event may be a packet arriving at the NIC or a venue publishing a price update; the response may be an updated order book, a strategy decision, or a transmitted order. Senior engineers should define the boundaries precisely because “latency” without scope is almost meaningless. A venue-to-NIC measurement, a wire-to-wire measurement, and a strategy-to-order measurement can differ by orders of magnitude while all being “correct” in their own contexts.

## What latency means end to end

End-to-end latency is the sum of every stage along the critical path: exchange serialization, propagation on the wire, switch traversal, NIC receive or transmit processing, PCIe transfer, kernel or bypass stack handling, application parsing, book update, strategy evaluation, risk checks, order serialization, and transmission back to the venue. In production conversations, define the start timestamp, end timestamp, clock source, and whether queueing delay is included.

In HFT, the most useful measurements are tied to business boundaries:

- **Wire-to-wire:** incoming packet observed at the host boundary to outgoing packet leaving the host.
- **Market-data-to-decision:** market data arrival to strategy decision availability.
- **Strategy-to-order:** decision created to order placed on the network.
- **Order-to-ack:** transmitted order to venue acknowledgment.

A good engineer also separates **service time** from **response time**. Service time is the time spent actively doing work; response time includes waiting in queues. Tail events are often queueing problems rather than slow instructions.

## Latency versus throughput tradeoffs

Low latency and high throughput are related but not identical goals. Batching increases throughput by amortizing fixed costs such as syscalls, DMA setup, cache misses, and lock handoff. The same batching almost always increases single-message latency because an item waits for the batch to fill or for a scheduled flush boundary.

Typical tradeoffs include:

- **Batching vs immediacy:** micro-batching can improve throughput dramatically but hurts time-to-first-byte.
- **Locking vs contention-free designs:** a mutex may be perfectly acceptable at low load but can explode tail latency when many threads contend.
- **Compression vs CPU time:** less network traffic can reduce wire delay, but decompression can cost more than it saves on a low-latency path.
- **Shared components vs dedicated resources:** pooling can improve utilization; dedicated cores and queues reduce interference.

In HFT, the fastest average system is often not the most profitable. Firms usually prefer predictable sub-10 microsecond behavior over a system that is very fast on average but occasionally stalls for hundreds of microseconds.

## Microseconds versus milliseconds

For many web systems, one millisecond is negligible. In HFT, one millisecond can represent an eternity: the order book can move several times, queues can reprice, and an opportunity can vanish. That does not mean every system must be single-digit microseconds. Backtesting platforms, reconciliation jobs, or long-horizon analytics can tolerate milliseconds or seconds. The key is to know which path is economically latency-sensitive.

A useful rule is to map latency to market consequences. If your signal half-life is 50 microseconds, spending 200 microseconds in pre-trade processing destroys edge. If your strategy trades on minute bars, optimizing from 200 microseconds to 20 microseconds is unlikely to matter. Interviewers want candidates who match engineering effort to business value.

## Why p99 and p99.9 matter more than average

Average latency hides operational pain. Suppose 99.9% of orders are sent in 5 microseconds and 0.1% take 800 microseconds because of page faults or interrupt storms. The average may still look excellent, yet those slow orders can correspond to the exact moments of peak volatility when being slow is most expensive.

Percentiles answer different questions:

- **p50:** typical case in steady state.
- **p95 / p99:** whether the system remains healthy under routine stress.
- **p99.9 / p99.99:** whether rare interference, queue buildup, or OS events are leaking into production.
- **max:** useful for debugging but unstable as a capacity-planning metric.

Tail latency matters because markets are adversarial. You do not get paid for being fast when nothing is happening; you get paid for being fast when everyone else is trying to trade too.

## Sources of latency

### Application-level

Parsing, validation, object allocation, branch-heavy code, cache-unfriendly data structures, logging, exception paths, unnecessary copies, and lock contention are common application contributors. In mature C++ codebases, the hot path is usually explicit about ownership, allocation, and memory layout.

### Kernel-level

If traffic goes through the kernel, scheduler preemption, socket buffer handling, interrupt moderation, softirq processing, context switches, and timer behavior all matter. Even when using kernel bypass, control-plane activity and background kernel work can create noise.

### Network-level

Serialization delay, switch hop latency, congestion, retransmissions, NIC buffering, multicast burstiness, and microbursts all affect latency. For market data, packet loss and gap recovery often dominate perceived latency more than raw switch traversal time.

### Hardware-level

CPU frequency changes, cache misses, NUMA penalties, TLB misses, PCIe topology, DRAM latency, branch misprediction, thermal throttling, and NIC firmware settings can all create visible effects. Hardware bottlenecks often show up as jitter rather than a constant offset.

## Latency budget allocation

A latency budget turns a vague performance goal into an engineering plan. If a strategy-to-order target is 8 microseconds at p99, assign budgets to each stage and reserve margin for unexpected behavior.

| Stage | Example budget |
|---|---:|
| NIC receive and timestamp visibility | 0.8 μs |
| Parse and normalize | 1.2 μs |
| Order book update | 1.0 μs |
| Strategy logic | 1.5 μs |
| Risk checks | 1.0 μs |
| Order encoding | 0.7 μs |
| Queueing / handoff / safety margin | 1.8 μs |

Budgets should reflect variability, not just mean service time. A stage with a 200 ns median and a 5 μs p99 deserves more attention than a stage with a stable 800 ns profile.

## Jitter and its causes

Jitter is variation in latency from run to run or event to event. Low average latency with high jitter is operationally dangerous because it weakens determinism. Common causes include scheduler interference, cache eviction, contention on shared queues, NUMA cross-traffic, interrupt coalescing, packet bursts, branchy code, lock convoying, and page faults.

A practical goal is not merely to reduce absolute latency but to narrow the distribution. Stable 7 microseconds is often preferable to oscillating between 3 and 40 microseconds.

## Wire-to-wire versus strategy-to-order

**Wire-to-wire** is an infrastructure-centric measurement. It isolates how fast the platform can transform inbound market data into outbound orders or acknowledgments. This is useful when optimizing parsing, networking, and thread topology.

**Strategy-to-order** is a business-logic-centric measurement. It excludes earlier market data handling and focuses on how quickly a computed decision becomes a real order. This is useful when comparing strategies or risk architectures.

Both are valuable, but they answer different questions. Senior candidates should state which one they are optimizing and why.

## Practical engineering principles

1. Put timestamps at domain boundaries, not only around functions.
2. Prefer single-writer ownership where possible.
3. Remove allocations, syscalls, and locks from the hot path.
4. Optimize for tails after confirming the mean is already good enough.
5. Measure under burst load, not only in a quiet benchmark loop.

## Interview questions with answers

### 1. Why is average latency a poor primary metric in HFT?
Because profits and losses are often determined during bursts, and rare slow events are exactly when the market is moving fastest. Average hides those outliers. Percentiles such as p99 and p99.9 better capture the operational quality of a low-latency path.

### 2. Explain the difference between wire-to-wire and strategy-to-order latency.
Wire-to-wire measures from ingress at the host boundary to egress at the host boundary. Strategy-to-order measures from the instant strategy logic has actionable input or a decision to the instant the order is emitted. The first is better for platform optimization; the second is better for business-logic timing.

### 3. How would you allocate a latency budget?
Start from the business target, instrument major stages, assign provisional budgets, and reserve explicit headroom for queueing and unexpected variance. Then validate with production-like burst tests and iterate where p99 exceeds budget.

### 4. What usually causes jitter in a supposedly fast system?
Shared resources and asynchronous interference: interrupts, scheduling, lock contention, bursty traffic, page faults, NUMA misses, and thermal or frequency changes. Jitter is often an isolation problem more than an instruction-count problem.

### 5. When is it acceptable to trade latency for throughput?
When the path is not economically latency-sensitive, or when batching reduces overall queueing so much that end-user latency improves despite a small per-item delay. The answer depends on business objectives, not dogma.
