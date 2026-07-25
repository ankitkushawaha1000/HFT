# Limit Order Book Design

Research date: 2026-07-24

Designing a limit order book is a classic HFT interview problem because it mixes domain knowledge with data-structure tradeoffs. A strong answer should define the required operations, the invariants of price-time priority, and the performance implications of different storage models.

## Requirements

The core operations are:

- add order
- cancel order
- modify or replace order
- match aggressive orders against resting liquidity
- query best bid and best ask
- sometimes provide depth snapshots or per-order lookup

Correctness requirements include preserving price-time priority, exact quantity accounting, and fast lookup by order ID.

## Price representation

Use integer ticks, not floating-point prices. Converting venue price formats into integer tick units avoids rounding bugs and enables array indexing or exact map keys.

## Price level data-structure options

### Sorted map

A balanced tree or ordered map naturally supports sparse price levels and ordered traversal.

Pros:

- simple sparse representation
- natural best-price lookup with iterators
- handles wide price ranges

Cons:

- pointer-heavy and cache-unfriendly
- log-time inserts with significant constant factors
- poor locality under heavy updates

### Price array

If the relevant price range is bounded or can be represented as offsets around a base, an array or vector of levels is much faster.

Pros:

- O(1) indexed access
- excellent locality
- ideal for clustered prices

Cons:

- memory cost for wide or shifting ranges
- needs careful handling of sparse extremes

Many real engines use hybrids: arrays for a hot band around the touch and fallback structures for sparse far-away levels.

## Queue at each price level

Within a price level, price-time priority usually implies FIFO order. A doubly linked list or intrusive queue is a common answer because:

- insertion at tail is O(1)
- removal of a known order is O(1)
- head of queue is easy to match

The key is to pair level queues with a direct order-ID lookup table so cancellation does not require scanning.

## Direct order lookup

Maintain a hash map or indexed table from order ID to the order object and its price level. That enables efficient cancel and modify operations. In a low-latency design, order objects are often pool-allocated and may contain embedded links for their level queue.

## Matching engine logic

For an incoming buy order:

1. while quantity remains and best ask price is marketable
2. match against the oldest resting order at the best ask
3. decrement quantities, generate fills, and remove fully filled orders
4. if residual quantity remains and the order is limit-priced, rest it on the bid side

The sell side is symmetric. The invariant is strict price-time priority unless the venue explicitly uses another rule.

## Modify semantics

Interviews sometimes blur modify and replace. A senior answer should clarify whether modify keeps time priority. Many venues treat economically meaningful changes—especially price changes—as cancel/replace, losing original queue position. Quantity reductions may or may not preserve priority depending on venue rules.

## Performance characteristics

What the interviewer wants:

- best bid/ask lookup should be cheap
- add/cancel/match should avoid whole-book scans
- memory layout matters as much as asymptotic complexity
- order ID lookup is essential

Typical complexity discussion:

- add: O(1) for array/hybrid level lookup plus O(1) queue append, or O(log N) if a new tree level is needed
- cancel: O(1) with direct lookup and intrusive list removal
- match: proportional to number of fills generated

## Memory usage tradeoffs

Dense arrays reduce latency but can use significant memory if the tick range is huge. Sparse maps save memory but pay in pointer overhead and cache misses. A good answer ties the structure to product class:

- futures with narrower active ranges may suit dense indexing
- equities across wide prices often need hybrid approaches
- options books may need additional strike/expiry dimensions beyond a single simple price ladder

## Common answer patterns

A strong practical answer is:

- integer tick prices
- order table by order ID
- price-level table with FIFO queue per level
- separate best bid/ask tracking
- pool allocation for orders and levels

Then discuss variants depending on price sparsity and asset class.

## Interview rubric

Interviewers generally score along these lines:

1. **Domain correctness:** did you preserve price-time priority?
2. **Operation coverage:** can you add, cancel, modify, and match efficiently?
3. **Data-structure reasoning:** did you justify map versus array versus hybrid?
4. **Performance awareness:** did you discuss locality, memory, and tails?
5. **Communication:** did you clarify assumptions such as tick size and modify semantics?

## Common mistakes

- using floating-point prices
- no order-ID index for cancels
- scanning a list to find best prices every time
- ignoring queue position semantics
- treating asymptotic complexity as the whole story

## Final guidance

When unsure, state a baseline design first, then explain how you would adapt it for sparse books, very wide price ranges, or venue-specific matching rules. That shows both decisiveness and flexibility.
