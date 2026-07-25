# Compilation, Linking, and ABI

Senior C++ engineers need a concrete model of what happens between source code and executable binary. This matters for debugging, performance, and deployment stability. HFT environments often build multiple tightly coupled services and shared libraries, so ABI mistakes can cause production outages even when code compiles cleanly.

## Compilation stages

The canonical stages are:
1. **Preprocessing**: expands `#include`, macros, conditional compilation.
2. **Compilation**: parses and optimizes translation units, producing assembly or IR.
3. **Assembly**: turns assembly into object files.
4. **Linking**: resolves symbols across object files and libraries to produce an executable or shared object.

In practice, modern compilers pipeline some of this internally, but the mental model remains useful.

## Object files and symbols

An object file contains machine code, relocation information, symbol tables, and sometimes debug information. Symbols can be defined or undefined, local or external, strong or weak, depending on platform/toolchain conventions.

Linkers resolve undefined references against available symbol definitions. Duplicate strong definitions generally produce link errors or ODR violations.

## Static vs dynamic libraries

A static library (`.a`) is an archive of object files linked into the executable at build time. This simplifies deployment and may enable more whole-program optimization, but increases binary size and rebuild coupling.

A shared library (`.so`) is loaded dynamically. It reduces duplication across processes and decouples deployment, but introduces runtime loader behavior, versioning concerns, PLT/GOT indirection, and ABI compatibility constraints.

In latency-sensitive environments, static linking is sometimes preferred for deployment simplicity and predictability, but operational requirements vary.

## Header-only libraries

Header-only libraries place implementation in headers, usually via templates or inline definitions. They are easy to integrate and optimize across call sites, but can increase compile times and code bloat. They also push more ODR responsibility onto the developer.

## ABI stability and breaking changes

ABI is the binary contract: object layout, name mangling, calling convention, exception model, alignment, vtable layout, symbol versions, and more. A code change can preserve API but break ABI.

Typical ABI breaks include:
- changing class layout by adding/reordering members;
- changing virtual function order or signatures;
- changing inlined constants or enum underlying types;
- compiling components with incompatible compiler/library versions or flags.

This is why plugin systems and shared library boundaries should expose narrow, stable interfaces.

## Name mangling

C++ supports overloading, namespaces, templates, and class methods, so symbol names are mangled to encode type information. `extern "C"` disables C++ name mangling for compatible declarations and is commonly used for C interoperability or stable exported entry points.

## LTO

Link-Time Optimization lets the compiler optimize across translation units at link time. It can improve inlining, dead-code elimination, and constant propagation, sometimes materially improving performance. Costs include longer link times, larger memory use during builds, and more complex debugging.

## ODR: One Definition Rule

The One Definition Rule requires that entities that must have one definition program-wide do so, and that repeated definitions allowed in headers be equivalent. Violating ODR can produce link errors, subtle runtime bugs, or silent UB.

Common ODR hazards:
- non-inline function definitions in headers;
- inconsistent macro-controlled class definitions across translation units;
- duplicated globals.

## Optimization flags

- `-O0`: prioritize debuggability; minimal optimization.
- `-O2`: strong general-purpose optimization; common production default.
- `-O3`: more aggressive optimizations such as heavier inlining/vectorization; can improve or hurt performance depending on code size and cache effects.
- `-Os`: optimize for size, sometimes improving I-cache behavior.

In HFT, `-O3` is not automatically better than `-O2`; measurement decides.

## Practical guidance

- Understand symbol visibility at library boundaries.
- Keep ABI boundaries small and versioned.
- Beware mixing compilers or standard-library implementations.
- Use LTO when build pipeline and debugging constraints allow it.
- Reproduce bugs with production-like optimization flags.

## Interview questions with answers

**What happens during linking?**  
The linker resolves symbol references, performs relocation, and combines object files and libraries into the final binary.

**What is the difference between API and ABI?**  
API is the source-level contract; ABI is the binary-level contract governing interoperability after compilation.

**Why can a class layout change break ABI?**  
Existing compiled code may use old offsets, sizes, or vtable expectations and become binary-incompatible.

**What does `extern "C"` do?**  
It requests C linkage, typically disabling C++ name mangling for compatible declarations.

**When can `-O3` be worse than `-O2`?**  
When extra inlining or code growth hurts I-cache locality or changes heuristics in unhelpful ways.

**What is an ODR violation?**  
A program-wide rule breach where an entity requiring a unique or equivalent definition is defined inconsistently across translation units.
## Operational pitfalls

ABI trouble often appears during rolling deploys, plugin loading, or when one component is rebuilt with a different compiler, standard library, or hidden visibility settings. Senior engineers should think in terms of reproducibility: exact compiler version, exact flags, exact dependency build mode.

Useful diagnostic tools include `nm`, `readelf`, `objdump`, and `ldd`. They help answer “which symbol is missing?”, “what shared object is being loaded?”, and “did the binary actually export what I think it exported?”

