# Companies: Interview Processes & Scouted Questions

A per-company breakdown of the interview process for **HFT / quant trading firms** and **top-paying employers of C++ engineers**, with a separate folder for **each interview round** containing the interview questions and **online assessment (OA)** questions that candidates have publicly reported.

- **Research cutoff:** 2026-07-25
- **Audience:** Senior / experienced C++ software engineers (this repo's candidate profile: 3 years C++ at Deutsche Bank).
- **How to use:** Open a company folder → read its `README.md` (process + compensation) → work through each `round-XX-*/questions.md`.

---

## ⚠️ Important disclaimer (read first)

This is an **independent, educational** preparation resource. It is **NOT affiliated with, endorsed by, or produced by any company listed here.**

- It **does not** contain confidential, leaked, or proprietary interview content. Reproducing a firm's confidential interview material (or violating an NDA) is out of scope and not the goal here.
- Every question below is a **publicly reported or representative** prep item, drawn from official careers pages, public job descriptions, engineering blogs, and openly posted candidate experiences (Glassdoor, LeetCode Discuss, Blind, Reddit, levels.fyi, interview-prep sites).
- Interview processes **change frequently** and vary by office, team, and seniority. Anecdotal reports may be **incomplete or outdated**.
- Nothing here guarantees an interview outcome. Treat it as a study checklist, not a script.

Each question carries an **evidence label**:

| Label | Meaning |
|---|---|
| `official` | Stated on an official company page or job description |
| `inferred` | Strongly implied by official/public role signals |
| `anecdotal` | Publicly reported by candidates, not officially confirmed |
| `general-prep` | Representative of the category; standard preparation, not company-specific |

Compensation figures are **public estimates** (mainly levels.fyi / Glassdoor / Levels reports) and are ranges, not offers.

---

## How each company folder is organized

```
companies/<company-id>/
├── README.md                     # Overview: type, HQ, comp, tech stack, full interview process
├── round-01-<name>/questions.md  # e.g. online-assessment
├── round-02-<name>/questions.md  # e.g. technical phone screen
└── round-NN-<name>/questions.md  # onsite / superday / final / HM
```

Round folders are numbered in the order a candidate typically encounters them. Not every company uses every round; the folders reflect that company's actual reported flow.

---

## Company checklist

Progress checklist so no target company is missed.

### Tier 1 — Elite HFT market-makers & prop trading (deep C++ / low-latency)

- [x] [Optiver](optiver/)
- [x] [Citadel Securities](citadel-securities/)
- [x] [Jane Street](jane-street/)
- [x] [Hudson River Trading (HRT)](hudson-river-trading/)
- [x] [Jump Trading](jump-trading/)
- [x] [Two Sigma](two-sigma/)
- [x] [IMC Trading](imc-trading/)
- [x] [DRW](drw/)
- [x] [Tower Research Capital](tower-research-capital/)
- [x] [SIG (Susquehanna)](sig-susquehanna/)
- [x] [Akuna Capital](akuna-capital/)
- [x] [Five Rings](five-rings/)
- [x] [Virtu Financial](virtu-financial/)
- [x] [XTX Markets](xtx-markets/)
- [x] [G-Research](g-research/)

### Tier 2 — Quant funds & additional prop shops

- [x] [Millennium](millennium/)
- [x] [Point72 (Cubist)](point72/)
- [x] [WorldQuant](worldquant/)
- [x] [Squarepoint Capital](squarepoint/)
- [x] [D. E. Shaw](de-shaw/)
- [x] [Flow Traders](flow-traders/)
- [x] [Headlands Technologies](headlands-technologies/)
- [x] [Radix Trading](radix-trading/)
- [x] [Quadrature Capital](quadrature-capital/)
- [x] [Maven Securities](maven-securities/)
- [x] [PDT Partners](pdt-partners/)
- [x] [Old Mission Capital](old-mission-capital/)

### Tier 3 — Top-paying tech employers of C++ engineers

- [x] [Google](google/)
- [x] [Meta](meta/)
- [x] [NVIDIA](nvidia/)
- [x] [Bloomberg](bloomberg/)
- [x] [Microsoft](microsoft/)
- [x] [Amazon](amazon/)
- [x] [Apple](apple/)

---

## Compensation snapshot (public estimates, USD total comp)

Ranges are indicative public estimates for software / core engineering roles; trading-firm comp is heavily bonus-weighted and varies widely.

| Company | Entry / new-grad | Senior / experienced | Notes |
|---|---|---|---|
| Jane Street | ~$400k+ | $600k–$1M+ | Among the highest new-grad comp reported |
| Citadel Securities | ~$300–450k | $500k–$1M+ | Strong C++ / low-latency roles |
| Optiver | ~$250–400k | $400–800k | Bonus-heavy, global offices |
| HRT | ~$300–450k | $500k–$900k | Core/algo engineering |
| Jump Trading | ~$250–400k | $400–800k | Systems/FPGA heavy |
| Two Sigma | ~$250–350k | $400–700k | Research + platform eng |
| IMC / DRW / SIG | ~$200–350k | $350–700k | Bonus-weighted |
| Google / Meta / NVIDIA / Apple / Microsoft / Amazon | ~$150–250k | $300–800k (staff+) | See levels.fyi per level |
| Bloomberg | ~$150–200k | $250–400k | Large C++ codebase |

Always verify current numbers on [levels.fyi](https://www.levels.fyi/) and each firm's offers directly.

---

## Cross-company preparation themes

Regardless of firm, the highest-leverage prep for a C++ HFT/quant loop is:

1. **C++ depth** — move semantics, RAII, memory model, `std::atomic`, false sharing, templates, virtual dispatch cost, undefined behavior.
2. **Data structures & algorithms** — clean, fast, edge-case-correct coding under time pressure.
3. **Low-latency systems** — order books, ring buffers, lock-free queues, cache behavior, kernel bypass, measurement.
4. **Probability / mental math / market-making games** — EV, conditional probability, quick arithmetic, estimation (heavier at SIG, IMC, Five Rings, Optiver).
5. **System design** — performance-sensitive, correctness-critical services with explicit tradeoffs and failure modes.
6. **Behavioral** — evidence-based ownership, incident response, and collaboration stories.

See the rest of this repository (`content/cpp`, `content/low-latency`, `content/systems`, `content/design`, `content/behavioral`) for the underlying study material that these questions map onto.
