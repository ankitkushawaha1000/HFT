# 14-Day Balanced Plan

**Audience:** Senior C++ engineer preparing for Optiver and similar HFT firms with roughly two weeks before first serious interviews.  
**Daily commitment:** 2-3 hours on weekdays, 3-4 hours on weekends if available.  
**Goal:** Build balanced readiness across behavioral, C++, systems, design, and mock execution without burning out.

---

## Plan philosophy

Two weeks is enough time to do more than triage, but not enough time to wander. This plan deliberately alternates between **content acquisition**, **active recall**, and **simulation**. The idea is to avoid the common failure mode of reading a lot and performing poorly anyway because nothing was practiced out loud.

The plan is split into:

- **Week 1:** behavioral mastery + core C++;
- **Week 2:** systems, design, and integrated mock interviews.

Use one tracker for three items each day:
- what you studied;
- what you could explain without notes;
- what still feels weak.

---

## Week 1 milestone

By the end of Day 7 you should be able to:

- deliver a 90-second background answer confidently;
- tell 5-6 behavioral stories with numbers and lessons;
- explain ownership, memory, object lifetime, and move semantics without notes;
- answer a basic concurrency or allocator question without panicking.

## Week 2 milestone

By the end of Day 14 you should be able to:

- run a full behavioral round and stay specific under follow-up pressure;
- complete a credible 60-minute C++ technical simulation;
- walk through a market-data feed handler design clearly;
- finish a full loop simulation with stable energy.

---

## Day-by-day plan

### Day 1 — Background narrative and recruiter readiness (2-3 hours)
- Read `content/mock-interviews/recruiter-screen-01.md`.
- Draft your background, why-now, why-HFT, and why-Optiver answers.
- Record one full recruiter screen or practice with a friend.
- Outcome: one polished background answer and one clear HFT motivation answer.

### Day 2 — Story bank construction (2.5-3 hours)
- Read `content/mock-interviews/optiver-behavioral-45min.md`.
- Build six stories: ownership, conflict, feedback, pressure, failure, technical improvement.
- For each story, add one metric and one reflection sentence.
- Outcome: six reusable stories with specific stakes.

### Day 3 — Deeper behavioral probes (2-3 hours)
- Read `content/mock-interviews/optiver-behavioral-60min.md`.
- Practice the harder follow-ups: “tell me more,” “what did you miss,” and “what would you do differently?”
- Rewrite any story that collapses under probing.
- Outcome: fewer but stronger stories.

### Day 4 — Modern C++ fundamentals (2-3 hours)
- Read `content/cpp/modern-cpp.md` and `content/cpp/value-categories.md`.
- Practice explaining RAII, move semantics, `noexcept`, value categories, structured bindings, and concepts.
- Outcome: sharper language-level explanations.

### Day 5 — Memory and lifetime (2-3 hours)
- Read `content/cpp/memory-and-pointers.md` and `content/cpp/object-lifetime.md`.
- Practice answering:
  - when heap allocation is dangerous in hot paths;
  - how dangling references appear in real code;
  - why `shared_ptr` is often the wrong default.
- Outcome: strong ownership and lifetime reasoning.

### Day 6 — Templates and generic design (2-3 hours)
- Read `content/cpp/templates-and-concepts.md`.
- Explain concepts versus SFINAE, compile-time constraints, and when runtime polymorphism is cleaner.
- If you struggle here, do not chase advanced metaprogramming tricks; focus on readable constraints and design judgment.
- Outcome: credible template discussion without overfitting to trivia.

### Day 7 — Week 1 review + mini mock (3-4 hours)
- Run a 30-minute recruiter screen.
- Run a 30-minute behavioral mini round.
- Run a 30-minute technical oral drill from `content/mock-interviews/senior-cpp-60min.md` warm-up + one core question.
- Outcome: identify top 3 weaknesses before Week 2.

---

## Week 2 — Systems, design, and mock integration

### Day 8 — Systems foundations (2-3 hours)
- Connect the C++ material to systems concerns: cache locality, allocator behavior, threading, and OS effects.
- Use `content/mock-interviews/senior-cpp-60min.md` concurrency section as a bridge.
- Outcome: better answers to “why does this matter in production?”

