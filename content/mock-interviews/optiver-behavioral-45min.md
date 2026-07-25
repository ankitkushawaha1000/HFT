# Optiver Behavioral Interview Simulation (45 Minutes)

**Target candidate:** Senior C++ engineer at Deutsche Bank, 3 years of experience  
**Style:** Fast, direct, high-signal conversation typical of a firm that values ownership, learning speed, and low-ego collaboration.  
**How to use it:** Run with a partner or read the interviewer lines aloud. Spend roughly 6-8 minutes per question including follow-ups.

---

## Interview objective

This interview is not a generic “tell me about yourself” round. It is designed to test whether you would operate well in an environment that is:

- highly feedback-driven;
- intellectually demanding;
- collaborative but direct;
- sensitive to quality, speed, and decision-making under pressure.

The interviewer is looking for evidence that you:

- own outcomes instead of narrating effort;
- learn quickly from mistakes;
- communicate clearly when stakes are high;
- can work with smart, opinionated people without getting defensive;
- are motivated by the actual work, not only by prestige.

---

## Full interviewer opening script

> Thanks for joining. This conversation will be fairly straightforward. I’d like to understand how you’ve handled real situations at work: ownership, collaboration, tradeoffs, setbacks, and how you learn. I may interrupt or drill into details if something sounds interesting or unclear. That’s not meant to be adversarial; it’s just how we try to get signal quickly. Let’s start with a short introduction from you.

**Candidate response target:** 60-90 seconds only.

---

## Time budget

- 0:00-3:00 — Intro and candidate summary
- 3:00-11:00 — Question 1
- 11:00-19:00 — Question 2
- 19:00-27:00 — Question 3
- 27:00-35:00 — Question 4
- 35:00-43:00 — Question 5
- 43:00-45:00 — Candidate questions and close

---

## Question 1 — Ownership under ambiguity (8 minutes)

**Interviewer script**

> Tell me about a time you took ownership of something important that was not neatly defined for you.

**Typical follow-ups**

- How did you know the problem was worth solving?
- What part was actually your responsibility, and what part did you choose to own?
- What tradeoffs did you make?
- How did you know you were done?

**What Optiver-style interviewers are evaluating**

- Whether you step into ambiguity or wait for permission
- Whether you can scope a problem before solving it
- Whether you tie engineering work to impact
- Whether you know the difference between activity and ownership

**Strong answer shape**

1. Start with context in 2-3 sentences.
2. Name the ambiguity explicitly.
3. Explain what you decided to own.
4. Show how you structured the work.
5. End with result and lesson.

**Strong answer example**

> A good example was a recurring performance and stability issue in a service that sat on an important internal workflow. The problem was real, but ownership was blurry because the symptoms crossed application, infrastructure, and operational boundaries. Instead of treating it as “someone else’s system,” I took responsibility for framing the investigation: what failure modes we were seeing, what data we were missing, and what short-term containment versus longer-term fixes looked like. I aligned with the adjacent team, instrumented the path that mattered, and narrowed the issue from broad complaints to a specific bottleneck. That let us ship a targeted fix rather than a broad rewrite.  
> **CANDIDATE_TODO:** Replace with your real case and quantify the business or operational improvement.

**Transition line**

> Thanks. Let’s stay on the theme of ownership, but look at how you operate with other people.

---

## Question 2 — Working with strong opinions (8 minutes)

**Interviewer script**

> Tell me about a disagreement with a teammate or stakeholder where both sides had a reasonable point of view.

**Typical follow-ups**

- Why did they disagree with you?
- How did you keep the discussion productive?
- Did you change your mind at any point?
- What happened after the decision?

**Evaluation criteria**

- Low-ego reasoning
- Ability to separate ideas from identity
- Comfort with direct debate
- Ability to drive resolution, not endless discussion

**Strong answer example**

> I try to distinguish between “I want to be right” and “we need the best decision.” In one case, I disagreed with the proposed approach because I thought it optimized for speed of delivery but increased operational risk in a path that already lacked good observability. The other engineer was reasonably focused on time pressure. I made the tradeoff visible rather than treating it as a preference debate: what would be faster today, what would be riskier next month, and what evidence we had either way. We ended up adjusting the implementation so we could meet the deadline without taking on the full risk I was worried about.  
> **CANDIDATE_TODO:** Add a real conflict and explain what specifically changed because of your intervention.

**Poor answer signs**

- Paints the other person as irrational
- Claims there was no tension because you are “easy to work with”
- Never explains how the issue was resolved

**Transition line**

> That makes sense. I also want to understand how you deal with feedback and mistakes.

---

## Question 3 — Feedback and growth (8 minutes)

**Interviewer script**

