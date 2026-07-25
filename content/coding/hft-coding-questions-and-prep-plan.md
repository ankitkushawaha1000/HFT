# HFT Coding Questions & Full Prep Plan

> Educational note: this page compiles **publicly reported and representative** preparation material (LeetCode, Glassdoor, Stack Overflow, HackerRank, company career pages, public prep blogs). It does **not** include confidential interview content or NDA material.

## Evidence labels used on this page

- **official**: explicitly stated on official company/careers material
- **inferred**: strongly implied by role requirements and public engineering content
- **anecdotal**: publicly reported by candidates
- **general-prep**: common prep pattern, not company-specific

## Commonly asked coding and quant-style topics

### Arrays / strings / hashing

| Question / topic | Difficulty | Typical stage & firms | Approach hint | Complexity | Public source |
|---|---|---|---|---|---|
| Two Sum / k-sum variants with constraints | Easy–Medium | OA + live coding (general-prep, anecdotal at Optiver/IMC/SIG) | Use hash map for complement lookups; call out overflow/duplicates | O(n) time, O(n) space | https://leetcode.com/problems/two-sum/ |
| Sliding-window substring frequency (anagrams, longest unique substring) | Medium | OA-heavy (general-prep) | Maintain window counts and invariant for validity | O(n) time, O(Σ) space | https://leetcode.com/problems/longest-substring-without-repeating-characters/ |
| Interval merge / meeting rooms style scheduling | Medium | OA + live rounds (general-prep) | Sort by start time; greedily merge or track min-heap of end times | O(n log n) time | https://leetcode.com/problems/merge-intervals/ |

### Data-structure design

| Question / topic | Difficulty | Typical stage & firms | Approach hint | Complexity | Public source |
|---|---|---|---|---|---|
| Limit order book skeleton (add/cancel/match) | Hard | Live systems/coding rounds (inferred + anecdotal at HFT firms) | Map price→level + ordered price index; discuss trade-offs by instrument load | Usually O(log n) update + O(k) match | https://www.investopedia.com/terms/o/order-book.asp |
| LRU cache | Medium | OA + live coding (general-prep) | Hash map + doubly linked list for O(1) get/put | O(1) avg ops | https://leetcode.com/problems/lru-cache/ |
| Ring buffer API | Medium | Live implementation (inferred/official for low-latency roles) | Fixed-size array with wrap-around indices and overflow policy | O(1) ops | https://en.wikipedia.org/wiki/Circular_buffer |
| Min/Max stack | Easy–Medium | OA screening (general-prep) | Store current min/max alongside each push | O(1) ops | https://leetcode.com/problems/min-stack/ |
| Token bucket / fixed-window rate limiter | Medium | Design + coding hybrid | Encode time buckets and eviction rules clearly | O(1) amortized | https://en.wikipedia.org/wiki/Token_bucket |

### Concurrency & lock-free

| Question / topic | Difficulty | Typical stage & firms | Approach hint | Complexity | Public source |
|---|---|---|---|---|---|
| SPSC ring queue with atomics | Hard | Live technical rounds (inferred, anecdotal in HFT) | Separate producer/consumer indices, memory-order reasoning, cache-line padding | O(1) ops | https://www.boost.org/doc/libs/release/doc/html/lockfree.html |
| Producer-consumer bounded queue | Medium | OA + live C++ rounds | Start with mutex/condvar correctness, then discuss lock-free variants | O(1) ops | https://en.cppreference.com/w/cpp/thread/condition_variable |
| False sharing diagnosis/fix | Medium | Systems depth rounds | Identify cache-line contention and align/pad hot fields | N/A | https://en.wikipedia.org/wiki/False_sharing |
| Atomic counter / CAS loop correctness | Medium | C++ depth rounds | Explain ABA risk, retry loops, memory_order semantics | O(1) | https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange |

### Low-latency / systems coding

| Question / topic | Difficulty | Typical stage & firms | Approach hint | Complexity | Public source |
|---|---|---|---|---|---|
| Memory pool / object pool allocator | Hard | Low-latency implementation rounds | Pre-allocate slabs, free-list management, fragmentation discussion | O(1) alloc/free target | https://en.wikipedia.org/wiki/Object_pool_pattern |
| Feed message parser + sequence-gap handling | Hard | Market data/system rounds | Parse binary/text safely, track sequence IDs, trigger gap recovery | O(n) parse stream | https://www.fixtrading.org/standards/ |
| Cache-friendly struct layout optimization | Medium | C++/systems interviews | Reorder hot fields, avoid pointer chasing, benchmark before/after | N/A | https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html |

### Math / probability / mental math / market-making games

