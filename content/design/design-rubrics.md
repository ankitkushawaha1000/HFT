# System Design Interview Rubrics

Research date: 2026-07-24

Many candidates improve dramatically once they understand how interviewers actually evaluate design answers. Examiners are usually not waiting for one exact architecture. They are scoring how well you reason, communicate, and adapt. This rubric is tailored to senior engineering interviews, especially in latency-sensitive trading environments.

## Dimensions and 5-level rubric

### 1. Requirements handling

**Level 1:** Starts designing immediately with no clarification.

**Level 2:** Asks a few generic questions but misses critical constraints such as latency target or recovery needs.

**Level 3:** Clarifies major functional and non-functional requirements.

**Level 4:** Systematically identifies hidden constraints, edge cases, and operational requirements.

**Level 5:** Rapidly shapes the problem, spots ambiguous or conflicting requirements, and negotiates sensible assumptions.

### 2. Architecture quality

**Level 1:** Random components with unclear responsibilities.

**Level 2:** Basic component list but weak data flow and ownership.

**Level 3:** Coherent architecture with correct major pieces.

**Level 4:** Clear critical path, failure domains, and state ownership.

**Level 5:** Architecture is not only coherent but well matched to constraints, with thoughtful boundaries and evolution path.

### 3. Tradeoff reasoning

**Level 1:** Presents one solution as obviously correct.

**Level 2:** Mentions tradeoffs superficially.

**Level 3:** Compares at least one or two plausible alternatives.

**Level 4:** Uses requirements and scale estimates to justify choices.

**Level 5:** Anticipates how the answer changes if assumptions change and communicates those pivots naturally.

### 4. Technical depth

**Level 1:** High-level buzzwords only.

**Level 2:** Some correct details but limited insight into bottlenecks or failure modes.

**Level 3:** Can zoom into one hard component with credible specifics.

**Level 4:** Demonstrates practical implementation awareness across performance, correctness, and operations.

**Level 5:** Balances deep specifics with system-level thinking; can defend details without losing structure.

### 5. Communication

**Level 1:** Hard to follow, unstructured, reactive.

**Level 2:** Structure exists but meanders.

**Level 3:** Clear, mostly organized, and responsive.

**Level 4:** Leads the conversation, signposts sections, checks alignment.

**Level 5:** Feels like a senior design review: concise, confident, collaborative, and adaptive.

## What examiners often write down

Interview notes tend to include phrases like:

- “clarified latency and correctness requirements early”
- “good use of back-of-envelope estimates”
- “missed recovery / failover story”
- “jumped to distributed system unnecessarily”
- “understood tradeoff between in-process and service boundary”
- “strong on protocol detail, weaker on ops”
- “communicated clearly, adjusted when challenged”

This means your visible reasoning process matters as much as your final diagram.

## Common failure modes

1. **No clarification phase:** candidate solves the wrong problem.
2. **Cloud-generic answer:** uses familiar services with no fit to constraints.
3. **No numbers:** cannot justify scale or hardware assumptions.
4. **No ownership model:** unclear who updates what state.
5. **Ignored tails and failure:** especially damaging in HFT-style prompts.
6. **Defensive communication:** treats interviewer questions as attacks instead of collaboration.

## Self-evaluation checklist

Before finishing an answer, ask yourself:

- Did I restate the problem clearly?
- Did I identify the critical path?
- Did I discuss the hardest bottleneck or correctness risk?
- Did I cover monitoring and failure handling?
- Did I compare alternatives?
- Did I tie choices back to requirements?

If several answers are “no,” the interviewer probably sees gaps too.

## How to recover if you go down the wrong path

Recovery is part of the evaluation. Senior candidates do not freeze when challenged. They say something like: “Given the tighter latency target you just clarified, I would revise the design by collapsing this service boundary and moving persistence off the critical path.”

Good recovery steps:

1. acknowledge the new information
2. state what assumption changed
3. update the design explicitly
4. explain the new tradeoff

This often scores better than stubbornly defending a bad path.

## Special note for HFT and low-latency prompts

Examiners in trading-focused interviews are often listening for:

- precise latency boundaries
- awareness of p99 and p99.9, not just averages
- state-machine correctness for orders and fills
- deterministic ownership and recovery
- operator safety and kill switches

That does not mean every answer must be “single-threaded C++.” It means the architecture must respect the actual economic and operational constraints.

## Final advice

Your goal is not to impress with the biggest design. Your goal is to show that, given ambiguous requirements, you can create clarity, choose appropriate complexity, and lead others toward a safe and effective system.

## Example scorecard

A candidate might score highly on architecture but lower on requirements if they built a coherent OMS yet never asked about recovery or regulatory audit needs. Another candidate may have average technical detail but still perform well through excellent structure, tradeoff framing, and calm adaptation. This is why process matters so much.

## How to self-correct in real time

If you realize you skipped an important area, explicitly repair it: “I have not talked about recovery yet, which is a major gap for this design. Let me cover authoritative state, replay, and operator actions after reconnect.” Interviewers usually see that as maturity, not weakness.
