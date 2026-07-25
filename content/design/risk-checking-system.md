# Pre-Trade Risk Checking System Design

Research date: 2026-07-24

A pre-trade risk checking system sits on the critical path between strategy intent and exchange submission. The interview challenge is to design a system that is extremely fast, correct, and operationally safe. The headline requirement “under 1 microsecond” should immediately trigger a discussion about scope and what is truly in-line.

## Requirements

### Functional

- enforce net, gross, and per-instrument position limits
- apply order-rate limits
- reject orders violating fat-finger constraints
- support kill switches and emergency disable
- accept live updates of risk parameters
- expose monitoring and alerting

### Non-functional

- very low and deterministic latency
- never miss a configured check
- no blocking dependencies on remote services
- strong auditability of decisions
- graceful behavior under parameter updates and failover

## Core checks

### Position limits

Track current positions and projected positions. For a buy order, the check may consider current net position plus remaining working buy exposure plus proposed quantity. Depending on firm policy, gross limits may aggregate absolute exposure across instruments or sectors.

### Order rate limits

Use per-strategy, per-account, or per-session counters over fixed windows or token-bucket models. Rate-limit logic must distinguish normal throttling from emergency cancels, which often deserve reserved capacity.

### Fat-finger checks

Compare price to current market reference such as mid, touch, last trade, or a configured reference price. Since market data can move quickly, the design must define which book snapshot is authoritative and how stale-data situations are handled.

## Inline versus separate process

This is the most important tradeoff.

### Inline risk

Pros:

- lowest latency
- no network or serialization hop
- simpler sequencing with strategy state

Cons:

- weaker fault isolation
- bugs can directly affect the trading process
- parameter update safety becomes more delicate

### Separate process

Pros:

- better isolation and audit boundaries
- easier independent deployment and monitoring
- can serve multiple strategies centrally

Cons:

- added hop and queueing
- more serialization and failure modes
- harder to meet sub-microsecond budgets

For ultra-low-latency paths, many firms keep the minimal essential checks in-process and use independent monitoring or drop-copy risk systems for secondary validation.

## State model

A high-performance design keeps compact counters indexed by strategy, account, and instrument handles. Dense arrays or flat hash tables are preferred to pointer-heavy structures. The critical path should compute projected exposure using pre-resolved handles and integer arithmetic.

```text
Order intent
   │
Read current counters
   │
Compute projected exposure
   │
Evaluate hard limits + rate bucket + fat-finger rules
   │
Approve or reject
```

## Kill switch design

Risk systems need hard-stop controls:

- **soft stop:** block new risk-increasing orders but allow cancels and risk-reducing actions
- **hard stop:** block all trading except emergency administrative commands if policy allows
- **scope:** per strategy, account, session, desk, or global

The kill switch state should be cheap to read on the hot path, ideally a single aligned flag or generation value checked before further work.

## Risk parameter updates and hot reload

Operators need to change limits without restarting. Safe update patterns include:

- copy-on-write parameter tables with atomic pointer swap
- generation-stamped config snapshots
- validation of new configs before activation
- audit log of who changed what and when

The hot path should never parse textual configuration or acquire slow locks while checking an order.

## Monitoring and alerting

Key signals:

- check latency percentiles
- reject rates by reason
- near-limit utilization
- stale market reference data for fat-finger checks
- parameter update failures
- kill switch activations

Independent monitoring is essential because a risk process cannot be trusted to self-certify after a severe fault.

## Failure handling

Important questions:

- if the reference market data is stale, do we reject, widen, or hold?
- if counters cannot be trusted after restart, what is the bootstrap procedure?
- what happens if a parameter update stream lags?
- how do we reconcile in-line counters with authoritative fills and drop copy?

A senior answer usually distinguishes between **hard fail-safe** behavior and **operator override** procedures.

## Achieving sub-microsecond behavior

To even approach this target:

- colocate risk with the strategy or gateway
- use pre-resolved integer handles
- avoid dynamic allocation and remote calls
- keep counters in cache-friendly arrays
- use single-writer ownership or very careful sharding
- treat market references for fat-finger checks as already-available state, not a query

The most important insight is that the system architecture must make the target possible; micro-optimizing a remote RPC-based design is futile.

## Tradeoff summary

- Inline checks minimize latency but demand disciplined software engineering.
- Separate risk services improve isolation but often miss aggressive latency budgets.
- Fat-finger logic depends on trustworthy and fresh market references.
- Recovery and reconciliation matter as much as steady-state approval speed.
