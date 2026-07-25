# HFT Interview Preparation Repository

**For:** Senior C++ Software Engineer interviews at Optiver, Citadel, Jane Street, and other HFT firms.

**Candidate Profile:** 3 years C++ experience at Deutsche Bank. Strengthening knowledge in OS, networking, and low-latency systems.

---

## ⚠️ Important Disclaimer

This is an **independent educational preparation resource**. It is **NOT affiliated with, endorsed by, or produced by any trading firm** mentioned in this repository. Company-specific interview processes change frequently. Anecdotal candidate reports may be incomplete or outdated. This material does not contain confidential interview information and **does not guarantee any interview outcome**.

---

## 📋 What's Inside

### 1. Interactive Website
- **Responsive design**: Works on desktop, tablet, mobile
- **Full-text search**: Find questions and content instantly
- **Progress tracking**: Track completion with localStorage
- **Dark/Light theme**: Study comfortably anytime
- **Mock interview mode**: Practice with timer and scoring
- **No backend required**: Works completely offline
- **Companies interview round library**: Tiered company pages with round-by-round question sets
- **Coding examples viewer**: Read HFT/C++ source examples directly in the web app
- **HFT coding prep planner**: Public-source question map + full prep schedule

### 2. Behavioral Interview Mastery (Optiver Focus)
- **60+ behavioral questions** with STAR framework answers
- **Personal story worksheet**: Fill in your real Deutsche Bank examples
- **Recruiter and hiring manager simulations** with full scripts
- **Senior-level competency rubrics**
- **Answer frameworks** showing what strong answers look like

### 3. Study Plans
- **7-day emergency plan** (for imminent interviews)
- **14-day balanced plan** (behavioral + technical)
- **30-day deep-dive plan** (all topics)
- **60-day comprehensive plan** (mastery level)
- **Interview-day checklist**

### 4. Technical Content
- **C++ Curriculum** (modern C++, memory, concurrency, STL)
- **OS & Networking Crash Course** (beginner-friendly for weak areas)
- **Low-Latency Design** (order books, feed handlers, latency measurement)
- **System Design Exercises** (real HFT problems with tradeoffs)

### 5. Question Bank
- **280+ questions** across all categories
- **Full answers with rubrics** (1=weak, 3=competent, 5=strong)
- **Company evidence** (official/inferred/anecdotal with confidence)
- **Clarifying questions and follow-ups**
- **Common mistakes** highlighted

### 6. Code Examples
- **C++ compilable examples** with tests
- **Smart pointers, move semantics, concurrency, atomics**
- **HFT examples**: ring buffer, order book, lock-free queue, memory pool
- **CMake build system** with sanitizer support

### 7. Mock Interviews
- Recruiter screen (30 min)
- Behavioral interview (45 min, 60 min)
- Senior C++ technical (60 min)
- System design (60 min)
- Full-loop simulation (4 hours)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- g++ or clang++ (C++17+)
- CMake 3.15+

### Running Locally

```bash
# Clone and navigate
git clone https://github.com/ankitkushawaha1000/HFT.git
cd HFT

# Install dependencies
npm install

# Start the website
npm run serve

# Open http://localhost:8000 in your browser
```

### Build Commands

```bash
# Run all validation and tests
npm run validate

# Generate static site
npm run build

# Generate PDFs
npm run build:pdf

# Compile C++ examples
cd examples && cmake -B build && cmake --build build && ctest --test-dir build
```

---

## 📂 Directory Structure

```
/
├── index.html                    # Main website entry point
├── package.json                  # Node dependencies
├── CMakeLists.txt               # C++ build config
├── README.md                    # This file
├── .gitignore
│
├── assets/
│   ├── css/
│   │   ├── styles.css           # Main styling
│   │   └── print.css            # Print-friendly styles
│   ├── js/
│   │   ├── app.js               # App controller
│   │   ├── quiz.js              # Question features
│   │   ├── progress.js          # Progress tracking
│   │   └── search.js            # Search implementation
│   └── images/                  # Icons and logos
│
├── content/
│   ├── optiver/                 # Optiver-specific content
│   ├── behavioral/              # STAR method, stories, leadership
│   ├── cpp/                     # C++ curriculum
│   ├── systems/                 # OS, networking, CPU basics
│   ├── low-latency/             # Latency, order books, design
│   ├── design/                  # System design exercises
│   ├── trading/                 # Market microstructure
│   ├── coding/                  # Coding interview prep
│   ├── mock-interviews/         # Mock interview scripts
│   └── study-plans/             # Study roadmaps
│
├── data/
│   ├── questions.json           # All 280+ questions
│   ├── behavioral-questions.json
│   ├── cpp-questions.json
│   ├── systems-questions.json
│   ├── design-questions.json
│   ├── companies.json           # Company reference info
│   └── sources.json             # Research sources
│
├── examples/
│   ├── cpp/
│   │   ├── 01-smart-pointers/
│   │   ├── 02-move-semantics/
│   │   ├── 03-concurrency-basics/
│   │   └── 04-atomics/
│   └── hft/
│       ├── 01-ring-buffer/
│       ├── 02-order-book/
│       ├── 03-lock-free-queue/
│       ├── 04-memory-pool/
│       └── 05-feed-handler/
│
├── scripts/
│   ├── build-site.mjs
│   ├── build-pdf.mjs
│   ├── serve.mjs
│   └── validate.mjs
│
├── tests/
│   ├── validate-data.mjs
│   ├── validate-links.mjs
│   └── validate-cpp.mjs
│
├── research/
│   ├── sources.md               # All sources cited
│   ├── company-evidence-matrix.md
│   └── research-methodology.md
│
├── generated/                   # Generated PDFs (ignored)
│   └── .gitkeep
│
└── .github/workflows/
    ├── validate.yml
    ├── deploy-pages.yml
    └── build-pdf.yml
```

