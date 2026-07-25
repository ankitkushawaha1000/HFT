
# C++ Foundations for HFT Interviews

Interviewers usually care less about obscure language trivia than about whether you can make sound performance and correctness decisions.

## High-Value Topics

- RAII and explicit ownership
- Move semantics and value categories
- `std::vector` growth behavior and memory locality
- Atomics, memory ordering, and false sharing
- Contention, lock scope, and single-writer designs
- Exception safety and construction failure handling

## How to Answer Well

- Start with the default you would choose in production.
- State the hidden cost model, such as heap traffic or cache coherence traffic.
- Explain when a more complex approach is justified.

## Interview Heuristic

If you say a construct is "faster," be ready to explain **why**: fewer allocations, tighter data layout, less synchronization, or better branch predictability.

## Common Pitfall

Avoid giving benchmark folklore without context. "Shared pointers are bad" is weaker than "shared ownership should be rare in hot paths because atomic reference count updates create coordination overhead and blur lifetime boundaries."
