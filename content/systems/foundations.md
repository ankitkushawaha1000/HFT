
# Systems Foundations

Strong systems answers connect operating-system behavior to application-visible latency and failure modes.

## Topics Worth Revisiting

- Cache hierarchy, TLBs, and page faults
- NUMA placement and cross-socket penalties
- Context switches, scheduler noise, and interrupt handling
- NIC queues, kernel networking paths, and busy polling tradeoffs
- File descriptors, `epoll`, and backpressure

## Practical Framing

When discussing a latency problem, separate:

1. **Median latency drivers** — usual work per request.
2. **Tail latency drivers** — rare but harmful stalls.
3. **Jitter sources** — scheduling, allocation spikes, contention, or noisy neighbors.

## Useful Mental Model

A surprising amount of "application latency" is really memory hierarchy, scheduling, or queueing behavior. Interviews often test whether you know where to look before rewriting business logic.