| Question / topic | Difficulty | Typical stage & firms | Approach hint | Complexity | Public source |
|---|---|---|---|---|---|
| Conditional probability puzzles (Bayes-style) | Medium | OA + quant screens (anecdotal at SIG/IMC/Five Rings/Optiver) | Define events first; solve with tree/table to avoid intuition traps | N/A | https://en.wikipedia.org/wiki/Bayes%27_theorem |
| Expected value game decisions | Medium | Trading game rounds | Compute EV quickly, compare actions by risk-adjusted edge | N/A | https://www.khanacademy.org/math/statistics-probability/random-variables-stats-library/expected-value |
| Fast estimation/Fermi questions | Easy–Medium | Recruiter/trading chat | State assumptions, bound low/high, refine in one pass | N/A | https://en.wikipedia.org/wiki/Fermi_problem |

### Classic algorithm puzzles seen repeatedly

| Question / topic | Difficulty | Typical stage & firms | Approach hint | Complexity | Public source |
|---|---|---|---|---|---|
| Binary search on answer (capacity/time) | Medium | OA + live coding | Convert to monotonic predicate and binary search threshold | O(n log M) | https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/ |
| Top-K streaming elements | Medium | OA + live coding | Min-heap of size k or bucket/frequency approach | O(n log k) | https://leetcode.com/problems/top-k-frequent-elements/ |
| Graph shortest path / BFS grid | Medium | OA coding | Choose BFS for unit edges, Dijkstra otherwise | O(V+E) or O(E log V) | https://leetcode.com/problems/shortest-path-in-binary-matrix/ |

## Full preparation plan

### Phase 0 (Day 0): Setup and baseline
- Read [Coding Foundations](../coding/foundations.md), [Coding Interview Strategy](../coding/coding-interview-strategy.md), and [7-day plan](../study-plans/7-day-emergency-plan.md).
- Benchmark your speed with one 60-minute OA simulation (2 medium + 1 easy).

### Phase 1 (Week 1): Core speed and correctness
- **Daily (90–120 min):** arrays/strings/hashing drills + 20-minute review.
- **Daily (45 min):** one behavioral story rep from [Behavioral Master Guide](../behavioral/behavioral-master-guide.md).
- **2 sessions/week:** implement ring buffer + min stack from scratch.

### Phase 2 (Week 2): Data structures and implementation depth
- Focus on LRU, order-book primitives, rate limiter, interval/heap patterns.
- Pair each coding session with one system concept from [Systems Foundations](../systems/foundations.md).
- Use company round pages to target style: start with [Optiver](../companies/optiver/README.md), [Jane Street](../companies/jane-street/README.md), [Google](../companies/google/README.md).

### Phase 3 (Weeks 3–4): Concurrency + low latency
- Rotate through [C++ concurrency model](../cpp/concurrency-memory-model.md), [Atomics](../cpp/atomics-and-lock-free.md), [Lock-free queues](../low-latency/lock-free-queues.md), and [Memory pools](../low-latency/memory-pools.md).
- Implement SPSC queue and memory pool with tests.
- Run timed mock rounds: [Senior C++ mock](../mock-interviews/senior-cpp-60min.md) + [System design mock](../mock-interviews/system-design-60min.md).

### Phase 4 (Weeks 5–8): Interview-loop simulation
- Follow [30-day](../study-plans/30-day-plan.md) then [60-day](../study-plans/60-day-plan.md) cadence.
- Weekly full loop: recruiter + coding + systems + behavioral.
- Every week, do 1–2 company-specific dry runs using round pages in `companies/*/round-*/questions.md`.

## Daily practice template (90-minute OA block)
1. **5 min:** parse prompt, list constraints and edge cases.
2. **35 min:** solve first problem, keep invariants explicit.
3. **35 min:** solve second problem, prioritize correctness over micro-optimization.
4. **10 min:** test with adversarial cases (empty, duplicates, overflow, max sizes).
5. **5 min:** write short retrospective and mistakes log.

## How to practice OAs effectively
- Timebox strictly; don’t pause timers for lookups.
- Write tiny tests while coding (sample + edge case + random case).
- Use platform constraints similar to interview settings (HackerRank, CodeSignal, Codility, LeetCode contests).
- Train keyboard fluency: template snippets for parsing, heap setup, and hash patterns.

## Curated public resources
- LeetCode interview set: https://leetcode.com/problemset/
- HackerRank interview prep: https://www.hackerrank.com/interview/interview-preparation-kit
- Stack Overflow C++ tag wiki: https://stackoverflow.com/tags/c%2b%2b/info
- Cppreference (atomics/concurrency): https://en.cppreference.com/w/cpp/atomic
- Glassdoor interview search: https://www.glassdoor.com/Interview/index.htm
- levels.fyi compensation data: https://www.levels.fyi/

## Company targeting matrix (quick use)
- **Heavier probability/trading games (anecdotal/inferred):** SIG, IMC, Five Rings, Optiver.
- **Heavier systems/C++ depth (inferred/anecdotal):** HRT, Jump, Citadel Securities, Tower, XTX.
- **Heavier standard algorithm loops (official/general-prep):** Google, Meta, Microsoft, Amazon, Bloomberg.
