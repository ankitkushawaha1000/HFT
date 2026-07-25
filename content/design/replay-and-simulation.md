# Replay and Simulation Platform Design

Research date: 2026-07-24

A replay and simulation platform lets engineers and quants run historical market data through strategies and infrastructure logic at original speed, slower than real time, or faster than real time. The problem is not merely storing packets; it is preserving enough ordering and timing semantics to produce deterministic, explainable results.

## Requirements

- ingest historical market data and event streams
- replay at market speed, slower, or accelerated speed
- provide deterministic logical time
- integrate strategies, books, risk, and gateways in simulation mode
- simulate network or processing latency when desired
- store results for analysis and comparison
- support large batch workloads for research and regression testing

## Core architecture

```text
Historical data store
   │
Replay scheduler / logical clock
   │
Event dispatcher
   ├─ market data consumers
   ├─ simulated strategy interfaces
   ├─ simulated risk / OMS / gateway layers
   └─ metrics and result capture
```

## Clock simulation

A replay system should not depend on wall-clock `now()` inside strategy or infrastructure logic. Instead, it should provide a logical clock derived from event timestamps. Components read the simulated time source so the run is deterministic.

Modes:

- **real-time replay:** preserve original spacing between events
- **scaled replay:** multiply inter-arrival gaps by a factor
- **as-fast-as-possible:** advance logical time according to event timestamps while processing without sleeping
- **step mode:** operator or test advances event-by-event

## Deterministic replay

Determinism is essential for debugging. Given the same input stream, configuration, seed values, and simulated latencies, the result should be reproducible.

Threats to determinism include:

- wall-clock calls
- unordered parallel processing
- random numbers without fixed seeds
- dependence on hash iteration order or unstable container behavior
- asynchronous side effects crossing run boundaries

A senior answer makes determinism explicit rather than assuming it emerges automatically.

## Strategy integration

There are two common approaches:

1. run the real strategy code against simulated interfaces
2. run a simplified research adapter with the same decision logic but different infrastructure

For interview purposes, the better answer is usually to reuse as much production logic as possible while replacing external I/O with simulated adapters. That reduces sim-prod drift.

## Latency simulation

Backtests that assume zero internal latency are often misleading. Useful simulation features include:

- configurable strategy decision delay
- queueing delay between components
- exchange acknowledgment delay models
- order book visibility delay or feed lag models
- stochastic jitter distributions for scenario analysis

This does not need to predict reality perfectly; it needs to let engineers reason about sensitivity.

## Result storage and analysis

Important outputs:

- orders and simulated fills
- positions and P&L time series
- latency distributions by component
- market states around decisions
- rejected or risk-blocked intents
- determinism checksums for regression comparison

Storage is rarely on the critical path in replay, so batch-friendly columnar or append-only formats are often appropriate.

## Differences from production

Interviewers want candidates to acknowledge what replay cannot faithfully reproduce:

- no real venue matching or queue position unless modeled
- no genuine counterparty behavior beyond the model
- system contention patterns may differ from live production
- drop copy, regulatory messages, and exchange edge cases may be incomplete in historical captures

A senior answer treats replay as an invaluable tool, not a perfect oracle.

## Scaling the platform

For large research workloads:

- partition runs by day, instrument set, or strategy config
- separate immutable input data from derived results
- cache normalized historical feeds
- maintain metadata and lineage so outputs are reproducible

Because replay is offline, scale-out and cloud-style parallel batch processing can make sense here even if they would be inappropriate for live HFT critical paths.

## Interview rubric

A strong design includes:

- explicit logical clock
- deterministic event ordering
- realistic simulation boundaries
- result capture for debugging and comparison
- clear explanation of what differs from production

Weak answers treat replay as “read a file and send packets.”

## Input data model

Replay quality depends on the captured data. Strong systems preserve raw packets or raw venue messages plus timestamps, session markers, and enough metadata to reconstruct ordering accurately. Derived normalized events are useful too, but raw capture gives better forensic value.

## Scenario libraries

Beyond historical days, teams often build scenario packs: open, close, halts, reconnects, macro spikes, stale-feed incidents, and cancel storms. This turns the platform into a regression harness for both strategy logic and infrastructure behavior.

## Validation against production

The platform should regularly compare replay outputs with known production outcomes for selected sessions. That does not prove perfect realism, but it catches drift in parsers, order-state logic, and simulated exchange behavior.

## Operational uses beyond research

Replay platforms are also valuable for onboarding, incident reconstruction, parser regression tests, and validating venue-specific edge cases after protocol upgrades. Mentioning these uses shows you understand replay as shared engineering infrastructure, not just a quant toy.
