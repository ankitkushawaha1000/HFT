# 7-Day Emergency Study Plan

**Audience:** Senior C++ engineer at Deutsche Bank with 3 years of experience, facing an Optiver or similar HFT interview in about one week.  
**Time commitment:** 4-6 focused hours per day.  
**Goal:** Maximize interview performance quickly by focusing on the highest-yield gaps: behavioral precision, C++ depth, systems intuition, low-latency reasoning, and interview stamina.

---

## How to use this plan

This is not a “learn everything” schedule. It is a **triage plan**. Your objective is to get interview-ready fast enough that your strongest capabilities show up consistently. That means:

- prioritizing stories and explanations you can actually deliver under pressure;
- targeting the topics that show up repeatedly in HFT interviews;
- simulating the format, not just reading notes;
- converting weak areas into “safe enough” areas rather than trying to become an expert in seven days.

Keep one notebook or document open throughout the week and record every `CANDIDATE_TODO` you resolve.

---

## Day 1 — Optiver behavioral prep + story bank (4.5-5.5 hours)

### Primary objective
Build a believable, specific behavioral narrative that explains who you are, what you have owned, and why HFT is the right next step.

### Study blocks

**Block 1 — 45 min: calibrate your narrative**
- Read `README.md` sections on repository usage and personalization.
- Read `content/mock-interviews/recruiter-screen-01.md`.
- Write draft answers for:
  - walk me through your background;
  - why HFT;
  - why now;
  - why Optiver.

**Block 2 — 90 min: build a 6-story bank**
Prepare one story for each of the following:
- ownership under ambiguity;
- conflict with a strong stakeholder;
- production incident under pressure;
- difficult feedback and growth;
- technical improvement or performance win;
- mistake and recovery.

For each story, write:
- context;
- problem;
- your specific role;
- decision/tradeoff;
- outcome;
- lesson.

**Block 3 — 60 min: Optiver-style behavioral practice**
- Read `content/mock-interviews/optiver-behavioral-45min.md`.
- Practice answering Questions 1-3 aloud.
- Record yourself if possible.

**Block 4 — 60 min: deeper probing**
- Read `content/mock-interviews/optiver-behavioral-60min.md`.
- For each of your six stories, answer:
  - what would you do differently?
  - what did you miss at the time?
  - what tradeoff did you make?
  - how do you know the result mattered?

**Block 5 — 30-45 min: recruiter close-out**
- Create your final 90-second background answer.
- Create your final 90-second “why HFT / why Optiver” answer.

### Exercises

- Speak each core answer without notes twice.
- Reduce one story from 3 minutes to 90 seconds.
- Add one real metric to at least three stories.

### CANDIDATE_TODO
- Replace all generic project references with real Deutsche Bank system names or anonymized descriptions.
- Add numbers: latency improvement, incident reduction, throughput, team size, scope, or business criticality.

---

## Day 2 — Core C++ review (5-6 hours)

### Primary objective
Sharpen the C++ topics most likely to show up early and repeatedly.

### Study blocks

**Block 1 — 75 min: modern C++ refresh**
- Read `content/cpp/modern-cpp.md`.
- Summarize in your own words:
  - RAII;
  - move semantics;
  - smart pointers;
  - `constexpr` / `consteval`;
  - concepts.

**Block 2 — 75 min: memory and ownership**
- Read `content/cpp/memory-and-pointers.md`.
- Practice explaining:
  - stack vs heap;
  - `new/delete` vs `malloc/free`;
  - `unique_ptr` vs `shared_ptr`;
  - alignment, padding, and allocator cost.

**Block 3 — 60 min: object lifetime**
- Read `content/cpp/object-lifetime.md`.
- Focus on temporary lifetime, destructor timing, and dangling references.

**Block 4 — 60 min: value categories**
- Read `content/cpp/value-categories.md`.
- Practice two whiteboard explanations:
  - why `std::move` does not move by itself;
  - when copy elision makes moves irrelevant.

**Block 5 — 60 min: templates and concepts**
- Read `content/cpp/templates-and-concepts.md`.
- Practice explaining SFINAE versus concepts and when generic code becomes over-engineered.

**Block 6 — 30-45 min: quick oral exam**
Use `content/mock-interviews/senior-cpp-60min.md` warm-up questions and answer aloud.

### Exercises

- Write a one-page cheat sheet from memory after finishing the readings.
- Explain `shared_ptr` overhead and allocator tradeoffs in under 2 minutes.
- Explain lvalue/xvalue/prvalue without reading notes.

### CANDIDATE_TODO
- Mark any topic where you still rely on memorized phrases instead of actual understanding.

---

## Day 3 — Systems crash course (4.5-5.5 hours)

### Primary objective
Patch the most obvious systems gaps that often hurt otherwise strong C++ candidates.

### Focus topics
- processes vs threads;
- virtual memory basics;
- caches, locality, TLB, page faults;
- TCP vs UDP in trading contexts;
- kernel/user boundary;
- epoll/reactor patterns;
- latency versus throughput.

### Study blocks

**Block 1 — 60 min: memory and OS mental model**
Using the memory-related C++ files, connect language-level choices to OS effects: heap allocation, page faults, cache behavior, and contention.

**Block 2 — 90 min: feed-handler system walk-through**
- Read `content/mock-interviews/system-design-60min.md`.
- Write down every systems concept embedded in the design: network ingress, parsing, sequencing, gap detection, recovery, fan-out, metrics.