---

## 🎯 How to Use This Repository

### For a 7-Day Emergency Interview
1. Start with `content/study-plans/7-day-emergency-plan.md`
2. Fill in `content/behavioral/story-bank-template.md` with your Deutsche Bank examples
3. Review `content/optiver/behavioral-interview.md`
4. Run mock interviews from `content/mock-interviews/`
5. Track progress on the website

### For Deep Preparation (30+ days)
1. Follow `content/study-plans/30-day-plan.md` or `60-day-plan.md`
2. Work through C++ curriculum at your pace
3. Complete all code examples
4. Study system design exercises
5. Run full mock interview loop weekly

### For Reference
- Use website search to find specific topics
- Filter questions by difficulty and company
- Bookmark favorites for quick review
- Export progress and share with mentors

---

## 📝 Personalizing Your Content

Many sections include **CANDIDATE_TODO** markers where you should add your own experiences:

```
CANDIDATE_TODO: Add a real production incident from Deutsche Bank
CANDIDATE_TODO: Quantify the impact if possible
CANDIDATE_TODO: Describe what you learned
```

**Do NOT fabricate stories.** Interviewers probe for details, and made-up examples fall apart under follow-up questions. Use your real experiences from Deutsche Bank.

---

## 🔍 Research & Sources

**Research Date:** 2026-07-24

All company-specific claims are sourced and marked with confidence levels:
- **High confidence:** Official company career pages, published job descriptions
- **Medium confidence:** Inferred from job descriptions, multiple candidate reports
- **Low confidence:** Single anecdotal report

See `research/sources.md` for complete source list.

---

## 💻 Using the Website

### Search & Filter
- Search by keyword
- Filter by company (Optiver, Citadel, Jane Street, etc.)
- Filter by difficulty (easy, medium, hard)
- Filter by topic (C++, behavioral, systems, etc.)

### Study Modes
1. **Learn Mode**: Read content, review answers
2. **Flashcard Mode**: Question then reveal answer
3. **Interview Mode**: Time-limited with scoring
4. **Mock Interview**: Random selection, full simulator

### Progress Tracking
- Mark questions as complete
- Track your scores over time
- View completion percentage by topic
- Bookmark favorites

### Dark/Light Theme
- Toggle in top menu
- Preference persists across sessions

---

## ✅ What the Repository Covers

| Topic | Coverage | Confidence |
|-------|----------|------------|
| Optiver Behavioral | 60+ questions, STAR framework | High |
| Other HFT Behavioral | Comparable to other firms | Medium |
| Modern C++ | C++11-20, beginner to advanced | High |
| STL & Data Structures | Internals, performance, usage | High |
| Concurrency | Basics, atomics, memory model | Medium |
| OS & Networking | Beginner-friendly crash course | Medium |
| Low-Latency Design | Order books, feed handlers | High |
| System Design | Real HFT scenarios | High |
| Trading Microstructure | Essentials for engineers | High |

---

## ❌ What's NOT Covered

- Advanced quantitative finance (trader-level math)
- Market-making strategy details
- Probability puzzles (not typical for software engineers)
- Company-internal processes or strategies
- Leaked or confidential interview materials

---

## 🛠️ Contributing

See `CONTRIBUTING.md` for:
- How to add new questions
- Question JSON schema
- Citation guidelines
- Testing requirements

---

## 📞 Support

This is a self-study resource. For specific questions about your interview:
- Review the mock interview debrief sections
- Study the rubrics to understand what's being evaluated
- Practice with the provided scripts
- Adjust based on feedback from mentors

For questions about the repository structure or content, check `CONTRIBUTING.md`.

---

## 📄 License

This repository is educational material. Feel free to fork, study, and share (with appropriate attribution to this source).

**Last Updated:** 2026-07-24
