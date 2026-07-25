# Ambiguity and Prioritization Guide

Ambiguity questions test whether you can move forward responsibly when information is incomplete. Prioritization questions test whether you can do that while protecting outcomes. Senior engineers are expected to reduce uncertainty for others, not just tolerate it personally.

## Handling unclear requirements

A useful sequence:

1. Identify what must be true for success.
2. Separate hard constraints from assumptions.
3. Ask the smallest questions that unlock movement.
4. Choose a reversible first step when possible.
5. Communicate what you are assuming and when you will revisit it.

## When to ask questions vs make assumptions

### Ask questions when

- the decision is expensive to reverse,
- safety/compliance risk is involved,
- multiple stakeholders may define success differently,
- hidden dependency risk is high.

### Make assumptions when

- progress is blocked by low-cost ambiguity,
- assumptions can be validated quickly,
- you make them visible,
- you create a checkpoint for correction.

## Prioritization frameworks

### Impact / effort

Useful for backlog or improvement work. Good when the main question is return on engineering time.

### MoSCoW

- Must have
- Should have
- Could have
- Won't have for now

Good for scope negotiation under deadlines.

### Risk / urgency matrix

Useful when incidents, deadlines, and dependencies compete at once.

Questions to ask:

- What has the biggest blast radius?
- What becomes irreversible soonest?
- What blocks others?
- What can safely wait?

### A quick senior prioritization checklist

Before you decide, ask:

- What would hurt most if I am wrong?
- What is easiest to reverse later?
- Which task changes the option set for everyone else?
- What hidden coordination cost am I creating?
- What does \"good enough for now\" actually mean?

That last question matters. Senior candidates often earn points by showing that they know when completeness is unnecessary and when it is essential.

## Managing multiple urgent tasks

The senior move is usually not working harder at all of them. It is:

- triaging explicitly,
- delegating where possible,
- narrowing scope,
- communicating tradeoffs,
- protecting high-risk items first.

## Communicating uncertainty to stakeholders

Good phrasing:

- "We can move now with these assumptions, but the main unknown is X."
- "I see two viable paths; one is faster, one is safer."
- "If we do not get answer Y by tomorrow, I recommend path Z."

Weak phrasing:

- "It's all a bit unclear right now."
- "We'll see how it goes."

### A strong update template

Use a simple structure:

```text
Current understanding: X.
Biggest unknown: Y.
Working assumption: Z.
Decision needed by: DATE/TIME.
Fallback if assumption fails: PLAN B.
```

This format works well because it turns ambiguity into something discussable instead of something atmospheric.

## Deciding without perfect information

A good answer usually shows:

- what you knew,
- what you did not know,
- how you bounded risk,
- how you set revisit points,
- what signals would trigger a change.

## What excellent answers sound like

Strong answers in this category usually sound calm and structured:

- \"I reduced the problem into decisions that were reversible versus expensive to reverse.\"
- \"I clarified success criteria first because different stakeholders were optimizing different things.\"
- \"I made one assumption to keep momentum, but I also created a checkpoint to validate it.\"

Weak answers often sound reactive:

- \"Everything kept changing, so we just adapted.\"
- \"There wasn't enough information, so I did my best.\"
- \"I treated every request as urgent because I didn't want to disappoint anyone.\"

The strong version shows active judgment. The weak version shows passive survival.

## Eight common questions with answer directions

1. **Tell me about a project with unclear requirements.**  
   Show how you created structure.
2. **Describe a decision with incomplete data.**  
   Show guardrails and reversibility.
3. **Tell me about changing priorities.**  
   Show reprioritization and communication.
4. **Describe juggling multiple urgent tasks.**  
   Show triage rather than endurance.
5. **Tell me about pushing back on scope.**  
   Show MoSCoW or risk-based framing.
6. **Describe making progress while stakeholders disagreed.**  
   Show assumptions and alignment points.
7. **Tell me about choosing not to act immediately.**  
   Show judgment, not passivity.
8. **Describe a time you simplified a vague problem.**  
   Show decomposition and sequencing.

## Example strong answer

```text
We were asked to modernize a CANDIDATE_TODO workflow, but the request combined reliability, reporting, and operational pain into one vague objective. I started by separating must-have outcomes from nice-to-have improvements and mapped the stakeholder groups that cared about each. Because the largest risk was disrupting an already fragile overnight process, I proposed a phased plan: first add observability and remove the worst manual step, then revisit the deeper architecture change once we had real baseline data. That let us deliver a visible improvement quickly while reducing the chance of optimizing the wrong thing. It also made later design discussions easier because everyone was using the same metrics.
```

## Common mistakes

- treating ambiguity as someone else's fault,
- assuming everything is urgent,
- confusing motion with progress,
- failing to make assumptions visible,
- not explaining why your prioritization was correct,
- forgetting to say what you deliberately de-prioritized,
- hiding uncertainty until too late,
- giving an answer that sounds like guesswork instead of bounded risk-taking.

## Practice prompts for senior candidates

Use these to pressure-test your stories:

- What did you stop doing so the highest-value work could succeed?
- Which assumption in the story would have been most dangerous if left unspoken?
- How did you keep stakeholders from over-reading your confidence?
- Where did you choose reversibility over optimization?
- If the situation repeated today, what would you clarify earlier?

## Final takeaway

Strong ambiguity and prioritization answers show structured thinking under imperfect conditions. The best candidates neither freeze nor guess blindly. They reduce uncertainty, make deliberate tradeoffs, and communicate clearly enough that others can follow the plan.
