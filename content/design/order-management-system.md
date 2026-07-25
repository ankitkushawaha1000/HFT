# Order Management System Design

Research date: 2026-07-24

An order management system (OMS) sits between strategies and venues. It tracks the lifecycle of orders, applies or coordinates risk checks, routes to one or more exchanges, processes acknowledgments and fills, maintains positions, and supports recovery and monitoring. In HFT interview settings, the OMS problem tests state management, sequencing, protocol handling, and the balance between latency and operational safety.

## Core responsibilities

- accept new, cancel, and replace requests from strategies
- assign internal IDs and correlate venue IDs
- apply or invoke pre-trade risk checks
- route to the selected venue or gateway
- process execution reports and fills
- maintain live order state and positions
- persist enough information for recovery and audit
- surface metrics, alerts, and operator controls

## Major components

```text
Strategies
   │
Order API / ingress
   │
Risk checker ──> Order router ──> Exchange gateways
   │                 │                 │
   │                 └─ route policy   └─ FIX / binary sessions
   │
State store / order table
   │
Fill processor ──> Position tracker ──> Monitoring / persistence
```

### Order router

The router chooses a venue or gateway based on strategy instructions, instrument availability, fee model, queue-position logic, and live gateway health. In many firms, route selection policy is partly trader-driven and partly systematic.

### Fill processor

The fill processor consumes execution reports, updates order state, aggregates fills, and emits events to position and P&L systems. It must be idempotent because reconnects or venue behavior can cause duplicate or out-of-order reports.

### Position tracker

This component maintains net and gross positions by account, strategy, instrument, and possibly venue. It often feeds both pre-trade checks and operator dashboards.

### Risk checker

Some firms keep risk in-line with the OMS; others put a dedicated low-latency module in front of the gateway. A senior answer should explain the chosen placement and its latency implications.

## Order state machine

At minimum, the OMS should model:

```text
New -> Sent -> Acked -> Partially Filled -> Filled
                    └-> Rejected
Acked / Partially Filled -> Cancel Pending -> Cancelled
Acked / Partially Filled -> Replace Pending -> Acked (new terms)
```

Important nuances:

- an order can be acknowledged and then rejected for a replace
- partial fills can arrive during cancel or replace races
- venue states and client-visible states may differ temporarily
- terminal states should be explicit and immutable once confirmed

## Multiple venue routing

Routing to multiple venues introduces non-trivial concerns:

- per-venue order type support differences
- different rate limits and throttles
- maker/taker economics
- independent sessions and sequence numbers
- venue-specific reject semantics
- differing cancel/replace workflows

A strong interview answer separates a venue-neutral internal order model from venue-specific adapters.

## Fill aggregation and position tracking

Execution reports are not just acknowledgments; they are the ground truth for fills. The OMS should aggregate partial fills by internal order ID and update positions atomically relative to order state changes.

Typical outputs include:

- filled quantity and average price per order
- net position per instrument and strategy
- realized and unrealized P&L feeds for downstream systems
- drop-copy or audit streams for independent monitoring

## FIX protocol integration

FIX remains common for order entry and execution reports. Senior candidates should understand session concepts more than memorize tags:

- logon/logoff
- heartbeats and test requests
- sequence numbers and resend requests
- business message rejects versus session-level rejects
- session recovery after disconnect

If the gateway uses a binary protocol instead, the same state-machine and correlation issues still apply.

## Persistence and recovery

Persistence strategy depends on latency budget. Common patterns:

- **hot-path in-memory state + asynchronous journal:** best latency, requires replay on restart
- **synchronous durable writes before send:** safer but often too slow for the hottest paths
- **replicated state machine or standby mirror:** improves recovery at architectural cost

Recovery must reconstruct:

- live orders and their latest known state
- pending cancels/replaces
- venue sequence expectations
- positions and fills, ideally from authoritative execution streams

A strong answer notes that on restart you must reconcile internal state with venue reality, not merely replay local logs blindly.

## Monitoring and alerts

Critical OMS metrics:

- strategy-to-gateway latency
- order-to-ack and cancel-to-confirm latency percentiles
- reject rates by venue and reason
- fill rates and partial fill patterns
- position drift between internal and independent sources
- session health, heartbeat failures, resend requests

Alerts should be actionable. “OMS slow” is not enough; separate gateway issues, venue rejects, risk-check slowness, and persistence lag.

## Consistency versus performance tradeoffs

This is the core design conversation.

- In-memory state is fastest but demands robust journaling and reconciliation.
- Strong synchronous durability reduces recovery ambiguity but may violate latency budgets.
- Centralized position tracking simplifies correctness but can become a bottleneck.
- Sharded state improves scale but complicates cross-strategy or cross-instrument risk.

A senior answer usually identifies the authoritative source for each truth: orders, fills, positions, and venue session state.

## Suggested interview answer structure

1. Define the order lifecycle and invariants.
2. Present components and ownership of state.
3. Walk new, cancel, replace, and fill flows.
4. Explain persistence and recovery.
5. Discuss monitoring, independent drop copy, and kill switches.
6. Close with latency-consistency tradeoffs.
