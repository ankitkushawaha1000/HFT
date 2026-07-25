# 30-Day Comprehensive Plan

**Audience:** Senior C++ engineer with roughly one month before serious HFT interview loops.  
**Daily commitment:** 2-3 hours on average, with one longer practice block each weekend.  
**Goal:** Build deep enough mastery that your behavioral, technical, and design answers all reinforce the same hiring narrative: strong production C++ engineer, fast learner, credible for HFT.

---

## Plan design principles

A 30-day plan gives you enough time to do four things well:

1. **Build a differentiated behavioral story** rather than a generic STAR catalog.
2. **Deepen C++ knowledge beyond syntax** into ownership, lifetime, memory behavior, and concurrency.
3. **Develop HFT-relevant systems intuition** around market data, latency, correctness, and recovery.
4. **Integrate under interview conditions** so your strongest thinking survives time pressure.

This plan is organized by week, but still gives a day-by-day schedule. Week 2 is dedicated to the full C++ curriculum and is intentionally dense.

---

## Weekly objectives

- **Week 1:** Behavioral and Optiver-specific preparation
- **Week 2:** C++ deep dive (target all 14 C++ study blocks)
- **Week 3:** Systems, low-latency, and design
- **Week 4:** Integration, mock interviews, and weak-area review

---

## Week 1 — Behavioral and Optiver-specific prep

### Day 1 — Baseline assessment
- Read `README.md` and note the repository structure.
- Read `content/mock-interviews/recruiter-screen-01.md`.
- Record an unprepared 10-minute self-introduction plus why-HFT answer.
- Outcome: establish the gap between what you know and what you can actually say.

### Day 2 — Story bank foundation
- Read `content/mock-interviews/optiver-behavioral-45min.md`.
- Build six stories: ownership, conflict, pressure, feedback, failure, technical win.
- Add stakes, metrics, and lessons.

### Day 3 — Depth and follow-ups
- Read `content/mock-interviews/optiver-behavioral-60min.md`.
- Stress-test each story with hard probes: “what did you miss?”, “what would you do differently?”, “why did the other person disagree?”

### Day 4 — Firm-specific motivation
- Read `research/research-methodology.md`, `research/company-evidence-matrix.md`, and the Optiver/Citadel/Jane Street/HRT/Two Sigma/Jump entries in `research/sources.md`.
- Write one tailored motivation paragraph for each firm you may interview with.

### Day 5 — Recruiter and hiring-manager practice
- Run one recruiter screen and one 30-minute behavioral mini-round.
- Identify overlong answers.

### Day 6 — Rewrite day
- Replace weak stories.
- Add missing numbers.
- Create a final 90-second background answer and 90-second why-HFT answer.

### Day 7 — Week 1 review
- Re-run the strongest three behavioral stories without notes.
- Milestone check: can you answer “why now?” and “why this firm?” convincingly?

---

## Week 2 — C++ deep dive (all 14 study blocks)

### Important note on repository coverage

This repository currently includes anchor files in `content/cpp/` such as:
- `content/cpp/modern-cpp.md`
- `content/cpp/memory-and-pointers.md`
- `content/cpp/object-lifetime.md`
- `content/cpp/templates-and-concepts.md`
- `content/cpp/value-categories.md`

Treat Week 2 as **14 C++ study blocks**. The practical way to fit that into seven days is to run **two study blocks per day**: one fundamentals block and one performance/systems block. If your local branch contains fewer than 14 standalone files, use the extra blocks for deeper exercises on concurrency, atomics, STL behavior, allocators, cache effects, and low-latency patterns.

### Day 8 — Blocks 1 and 2: modern C++ + value categories
- Block 1: read `content/cpp/modern-cpp.md` carefully.
- Block 2: read `content/cpp/value-categories.md`.
- Drill RAII, move semantics, `noexcept`, lvalue/xvalue/prvalue, forwarding references, and copy elision.

### Day 9 — Blocks 3 and 4: memory + object lifetime
- Block 3: read `content/cpp/memory-and-pointers.md`.
- Block 4: read `content/cpp/object-lifetime.md`.
- Practice stack vs heap, `shared_ptr` cost, alignment, dangling references, and destruction order.

### Day 10 — Blocks 5 and 6: templates/concepts + compile-time ergonomics
- Block 5: read `content/cpp/templates-and-concepts.md`.
- Block 6: practice concepts, SFINAE, type traits, and compare compile-time constraints with runtime polymorphism.

### Day 11 — Blocks 7 and 8: concurrency foundations + SPSC reasoning
- Block 7: use `content/mock-interviews/senior-cpp-60min.md` concurrency section.
- Block 8: explain acquire/release, relaxed ordering, false sharing, and SPSC queue invariants from memory.

### Day 12 — Blocks 9 and 10: allocators + memory pools
- Block 9: revisit allocator tradeoffs and workload classification.
- Block 10: practice `std::pmr`, arenas, slab strategies, and thread-local pools for bursty market-data workloads.

