# Recruiter Screen Simulation 01 (30 Minutes)

**Target candidate:** Senior C++ engineer at Deutsche Bank with 3 years of experience, preparing for Optiver and other HFT firms.  
**Goal:** Practice the first call that decides whether you move into the technical loop.  
**How to use this file:** Read the interviewer lines out loud, pause after each question, answer in 90-150 seconds unless a follow-up is listed, then grade yourself with the rubric at the end.

---

## Interview structure and timing

- 0:00-2:00 — Introductions and agenda
- 2:00-6:00 — Background and current role
- 6:00-10:00 — Why HFT, why now
- 10:00-14:00 — Motivation for the specific firm
- 14:00-18:00 — Relevant technical/project fit
- 18:00-22:00 — Collaboration, pace, and communication
- 22:00-25:00 — Logistics: location, compensation, process, timing
- 25:00-30:00 — Candidate questions and close

---

## Full interviewer intro script

> Hi, thanks for taking the time today. I’m going to spend about 30 minutes getting to know your background, what you’re looking for, and why you’re exploring trading firms. I’ll also leave time at the end for your questions and I can explain next steps. This is not a deep technical interview, but I will be listening for the scope of your work, how you communicate, and whether the role looks aligned from both sides. Sound good?

**Strong candidate move:** respond briefly, show energy, and confirm the agenda.

**Example response:**

> Absolutely. Thanks for making the time. I’m happy to walk through my background, what I’ve been doing at Deutsche Bank, and why I’m specifically interested in high-performance trading environments.

---

## Question 1 — “Can you walk me through your background?”

**Recruiter prompt**

> Let’s start with a quick overview. Can you walk me through your background and what you’re doing today?

**What the recruiter is evaluating**

- Can you summarize your profile crisply in 2 minutes?
- Do you sound senior for your tenure?
- Do you connect your current work to the target role?
- Do you show progression, not just a job description recap?

**What a strong answer includes**

- One-line professional identity
- Current team and system scope
- Concrete ownership area
- Relevance to low-latency, reliability, or performance engineering
- Why you are now exploring HFT

**Example candidate response**

> I’m a C++ engineer at Deutsche Bank, where I’ve spent the last three years building and improving production systems used in electronic trading and market connectivity workflows. My work has mostly sat at the boundary between application logic and platform concerns: performance-sensitive services, debugging production issues, and improving reliability where latency and correctness both matter. Over time, I’ve taken on more ownership for diagnosing bottlenecks, improving observability, and making design tradeoffs under production constraints. I’m now looking for an environment where low-latency engineering is even more central to the product, and where strong engineering directly affects business outcomes every day.  
> **CANDIDATE_TODO:** Replace this with your actual desk, product area, and one concrete system you owned.

**Red flags**

- Chronological life story without a thesis
- Too much emphasis on tools, not outcomes
- Claims of “senior” work without specifics
- No explanation of why HFT is the next logical step

**Green flags**

- Clear summary in under 2 minutes
- Strong verbs: owned, improved, delivered, debugged, led
- Quantified impact where possible
- Shows mature judgment, not title inflation

---

## Question 2 — “Why are you looking now?”

**Recruiter prompt**

> What prompted you to start looking at new opportunities at this point?

**Evaluation criteria**

- Motivation sounds positive, not reactive
- Decision appears thoughtful and professional
- Candidate is running toward something, not only away from something

**Example candidate response**

> I’ve learned a lot in my current role and I’ve built a solid foundation in production C++ systems, but I want the next environment to be more engineering-intense around performance, feedback loops, and ownership. What attracts me to firms like Optiver is that the systems are both business-critical and technically demanding. I’m especially motivated by the chance to work closer to latency-sensitive infrastructure, market data, and execution paths where the engineering bar is extremely high.  
> **CANDIDATE_TODO:** Add one truthful reason tied to growth, scope, or environment.

**Red flags**

- Complaining about manager, comp, or politics
- “I’m just seeing what’s out there”
- Vague attraction to prestige only

**Green flags**

- Growth-oriented motivation
- Good judgment about current role and next step
- No negativity toward present employer

---

## Question 3 — “Why HFT, and why not stay in banking?”

**Recruiter prompt**

> You’re coming from a bank. Why do you want to move into high-frequency or market-making firms specifically?

**Evaluation criteria**

- Has a real thesis about the environment
- Understands that HFT is not just “finance with better pay”
- Values speed, iteration, and direct feedback loops

**Example candidate response**