### Day 9 — HFT and low-latency mental model (2-3 hours)
- Read `research/research-methodology.md` and `research/company-evidence-matrix.md`.
- Build a one-page note on what top firms likely emphasize: speed, correctness, ownership, and directness.
- Outcome: credible firm-specific calibration.

### Day 10 — System design fundamentals (2-3 hours)
- Read `content/mock-interviews/system-design-60min.md`.
- Practice only the first 15 minutes: clarification + high-level design.
- Outcome: strong opening structure.

### Day 11 — Deep dive: gap detection and recovery (2-3 hours)
- Re-run the feed-handler design focusing on parsing, sequencing, gap detection, and recovery.
- Practice drawing the recovery state machine from memory.
- Outcome: you can explain why correctness and degraded modes matter.

### Day 12 — Senior C++ technical rehearsal (2.5-3 hours)
- Run `content/mock-interviews/senior-cpp-60min.md` in full if possible.
- Focus especially on allocator strategy, atomics, and the ring buffer coding task.
- Outcome: one full technical run with notes on weak spots.

### Day 13 — Behavioral + design integration (2-3 hours)
- Re-run the deepest behavioral questions and one full system design answer.
- Practice transitioning smoothly from “my background” into “how I think.”
- Outcome: more coherent interviewer impression across round types.

### Day 14 — Full loop simulation + decision review (3-4 hours)
- Run `content/mock-interviews/full-loop-simulation.md`.
- Score yourself using the rubrics in each mock file.
- Decide whether you are ready to apply immediately or need another week of focused iteration.

---

## Weekly milestone checks

### End of Week 1 checklist

- [ ] I can explain why I am moving from banking to HFT without sounding generic.
- [ ] I have at least five behavioral stories with real stakes and real outcomes.
- [ ] I can explain move semantics, ownership, and object lifetime without notes.
- [ ] I know which technical area is currently my weakest.

### End of Week 2 checklist

- [ ] I can handle direct behavioral follow-ups without losing specificity.
- [ ] I can discuss acquire/release ordering in an SPSC queue at a competent level.
- [ ] I can design a market-data feed handler with gap detection and recovery.
- [ ] I have practiced a full interview day with timing.

---

## Adjustments based on interview timeline

### If interviews are sooner than 14 days
- Replace Days 8-14 with the compressed schedule in `content/study-plans/7-day-emergency-plan.md`.
- Prioritize mock performance over additional reading.

### If interviews are slightly later than 14 days
- Repeat Days 10-14 once with better answers.
- Add one extra mock technical round and one extra design round.

### If one area is clearly weaker than the rest
- Reallocate 30-45 minutes per day from a strength area into that weak area.
- Common example: if behavioral is strong but atomics are weak, spend more time on `content/mock-interviews/senior-cpp-60min.md` and less on recruiter polish.

---

## Recommended daily operating rules

1. **Always end with active recall.** Do not finish a session by reading; finish by speaking or writing from memory.
2. **Keep answers concrete.** Every story should survive the question, “What exactly did you do?”
3. **Do not try to sound like a trader.** Sound like a strong engineer who understands why trading systems demand precision.
4. **Use file references deliberately.** Revisit the same core documents instead of constantly adding new materials:
   - `content/mock-interviews/recruiter-screen-01.md`
   - `content/mock-interviews/optiver-behavioral-45min.md`
   - `content/mock-interviews/optiver-behavioral-60min.md`
   - `content/mock-interviews/senior-cpp-60min.md`
   - `content/mock-interviews/system-design-60min.md`
   - `content/cpp/*.md`
5. **Track repeated failures.** If the same answer is weak twice, rewrite it.

---

## CANDIDATE_TODO personalization list

Before you call this plan complete, fill in all of the following:

- your exact Deutsche Bank team or scope description;
- two real production incidents;
- one real performance or scalability improvement;
- one example of difficult feedback you actually received;
- one honest sentence on what will be hardest in moving to HFT;
- one sentence on why you are still confident you can ramp quickly.

A strong 14-day preparation cycle will not make you omniscient. It will make you **reliably interviewable**, which is the actual objective.
