# 60-Day Mastery Plan

**Audience:** Senior C++ engineer targeting Optiver, Citadel Securities, HRT, Two Sigma, Jane Street, Jump Trading, and similar firms with roughly two months to prepare.  
**Time commitment:** 8-12 hours per week, with one deliberate mock or coding block every weekend.  
**Goal:** Build durable mastery rather than short-term interview survival.

---

## Plan overview

This 60-day plan is designed for candidates who want to move beyond emergency preparation and actually raise their ceiling. In two months, you can develop:

- a strong, evidence-based behavioral narrative;
- deeper command of C++ ownership, lifetime, performance, and concurrency;
- a better systems and low-latency mental model;
- improved fluency on HFT-flavored design problems;
- repeatable mock-interview performance.

The plan is organized into two months:

- **Month 1 — Foundation:** behavioral, core C++, systems grounding;
- **Month 2 — Advanced:** low-latency design, HFT-specific reasoning, mock execution, and weak-area repair.

---

## Month 1 — Foundation

### Week 1 — Baseline, narrative, and recruiter readiness

**Objectives**
- Establish your starting point.
- Build a believable transition narrative from banking to HFT.
- Remove generic recruiter answers.

**Tasks**
- Read `content/mock-interviews/recruiter-screen-01.md`.
- Record baseline answers for background, why-now, why-HFT, and why-this-firm.
- Build a tracker for recurring weak spots.
- Start a six-story behavioral bank.

**Deep-dive exercise**
Write two versions of your background answer:
- a 90-second recruiter version;
- a 2-minute hiring-manager version.

**Assessment milestone**
By the end of the week, your story should sound intentional rather than opportunistic.

### Week 2 — Behavioral mastery and Optiver-style probing

**Objectives**
- Turn broad stories into strong interview assets.
- Improve follow-up resilience.

**Tasks**
- Read `content/mock-interviews/optiver-behavioral-45min.md` and `content/mock-interviews/optiver-behavioral-60min.md`.
- Finalize stories for ownership, conflict, feedback, failure, pressure, and technical initiative.
- Practice with “tell me more,” “what did you miss,” and “what would you do differently?”

**Deep-dive exercise**
For each story, write three lines:
- what made it difficult;
- what tradeoff you made;
- what changed afterward.

**Assessment milestone**
At least four stories should survive deep follow-up without collapsing into vagueness.

### Week 3 — Core C++ foundations

**Objectives**
- Tighten your command of modern C++ fundamentals.
- Build precision on ownership and lifetime.

**Tasks**
- Read `content/cpp/modern-cpp.md`.
- Read `content/cpp/value-categories.md`.
- Read `content/cpp/memory-and-pointers.md`.
- Read `content/cpp/object-lifetime.md`.

**Deep-dive exercise**
Create a personal cheat sheet covering:
- RAII;
- move semantics;
- value categories;
- `shared_ptr` cost model;
- dangling-reference failure modes.

**Assessment milestone**
You should be able to answer warm-up C++ questions without relying on buzzwords.

### Week 4 — Templates, systems grounding, and first technical mock

**Objectives**
- Get comfortable with generic programming discussion.
- Start linking language decisions to systems effects.

**Tasks**
- Read `content/cpp/templates-and-concepts.md`.
- Revisit allocator, alignment, and locality topics.
- Run the warm-up plus one core question from `content/mock-interviews/senior-cpp-60min.md`.

**Deep-dive exercise**
Explain aloud:
- concepts vs SFINAE;
- why allocator behavior matters to p99 latency;
- why x86 experience is not a substitute for memory-model reasoning.

**Assessment milestone**
You should know exactly which technical area is weakest: atomics, templates, allocators, or systems.

---

## Month 2 — Advanced

### Week 5 — Low-latency and HFT systems

**Objectives**
- Build vocabulary and reasoning for trading-system environments.
- Translate your experience into HFT-relevant language without exaggeration.

**Tasks**
- Read `research/research-methodology.md`.
- Read `research/sources.md` selectively for company context.
- Read `research/company-evidence-matrix.md`.
- Read `content/mock-interviews/system-design-60min.md`.

**Deep-dive exercise**
Take one real system from your background and answer:
- where was the latency sensitivity?
- where was correctness more important than latency?
- what was the recovery model?