> The main draw is engineering density. In my current role, performance matters, but it sits alongside many other priorities and organizational constraints. In an HFT environment, the link between system design, latency, reliability, and business value is much tighter. That appeals to me because I enjoy problems where the technical details genuinely matter: memory behavior, concurrency, protocol handling, failure recovery, and operational rigor under pressure. I also like the idea of getting faster feedback on whether a design was actually good.  
> **CANDIDATE_TODO:** Add a genuine sentence about what you have learned about HFT systems so far.

**Red flags**

- Thinks HFT is only about writing “fast code” in isolation
- Ignores operations, risk, and correctness
- Focuses only on money or brand

**Green flags**

- Talks about tight feedback loops and engineering rigor
- Understands speed + correctness + reliability tradeoff
- Sounds informed, not romanticized

---

## Question 4 — “Why our firm?”

**Recruiter prompt**

> There are several top trading firms hiring strong engineers. Why are you interested in us specifically?

**Evaluation criteria**

- Has done basic research
- Tailors answer to the firm instead of giving generic “top company” language
- Shows seriousness about the opportunity

**Example candidate response (Optiver-oriented)**

> Optiver stands out to me for a few reasons. First, the firm publicly emphasizes engineering impact in trading rather than treating engineering as a support function, which matches what I’m looking for. Second, the culture seems to value direct communication, fast learning, and measurable improvement, which fits how I prefer to work. Third, from what I’ve read about your software engineering interviews and technical work, it seems like engineers are expected to reason deeply about systems instead of only solving abstract coding problems. That combination is attractive to me.  
> **CANDIDATE_TODO:** Add one firm-specific reference from your own research before using this live.

**Red flags**

- “You’re one of the top firms” and nothing else
- Confuses market-making, hedge fund, and broker-dealer models
- Uses copied website language with no interpretation

**Green flags**

- Knows 2-3 differentiators
- Mentions engineering culture or system profile
- Sounds selective rather than desperate

---

## Question 5 — “Tell me about a project that is most relevant here.”

**Recruiter prompt**

> If I were speaking to a hiring manager next, what project from your background would you want them to hear about first?

**Evaluation criteria**

- Chooses a project with the right signal
- Explains business context, technical challenge, and impact
- Demonstrates ownership beyond implementation

**Example candidate response**

> I’d probably start with a production performance and reliability project where I owned the investigation from symptom to rollout. The reason I’d pick that one is that it shows how I work when the system matters: I had to isolate the bottleneck, decide what to measure, align with adjacent teams, make a safe change, and validate the result in production. It was not just coding; it was diagnosis, prioritization, and operating judgment.  
> **CANDIDATE_TODO:** Replace with a real Deutsche Bank project. Include the system, the bottleneck, what you changed, and the measurable result.

**Red flags**

- Picks a project with no clear outcome
- Cannot explain own role versus team role
- No metrics, tradeoffs, or lessons

**Green flags**

- Strong end-to-end ownership signal
- Real production constraints
- Good balance of technical depth and business relevance

---

## Question 6 — “How do you like to work with others?”

**Recruiter prompt**

> How would your teammates describe your working style?

**Evaluation criteria**

- Self-awareness
- Collaboration style under pace and ambiguity
- Communication maturity

**Example candidate response**

> I think they’d say I’m calm, direct, and reliable under pressure. I usually try to reduce ambiguity quickly: clarify the problem, make the tradeoffs visible, and keep people updated without creating noise. I care a lot about being easy to work with, especially in cross-functional situations where engineering, support, and business priorities can pull in different directions. At the same time, if I think something is risky or poorly framed, I’ll say so clearly and propose an alternative.  
> **CANDIDATE_TODO:** Add a short real example that supports this description.

**Red flags**

- “I work best alone” without nuance
- Over-indexing on being agreeable
- No evidence of communication under stress

**Green flags**

- Low-ego, high-accountability tone
- Communicates clearly without drama
- Can disagree constructively

---

## Question 7 — “Tell me about pressure.”

**Recruiter prompt**

> Can you give me an example of working under pressure or dealing with a production issue?

**Evaluation criteria**

- Composure and judgment
- Incident mindset
- Ability to operate with incomplete information

**Example candidate response**

> One pattern I’ve seen is that strong incident handling is less about heroics and more about structure. In a recent issue, my first step was to establish the blast radius, protect the system, and make sure everyone had the same facts. Then I narrowed hypotheses using logs, metrics, and recent changes instead of guessing. Once we stabilized the issue, I drove the follow-up so we didn’t just recover but actually removed the class of failure.  
> **CANDIDATE_TODO:** Replace with a specific incident, including timeline, your role, and what changed afterward.

**Red flags**