**Block 3 — 60 min: concurrency bridge**
- Re-read the concurrency/atomics section of `content/mock-interviews/senior-cpp-60min.md`.
- Practice explaining acquire/release and false sharing.

**Block 4 — 60 min: verbal systems drill**
Answer aloud:
- Why can heap allocation hurt tail latency?
- Why is silent packet loss dangerous for market data?
- What is the difference between a slow system and an untrustworthy system?

**Block 5 — 30-45 min: incident-to-systems translation**
Take one real production issue from your background and explain it in systems terms rather than project-management terms.

### CANDIDATE_TODO
- Note which operating-systems topics still feel hand-wavy and schedule 20-minute refreshes on Days 6-7.

---

## Day 4 — Low-latency and HFT specifics (4.5-5.5 hours)

### Primary objective
Develop credible HFT-flavored intuition even if your past role was not pure low-latency trading.

### Topics to cover
- market data feed handlers;
- sequencing and gap detection;
- book building basics;
- jitter, p99, p999, and tail latency;
- lock contention, cache-line bouncing, allocator variance;
- why correctness and recovery matter as much as speed.

### Study blocks

**Block 1 — 90 min: market data architecture**
- Deep-read `content/mock-interviews/system-design-60min.md`.
- Draw the architecture from memory.

**Block 2 — 60 min: research calibration**
- Read `research/research-methodology.md`.
- Read `research/company-evidence-matrix.md`.
- Note what is confirmed versus inferred about company expectations.

**Block 3 — 60 min: technical story upgrade**
Take one project from banking and retell it using HFT-relevant vocabulary where truthful: latency budget, failure domain, recovery path, observability, allocation cost, concurrency, correctness.

**Block 4 — 45 min: targeted motivation prep**
Use `research/sources.md` to strengthen firm-specific motivation for Optiver, HRT, Citadel Securities, Two Sigma, Jane Street, and Jump.

**Block 5 — 30-45 min: whiteboard tradeoffs**
Practice answering:
- speed versus correctness;
- preallocation versus flexibility;
- centralized book building versus downstream reconstruction.

### CANDIDATE_TODO
- Prepare one sentence on what you still need to learn about market microstructure, and one sentence on why that does not prevent you from contributing quickly.

---

## Day 5 — System design practice (5-6 hours)

### Primary objective
Become capable of giving one strong HFT-oriented system design answer.

### Study blocks

**Block 1 — 45 min: opening and clarification**
- Practice the first 5 minutes of `content/mock-interviews/system-design-60min.md` until it feels natural.

**Block 2 — 90 min: full design round**
- Run the whole interview once aloud, ideally with a partner.

**Block 3 — 60 min: postmortem**
- Compare your answer against the “Strong vs weak answer comparison” section.
- Identify gaps in your discussion of recovery and observability.

**Block 4 — 60 min: order-book extension**
Even though the core problem is a feed handler, extend your answer verbally into:
- derived top-of-book publication;
- raw vs normalized event paths;
- stale-book handling during recovery.

**Block 5 — 45-60 min: candidate questions and close**
Prepare strong end-of-round questions for design interviewers.

### Exercises

- Draw the design three times from memory.
- Explain the recovery state machine in under 2 minutes.
- List five metrics you would expose in production.

---

## Day 6 — Mock interview full loop (4-5 hours)

### Primary objective
Stress-test your preparation under fatigue.

### Assignment
Run `content/mock-interviews/full-loop-simulation.md` as written.

### Required components
- recruiter screen;
- deeper behavioral round;
- senior C++ round;
- system design round.

### Debrief focus
After the loop, score yourself on:
- clarity;
- consistency;
- confidence without bluffing;
- technical precision;
- pacing.

### CANDIDATE_TODO
- Identify the two answers that degraded most from fatigue.
- Rewrite only those two; do not try to rewrite everything.

---

## Day 7 — Review weak areas + interview day prep (4-5 hours)

### Primary objective
Consolidate, don’t cram.

### Study blocks

**Block 1 — 90 min: weak-area repair**
Review the two weakest areas identified on Day 6.

**Block 2 — 60 min: final behavioral pass**
- Re-run your background answer.
- Re-run one ownership story, one conflict story, and one failure story.

**Block 3 — 60 min: final technical pass**
- Re-answer the allocator, atomics, and template questions from `content/mock-interviews/senior-cpp-60min.md`.

**Block 4 — 45 min: interview-day checklist**
- Read `content/study-plans/interview-day-checklist.md`.
- Prepare logistics, attire, water, setup, notebook, and recovery plan.

**Block 5 — 30-45 min: stop early**
Do not study until exhaustion. End the day with confidence, not panic.

---

## Final emergency-plan rules

1. **Prefer depth over breadth.** One strong story beats four weak ones. One strong design answer beats three half-learned architectures.
2. **Do not bluff on market structure.** Be honest about the gap and strong on the systems reasoning you do have.
3. **Quantify everything you can.** Recruiters, hiring managers, and technical interviewers all trust numbers more than adjectives.
4. **Practice aloud every day.** Silent reading creates false confidence.
5. **Finish with rest.** The last 10% of prep is energy management, not information acquisition.

If you follow this seven-day plan well, your goal is not perfection. Your goal is to present as a **high-upside, technically credible engineer with strong ownership and fast learning velocity**.
