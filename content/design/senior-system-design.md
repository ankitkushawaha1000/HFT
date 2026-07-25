# Senior System Design Interview Approach

Research date: 2026-07-24

Senior system design interviews are not primarily tests of diagram drawing. They are tests of judgment under ambiguity. At high-frequency trading firms, that judgment must combine architecture, performance engineering, operational realism, and the ability to explain tradeoffs clearly under time pressure. Interviewers want to see whether you can lead a design conversation, not merely list components.

## Communication first

Strong senior candidates narrate their thinking before diving into a solution. That does not mean talking endlessly; it means setting up a crisp structure so the interviewer can follow. A good opening is: restate the problem, identify the success criteria, clarify the load and latency regime, then propose how you will proceed.

Example framing:

1. clarify requirements
2. estimate scale
3. sketch the high-level architecture
4. zoom into critical paths
5. discuss tradeoffs, failure modes, and operations

This pattern signals leadership. Junior candidates often jump straight into databases or queues. Senior candidates establish a decision process.

## Clarifying requirements

Requirements gathering is not a formality. For HFT-style systems, the requirements that matter most are often non-functional.

### Functional requirements

Ask what the system must do:

- ingest market data, route orders, compute risk, persist events, replay sessions
- support one venue or many
- handle live traffic only or also simulation and backtesting
- expose operator tooling and observability

### Non-functional requirements

Ask what quality bar the system must meet:

- latency target: median, p99, p99.9
- throughput: messages or orders per second
- correctness guarantees: lossless? exactly-once? at-least-once?
- availability and failover expectations
- recovery point and recovery time objectives
- regulatory or audit constraints

### Constraints

Explicit constraints often determine the design more than the feature list:

- single colo versus multiple sites
- kernel stack or bypass
- protocol mandates such as FIX, OUCH, ITCH, SBE
- hardware budget and team size
- whether persistence is required on the critical path

## Back-of-envelope calculations

Senior design answers include simple arithmetic. The goal is not precision; it is to show that component choices match scale.

Typical calculations:

- peak market data packets per second
- expected per-symbol update concentration during bursts
- memory footprint for in-flight orders and books
- log volume per trading session
- network bandwidth headroom
- CPU core budgeting by stage

An HFT-flavored answer might estimate whether a single core can parse the feed given packet rate and cycles per packet, whether a risk check needs an array or a distributed store, or whether recovery traffic can overlap safely with live traffic.

## Component breakdown

After requirements and scale, decompose the system into clear responsibilities. Typical patterns:

- ingress / gateway layer
- normalization or parsing layer
- stateful core such as order book or position tracker
- decision or policy layer such as strategy or risk
- egress / venue connectivity layer
- persistence and replay
- observability and control plane

Senior candidates make the data flow explicit. They say which thread or process owns which state, how handoffs occur, and where backpressure is allowed versus prohibited.

## Tradeoff discussion framework

An effective way to sound senior is to state options comparatively:

| Dimension | Option A | Option B | What decides |
|---|---|---|---|
| Process model | single process | split services | latency budget, fault isolation |
| Network path | kernel sockets | kernel bypass | packet rate, jitter, ops cost |
| State storage | in-memory only | synchronous durable write | recovery needs, tail budget |
| Concurrency | shared mutable state | single-writer sharding | contention, scaling pattern |
| Data structure | flat arrays | trees/maps | price range density, memory |

The interviewer is usually testing whether you can resist premature certainty. A senior answer says “for this requirement set, I would choose X because Y, and I would revisit if Z changed.”

## HFT-specific considerations

### Latency

State the critical path and keep it short. Remove logging, allocation, cross-process hops, and unnecessary serialization from that path. Separate hot-path decisions from slower control-plane workflows.

### Reliability

Low latency is irrelevant if the system is unsafe. Discuss redundancy, replay, gap recovery, sequence tracking, and operator kill switches.

### Correctness

Trading systems fail expensively when state diverges. Senior candidates discuss idempotency, authoritative identifiers, sequence numbers, exact handling of cancels versus replaces, and how recovery reconstructs truth.

### Determinism

Many HFT systems prefer deterministic single-writer pipelines over horizontally scalable but jitter-heavy architectures. This is an important senior instinct.

## What separates junior from senior answers

Junior answers often:

- list generic cloud components
- assume latency is solved by “Redis” or “Kafka” without budget analysis
- ignore failure and recovery
- avoid numbers
- skip operational tooling

Senior answers usually:

- define measurable objectives
- partition control plane from data plane
- discuss ownership, failure domains, and observability
- explain what is synchronous versus asynchronous
- know when not to distribute a system
- tie design choices to business consequences

## Common pitfalls

1. **Over-distribution:** adding remote hops to a microsecond-sensitive path.
2. **No explicit critical path:** describing everything at the same importance level.
3. **Ignoring recovery:** assuming in-memory state never needs reconstruction.
4. **Using average latency only:** failing to reason about tails.
5. **Skipping operator safety:** no kill switch, no runbooks, no alerts.
6. **No tradeoff framing:** presenting the first idea as the only idea.

## A practical interview flow

1. Restate the problem and success criteria.
2. Ask clarifying questions until requirements are bounded.
3. Do one or two scale estimates.
4. Draw a high-level architecture.
5. Walk the critical path end to end.
6. Zoom into the hardest component.
7. Discuss failure handling and observability.
8. Close with tradeoffs and possible future evolution.

## HFT-specific example prompt handling

If asked to design a pre-trade risk system with a sub-microsecond budget, a strong answer would immediately challenge assumptions: which checks are in line, which are static parameters, whether the engine is colocated with the strategy, and whether persistent writes are excluded from the hot path. That shows seniority because it protects the design from impossible requirements instead of blindly diagramming.

## Final advice

Interviewers usually remember three things: whether you created structure, whether your tradeoffs made sense, and whether you handled ambiguity calmly. Senior design performance is less about encyclopedic knowledge than about disciplined reasoning.