- No structured response to incidents
- Emphasizes panic, blame, or hero narrative
- Cannot distinguish mitigation from root cause

**Green flags**

- Calm, ordered, and safety-first approach
- Good communication habits
- Turns incidents into durable improvements

---

## Question 8 — “What are your logistics?”

**Recruiter prompt**

> A few quick logistics questions: where are you in your process, what locations are you open to, and do you have any compensation expectations in mind?

**Evaluation criteria**

- Professionalism
- Realistic expectations
- No signs of process chaos

**Example candidate response**

> I’m early but active in my process, and I’m prioritizing roles that are strong on engineering quality and fit rather than trying to maximize volume. On location, I’m open to **CANDIDATE_TODO**. On compensation, I’d prefer to understand the level and scope first, but I’m looking for a competitive package in line with senior C++ roles in trading firms.

**Red flags**

- Aggressive comp anchoring too early
- Contradictory location or visa information
- Sounds disorganized across active processes

**Green flags**

- Clear but flexible
- Understands recruiter’s need for basic calibration
- Keeps tone collaborative

---

## Question 9 — “What questions do you have for me?”

**Recruiter prompt**

> What would you like to ask me?

**Evaluation criteria**

- Curiosity and preparation
- Interest in role design, success metrics, and interview process
- Judgment about what is appropriate for a recruiter screen

**Strong questions to ask**

- How is the engineering organization structured around trading, infrastructure, and platform work?
- What tends to differentiate candidates who do well in the process from those who are borderline?
- For someone coming from banking into trading, what gaps do you most want to see closed during the interview loop?
- What does strong performance look like in the first 6-12 months for this role?

**Questions to avoid**

- “How quickly can I get promoted?” as your first question
- Overly tactical questions already answered on the careers page
- Very detailed comp negotiation on the first call

---

## End-of-call closing script

> Thanks, this was helpful. I’m even more interested after hearing how the role is scoped. I appreciate the overview and I’d be excited to continue in the process. Please let me know if there’s anything else from my side that would help as you decide next steps.

---

## Global red flag indicators

- Rambling answers that exceed 3 minutes without structure
- Inflated ownership claims that would collapse under probing
- Generic “top company” motivation
- Negative framing about current employer
- No evidence of preparation for HFT-specific environment
- Inability to speak concretely about a production system

## Global green flag indicators

- Crisp communication and strong energy
- Sound reasoning for the move from bank to HFT
- Specific project evidence tied to systems, reliability, or performance
- Mature, low-ego collaboration style
- Thoughtful, well-scoped questions at the end

---

## Post-interview self-evaluation rubric

Score each category from 1 to 5.

| Category | 1 | 3 | 5 |
|---|---|---|---|
| Narrative clarity | Rambling, unclear story | Mostly clear with minor repetition | Sharp, memorable, and easy to follow |
| Role fit | Weak link to target role | Some relevant overlap | Strong, explicit relevance to HFT engineering |
| Motivation | Generic or negative | Reasonable but bland | Positive, informed, and firm-specific |
| Ownership | Mostly team-level descriptions | Some personal scope | Clear individual ownership and judgment |
| Communication | Defensive or vague | Competent | Concise, confident, and collaborative |
| Seniority signal | Sounds mid-level/junior | Mixed | Strong maturity despite 3-year tenure |
| Recruiter readiness | Would not advance | Possible advance | Clear advance to next round |

**Interpretation**

- **30-35:** Strong pass for recruiter screen
- **24-29:** Borderline but fixable
- **18-23:** Needs targeted improvement before live screens
- **Below 18:** Rebuild story and motivation before applying broadly

---

## Debrief guide

Immediately after practice, write down:

1. Which answer felt least believable or least specific?
2. Did you mention at least two concrete systems or projects by name?
3. Did your “why HFT” answer sound earned, or did it sound copied?
4. Did you quantify anything: latency, throughput, incidents, scale, revenue relevance, developer productivity, or reliability?
5. If the recruiter asked “What exactly did *you* do?”, would every answer survive?
6. What one sentence do you want the recruiter to remember about you?

### 10-minute improvement drill

- Rewrite your background answer to exactly 120-150 words.
- Rewrite your “why HFT” answer to exactly 90-120 words.
- Prepare one project answer in STAR format with numbers.
- Prepare one incident answer with mitigation, root cause, and prevention.

### Final readiness check

You are ready to use this live when you can do all of the following without notes:

- deliver your background in under 2 minutes;
- explain why HFT is the next step without sounding opportunistic;
- name one production project and one incident with specifics;
- ask 2-3 thoughtful questions tailored to the firm.
