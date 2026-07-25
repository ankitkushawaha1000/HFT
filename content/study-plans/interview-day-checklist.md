# Interview Day Checklist

**Purpose:** Reduce avoidable mistakes on interview day and preserve decision quality across multiple rounds.  
**Audience:** Senior C++ engineer interviewing with Optiver or similar HFT firms.  
**Use this the day before and on the day itself.**

---

## Night before

### Logistics checklist

- [ ] Confirm the interview schedule, time zone, and interviewer sequence.
- [ ] Check the meeting links and calendar invites.
- [ ] Verify laptop power, charger, headphones, microphone, and camera.
- [ ] Confirm coding environment if a live coding round is expected.
- [ ] Prepare a notebook, pen, water, and quiet backup space.
- [ ] If remote, test internet stability and have a hotspot fallback if available.

### Preparation checklist

- [ ] Read your 90-second background answer once.
- [ ] Read your why-HFT / why-this-firm answer once.
- [ ] Review your six core behavioral stories.
- [ ] Review the top three C++ topics most likely to come up:
  - ownership / lifetime;
  - concurrency / atomics;
  - memory / allocator tradeoffs.
- [ ] Review the opening structure for the feed-handler system design.

### Mental checklist

- [ ] Decide what three traits you want interviewers to remember: e.g. calm, precise, high-ownership.
- [ ] Accept that you do not need to know everything.
- [ ] Commit to saying “Here’s how I’d reason about it” instead of bluffing.

### What not to do the night before

- Do not cram five new topics.
- Do not do a full loop practice late at night.
- Do not stay up rewriting every answer.
- Do not review anonymous interview reports obsessively.

### Best end-of-night routine

Spend 20-30 minutes on a light final review, then stop. Sleep is part of interview preparation, especially for multi-round HFT interviews where judgment and working memory matter.

---

## Morning of the interview

### Physical setup

- [ ] Wake up early enough that you are fully alert before the first round.
- [ ] Eat something stable and familiar.
- [ ] Hydrate, but avoid overdoing caffeine if it makes you jittery.
- [ ] Dress one level more polished than your daily work setup.

### Technical setup

- [ ] Reboot the machine if helpful.
- [ ] Close distracting apps and browser tabs.
- [ ] Open only what you need: calendar, meeting link, notebook, and coding environment if relevant.
- [ ] Silence phone notifications, but keep emergency access available.

### Mental preparation

Before the day starts, remind yourself:

- my job is to think clearly, not perform perfection;
- good interviewers care how I reason under uncertainty;
- I can be honest about domain gaps while showing strong systems instincts.

---

## One hour before

### Final review points

Spend no more than 30-40 minutes on this review.

**Behavioral**
- background answer;
- why HFT / why this firm;
- one ownership story;
- one conflict story;
- one failure/growth story.

**Technical**
- `shared_ptr` tradeoffs;
- acquire/release intuition for SPSC queue;
- allocator / pool / reuse ideas for hot paths;
- value categories and move semantics.

**System design**
- clarification questions for feed handler;
- high-level architecture;
- gap detection and recovery flow;
- strong candidate questions at the end.

### 10-minute priming routine

- Take a short walk or stand away from the screen.
- Do a breathing reset.
- Remind yourself to pause before answering.
- Decide to speak in structure: context, problem, decision, result.

---

## During the interview

### Universal reminders

- Start answers slightly slower than feels natural.
- Clarify ambiguous questions before diving in.
- Think aloud, but do not ramble.
- If you are unsure, state assumptions and continue.
- Prefer specific examples over abstract claims.

### Behavioral framework reminders

For story questions, hit these in order:
1. context;
2. problem;
3. your role;
4. tradeoff or key decision;
5. outcome;
6. reflection.

If pushed with “tell me more,” add:
- what made it difficult;
- what you missed at the time;
- what you would do differently now.

### Technical interview reminders

- Define terms precisely.
- Distinguish correctness from optimization.
- Mention measurement when discussing performance.
- Avoid folklore explanations like “x86 makes it fine.”
- In coding, keep the solution simple and executable.

### System design reminders

- Ask requirements questions first.
- Separate hot path from recovery/observability concerns, but cover both.
- Explicitly discuss degraded modes.
- Name tradeoffs and invariants.
- End with metrics and failure handling.

### If you get stuck

Use one of these resets:
- “Let me state my assumptions first.”
- “I’d like to break this into correctness and performance.”
- “I’m not certain of the exact detail, but here is how I’d reason about it.”
- “For a first version, I’d keep it simple and then improve it in these ways.”

These statements preserve credibility better than bluffing or freezing.

---

## After each interview

### Capture notes immediately (2-3 minutes)

Write down:
- questions asked;
- where you hesitated;
- one answer that landed well;
- one detail to keep consistent later in the day;
- one topic to revisit if another interviewer touches it.

### Emotional rule

Do not overreact to one rough moment. Many strong candidates think they failed a round they actually passed. Your task is to reset cleanly for the next conversation.

### Short recovery protocol

- stand up;
- breathe;
- sip water;
- write three bullets only;
- move on.

---

## End of day debrief

### Part 1 — factual recall

Write down every question you can remember, grouped by round:
- recruiter;
- behavioral;
- C++ technical;
- system design.

### Part 2 — signal review

Rate yourself 1-5 on:
- clarity;
- ownership;
- technical precision;
- design structure;
- composure;
- consistency.

### Part 3 — hiring-committee simulation

Ask:
- What would the recruiter say about my motivation and communication?
- What would the hiring manager say about my ownership and growth?
- What would the technical interviewer say about my C++ depth?
- What would the design interviewer say about my systems judgment?

### Part 4 — decision note to yourself

Write one paragraph answering:

> If I were deciding on me today, what would make me hesitate, and what would make me want to hire me anyway?

That exercise is often more useful than replaying every answer.

---

## Following up

### Thank-you note guidance

If the process or recruiter relationship makes it appropriate, send a short follow-up note within 24 hours.

Good note structure:
- appreciation for time;
- one specific point you enjoyed discussing;
- concise reaffirmation of interest;
- offer to provide any follow-up details.

**Example**

> Thanks again for the conversation today. I enjoyed discussing the role and learning more about how the team thinks about engineering ownership and performance-sensitive systems. The process reinforced my interest in the opportunity, and I’d be happy to provide any additional information that would be helpful.

### Additional materials

If you are asked to send anything else, keep it clean and relevant:
- updated resume if necessary;
- scheduling availability;
- concise clarification of a point raised in interview only if requested.

Do not send long unsolicited essays correcting your own answers.

---

## Final reminders for HFT interview days

1. **Precision beats volume.** A clean 90-second answer usually beats a messy 4-minute answer.
2. **Correctness beats swagger.** Especially in C++ and systems discussions.
3. **Curiosity beats posturing.** It is okay to be strong and still learning.
4. **Consistency matters.** Your recruiter, behavioral, technical, and design rounds should all describe the same person.
5. **Energy management is part of performance.** Break discipline matters.

---

## CANDIDATE_TODO personal interview-day list

Fill this in before your actual interview:

- My one-sentence professional identity: `CANDIDATE_TODO`
- My strongest ownership story: `CANDIDATE_TODO`
- My strongest technical project: `CANDIDATE_TODO`
- My honest HFT transition gap: `CANDIDATE_TODO`
- My best reason I will ramp quickly: `CANDIDATE_TODO`
- My three end-of-interview questions: `CANDIDATE_TODO`

Interview days go best when they feel familiar. Use this checklist until your setup, narrative, and reset process are automatic.
