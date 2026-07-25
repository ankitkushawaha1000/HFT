# Market Making Basics for Engineers

Research date: 2026-07-24

Market making is the business of continuously quoting both sides of a market and earning spread while managing inventory and adverse-selection risk. Engineers do not decide the strategy, but they build the systems that make the strategy executable, safe, and observable. Understanding the economic shape of market making helps engineers prioritize the right performance and correctness properties.

## What market making is

A market maker posts bids and asks, hoping to buy slightly below fair value and sell slightly above it. Profit does not come from one static spread number; it depends on fill quality, inventory control, fees, hedging, and whether the quotes were adverse-selected by faster or better-informed participants.

## Inventory risk

When quotes are hit or lifted asymmetrically, the market maker accumulates inventory. Long inventory loses money if the market falls; short inventory loses money if the market rises. Inventory constraints therefore feed directly into quoting behavior.

Engineering implications:

- position updates must be low latency and accurate
- risk limits must support product, strategy, and aggregate views
- kill switches must handle runaway inventory quickly

## Adverse selection

Adverse selection occurs when counterparties trade with you precisely because your quote is stale or too generous relative to new information. This is why low-latency market data, fast quote updates, and reliable cancel paths matter so much.

An engineer should connect this concept to system requirements:

- stale quote detection
- quote update latency monitoring
- cancellation path prioritization
- dependency on correct market-data sequencing

## Spread as compensation

The spread compensates the market maker for inventory risk, adverse selection, fees, and capital usage. Narrow spreads attract flow but reduce per-trade margin; wide spreads protect the book but may reduce fills. Systems must support frequent repricing as conditions change.

## Quote management

A market-making strategy updates quotes when:

- the fair value estimate changes
- visible book pressure changes
- inventory moves away from target
- volatility or spread regime changes
- venue health or queue position considerations change

Engineers do not choose the model, but they build:

- fast market-data normalization
- low-latency quoting and cancel/replace paths
- per-venue session tracking
- observability for stale quotes and missed cancels

## Risk parameters

Typical parameters include:

- max long and short position
- per-order size caps
- quote width limits
- order-rate limits
- stale-data protection
- symbol- or venue-specific enable/disable flags

Parameter updates must be safe and near-real-time. Operational tooling matters because desks change these limits during live trading.

## What engineers build versus what traders decide

Traders or quants typically define fair-value models, inventory preferences, and quoting tactics. Engineers build the execution substrate:

- feed handlers
- order books
- strategy runtime and scheduling
- risk enforcement
- gateways and monitoring
- replay and incident-analysis tools

Confusing these roles is common in interviews. A strong engineer answer respects the division while still understanding the business motivation.

## Impact on system design

Market making pushes designs toward:

- extremely low market-data-to-order latency
- precise order-state management
- aggressive tail-latency control on cancel/replace paths
- reliable position tracking and independent drop copy
- per-symbol or per-partition ownership to reduce contention

The design is shaped by the fact that a missed cancel or stale quote can be much more expensive than one average-latency regression suggests.

## Interview angles

Interviewers may ask why cancel latency matters more than throughput, why inventory is central, or how adverse selection changes architecture priorities. Good answers tie microstructure to system behavior: quote-driven strategies care deeply about determinism, accurate book state, and safe operator controls.

## Queue position and quote value

Under price-time priority, a quote is not just a price; it is a place in line. Canceling and replacing too aggressively can sacrifice queue position, while quoting too passively increases adverse-selection risk. Engineers need to preserve order-state fidelity so the strategy can reason about these tradeoffs.

## Quote lifecycle in systems terms

A typical quote lifecycle is: compute fair value, derive bid/ask, run safety checks, submit, track acknowledgments, process partial fills, and reprice or cancel on new information. Each stage requires low-latency telemetry because small stalls accumulate into stale quoting behavior.

## Monitoring for market-making systems

Operational dashboards often emphasize stale-quote age, cancel-to-confirm latency, fill imbalance, inventory drift, and venue-specific reject bursts. These metrics connect directly to the economic risks of market making and are often more useful than generic CPU dashboards alone.

## Why engineers are asked this topic

Interviewers use market-making questions to test whether you can connect business mechanics to infrastructure priorities. A candidate who understands inventory, stale quotes, and cancel urgency will usually make better design choices than one who talks only about generic low latency.

## System boundaries that matter

A market-making stack usually depends on the tight coupling of feed handling, order-state tracking, and risk control. If any one of those boundaries is weak, the strategy can make good decisions on bad state or fail to react quickly enough to changing markets.
