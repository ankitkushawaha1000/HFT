
# Writing Guide

This repository is for interview preparation at firms that expect both technical depth and communication discipline. The goal is not to sound impressive; it is to deliver answers that are correct, scoped, and persuasive under time pressure.

## Depth Guidelines by Content Type

### Question Answers

- Start with a direct answer in 1-2 sentences.
- Expand with mechanism: why it works, where it breaks, and which tradeoffs matter.
- End with operational judgment: what you would choose in a real system and why.

### Study Notes

- Optimize for fast review. Use short sections, tables, and bullet lists.
- Prefer one strong example over five shallow ones.
- Define terms that a candidate may know loosely but not precisely.

### System Design Content

- State assumptions first.
- Cover workload shape, failure domains, observability, and latency budgets.
- Include at least one explicit tradeoff between simplicity and performance.

### Behavioral Content

- Anchor every answer in a real event.
- Quantify scope, constraints, and impact whenever possible.
- Show judgment, not just effort.

## Rubric Scoring Standard

Use this rubric language when drafting answers and self-reviewing content.

### 1 = Weak

A weak answer is technically shallow, generic, or disconnected from production reality.

Common signs:

- Recites definitions without explaining implications.
- Uses slogans such as "use caching" or "avoid locks" without context.
- Ignores risk, failure modes, or tradeoffs.
- Sounds memorized and collapses under follow-up.

### 3 = Competent

A competent answer is correct and reasonably structured.

Common signs:

- Explains the main mechanism clearly.
- Covers at least one important tradeoff.
- Uses an example or production-style scenario.
- Would be acceptable in many interviews, but may not stand out.

### 5 = Strong

A strong answer shows senior-level judgment.

Common signs:

- Begins with a crisp recommendation.
- Connects design choices to constraints such as p99 latency, throughput, blast radius, or developer ergonomics.
- Anticipates edge cases and follow-up questions.
- Makes it obvious the candidate has operated real systems, not just studied theory.

## How to Write Senior-Level Answers

Senior-level answers should usually follow this structure:

1. **Position:** State your recommendation directly.
2. **Context:** Name the conditions that make the recommendation sensible.
3. **Tradeoffs:** Explain what you gain and what you give up.
4. **Failure Modes:** Show what can go wrong and how you would detect it.
5. **Operational Choice:** Explain what you would ship first and how you would iterate.

Example framing:

> I would start with a single-writer design because it gives deterministic ordering and removes a class of lock contention problems. If throughput becomes the bottleneck, I would shard by instrument only after validating that cross-book coordination is not dominant.

That structure signals ownership and judgment.

## Tradeoff Analysis Framework

Use this checklist whenever you write or review an answer:

- **Latency:** What affects median, tail, and jitter?
- **Throughput:** What is the sustainable rate under realistic bursts?
- **Correctness:** What invariants must always hold?
- **Complexity:** What implementation or operational burden are you introducing?
- **Failure Handling:** How does the system degrade under overload or dependency failure?
- **Observability:** What metrics, logs, or traces prove the design is healthy?
- **Evolution:** What future requirement is easiest or hardest after this choice?

If an answer skips all but one of these dimensions, it is usually too shallow.

## CANDIDATE_TODO Usage Guidelines

`CANDIDATE_TODO` is allowed only for content that must be personalized by the candidate.

Appropriate use:

- `CANDIDATE_TODO: Replace this example with a real Deutsche Bank production incident.`
- `CANDIDATE_TODO: Quantify latency improvement using your own metrics.`

Inappropriate use:

- Deferring factual research.
- Deferring core explanations.
- Leaving placeholders where a complete answer should already exist.

A good rule: if another candidate could reuse the text unchanged, it should not be a `CANDIDATE_TODO`.

## Markdown Formatting Standards

- Use one `#` title per file.
- Prefer `##` and `###` headings over deeply nested lists.
- Keep paragraphs short; interview prep is usually skimmed.
- Use fenced code blocks with language tags.
- Use tables only when they improve comparison clarity.
- Bold only the terms that deserve emphasis.
- Keep lists parallel in grammar and level of detail.
- Use blockquotes sparingly for answer patterns or memorable heuristics.

## Final Quality Check Before Merging

Ask these questions:

- Would this help a candidate answer more clearly in a real interview tomorrow?
- Does it distinguish strong judgment from rehearsed buzzwords?
- Is every claim either widely established, cited, or clearly labeled as inference?
- Would a skeptical senior interviewer find the answer credible?

If not, revise before merging.