### Day 13 — Blocks 11 and 12: STL performance + hot-path design
- Block 11: review vector growth, iterator invalidation, node-based containers, and locality.
- Block 12: rehearse when abstraction is worth it and when a plain loop is better in hot paths.

### Day 14 — Blocks 13 and 14: oral exam + Week 2 review
- Block 13: run the full non-coding parts of `content/mock-interviews/senior-cpp-60min.md`.
- Block 14: write a from-memory cheat sheet on ownership, lifetime, atomics, allocators, and templates.
- Milestone check: can you sound precise without sounding theatrical?

---

## Week 3 — Systems, low-latency, design

### Day 15 — Systems mental model refresh
- Map C++ choices to cache, TLB, allocation, page faults, and scheduler behavior.
- Outcome: stronger “why” behind performance answers.

### Day 16 — Networking and feed-handler basics
- Read `content/mock-interviews/system-design-60min.md` with a focus on ingress, parsing, and distribution.
- Practice UDP/multicast vs TCP tradeoffs conceptually.

### Day 17 — Sequencing and correctness
- Focus on sequence numbers, gap detection, duplicates, and stale data handling.
- Write out a recovery state machine.

### Day 18 — Low-latency design tradeoffs
- Practice preallocation, thread affinity, queue design, and backpressure.
- Outcome: stronger p99-oriented reasoning.

### Day 19 — Full system design opening
- Rehearse the first 15 minutes of the feed-handler design until it is crisp.

### Day 20 — Full system design deep dive
- Run the entire design round aloud.
- Add observability, failover, degraded modes, and downstream signaling.

### Day 21 — Week 3 review
- Compare your answer with the strong/weak table in `content/mock-interviews/system-design-60min.md`.
- Milestone check: could a trading systems team trust your design instincts?

---

## Week 4 — Integration, mocks, weak-area review

### Day 22 — Recruiter + behavioral combo
- Run `content/mock-interviews/recruiter-screen-01.md` and `content/mock-interviews/optiver-behavioral-45min.md` back-to-back.
- Focus on consistency of narrative.

### Day 23 — Technical + design combo
- Run `content/mock-interviews/senior-cpp-60min.md` and a 30-minute compressed design round.
- Identify cross-round weaknesses.

### Day 24 — Weak-area repair
- Spend the whole session on the weakest topic from the previous two days.

### Day 25 — Live coding emphasis
- Practice the ring buffer from `content/mock-interviews/senior-cpp-60min.md` until you can outline it cleanly in 15 minutes.

### Day 26 — Optiver-style deep behavioral round
- Re-run `content/mock-interviews/optiver-behavioral-60min.md`.
- Focus on accountability and growth.

### Day 27 — System design refinement
- Re-run the feed-handler design with more attention to alternatives and tradeoffs.

### Day 28 — Full loop simulation
- Run `content/mock-interviews/full-loop-simulation.md`.
- Take a full debrief.

### Day 29 — Decision-quality review
- Review all scoring rubrics.
- Decide what kind of firm-specific calibration remains necessary.

### Day 30 — Confidence and compression
- Compress your strongest answers:
  - background to 90 seconds;
  - why HFT to 90 seconds;
  - core project story to 2 minutes;
  - feed-handler design opening to 3 minutes.

---

## Resource references by topic

### Behavioral
- `content/mock-interviews/recruiter-screen-01.md`
- `content/mock-interviews/optiver-behavioral-45min.md`
- `content/mock-interviews/optiver-behavioral-60min.md`

### C++
- `content/cpp/modern-cpp.md`
- `content/cpp/memory-and-pointers.md`
- `content/cpp/object-lifetime.md`
- `content/cpp/templates-and-concepts.md`
- `content/cpp/value-categories.md`
- `content/mock-interviews/senior-cpp-60min.md`

### Systems and design
- `content/mock-interviews/system-design-60min.md`
- `research/company-evidence-matrix.md`
- `research/sources.md`

### Integration
- `content/mock-interviews/full-loop-simulation.md`
- `content/study-plans/interview-day-checklist.md`

---

## Progress checkpoints

### Day 7 checkpoint
- I have a credible HFT motivation story.
- My background answer sounds sharp.
- My core stories have numbers.

### Day 14 checkpoint
- I can discuss ownership, lifetime, allocators, and atomics with confidence.
- I know where my C++ depth still feels weak.

### Day 21 checkpoint
- I can explain a feed handler with sequencing and recovery.
- I understand why correctness and latency are both first-class.

### Day 30 checkpoint
- I can finish a mock loop without major degradation in clarity or confidence.

---

## CANDIDATE_TODO personalization list

Before interviews, complete these:

- map every behavioral story to a real Deutsche Bank example;
- identify one credible market-data or low-latency adjacent story from your background;
- prepare one answer for “what will be hardest about moving into HFT?”;
- prepare one answer for “what strengths from banking transfer directly?”;
- write down your three weakest technical topics and revisit them twice.

A well-executed 30-day plan should leave you not merely “prepared,” but **coherent**: your recruiter, behavioral, technical, and design answers should all describe the same high-upside engineer.
