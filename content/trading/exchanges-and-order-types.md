# Exchanges and Order Types

Research date: 2026-07-24

Engineers at trading firms build systems against the real operational constraints of exchanges. That means understanding not only order types, but also how venue rules, protocols, and fee models affect implementation. A correct API wrapper is not enough if the system cannot represent venue-specific semantics safely.

## Major exchanges and venue families

### CME Group

Major futures and derivatives venue family. Engineers often deal with futures market data, matching rules, session management, and strict risk controls around high message rates.

### Cboe

Important across equities, options, and market data services. Venue-specific order types and matching semantics matter, especially for options and equities smart routing.

### NYSE

A major equities venue family with auction mechanisms, routing logic, and exchange-specific order behavior.

### NASDAQ

A major equities venue family and a well-known source of ITCH/OUCH-style protocol discussions in engineering literature.

### ICE

Important in futures and commodities markets, with its own operational characteristics around market data and order entry.

### Eurex

A major European derivatives venue family. Engineers need awareness of regional session behavior, product specifics, and protocol support.

The interview goal is not to memorize venue catalogs. It is to show that you understand exchange connectivity is venue-specific and not interchangeable.

## Core order types

### Market order

An order to trade immediately at the best available price. Engineers should represent the fact that execution price is not known in advance and that slippage risk can be material.

### Limit order

An order to buy no higher than, or sell no lower than, a specified price. This is the core order type for most book-based systems.

### Stop order

An order activated when a trigger condition is met. Some stops convert to market orders, others to limit orders. Systems must model both the trigger source and post-trigger behavior.

### IOC (Immediate or Cancel)

The order executes whatever is immediately available and cancels any remainder. Infrastructure must handle partial-fill-plus-cancel as a normal outcome.

### FOK (Fill or Kill)

The order must fill in full immediately or be canceled in full. Engineers should model the all-or-nothing expectation explicitly.

### Post-Only

An order that should add liquidity, not remove it. If it would cross the book, the venue may reject it or reprice it according to venue rules. This is a classic source of venue-specific behavior.

### GTC (Good Till Cancelled)

The order remains active until filled or canceled, subject to venue policies and session boundaries.

## Cancel/replace orders

Cancel/replace is more subtle than “edit an order.” On many venues, changing price means giving up queue priority because the exchange treats it effectively as cancel plus new order. The system must preserve correlation between old and new states and handle races with fills or cancels already in flight.

## Smart order routing concept

Smart order routing decides where to send an order across multiple venues. Inputs may include:

- displayed price and size
- fee or rebate economics
- queue position expectations
- venue reliability and latency
- order type support
- dark versus lit routing policy

Even if a team does not build a full SOR, an interview candidate should understand why venue choice is a first-class decision.

## Maker/taker fee model

Many venues charge or rebate participants differently depending on whether they add or remove liquidity.

- **maker:** provides resting liquidity, may receive a rebate
- **taker:** removes liquidity, may pay a fee

Engineering implications:

- route policy may incorporate economics, not just raw spread
- order-type support such as post-only matters for fee control
- P&L and post-trade analytics need venue fee models

## What engineers need to implement for each order type

1. **Validation rules:** which fields are required or forbidden.
2. **Lifecycle behavior:** how acknowledgments, partial fills, and cancels appear.
3. **Venue support matrix:** not all order types exist everywhere.
4. **Simulation support:** how backtesting and replay model behavior.
5. **Risk implications:** market orders and stop-triggered orders often deserve extra controls.

## Common pitfalls

- assuming order type semantics are identical across venues
- ignoring partial fills for IOC and stop-converted orders
- forgetting queue-priority effects of cancel/replace
- failing to model fee impacts on routing decisions
- treating post-only rejects as generic failures instead of expected logic outcomes

## Interview guidance

A strong answer usually defines the order type, mentions a practical implementation consequence, and calls out venue-specific semantics where relevant. That shows engineer-level understanding rather than textbook recall.

## Venue-specific operational notes

Even common order types can differ in edge behavior across venues: post-only may reject, slide, or reprice; stop triggers may reference last trade or best bid/ask; GTC availability may vary by product or session boundary. Engineers should encode support matrices and not assume a universal abstraction is lossless.

## Routing implementation consequences

A routing layer therefore needs a capability model per venue: which time-in-force values are allowed, what rate limits apply, how cancels behave during session transitions, and which reject codes are transient versus permanent. This is the difference between a toy abstraction and a production routing system.
