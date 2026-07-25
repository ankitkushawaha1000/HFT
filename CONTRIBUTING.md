
# Contributing Guide

Thanks for improving the HFT interview preparation repository. The project is designed to be both a study tool and a maintainable knowledge base, so every contribution should raise signal quality, citation quality, or usability.

## Repository Principles

- Prefer depth over breadth. A smaller set of precise, interview-ready material is better than a large set of vague notes.
- Separate facts from inference. If a statement is based on anecdotal evidence, say so explicitly.
- Write for senior-level discussion. Answers should explain tradeoffs, failure modes, and operating constraints.
- Keep examples executable. C++ snippets should compile cleanly under the root CMake configuration.

## Adding New Questions

Questions live in `data/questions.json` as an array of objects. Each object should be self-contained enough to power the website, mock interview mode, search index, and future exports.

### Required Question Fields

Every question entry must include these fields:

- `id`: stable kebab-case identifier, unique across the repository.
- `title`: short label that appears in the UI.
- `prompt`: the exact question a candidate would hear.
- `topic`: one of `behavioral`, `cpp`, `systems`, `low-latency`, `design`, `trading`, or `coding`.
- `difficulty`: one of `easy`, `medium`, or `hard`.
- `companies`: array containing one or more of `optiver`, `citadel`, `jane-street`, or `general`.
- `tags`: 3-8 search-friendly keywords.
- `summary`: 1-2 sentence high-level answer preview.
- `answer`: complete answer in Markdown.
- `rubric`: object with `1`, `3`, and `5` keys describing weak, competent, and strong responses.
- `followUps`: array of realistic follow-up prompts.
- `pitfalls`: array of common failure modes.
- `citations`: array of citation objects.

### Citation Object Format

Each citation object should follow this shape:

```json
{
  "label": "C++ Core Guidelines: R.20",
  "url": "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-smartptr",
  "type": "official",
  "confidence": "high",
  "note": "Supports the recommendation to express ownership explicitly with smart pointers."
}
```

### Confidence Levels

Use confidence consistently:

- `high`: official company material, standards documents, authoritative library/runtime documentation, or directly reproducible measurements.
- `medium`: strong inference from multiple public job descriptions, conference talks, or several independent candidate reports.
- `low`: a single anecdotal report or informed extrapolation that still adds value if clearly labeled.

Never present `medium` or `low` confidence material as settled fact.

### Example Question Entry

```json
{
  "id": "cpp-unique-shared-ownership",
  "title": "When would you use unique_ptr vs shared_ptr?",
  "prompt": "Explain when you would use std::unique_ptr instead of std::shared_ptr in latency-sensitive C++ code.",
  "topic": "cpp",
  "difficulty": "medium",
  "companies": ["optiver", "citadel", "general"],
  "tags": ["ownership", "memory", "latency", "raii"],
  "summary": "Prefer unique ownership by default because it is cheaper, clearer, and avoids accidental shared lifetime coupling.",
  "answer": "...full markdown answer...",
  "rubric": {
    "1": "Only states that unique_ptr is faster.",
    "3": "Explains ownership and reference counting overhead.",
    "5": "Connects ownership semantics to cache traffic, design clarity, and failure modes."
  },
  "followUps": [
    "What are the hidden costs of shared_ptr?",
    "When is intrusive reference counting preferable?"
  ],
  "pitfalls": [
    "Claiming shared_ptr is always bad.",
    "Ignoring ownership semantics in favor of micro-benchmark folklore."
  ],
  "citations": [
    {
      "label": "C++ Core Guidelines: R.20",
      "url": "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-smartptr",
      "type": "official",
      "confidence": "high",
      "note": "Recommends using smart pointers to represent ownership."
    }
  ]
}
```

## Adding New Content Files

Long-form notes live under `content/` and should be grouped by category:

- `content/study-plans/`
- `content/behavioral/`
- `content/cpp/`
- `content/systems/`
- `content/low-latency/`
- `content/design/`
- `content/trading/`
- `content/coding/`
- `content/mock-interviews/`

When you add a new Markdown file:

1. Use a descriptive filename in kebab-case.
2. Add or update the relevant entry in `data/content-index.json`.
3. Keep the opening section concise enough to preview in search results.
4. Add `CANDIDATE_TODO` only where personal candidate input is genuinely required.
5. Verify internal links remain valid with `npm test`.

## C++ Example Style

C++ examples should optimize for clarity under interview pressure while still respecting production habits.

- Target C++17.
- Prefer RAII, value semantics, and explicit ownership.
- Avoid `using namespace std;`.
- Include only headers you use.
- Keep translation units small and focused on a single idea.
- Make latency-sensitive assumptions explicit in comments or naming.
- Prefer `std::array`, `std::vector`, and `std::span`-like interfaces over raw pointers unless pointer-level control is the point of the example.
- Write branch-safe, bounds-aware code even in interview examples.
- Compile warning-free with the root `CMakeLists.txt` warning flags enabled.

## Running Tests

From the repository root:

```bash
npm install
npm test
npm run validate
cmake -S . -B build
cmake --build build
ctest --test-dir build --output-on-failure
```

Use the smallest meaningful validation loop for your change. Documentation-only changes usually need `npm test`; JavaScript changes should also run `npm run validate`; C++ changes should also run the CMake and CTest commands.

## Pull Request Checklist

Before opening a pull request, confirm all of the following:

- [ ] The change improves factual quality, learning quality, or usability.
- [ ] New questions include all required fields.
- [ ] Citations include accurate confidence labels.
- [ ] `CANDIDATE_TODO` appears only where personal candidate input is necessary.
- [ ] Markdown renders correctly in the website.
- [ ] `npm test` passes.
- [ ] Any affected C++ example builds cleanly with warnings enabled.
- [ ] The PR description explains what changed, why it matters, and how it was validated.
