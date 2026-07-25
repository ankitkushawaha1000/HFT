# Research Methodology

**Research date:** 2026-07-24  
**Repository purpose:** Interview preparation for HFT and adjacent quantitative trading firms.  
**Scope:** Optiver, Citadel, Jane Street, Two Sigma, Hudson River Trading, Jump Trading.

---

## Objective

This research layer is intended to support responsible interview preparation. The goal is to help the candidate understand:

- what each firm publicly says about software engineering and interviewing;
- what appears consistently across public job descriptions and engineering content;
- what can be inferred, with reasonable confidence, about likely interview emphasis areas.

It is **not** intended to reproduce confidential interview content, leaked questions, or proprietary internal process details.

---

## Source classes consulted

The repository uses a layered evidence model. Different source classes serve different purposes.

### 1. Official company career pages
Used for:
- role descriptions;
- public team descriptions;
- interview-preparation guidance where available;
- stated expectations around software engineering, collaboration, and problem solving.

### 2. Published job descriptions
Used for:
- language and systems emphasis (for example, C++, Linux, low-latency, networking, distributed systems);
- role scope and ownership expectations;
- evidence of whether a firm clearly signals deep C++ or systems knowledge.

### 3. Public engineering blog posts and technical pages
Used for:
- validating whether the firm publicly discusses performance engineering, infrastructure, reliability, low-latency systems, or market-data-style problems;
- understanding how engineers at the firm describe their work.

### 4. Public candidate-report aggregations
Used only as a secondary input when official evidence is incomplete.

Examples include:
- Glassdoor patterns;
- Blind patterns;
- public forum summaries;
- candidate-prep blog posts that aggregate experiences.

These are **not individually cited** in this repository because the goal is to extract high-level recurring patterns, not to preserve unverifiable anecdote. They are used cautiously and only to shape low- or medium-confidence inferences.

### 5. Public conference talks, books, and academic papers
Used to support the **technical curriculum**, not to claim direct hiring-process facts. These sources help validate the relevance of topics such as low-latency design, concurrency, mechanical sympathy, market microstructure, and high-performance C++.

---

## Confidence classification system

### High confidence
Assigned when one of the following is true:
- the claim is stated directly on an official company page;
- the claim appears in multiple official pages from the same firm;
- the claim is technical/common-knowledge material from authoritative books, papers, or conference talks.

**Example:** A company’s official interview-preparation page explicitly mentions coding, system design, or behavioral evaluation.

### Medium confidence
Assigned when:
- official evidence is partial rather than explicit;
- published job descriptions and technical content strongly imply an interview emphasis;
- multiple independent public patterns align, but official confirmation is incomplete.

**Example:** A firm does not publish a full interview sequence, but official roles repeatedly emphasize C++, performance, Linux, and low-latency work, making deep technical screening a strong inference.

### Low confidence
Assigned when:
- the claim rests mostly on aggregated anecdotal candidate reports;
- official sources are weak, old, or ambiguous;
- public evidence is directionally suggestive but not stable enough for strong conclusions.

**Example:** A very specific interview stage structure mentioned by candidates but not documented by the company.

### Unknown / insufficient evidence
Assigned when:
- the repository found no reliable basis to classify the claim;
- public evidence conflicts materially;
- the only evidence available appears outdated or too anecdotal.

---

## How confidence levels are assigned in practice

When evaluating a claim such as “this firm tests system design” or “this firm cares deeply about C++ depth,” the process is:

1. **Check official interview or careers pages first.**
2. **Check public job descriptions** for the relevant engineering role family.
3. **Check official engineering or technology content** for alignment with the skill area.
4. **Use aggregated anecdotal patterns only if official evidence is incomplete.**
5. **Downgrade confidence** if the evidence is indirect, stale, or role-dependent.

Confidence therefore reflects the **quality of evidence**, not the importance of the topic.

---

## What is included

Included in scope:
- public firm statements about interview preparation or role expectations;
- public role descriptions for software engineering, C++, systems, or low-latency roles;
- public engineering blogs or technical pages that reveal engineering culture and problem types;
- aggregated non-confidential patterns from candidate reports at a high level only.

---

## What is excluded

Explicitly excluded:
- leaked interview questions;
- confidential documents;
- internal training or evaluation rubrics not published by the company;
- copied proprietary take-home tasks;
- unverifiable “friend told me” process details;
- any claim that would encourage a candidate to memorize secret content rather than build skill.

This repository is designed to remain ethical and durable even as firms change their process.

---

## Limitations and caveats

### 1. Interview processes change frequently
A company may update its interview sequence, coding environment, or role expectations after the research date. The research date should therefore be treated as a **cutoff**, not a guarantee of future accuracy.

### 2. Role family matters
A software engineer focused on low-latency market data may face a different interview emphasis from an infrastructure, platform, or research engineering candidate at the same firm.

### 3. Office and region differences exist
Interview structure can vary by geography, seniority, and hiring urgency.

### 4. Public evidence is uneven across firms
Some firms publish detailed interview guidance; others publish only high-level careers material. That means confidence levels are not directly comparable without context.

### 5. Anecdotal sources can be biased
Candidate reports often overrepresent unusually good or unusually bad experiences, and they may conflate teams, years, and roles.

---

## Recommended interpretation model for candidates

Use the research to answer three practical questions:

1. **What is almost certainly worth preparing?**  
   Example: coding, C++ fundamentals, systems reasoning, ownership stories.

2. **What is probably worth preparing because the evidence is strong enough?**  
   Example: market-data-style system design, low-latency tradeoffs, direct behavioral probing.

3. **What should be treated only as a loose pattern?**  
   Example: exact number of rounds, exact order of rounds, or highly specific problem types.

---

## Ethical note

This repository deliberately optimizes for **real skill-building** over rumor-driven prep. The intended outcome is that the candidate becomes better at reasoning about production C++, systems, and HFT-style design problems, not merely better at pattern-matching anecdotes.

That makes the preparation more transferable across firms, more resilient to process changes, and more aligned with how strong engineering interviews are supposed to work.
