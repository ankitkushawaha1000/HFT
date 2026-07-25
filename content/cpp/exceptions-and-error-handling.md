# Exceptions and Error Handling

Error handling in production C++ is about more than syntax. It is about expressing failure semantics, preserving invariants, bounding latency, and keeping interfaces honest. HFT firms care because the right answer differs between startup/configuration code, control-plane services, and the hot trading path.

## Exception safety guarantees

The classic guarantees are:

- **nothrow guarantee**: operation will not throw.
- **strong guarantee**: on failure, the observable state is unchanged.
- **basic guarantee**: invariants hold and no resources leak, but state may change.
- **no guarantee**: failure may leave state corrupted.

Strong guarantee often uses copy-and-swap or transactional staging. Basic guarantee is the practical baseline for many mutating operations. No guarantee is rarely acceptable in production code.

## RAII and exception safety

RAII is the cornerstone of exception safety because stack unwinding destroys fully constructed automatic objects in reverse order.

```cpp
void load_config(const std::string& path) {
    std::ifstream in(path);
    if (!in) throw std::runtime_error("open failed");
    std::vector<std::string> lines;
    // if push_back throws, file still closes automatically
}
```

Even teams that avoid exceptions in the matching engine still rely on RAII for deterministic cleanup in initialization and tooling code.

## `noexcept`

`noexcept` serves two roles:
- documents and enforces a no-throw contract;
- enables optimizations and library behavior, especially move operations.

Standard containers prefer move operations that are `noexcept`; otherwise they may fall back to copying during reallocation to preserve strong exception safety.

Use `noexcept` when you can truly uphold it. Marking a function `noexcept` and then throwing leads to `std::terminate`.

## `std::terminate`

`std::terminate` is called when the runtime cannot continue exception processing safely. Common reasons:
- an exception escapes a `noexcept` function;
- a destructor throws during stack unwinding;
- an exception escapes the top of a thread function;
- a `std::thread` is destroyed while still joinable.

In low-latency systems, deliberate termination on unrecoverable invariant failure is sometimes preferable to limping forward with corrupted state.

## Stack unwinding

When an exception propagates, stack frames are unwound and destructors for fully constructed automatic objects run. Constructors that fail only unwind already-constructed subobjects. This is why partially initialized classes remain tricky: invariants should be established incrementally and resource members should manage themselves.

## Alternatives: `std::expected` and error codes

`std::expected<T, E>` (standardized in C++23, widely discussed in 2026 codebases) represents either a value or an error explicitly in the type system. It is excellent for predictable, local failure paths where you want static visibility without exception machinery.

Error codes are still useful when:
- interfacing with C APIs or syscalls;
- failure is frequent and expected;
- you need extremely explicit hot-path control flow.

Exceptions are useful when:
- failure is exceptional rather than routine;
- you need to separate error handling from the success path;
- stack unwinding cleanly composes with RAII.

## Exceptions vs error codes in HFT

A common production stance is:
- allow exceptions in startup, configuration, offline tooling, admin services, and non-latency-critical code;
- avoid exceptions in the hottest trading and market-data paths if their unpredictability, binary impact, or policy constraints are unacceptable;
- convert boundary failures into explicit status objects before entering the critical path.

This is less ideology than engineering tradeoff. The key is consistency across subsystem boundaries.

## Common production patterns

1. **Initialization throws, runtime path returns status**: parse config with exceptions, then operate with prevalidated state.
2. **Boundary translation**: catch low-level exceptions at a subsystem boundary and translate to a domain error type.
3. **Fail-fast invariants**: use assertions or termination for impossible states; do not attempt recovery from memory corruption or broken synchronization assumptions.
4. **`expected` for composable business logic**: explicit propagation without hidden control flow.

## Practical design rules

- Destructors should not throw.
- Make moves `noexcept` where correct.
- State the guarantee your API offers.
- Keep mutation and allocation staged so rollback is easy.
- Do not mix exception and error-code policies arbitrarily within a hot subsystem.

## Interview questions with answers

**What is the strong exception guarantee?**  
If the operation throws, the observable program state is unchanged.

**Why does `noexcept` matter for move operations?**  
Containers may use `noexcept` moves during reallocation; otherwise they may copy to preserve stronger guarantees.

**When is `std::terminate` called?**  
For example when an exception escapes a `noexcept` function or a destructor throws during unwinding.

**Would you use exceptions in the HFT hot path?**  
Usually not by policy unless carefully justified; explicit error channels are often preferred for predictability.

**What role does RAII play in exception safety?**  
It guarantees cleanup during stack unwinding and prevents resource leaks on failure paths.

**When is `std::expected` attractive?**  
When failures are expected, local, and benefit from explicit type-level handling without exception control flow.
## Choosing the policy

The best production policy is explicit and subsystem-specific. A matching engine, market-data parser, and order gateway should not each invent their own ad hoc failure style. Teams typically choose one of three patterns: exceptions at boundaries only, exceptions allowed except on designated hot paths, or explicit status values everywhere. Consistency is usually more valuable than theoretical purity because it makes invariants reviewable and failures observable.

