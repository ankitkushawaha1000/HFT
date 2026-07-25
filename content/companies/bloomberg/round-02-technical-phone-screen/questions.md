# Bloomberg — Round 2: Technical Phone Screen

**What this round assesses:** Algorithmic problem-solving and core C++ language knowledge.

## Format

1–2 live CoderPad sessions, 45–60 min each; typically one coding problem plus substantial C++ conceptual questions.

## Online assessment details

Platform: CoderPad live coding. Number/type: 1 coding problem plus C++ internals. Topics: LRU cache, linked lists, BSTs, smart pointers, Rule of Five, move semantics, references. `anecdotal`

## Representative questions

1. Implement a simplified LRU Cache with `unordered_map<int, list<int>::iterator>` and `list<int>`. `anecdotal`
2. Reverse a linked list in groups of K. `anecdotal`
3. Validate a BST using in-order traversal or min/max bounds. `anecdotal`
4. Explain `std::unique_ptr` vs. `std::shared_ptr`; how does the `shared_ptr` control block and reference count work? `anecdotal`
5. What is the Rule of Five? Implement a simple string class with all five special member functions. `anecdotal`
6. What does `std::move` actually do at the machine-code level? `anecdotal`
7. Explain lvalue vs. rvalue references; what is `std::forward` and when do you use it? `anecdotal`

## Sources

- https://leetcode.com/company/bloomberg/ `anecdotal`
- Glassdoor Bloomberg technical phone screen `anecdotal`
