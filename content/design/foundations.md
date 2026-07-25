
# Design Foundations

HFT design interviews reward clarity on scope, invariants, and sequencing. Do not jump into architecture diagrams before you know what must be correct and what must be fast.

## Recommended Flow

1. Clarify request rate, burst profile, latency target, and correctness constraints.
2. Separate critical path from control path.
3. State the minimal version you would ship first.
4. Discuss failure handling and observability before scaling strategies.
5. Add optimization only where it solves a measured bottleneck.

## High-Value Tradeoffs

- Single process determinism vs distributed scaling
- Lock-free complexity vs single-thread ownership simplicity
- Synchronous durability vs latency budget
- Rich validation vs critical-path cost

## What Makes an Answer Feel Senior

Senior answers describe how the system behaves under overload, data corruption, dependency failure, or clock skew — not just when everything is healthy.
