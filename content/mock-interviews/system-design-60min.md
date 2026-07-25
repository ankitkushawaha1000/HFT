# System Design Interview Simulation (60 Minutes)

**Problem:** Design a market data feed handler for multiple exchanges.  
**Target candidate:** Senior C++ engineer preparing for HFT and market-making firms.  
**Primary evaluation axes:** requirements clarity, architecture quality, latency awareness, failure handling, and tradeoff reasoning.

---

## Interview structure

- 0:00-5:00 — Requirements clarification
- 5:00-15:00 — High-level design
- 15:00-45:00 — Deep dive: parsing, sequencing, gap detection, recovery
- 45:00-55:00 — Tradeoffs and alternatives
- 55:00-60:00 — Candidate questions and close

---

## Full interviewer opening script

> Let’s do a system design exercise. Imagine we are building a market data feed handler that connects to multiple exchanges and distributes normalized market data internally to downstream trading systems. I’m interested in how you clarify requirements, structure the system, and reason about correctness and latency. Please ask questions before jumping into the design.

---

## Phase 1 — Requirements clarification (5 minutes)

### Strong candidate questions to ask

- Which message types matter: top-of-book only, depth-of-book, trades, reference data?
- Are we building for one region or multiple colocated venues?
- What downstream consumers exist: strategy processes, persistence, monitoring, replay?
- Is the primary objective lowest possible latency, strongest correctness guarantees, easiest extensibility, or some balance?
- Do exchanges provide sequence numbers, snapshots, retransmit channels, or recovery APIs?
- Are we normalizing into a single canonical schema?
- What reliability target matters: zero data loss, bounded stale state, fast failover?
- Do we need historical replay support?

### Baseline assumptions for the mock

If the interviewer gives little guidance, assume:

- 6-10 exchanges
- binary multicast or TCP feeds depending on venue
- messages include book updates, trades, and heartbeat/control events
- downstream systems need a normalized internal event format
- low latency matters, but correctness under gaps matters more than shaving the last microsecond from a broken design
- each venue provides sequence numbers and some recovery mechanism

### Weak answer warning

A weak candidate starts drawing boxes immediately without clarifying data quality, sequencing, or failure recovery.

---

## Phase 2 — High-level design (10 minutes)

### Strong top-level architecture

1. **Per-exchange ingress adapters**
   - Network receiver per venue/protocol
   - Minimal decode of transport framing
   - Venue-specific parser module

2. **Sequencer / validator layer**
   - Sequence tracking per instrument or channel
   - Detect gaps, duplicates, stale packets, and heartbeat loss
   - Emit recovery events

3. **Normalization layer**
   - Convert venue-specific messages to internal canonical events
   - Preserve original metadata: venue, sequence, receive timestamp, source channel

4. **Book state / derived state (optional depending on consumers)**
   - Maintain venue book snapshots if downstream expects computed top-of-book or depth views
   - Keep raw-event and derived-event paths clearly separated

5. **Recovery manager**
   - Snapshot/retransmit handling
   - State machine for live, degraded, recovering, resynced

6. **Fan-out / distribution layer**
   - Publish normalized events to internal subscribers
   - Separate ultra-low-latency subscribers from slower analytics or persistence consumers

7. **Observability and controls**
   - Per-feed metrics, gap counters, recovery latency, packet loss indicators, queue depth, parser errors
   - Admin interface for health and failover actions

### Example interviewer transition

> Good. Let’s assume the overall shape is reasonable. Now I want to go deeper into the hard parts.

---

## Phase 3 — Deep dive (30 minutes)

### Deep dive A — Parsing and message handling

**Interviewer prompt**

> How would you structure parsing so that it stays maintainable as you add more exchanges?

**Strong answer points**

- Separate transport framing from venue message parsing
- Use explicit schema/version handling per venue
- Avoid premature over-generalization; normalize after decode, not before understanding semantics
- Prefer zero-copy or bounded-copy parsing where safe
- Validate lengths and sequence fields defensively
- Keep cold-path logging/error handling out of the hottest path

**Good follow-ups**

- How do you handle protocol version drift?
- Where would you place timestamping?
- What would you unit test versus integration test?

### Deep dive B — Gap detection

**Interviewer prompt**

> Let’s say exchange A sends sequence numbers and you detect a gap. What happens next?

**Strong answer points**

- Track expected sequence per channel/partition
- On gap, mark feed or instrument state as degraded
- Decide whether downstream should receive stale-state signal, pause updates, or continue partial processing depending on product requirements
- Trigger venue-specific recovery path: retransmit request, snapshot refresh, secondary line failover, or channel reset
- Buffer post-gap messages cautiously if the venue protocol allows resequencing safely
- Avoid silently applying out-of-order deltas to book state

**Excellent nuance**

- The correct response differs between raw event distribution and derived book state
- A strategy may prefer explicit “book not trustworthy” signaling rather than false continuity
- Recovery must be modeled as a state machine, not ad hoc retries

