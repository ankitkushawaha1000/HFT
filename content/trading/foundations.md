
# Trading Foundations for Engineers

You do not need to be a trader to interview well, but you do need enough market context to understand why the software is designed the way it is.

## Core Concepts

- Limit order book structure and price-time priority
- Maker vs taker behavior
- Spread, slippage, and queue position
- Adverse selection risk
- Market data freshness and stale-book risk

## Why This Matters for Engineers

Trading context explains engineering choices:

- Why deterministic sequencing matters
- Why stale data can be more dangerous than brief unavailability
- Why a risk check may belong off the critical path or in a precomputed form
- Why one extra microsecond can matter only on some strategies and not others

## Interview Tip

If you are unsure about the finance detail, connect it back to system consequences: correctness, latency sensitivity, or risk exposure.
