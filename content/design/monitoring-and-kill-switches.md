# Monitoring, Circuit Breakers, and Kill Switches

Research date: 2026-07-24

Low-latency systems need operational safety mechanisms that are fast, understandable, and hard to bypass accidentally. Monitoring tells you that the platform is deviating from expected behavior; kill switches and circuit breakers let you limit damage quickly. In HFT interviews, candidates are often judged on whether they remember that production systems are operated by humans under stress.

## Metrics that matter

### Latency metrics

Track p50, p95, p99, and p99.9 for critical paths such as:

- market-data ingestion
- strategy-to-order
- order-to-ack
- cancel-to-confirm
- risk-check latency

### Business and flow metrics

- order rates by strategy and venue
- cancel rates and replace rates
- fill rates and partial fill ratios
- reject counts by reason
- live and projected positions
- market-data drop or gap-recovery counts

### Infrastructure metrics

- CPU utilization and frequency stability
- queue depths and queue occupancy duration
- packet drops, NIC errors, retransmit activity
- page faults and memory pressure
- session heartbeat failures and reconnect counts

## Alerting thresholds

Good alerts are both sensitive and actionable. Examples:

- p99 order-to-ack latency above threshold for N seconds
- sudden venue reject-rate spike
- risk-check reject rate abnormal versus baseline
- queue occupancy above 80% for more than a short window
- independent drop-copy mismatch with OMS state
- position nearing configured limit

A strong answer explains severity tiers: page immediately for global kill triggers, ticket for slow trend drift, dashboard-only for advisory states.

## Kill switch design

### Hard stop

Block all new order flow immediately for a defined scope. Usually allow cancels if doing so reduces risk, subject to venue policy and implementation constraints.

### Soft stop

Block only new risk-increasing orders while allowing cancels and possibly risk-reducing hedges.

### Scope

- global
- desk
- strategy
- account
- venue session
- instrument or product group

The more granular the switch, the more useful it is operationally, but the more state management and UX discipline it requires.

## Auto-kill triggers

Automatic actions should be conservative, explainable, and tested. Common triggers:

- runaway order rate
- position breach or rapid approach to hard limit
- uncontrolled reject storm
- stale market data while trading continues
- repeated session flapping or drop-copy loss

Automatic stops should emit a clear reason code and timestamp so humans can understand the event after the fact.

## Health check patterns

Low-latency services still need health signals, but naive “HTTP 200 means healthy” checks are insufficient. Better patterns:

- liveness: process is running
- readiness: session established, reference data loaded, queues within bounds
- dependency health: venue session, drop-copy session, market data freshness
- progression checks: sequence numbers and timestamps advancing as expected

## Operational runbooks

A senior engineer should mention runbooks. During incidents, operators need explicit steps:

1. identify affected strategies and venues
2. compare OMS and drop-copy state
3. activate scoped kill switch if needed
4. confirm cancels or flattening actions
5. reconcile positions and live orders
6. restart or fail over only after state is understood

A design without runbooks is incomplete because human response time and clarity affect real risk.

## Circuit breakers

Circuit breakers are automated controls that temporarily halt or degrade behavior when a subsystem is unhealthy. Examples:

- stop routing to a venue with excessive rejects or ack latency
- downgrade non-critical analytics consumers when queues rise
- refuse strategy startup if market data is stale
- pause replay or simulation if determinism checks fail

Unlike kill switches, circuit breakers are often narrower and reversible once conditions normalize.

## Interview rubric

Strong answers include:

- concrete metrics and percentile thinking
- scoped kill switches with risk-reducing exceptions
- automatic triggers with auditability
- health checks tied to progression, not just process aliveness
- operator workflows and independent reconciliation sources

Weak answers say only “we send alerts to PagerDuty and have a kill switch.”

## Dashboard design

Dashboards should group metrics by operator workflow: venue health, order flow health, risk health, and host health. During an incident, operators need immediate visibility into whether the problem is market data, a gateway, a risk block, or a venue-side reject storm.

## Independent control paths

A kill switch is more trustworthy when it can be activated through an independent path rather than only through the possibly broken service itself. Some firms implement multiple activation paths, such as GUI controls, command-line tools, and desk-level emergency procedures with audit logging.

## Drills and testing

Operational safety controls need practice. Teams should test soft stops, hard stops, venue failover, and recovery runbooks in controlled environments so that activation semantics are known before a real incident occurs.

## Post-incident learning loop

After a trigger or kill event, teams should preserve the timeline, decision reason, and resulting system state for review. Good post-incident analysis improves thresholds, dashboards, and runbooks so controls become more accurate over time instead of becoming noisy and ignored.