> What’s a piece of difficult feedback you received that actually changed how you work?

**Typical follow-ups**

- Why was that feedback accurate?
- What did you do differently afterward?
- How do you know the change stuck?
- What feedback do you still actively work on?

**Evaluation criteria**

- Coachability
- Self-awareness without self-protection
- Evidence of behavioral change, not performative humility

**Strong answer example**

> Early in my role, I got feedback that my technical instincts were good, but I sometimes went too quickly into solution mode before aligning on the exact problem and decision criteria. That was uncomfortable to hear because I thought I was being proactive. Looking back, the feedback was fair: I was optimizing for momentum, but occasionally skipped the framing step that helps others follow and challenge the direction. Since then, I’ve become much more explicit about context, tradeoffs, and success criteria before pushing a solution. The result is that design discussions move faster overall because people have fewer hidden objections later.  
> **CANDIDATE_TODO:** Replace with real feedback from a manager, tech lead, or peer.

**Transition line**

> Good. Let’s switch from feedback to pace.

---

## Question 4 — Operating under pressure (8 minutes)

**Interviewer script**

> Tell me about a high-pressure situation where the quality of your judgment mattered.

**Typical follow-ups**

- What made it genuinely high pressure?
- What were the risks if you got it wrong?
- How did you decide what to do first?
- What would you do differently now?

**Evaluation criteria**

- Calm prioritization
- Structured thinking under time pressure
- Understanding of operational risk
- Willingness to reflect after the fact

**Strong answer example**

> In high-pressure situations, I try to become more structured, not more reactive. In one production incident, the main risk was that the team could lose time chasing symptoms while the user impact widened. I focused first on stabilization, then on narrowing the problem space using the best signals available, and only then on deeper root-cause hypotheses. That kept the team from thrashing. Afterward, I pushed for better instrumentation because I didn’t want the lesson to be “work harder next time”; I wanted it to be “make the system easier to reason about under stress.”  
> **CANDIDATE_TODO:** Replace with a true production issue and the concrete operational lesson.

**Transition line**

> Thanks. Last core question: motivation and fit.

---

## Question 5 — Why this environment? (8 minutes)

**Interviewer script**

> Why do you think an environment like Optiver would suit you better than where you are today?

**Typical follow-ups**

- What do you think will be hardest about the transition?
- Where do you expect to have the steepest learning curve?
- Why are you confident you would enjoy the pace?

**Evaluation criteria**

- Genuine motivation
- Realistic understanding of the environment
- Balance of confidence and humility

**Strong answer example**

> I think the fit comes from the type of engineering problems that energize me most. I enjoy environments where systems are performance-sensitive, feedback loops are short, and people care deeply about technical quality because it affects the business immediately. At the same time, I’m realistic that the transition from banking to a top market-maker would require me to ramp quickly on market structure, tighter latency budgets, and a different pace of decision-making. I’m interested in that challenge rather than intimidated by it.  
> **CANDIDATE_TODO:** Add one sentence about how you are already preparing for that transition.

---

## Candidate questions (2 minutes)

Good questions for this round:

- What behaviors most clearly distinguish engineers who earn trust quickly at Optiver?
- Where do candidates from large institutions typically underperform in your process?
- How much of success in the role comes from pure technical depth versus communication and prioritization?

Avoid:

- Asking only about perks or remote policy
- Asking something generic that could apply to any employer

---

## Self-assessment rubric

Rate each answer from 1 to 5.

| Dimension | 1 | 3 | 5 |
|---|---|---|---|
| Specificity | Generic statements | Some concrete detail | Clear story with sharp evidence |
| Ownership | Mostly team effort | Some personal ownership | Strong personal agency and judgment |
| Reflection | Little insight | Basic lesson | Nuanced self-awareness and growth |
| Communication | Rambling or defensive | Mostly clear | Crisp, calm, and easy to follow |
| Optiver fit | Sounds generic | Plausible fit | Strong match for pace, rigor, and directness |
| Senior signal | Too tactical only | Mixed | Shows leverage, prioritization, and judgment |

**Passing standard for practice:** average at least **4/5** on specificity, ownership, and communication.

---

## Debrief prompts

After the simulation, answer these in writing:

1. Which story best demonstrated judgment, not just effort?
2. Which answer sounded rehearsed in a bad way?
3. Did you give at least one example of changing your mind based on evidence?
4. Did you sound excited by the work itself, not just the brand?
5. If the interviewer asked, “What exactly was difficult about that?”, would every answer hold up?

## Final note

If your answers sound polished but interchangeable across firms, they are not ready. For Optiver-style behavioral rounds, your answers should sound **concrete, direct, and slightly operational**: what mattered, how you decided, and what changed because of you.
