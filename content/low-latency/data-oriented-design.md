# Data-Oriented Design for Performance

Research date: 2026-07-24

Data-oriented design starts from how the machine executes programs, not from how humans name abstractions. In HFT, this mindset is often the difference between code that is elegant on a whiteboard and code that is actually fast under load. The objective is to organize memory and control flow so the CPU sees predictable, contiguous, branch-light work.

## Why object-oriented design can hurt cache performance

Classic object-oriented decomposition often creates many small heap objects connected by pointers and virtual dispatch. That can be excellent for extensibility, but it is hostile to modern CPU behavior:

- pointer chasing creates cache misses
- object headers and padding waste bandwidth
- virtual calls obscure control flow and inhibit optimization
- unrelated fields live together even if only a few are hot

A matching engine or feed handler rarely benefits from deep inheritance on the hot path. It benefits from dense arrays, simple ownership, and explicit state transitions.

## Array of Structs versus Struct of Arrays

### Array of Structs (AoS)

```cpp
struct QuoteLevel {
    int price_ticks;
    int qty;
    bool active;
};
std::vector<QuoteLevel> levels;
```

AoS is intuitive and convenient when most operations use all fields of each record together.

### Struct of Arrays (SoA)

```cpp
struct QuoteLevels {
    std::vector<int> price_ticks;
    std::vector<int> qty;
    std::vector<std::uint8_t> active;
};
```

SoA is superior when algorithms scan one or two fields across many records, which is common in filters, pricing adjustments, and eligibility checks. It improves cache density and SIMD opportunities.

## Cache-line efficiency calculation

Suppose a cache line is 64 bytes and a struct is 24 bytes, but your loop only needs the 4-byte quantity field. In AoS, each line carries two full records plus part of a third, meaning most fetched bytes are irrelevant to the current computation. In SoA, sixteen 4-byte quantities fit in a single line. That can cut memory traffic by a large factor and often matters more than shaving a few instructions.

The key interview point is not to memorize formulas; it is to reason about **useful bytes per line fetched**.

## Hot/cold splitting

Many production structs mix fields needed on every message with fields needed only for logging, recovery, or diagnostics. Hot/cold splitting places frequently used fields in a compact hot struct and infrequently used metadata elsewhere.

Examples:

- active order state versus audit trail strings
- top-of-book quantities versus symbol metadata
- risk counters versus operator-visible descriptions

This reduces cache pollution and makes the critical path more predictable.

## Flat data structures versus pointer chasing

A flat vector, array, or indexed arena usually beats a tree or linked list if the working set fits known bounds and update patterns are predictable. Pointer-chasing structures pay in cache misses and branch mispredictions.

In HFT, flat structures commonly win for:

- instrument lookup via integer IDs
- price levels stored in arrays indexed by tick offset within a narrow range
- pre-allocated order tables addressed by order ID or handle

The price is that bounds and resizing strategies must be designed carefully.

## Branch elimination techniques

Branches are not always bad, but unpredictable branches are expensive. Common branch-reduction techniques include:

- use sentinel values instead of special-case null checks
- sort or partition data so hot loops operate on homogeneous cases
- use lookup tables for small discrete logic
- represent booleans as masks usable in vectorized operations
- separate rare slow paths from common fast paths

An important nuance: replacing readable code with obscure branchless tricks is only worthwhile when measurement shows branch misprediction is material.

## SIMD-friendly layouts

SIMD works best when data is contiguous, aligned, and homogeneous. SoA layouts make it easier to load vectors of prices, quantities, or flags. Even when explicit intrinsics are not used, a good layout gives the compiler a chance to auto-vectorize.

Typical candidates in trading infrastructure include:

- normalizing numeric fields across a batch of feed messages
- scanning risk counters for threshold breaches
- computing checksums or simple transforms on contiguous buffers

## Practical examples from HFT systems

### Feed normalization

A feed handler often receives many messages with similar field extraction logic. Storing parsed fields in columnar arrays lets downstream logic scan only the fields it needs, such as instrument ID and best price, without dragging along timestamps, flags, or raw payload pointers.

### Order book snapshots

For snapshot generation, a flat array of levels around the touch may outperform a tree because the range of relevant prices is small and access locality is high.

### Risk checks

Pre-trade risk often evaluates thresholds over compact counters keyed by instrument or strategy ID. Dense arrays indexed by integer handles are usually better than maps keyed by strings.

## Design heuristics

1. Start from access patterns, not class diagrams.
2. Pack hot fields tightly and align intentionally.
3. Prefer handles and indices to general-purpose pointers in hot code.
4. Use SoA when loops touch only some fields across many elements.
5. Validate with cache-miss and branch-mispredict measurements, not style preferences.

## Interview questions with answers

### 1. Why can object-oriented design be slower in HFT hot paths?
Because it often introduces pointer chasing, fragmented allocations, virtual dispatch, and poor cache density. The CPU spends time waiting for memory rather than executing useful work.

### 2. When should you use SoA instead of AoS?
When processing large collections and touching only a subset of fields in each pass, especially when SIMD or cache efficiency matters more than per-record convenience.

### 3. What is hot/cold splitting?
It is separating frequently accessed fields from rarely accessed metadata so the hot path fetches only what it needs into cache.

### 4. Why do flat structures often beat trees in low-latency systems?
Because contiguous memory greatly reduces cache misses and branch unpredictability. If bounds are manageable, O(1) indexed access often wins over theoretically elegant but memory-scattered structures.

### 5. Give an HFT example of branch elimination.
A feed parser may classify message types into a small table of handlers indexed by message code, or a risk check loop may use threshold masks over arrays rather than unpredictable nested conditionals.
