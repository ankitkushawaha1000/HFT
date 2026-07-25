# Undefined Behavior

Undefined behavior is not merely “the program may crash.” It means the C++ standard imposes no requirements on the program's behavior after the violating construct. Compilers therefore optimize under the assumption that UB does not occur, and those assumptions can transform code in surprising ways. In HFT systems, UB is especially dangerous because it often appears only under peak optimization, peak load, or rare data patterns.

## Categories of UB in C++

Broad classes include:
- lifetime violations;
- out-of-bounds access;
- invalid pointer arithmetic/dereference;
- data races;
- strict aliasing violations;
- signed overflow;
- uninitialized reads;
- invalid shifts and narrowing assumptions;
- violating library preconditions.

The important mindset is that UB lets the optimizer assume impossible states never happen, so surrounding code may be rewritten in ways that defeat naive debugging.

## Signed integer overflow

Signed overflow is UB in C++. For example, `int x = INT_MAX; ++x;` is not defined to wrap. Compilers can exploit this to simplify range checks or loop conditions.

Use unsigned wraparound only when semantically appropriate, or use wider types, checked arithmetic, or explicit saturating logic.

## Null pointer dereference

Dereferencing a null pointer is UB. Compilers may assume a dereferenced pointer is non-null and optimize away subsequent null checks. This is why “we checked later” is not a valid defense.

## Use-after-free

Accessing storage after object lifetime ends is classic UB. The fact that the bytes still look intact is irrelevant. Optimizers and allocators may reuse or poison the region, and speculative hardware behavior can mask or expose the bug nondeterministically.

## Out-of-bounds access

Reading or writing beyond array/container bounds is UB except where APIs explicitly permit one-past-the-end pointers for iteration without dereference. Out-of-bounds reads are not “harmless”; they can invalidate optimizer assumptions and create security vulnerabilities.

## Strict aliasing rule

The strict aliasing rule restricts reading an object through an unrelated type. Violations let the compiler assume two pointers cannot refer to the same object and reorder or cache values accordingly.

Legitimate exceptions include aliasing through `char`, `unsigned char`, or `std::byte`, and certain standard-sanctioned cases. If you need bit reinterpretation, prefer `std::bit_cast` for same-size trivially copyable types or explicit serialization.

## Uninitialized reads

Reading an indeterminate value is UB for many types. Developers sometimes assume stack garbage is just an unpredictable number, but the language contract is weaker than that. Uninitialized state also contaminates branch decisions, often producing unreproducible failures.

## Integer promotion pitfalls

A common interview area is “promotion bugs.” Small integer types such as `char` and `short` are promoted to `int` in many expressions. Left shifts, signedness changes, or narrowing conversions can create UB or logic errors if the intermediate type cannot represent the intended value.

For example, shifting a signed value into the sign bit or by an invalid amount is problematic. The correct lesson is to reason about exact types and conversions, not just final assignment types.

## Sanitizers

- **AddressSanitizer (ASan)**: finds out-of-bounds accesses, use-after-free, double-free, stack-use-after-scope, and related memory issues.
- **UBSan**: instruments many forms of undefined behavior such as invalid shifts, signed overflow, null misuse, misaligned access, and vptr issues.
- **ThreadSanitizer (TSan)**: detects data races.

These are development tools, not proof systems, but they catch an enormous fraction of real defects early.

## Detecting and preventing UB

1. Use sanitizers in CI and pre-release test runs.
2. Prefer types and APIs that encode bounds and ownership.
3. Avoid clever aliasing tricks.
4. Keep lifetimes lexical where possible.
5. Review optimizer-sensitive code under `-O2`/`-O3`, not only `-O0`.
6. Use static analysis and warnings aggressively.
7. For binary protocols, make layout and conversions explicit.

## HFT-specific concerns

Performance pressure tempts engineers toward custom allocators, manual layout, unions, branchless arithmetic, and lock-free structures. Those are all legitimate tools, but they sit close to UB edges. Senior engineers earn trust by combining low-level performance work with proof-oriented discipline.

## Interview questions with answers

**Why is signed overflow UB?**  
The language leaves it undefined so compilers can optimize assuming mathematically impossible overflow states do not occur.

**Can an out-of-bounds read be harmless if you never write?**  
No. It is still UB and can break correctness or security.

**What is the strict aliasing rule in practice?**  
You generally may not access an object through an unrelated pointer type because the compiler assumes such pointers do not alias.

**Why are null checks after dereference unreliable?**  
Once a dereference exists, the optimizer may assume the pointer was non-null and eliminate later checks.

**What do sanitizers buy you?**  
Fast, actionable detection of memory, UB, and race bugs that might otherwise appear only under optimization or load.

**Does passing sanitizer builds mean the code is correct?**  
No. Sanitizers increase confidence dramatically but do not prove the absence of UB.
## Review mindset

When reviewing low-level code, look for patterns rather than isolated statements: pointer arithmetic near protocol parsing, storage reuse with placement `new`, aliasing through unrelated structs, unchecked shifts, or races hidden behind “debug only” flags. Most serious UB survives because the local code looks plausible while the lifetime or type-system contract has already been broken somewhere else.

That is why senior reviewers ask “what object is alive here?” and “what does the optimizer assume?”

