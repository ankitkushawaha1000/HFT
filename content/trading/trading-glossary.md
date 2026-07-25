# Trading Glossary for Engineers

Research date: 2026-07-24

This glossary defines common trading, market microstructure, risk, protocol, and exchange terms at an engineer-friendly level. Definitions are intentionally concise and oriented toward system design and implementation.

## A

**Ack (Acknowledgment):** A venue or downstream system message confirming receipt or acceptance of an order-related request.

**Aggressive Order:** An order that immediately trades against resting liquidity instead of adding liquidity.

**Algo / Algorithmic Trading:** Automated decision-making and execution based on programmed logic.

**Ask / Offer:** The lowest displayed sell price currently available in the book.

**Auction:** A special matching process, often at open or close, where orders are crossed according to venue rules.

## B

**Backtesting:** Running strategy logic against historical data to evaluate behavior.

**Best Bid / Best Ask:** Highest resting buy price and lowest resting sell price.

**Bid:** The highest displayed buy price in the market.

**Binary Protocol:** A compact message format used by many low-latency feeds and order-entry gateways.

**Book Depth:** Quantity available across price levels, not just at the top of the book.

## C

**Cancel:** Request to remove a resting order from the venue.

**Cancel/Replace:** Venue workflow for modifying an order, often treated as cancel plus new order.

**Circuit Breaker:** Automated control that pauses or alters behavior when abnormal conditions occur.

**Clearing:** The post-trade process of validating and settling obligations resulting from trades.

**Colocation:** Hosting trading infrastructure physically close to exchange matching engines to reduce latency.

**Cross:** A trade or matching event where buying and selling interest meets under venue rules.

## D

**Dark Pool / Dark Venue:** A venue where resting liquidity is not fully displayed before execution.

**Delta:** Sensitivity of position value to the price of the underlying instrument.

**Depth-of-Book:** Market data showing multiple price levels beyond best bid and ask.

**Derivatives:** Instruments whose value depends on an underlying asset, such as futures or options.

**Drop Copy:** An independent copy of order and execution events sent for risk, reconciliation, or compliance.

## E

**Execution Report:** A venue or broker message describing an order state change such as ack, fill, reject, or cancel.

**Exchange Gateway:** The component that manages connectivity and protocol messaging to a venue.

**Exposure:** The amount of market risk associated with current or potential positions.

## F

**Fair Value:** A strategy’s internal estimate of the economically reasonable price of an instrument.

**Fat Finger Check:** A risk control that blocks orders with obviously wrong sizes or prices.

**FIFO (First In, First Out):** Queue ordering rule where earlier orders at the same price trade first.

**Fill:** A completed execution against some or all of an order’s quantity.

**FIX:** Financial Information eXchange, a widely used text-based protocol for trading workflows.

**FOK (Fill or Kill):** An order that must be filled completely immediately or canceled.

## G

**Gamma:** Sensitivity of delta to changes in the underlying price.

**Gateway:** Generic term for venue-facing connectivity software.

**Good Till Cancelled (GTC):** An order that stays active until executed or canceled, subject to venue rules.

**Gross Position:** Total exposure without netting longs against shorts.

## H

**Hedge:** A trade used to reduce risk from another position.

**Hidden Liquidity:** Resting interest not fully displayed in the visible book.

**Hit the Bid:** Sell aggressively into the current best bid.

**Hot Path:** The latency-critical execution path where extra work is most harmful.

## I

**Iceberg Order:** An order type where only part of the total size is displayed at any time.

**Immediate or Cancel (IOC):** Order that executes what it can immediately and cancels the remainder.

**Implied Liquidity:** Liquidity inferred or constructed by a venue, common in some derivatives markets.

**Inventory Risk:** Risk from holding directional exposure while making markets.

## J

**Jitter:** Variability in latency or timing from event to event.

## K

**Kill Switch:** Mechanism to stop some or all trading activity quickly.

## L

**Last Trade:** The price of the most recently reported execution.

**Latency Budget:** Allocation of allowable time across stages of a critical path.

**Level 1 Data:** Top-of-book market data only.

**Level 2 Data:** Multi-level depth-of-book data.

**Limit Order:** An order with a maximum buy price or minimum sell price.

**Liquidity:** The availability of counterparties and resting quantity to trade without large price movement.