### Deep dive C — Recovery and resynchronization

**Interviewer prompt**

> Walk me through a robust recovery flow.

**Strong answer outline**

1. Detect gap or feed corruption.
2. Quarantine affected state scope: channel, instrument group, or whole venue.
3. Notify downstream with a health/degraded marker if required.
4. Request retransmit or fresh snapshot.
5. Apply snapshot carefully with version/sequence alignment.
6. Replay buffered in-order deltas after the snapshot boundary.
7. Mark stream healthy again only after consistency checks pass.

**Follow-ups**

- What if retransmit is unavailable?
- What if the snapshot arrives after newer live data?
- How do you prevent double-application of events?
- How would you test this logic?

### Deep dive D — Performance and architecture tradeoffs

**Interviewer prompt**

> Where are the main latency risks in your design?

**Strong answer points**

- unnecessary allocations in decode/normalize path;
- cross-thread handoff overhead;
- cache misses from large polymorphic message objects;
- lock contention in fan-out or shared state;
- recovery logic accidentally polluting hot-path branches;
- slow subscribers backpressuring critical consumers.

**Good mitigation ideas**

- preallocated buffers / pools;
- per-venue worker affinity where appropriate;
- separate hot path from monitoring/persistence;
- bounded queues and backpressure policies per subscriber class;
- immutable normalized events with minimal transformation.

### Deep dive E — Correctness model

**Interviewer prompt**

> What invariants would you want the system to maintain?

**Strong invariants**

- no delta applied out of sequence to derived book state;
- no silent gap masking;
- normalized events preserve venue identity and source ordering context;
- recovery transitions are explicit and observable;
- downstream health signal reflects actual trust in the data.

---

## Phase 4 — Tradeoffs and alternatives (10 minutes)

### Typical interviewer prompts

- Would you use one thread per venue, per channel, or a shared event loop?
- When would you normalize eagerly versus lazily?
- Would you centralize book building or let strategies build their own local views?
- How would you handle backup lines or active-active feeds?

### Strong tradeoff discussion

**One thread per venue/channel**
- Pros: simpler ownership, less contention, predictable affinity
- Cons: scaling limits, uneven venue load, coordination overhead

**Shared event loop / reactor**
- Pros: fewer threads, potentially better utilization
- Cons: harder isolation, tail-latency coupling across venues

**Central book builder**
- Pros: one source of truth, simpler downstream usage
- Cons: can become a bottleneck; harder to tailor per-strategy requirements

**Raw + derived paths**
- Often best in practice: preserve raw normalized events for advanced consumers while optionally publishing derived book views for simpler consumers.

---

## Phase 5 — Questions from the candidate (5 minutes)

Strong questions:

- In your environment, where has correctness historically been harder than latency?
- Do your downstream consumers prefer raw normalized events or centrally derived book state?
- How much exchange-specific behavior lives in shared libraries versus isolated venue adapters?

---

## Strong vs weak answer comparison

| Dimension | Strong answer | Weak answer |
|---|---|---|
| Requirements | Clarifies message types, recovery model, and consumers | Assumes generic pub/sub is enough |
| Architecture | Distinguishes ingress, sequencing, normalization, recovery, distribution | Draws a single “parser → queue → consumers” line |
| Correctness | Treats gaps and recovery as first-class design problems | Mentions “retry” without state model |
| Latency | Knows where allocations, handoffs, and locks hurt | Says “use C++ and make it fast” |
| Tradeoffs | Explains alternatives and why chosen design fits requirements | Presents one architecture as obviously correct |
| Operational maturity | Includes metrics, health states, and failover behavior | Ignores observability and degraded modes |

---

## Evaluation rubric

| Category | 1 | 3 | 5 |
|---|---|---|---|
| Clarification | Jumps in blindly | Some useful questions | Sharp questions that shape the problem |
| Architecture | Generic boxes | Reasonable baseline | Clean decomposition tied to constraints |
| Correctness | Hand-wavy | Handles common cases | Strong sequencing and recovery model |
| Performance | Generic speed comments | Some latency awareness | Concrete hot-path and tail-latency reasoning |
| Tradeoffs | One-dimensional | Mentions pros/cons | Makes context-aware design choices |
| Communication | Hard to follow | Mostly clear | Structured, crisp, and executive-friendly |

---

## Self-assessment prompts

1. Did I spend enough time clarifying requirements before designing?
2. Did I explicitly model gap detection and recovery, or only mention them?
3. Did I distinguish raw event flow from derived book-state flow?
4. Did I say how I would measure health and performance?
5. If asked to defend my threading model, could I do it in two minutes?

## Final coaching note

In HFT-flavored system design, the impressive answer is not the fanciest architecture. It is the one that shows you understand that **bad data is worse than slow data, and silent inconsistency is worse than visible degradation**.
