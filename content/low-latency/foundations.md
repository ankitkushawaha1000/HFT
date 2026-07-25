
# Low-Latency Foundations

Low-latency engineering is not only about making a fast path fast. It is about making the fast path predictable and proving where the time goes.

## Design Principles

- Prefer a single-writer ownership model on critical mutation paths.
- Minimize allocations, syscalls, and cross-core synchronization in the hot path.
- Budget latency hop by hop instead of talking about "fast" globally.
- Measure tail latency explicitly; average latency hides the real pain.

## Typical Latency Sources

- Cache misses and pointer chasing
- Lock contention and cache-line bouncing
- Kernel transitions and wakeup delays
- Burst amplification from downstream congestion
- Logging or metrics emitted synchronously on the critical path

## Good Interview Move

When asked to optimize a system, state the instrumentation plan first: timestamps at queue boundaries, percentile histograms, queue depth, drop counts, and CPU/core attribution.