**Lit Venue:** A venue where displayed orders contribute to the visible market.

## M

**Maker/Taker Fees:** Venue pricing model where adding and removing liquidity have different fees or rebates.

**Market Data Feed:** Stream of quotes, trades, and status information from a venue.

**Market Impact:** Price movement caused by one’s own trading activity.

**Market Maker:** Participant that continuously quotes both sides of a market.

**Market Order:** Order to trade immediately at the best available prices.

**Matching Engine:** Exchange component that pairs incoming and resting orders according to venue rules.

**Midprice:** Typically the average of best bid and best ask.

**MiFID II:** European regulatory framework with important controls around algorithmic trading and recordkeeping.

**Multicast:** One-to-many network distribution model widely used for market data.

## N

**NASDAQ ITCH:** Well-known style of binary market-data feed carrying book events and trades.

**Net Position:** Long minus short exposure for an instrument or account.

**Normalized Event:** Internal representation of venue-specific data converted to a common schema.

## O

**Offer:** Another term for ask.

**Open Order:** An order resting at the venue that may still trade or be canceled.

**Options Greeks:** Sensitivities such as delta, gamma, vega, and theta used in options risk.

**Order Book:** The visible and/or managed set of buy and sell orders arranged by price and queue priority.

**Order Router:** Component that chooses where to send orders.

**OUCH:** A family of lightweight order-entry protocols associated with certain equities venues.

## P

**Packet Gap:** Missing sequence range in market data or session messages.

**Partial Fill:** Execution of only part of an order’s total quantity.

**Passive Order:** An order that rests in the book and adds liquidity.

**P&L:** Profit and loss.

**Position Limit:** Risk rule constraining exposure by instrument, strategy, or account.

**Post-Only:** Order type intended to add, not remove, liquidity.

**Pre-Trade Risk:** Blocking checks applied before an order is sent.

**Price-Time Priority:** Matching rule where price is primary and time breaks ties.

**Pro-Rata:** Allocation rule where fills are divided proportionally across resting size.

## Q

**Queue Position:** Relative place of an order among resting orders at the same price.

## R

**Rate Limit:** Venue or internal constraint on message frequency.

**Reject:** A message indicating an order or request was refused.

**Replay:** Re-sending or reprocessing historical or missed data to reconstruct state.

**Resend Request:** Protocol mechanism asking a counterparty to retransmit missing sequenced messages.

**Risk-Reducing Order:** Order that lowers existing exposure, often allowed during soft stops.

## S

**SBE (Simple Binary Encoding):** A compact binary encoding designed for low-latency messaging.

**Sequence Number:** Monotonic identifier used to detect gaps, duplicates, and ordering.

**Session:** Persistent logical connection with protocol state such as heartbeats and sequences.

**Slippage:** Difference between expected and actual execution price.

**Smart Order Router (SOR):** Logic that routes orders across venues based on price, fees, and other factors.

**Spread:** Difference between best ask and best bid.

**Stop Order:** An order activated when a trigger price or condition is reached.

**Strategy-to-Order Latency:** Time from strategy decision to outbound order emission.

## T

**Tail Latency:** High-percentile latency behavior such as p99 or p99.9.

**Taker:** Participant removing liquidity from the book.

**TCP Replay Channel:** Reliable channel used by some venues for recovery of missed data.

**Theta:** Sensitivity of option value to time decay.

**Tick Size:** Smallest allowed price increment for an instrument.

**Time in Force (TIF):** Order lifetime instruction such as IOC or GTC.

**Top-of-Book:** Best bid and best ask only.

**Trade Print:** Report of an executed trade.

## U

**UDP Multicast:** Common low-latency transport for broadcasting market data to many recipients.

## V

**Value at Risk (VaR):** Statistical estimate of potential portfolio loss over a horizon at a confidence level.

**Vega:** Sensitivity of option value to volatility changes.

**Venue:** Exchange, ATS, dark pool, or other execution destination.

## W

**Warmup:** Controlled initialization phase used to stabilize caches, memory mappings, and code paths before live measurement or trading.

**Wire-to-Wire Latency:** Time from inbound packet arrival at a host boundary to outbound packet transmission.

## Y

**Yield Curve:** Relationship between interest rates and maturities; relevant for rates products and pricing systems.

## Z

**Zero-Copy:** Design approach that avoids unnecessary data duplication between processing stages.
