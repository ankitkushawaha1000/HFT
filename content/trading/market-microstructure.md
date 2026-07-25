# Market Microstructure for Engineers

Research date: 2026-07-24

Market microstructure is the study of how trading actually happens: how orders are displayed, matched, prioritized, and turned into prices. Engineers at HFT firms do not need to become traders, but they do need enough microstructure knowledge to build correct systems. A trading stack that misunderstands queue priority, book updates, or venue behavior will make incorrect design decisions no matter how good the code looks.

## Bid/ask spread

The **bid** is the highest displayed price at which someone is willing to buy. The **ask** or **offer** is the lowest displayed price at which someone is willing to sell. The difference is the **spread**.

Why does the spread exist?

- market makers need compensation for inventory and adverse-selection risk
- there is uncertainty about the true current value
- venues impose tick sizes that discretize prices
- liquidity providers may require compensation for holding queue position and operational risk

For engineers, the spread matters because it drives strategy behavior, quote logic, and fat-finger/risk controls.

## Order book basics

An order book is the set of resting buy and sell orders organized by price level. Important terms:

- **best bid:** highest buy price
- **best ask:** lowest sell price
- **depth:** resting quantity at each level
- **top of book:** the best bid and best ask only
- **depth of book:** multiple levels beyond the top

The book is not just a price table; it is a queueing system. At each price, time priority determines who trades first in most venues.

## Market impact

Market impact is the effect of trading on the market price. Aggressive orders consume displayed liquidity and can move the price. Even passive quoting can have impact if it changes displayed depth and influences other participants.

Engineers need this concept because:

- order slicing and child-order routing are impacted by expected impact
- simulation and backtesting need assumptions about fills and slippage
- kill switches and risk checks sometimes depend on unusual self-generated impact

## Price formation

Prices emerge from the interaction of resting liquidity, incoming aggressive orders, cancellations, and information arrival. The last trade price is not the whole story. Midprice, spread, depth imbalance, queue position, and hidden liquidity all influence how participants perceive “fair value.”

An engineer does not need a trader’s intuition about all of this, but should understand that the visible book is both a signal and a strategic game.

## Priority rules

### Price-time priority

The most common rule. Better price wins first; among orders at the same price, earlier arrival wins. This makes queue position highly valuable and strongly shapes system requirements around cancel/replace speed and accurate state tracking.

### Pro-rata priority

Some markets allocate fills proportionally to resting size at a level instead of strict FIFO. Engineers must know the venue rule because the expected value of quoting, order sizing, and simulation assumptions differ.

### Hybrid rules

Real venues may blend FIFO, size preference, or special treatment for certain order types. Production systems should encode venue behavior explicitly rather than assuming universal FIFO.

## Lit versus dark venues

### Lit venues

Displayed orders contribute to the visible order book and market data. These venues shape public price discovery.

### Dark venues

Orders are not fully displayed before execution. They can reduce visible impact or allow midpoint crossing but introduce different matching and information considerations.

Engineers need to know the distinction because market data availability, fill models, and regulatory reporting paths differ.

## Market data types

### Top-of-book

Best bid, best ask, and associated sizes. Good for lightweight strategies and some risk references.

### Depth-of-book

Multiple price levels and sizes. Necessary for richer execution logic, book pressure analysis, and realistic simulation.

### Trade prints

Reports of executed trades. Useful, but insufficient alone to reconstruct the full state of a limit order book.

### Reference and status data

Auction states, instrument status, trading halts, and reference prices are also part of real market data and often critical for safe system behavior.

## What engineers need to know versus what traders need

Engineers should understand:

- how orders enter and leave the book
- what sequencing and priority rules exist
- how venue-specific behavior affects system correctness
- how data feeds represent state changes
- how fills, cancels, and rejections interact operationally

Traders additionally care about predictive behavior, alpha, inventory decisions, and execution tactics. Engineers do not need to generate edge directly, but they must avoid baking incorrect market assumptions into infrastructure.

## Why microstructure matters to design

1. It determines which market data you must capture.
2. It shapes order-book and simulation correctness.
3. It affects expected latency sensitivity: queue position matters more under FIFO than under looser allocation rules.
4. It changes how risk and post-trade reconciliation should be built.

## Common interview angles

Interviewers may ask how a partial fill affects queue position, why cancel/replace timing matters, what top-of-book omits, or how pro-rata differs from FIFO. Good answers tie microstructure to system behavior rather than reciting definitions in isolation.