**Assessment milestone**
You should be able to explain why HFT firms care about correctness, recovery, and tail latency together.

### Week 6 — Advanced C++ and coding execution

**Objectives**
- Strengthen atomics, queue design, allocator strategy, and coding fluency.

**Tasks**
- Re-run the concurrency and allocator sections of `content/mock-interviews/senior-cpp-60min.md`.
- Practice the lock-free ring buffer twice this week.
- Review false sharing, acquire/release, and SPSC queue invariants.

**Code example completion schedule**
- Session 1: ring buffer outline and invariants
- Session 2: implement `push` / `pop`
- Session 3: add commentary on memory ordering choices
- Session 4: explain how to extend to non-trivial types or different producer/consumer models

**Assessment milestone**
You should be able to implement and explain the simple ring buffer in 15 minutes.

### Week 7 — System design and architecture depth

**Objectives**
- Make one HFT system design answer genuinely strong.

**Tasks**
- Run the full feed-handler design twice.
- Once focus on structure and clarity.
- Once focus on gap detection, replay, and recovery.
- Add discussion of observability, degraded modes, and downstream signaling.

**Deep-dive exercise**
Practice three alternative design choices:
- centralized book building vs downstream reconstruction;
- one-thread-per-venue vs shared event loop;
- eager normalization vs raw-message distribution with adapters.

**Assessment milestone**
A listener should come away believing you can reason about production trading systems, even if you are not yet a domain veteran.

### Week 8 — Full integration and interview readiness

**Objectives**
- Convert knowledge into repeatable performance.
- Simulate decision-making under fatigue.

**Tasks**
- Run `content/mock-interviews/full-loop-simulation.md` once early in the week.
- Run a second, lighter full or partial loop at the end of the week.
- Review `content/study-plans/interview-day-checklist.md`.
- Create a final one-page interview summary for yourself.

**Assessment milestone**
You should be able to complete a full day of interviews with stable clarity and confidence.

---

## Mock interview cadence

Use this rhythm throughout the 60 days:

- **Week 1:** one recruiter-style mock
- **Week 2:** one behavioral mock
- **Week 3:** one technical oral drill
- **Week 4:** one partial technical mock
- **Week 5:** one system-design opening drill
- **Week 6:** one full senior C++ mock
- **Week 7:** one full system-design mock
- **Week 8:** one or two full loop simulations

The purpose is to avoid long periods of passive study without performance testing.

---

## Deep dive exercise library

Use these when you have extra time or when a weak area needs reinforcement.

### Behavioral exercises
- Rewrite one story from “team effort” language into “my decision and why it mattered.”
- Practice answering the same story in 60 seconds, 90 seconds, and 3 minutes.

### C++ exercises
- Explain `std::move`, copy elision, and moved-from states to a peer.
- Compare pool allocators, arenas, and `pmr` for a bursty market-data workload.
- Draw the memory-ordering flow for an SPSC queue.

### Systems exercises
- Write the invariants for a feed-handler recovery state machine.
- List the top five sources of latency variance in a real-time data pipeline.
- Explain how bad data propagates differently from slow data.

### Design exercises
- Redesign the feed handler for easier extensibility instead of lowest latency.
- Add active-active feed redundancy to your architecture.
- Explain which metrics would page you and which would only feed dashboards.

---

## Assessment milestones

### Day 15
- strong recruiter pitch;
- six behavioral stories drafted;
- first honest view of major gaps.

### Day 30
- good C++ baseline across ownership, lifetime, templates, and memory topics;
- one completed partial technical mock.

### Day 45
- strong understanding of HFT interview expectations by company;
- one credible feed-handler system design answer.

### Day 60
- full-loop readiness;
- clear plan for firm-specific tailoring;
- stable performance under mock conditions.

---

## CANDIDATE_TODO personalization list

To get full value from the 60-day plan, explicitly fill in:

- your best ownership story from Deutsche Bank;
- your best production incident story;
- your strongest technical improvement story;
- one honest weakness for the HFT transition;
- one concrete action you are taking to close that gap;
- your top three firm preferences and why each differs.

---

## Final advice

A 60-day plan should not merely make you better at interviews. It should make you better at **thinking like the engineer these firms want to hire**: precise, curious, calm under pressure, skeptical of hand-waving, and motivated by hard systems problems. If that identity becomes real, the interviews get much easier.
