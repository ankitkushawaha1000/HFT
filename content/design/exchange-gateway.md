# Exchange Gateway Design

Research date: 2026-07-24

An exchange gateway is the venue-facing edge of the trading stack. It manages sessions, translates internal order intents into venue protocol messages, tracks acknowledgments and rejects, enforces rate limits, and often emits independent drop-copy or audit streams. In an HFT interview, this design problem tests protocol knowledge, failure handling, and control of venue-specific complexity.

## Exchange connectivity requirements

The gateway must:

- maintain authenticated connectivity to one or more venues
- send new, cancel, and replace requests
- receive acknowledgments, fills, rejects, cancels, and session messages
- respect venue throttles and protocol rules
- detect disconnects and recover cleanly
- surface a clean internal API to the OMS or strategy layer

## Session management

### FIX sessions

For FIX-based gateways, the session layer handles:

- logon and logout
- heartbeat intervals and test requests
- message sequence numbers
- resend requests and gap fills
- session reset rules at day boundaries or reconnect

Senior candidates should emphasize the separation of session state from business state. A healthy TCP socket does not guarantee business correctness if sequence handling is wrong.

### Binary sessions

Many venues expose binary order-entry protocols for lower latency. These still have equivalent concerns: sequencing, heartbeats or keepalives, session establishment, replay, and reject handling. The internal architecture should isolate venue specifics behind a stable abstraction.

## Order submission and acknowledgment tracking

Each outbound order needs:

- an internal ID from the OMS or strategy
- a venue message with correct account and instrument mapping
- correlation between internal and venue IDs
- tracking of “sent but not yet acknowledged” state

The gateway should preserve ordering guarantees required by the venue while ensuring that retries or reconnect logic do not duplicate live orders accidentally.

## Protocol specifics: FIX versus binary

### FIX

Pros:

- widely understood and operationally familiar
- flexible and expressive
- strong tooling ecosystem

Cons:

- larger messages
- parsing and formatting overhead
- generally higher latency variance than specialized binary protocols

### Binary

Pros:

- compact, efficient, lower serialization overhead
- often closer to venue-native semantics

Cons:

- venue-specific complexity
- harder debugging and tooling
- more custom implementation burden

A strong answer does not claim binary is always better; it explains that venue choice and operational cost matter.

## Drop copy architecture

Drop copy is an independent stream of order and execution events used for risk monitoring, reconciliation, and post-trade processing. Best practice is to keep it logically separate from the main order-entry session so a problem on the trading path does not remove independent visibility.

Typical consumers:

- independent risk systems
- compliance and audit
- reconciliation services
- real-time monitoring dashboards

## Rate limiting compliance

Exchanges enforce order-rate and message-rate limits. The gateway must track budgets per session, account, and sometimes per order type. It should reject or defer local traffic before violating venue rules when possible.

Design questions:

- token bucket versus fixed-window model
- where limits are enforced: strategy, OMS, gateway, or all three
- what happens when rate budget is exhausted during a cancel storm

Senior answers often note that cancel traffic is especially operationally sensitive; you must not block risk-reducing cancels behind normal sends.

## Failover and reconnect logic

Disconnect handling is one of the hardest parts of gateway design. After reconnect, the gateway must determine:

- whether the venue accepted messages sent before the disconnect
- the correct next sequence number
- which live orders remain working at the venue
- how to replay or reconcile missed execution reports

A robust design typically combines local journals, exchange replay or drop-copy streams, and OMS reconciliation logic. Blind resend is dangerous.

## Internal architecture

```text
OMS / router
   │
Gateway API
   │
Session engine ──> Encoder / decoder ──> TCP or venue transport
   │
State tables (orders, sequences, throttles)
   │
Drop copy / audit publisher
```

Single-writer ownership of session state is usually preferable. It reduces locking and makes protocol sequencing easier to reason about.

## Operational visibility

Important metrics include:

- order send latency and order-to-ack latency
- session heartbeat misses
- resend requests and sequence gaps
- reject counts by venue reason
- throttle utilization and near-breach conditions
- reconnect count and reconciliation lag

## Design tradeoffs

- one gateway per venue versus multi-venue shared process
- synchronous logging versus asynchronous journaling
- centralized throttling versus per-session throttling
- strict serialization for simplicity versus parallel pipelines for scale

For the hottest paths, engineers often accept per-venue specialization to keep state simple and deterministic.

## Daily session boundaries and resets

Some venues reset sessions or sequence expectations at market boundaries, while others expect more continuous continuity with explicit reset workflows. The gateway design should make day-start procedures, replay windows, and state reset rules explicit rather than burying them in ad hoc scripts.

## Certification and testing

Exchange gateways usually require conformance testing, negative-case testing, and venue certification before production rollout. A senior answer can mention simulators, record-and-replay testing, and chaos-style disconnect injection to validate reconnect logic.

## Order-ID mapping discipline

The internal ID, client order ID, and venue order ID must all be tracked carefully. Many post-incident debugging exercises reduce to one bad mapping or an overwritten replace chain. Strong gateway designs treat correlation state as first-class.
