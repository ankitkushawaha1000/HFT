# Order Book

This example models a price-time priority order book with separate bid and ask maps. Bids are stored in descending price order and asks in ascending price order, so best prices are always at `begin()`.

Adding or cancelling a resting order is `O(log N)` for the price lookup plus `O(1)` list work inside a level. Matching walks top-of-book levels first, which mirrors how many exchange-style books are implemented in interview problems and trading simulators.
