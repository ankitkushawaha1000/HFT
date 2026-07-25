# Risk Management Basics for Engineers

Research date: 2026-07-24

Engineers at trading firms implement the mechanisms that make risk policies real. They do not always choose the policies, but they must understand the categories of risk well enough to build correct checks, data models, and operator tools. Good engineering risk awareness is about translating financial controls into reliable systems.

## Position limits

### Net position

Net position is long quantity minus short quantity for an instrument or portfolio. A limit restricts directional exposure.

### Gross position

Gross position measures total exposure regardless of direction, often the sum of absolute positions. It is useful because a strategy can have small net but large gross exposure.

### Per-instrument limits

Some products deserve tighter constraints due to liquidity, volatility, or firm policy. Engineers must support instrument-scoped counters and parameter overrides.

## Greeks basics: engineer-level awareness

Engineers do not need to derive option-pricing models in most roles, but they should know the common sensitivities:

- **Delta:** sensitivity to underlying price changes
- **Gamma:** rate of change of delta
- **Vega:** sensitivity to volatility
- **Theta:** sensitivity to time decay

Why this matters: some risk systems enforce limits not just on share or contract counts but on risk sensitivities aggregated across positions.

## Value at Risk (VaR)

VaR is a statistical estimate of potential loss over a horizon at a chosen confidence level. Engineers mainly need conceptual awareness:

- it is a portfolio-level post-trade risk concept, not usually a microsecond in-line check
- it depends on model assumptions and historical or simulated distributions
- it influences reporting and supervisory controls

## Pre-trade versus post-trade risk

### Pre-trade risk

Acts before sending an order. Examples: position limits, price collars, order rate limits, kill switches.

### Post-trade risk

Evaluates resulting exposure after fills. Examples: portfolio limits, Greek aggregation, VaR, stress scenarios, independent surveillance.

A strong engineering design cleanly distinguishes latency-sensitive blocking checks from analytical or supervisory checks.

## Kill switches and circuit breakers

Kill switches are hard or soft mechanisms to stop trading or risk-increasing actions. Circuit breakers are narrower automatic controls that trigger based on abnormal conditions, such as stale data or excessive rejects.

Engineers must make these controls:

- fast
- scoped
- auditable
- hard to misuse accidentally

## Regulatory awareness

### MiFID II

In Europe, MiFID II emphasizes controls around algorithmic trading, kill-switch capability, testing, and recordkeeping. Engineers should know that operational controls and audit trails are regulatory concerns, not just internal preferences.

### Dodd-Frank and related U.S. oversight

For U.S. markets, broad regulatory frameworks and venue rules influence pre-trade controls, reporting, and risk management. The exact obligations depend on asset class and entity, but engineers should know that auditability and control design are externally relevant.

## What engineers implement

- in-line risk checks
- position and exposure counters
- drop-copy and independent reconciliation feeds
- parameter management and approvals
- alerting and incident tooling
- simulation and testing for risk controls

## Common misunderstandings

- “Risk” is not only about one blocking gateway check.
- Position counts alone may be insufficient when options or multi-leg portfolios are involved.
- Independent monitoring is essential; self-reported safety is weak safety.

## Interview guidance

If asked about risk, define the category, explain whether it is pre-trade or post-trade, then tie it to a concrete system responsibility. That is the engineer-level answer interviewers want.

## Stress testing and scenario risk

Beyond real-time blocking checks, firms run stress scenarios to ask how portfolios behave under large market moves, volatility shocks, or liquidity collapses. Engineers may not design the model, but they build the data pipelines and replay infrastructure that make these analyses possible.

## Independent risk monitoring

A common production pattern is independent risk from drop copy or fill streams. This matters because a trading system should not be the only source of truth about its own safety. Reconciliation between primary and independent views is a core engineering responsibility.

## Engineer pitfalls

Common mistakes include using floating-point quantities where exact representation is required, failing to distinguish working orders from filled exposure, and not defining what happens when market-data references for risk checks are stale.

## Risk data quality

Risk controls are only as good as the data feeding them. Engineers therefore need strong guarantees around instrument reference data, fill sequencing, account mapping, and clock consistency across systems. Many real incidents are data-quality failures that first appear as “risk” problems.

## Practical interview framing

When asked a risk question, answer in three steps: define the metric, say whether it is pre-trade or post-trade, and describe the system component that computes or enforces it. This produces concise, engineer-focused answers.

## Control-plane expectations

Risk systems also need approvals, audit trails, and clear operator ownership for parameter changes. Engineers should design for both fast evaluation on the hot path and safe governance off the hot path.
