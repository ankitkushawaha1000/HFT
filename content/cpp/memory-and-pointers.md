# Memory and Pointers

Senior C++ interviews in trading firms often move quickly from syntax to memory behavior: where bytes come from, who owns them, how long they live, and what the cost model looks like under pressure. The key skill is mapping language-level constructs to allocation behavior, cache behavior, and failure modes.

## Stack vs heap allocation

Stack allocation usually means automatic storage duration: space is reserved by adjusting the stack pointer, reclaimed automatically on scope exit, and often very cheap. It is ideal for small fixed-size objects, temporary state, and hot-path objects whose lifetime is lexical.

Heap allocation uses an allocator, typically via `operator new`, to request dynamic storage. It is appropriate when lifetime must outlive the current scope, size is only known at runtime, or ownership must be transferred.

Costs differ:
- stack: near-zero allocation overhead, excellent locality, deterministic reclamation;
- heap: allocator overhead, possible locks/contention, fragmentation, TLB/cache disruption, and latency variance.

In HFT, heap traffic inside the hottest path is usually treated as suspicious until proven harmless.

## `new`/`delete` vs `malloc`/`free`

`new` allocates storage and then constructs an object. `delete` runs the destructor and then deallocates. `malloc`/`free` only manage raw storage and know nothing about constructors, destructors, alignment beyond C guarantees, or array element counts.

```cpp
Widget* p1 = new Widget(42);   // allocation + construction
Widget* p2 = static_cast<Widget*>(std::malloc(sizeof(Widget))); // storage only
std::free(p2);
delete p1;
```

Mixing them is a bug: memory from `new` must be released with `delete`, and memory from `malloc` with `free`.

## `unique_ptr`, `shared_ptr`, `weak_ptr` internals

`unique_ptr<T, D>` stores a pointer and possibly a deleter. With an empty stateless deleter, empty base optimization often keeps size minimal. It has no reference counting and almost no overhead beyond destruction logic.

`shared_ptr<T>` typically stores the managed pointer separately from a control block that holds strong and weak counts, deleter, and possibly allocator state. `make_shared` often performs one allocation for both object and control block, improving locality.

`weak_ptr<T>` points to the same control block but does not contribute to strong ownership. `lock()` checks whether the managed object is still alive and returns a `shared_ptr` if so.

Costs of `shared_ptr` matter: refcount increments/decrements, usually atomic in multi-threaded implementations, can generate coherence traffic and unpredictable destruction points.

## Custom deleters

Custom deleters let smart pointers manage non-`delete` resources.

```cpp
using FilePtr = std::unique_ptr<FILE, int(*)(FILE*)>;
FilePtr fp(std::fopen("data.bin", "rb"), &std::fclose);
```

This is central to RAII for sockets, file descriptors, mmap regions, and pinned memory. For `unique_ptr`, the deleter type affects object size; for `shared_ptr`, the deleter typically lives in the control block.

## Memory leak detection

Leaks are not just “memory grows forever.” In low-latency systems, leaks also distort allocator behavior and can create performance cliffs long before OOM.

Practical tools:
- AddressSanitizer/LeakSanitizer for development builds;
- Valgrind Memcheck for exhaustive but slow checking;
- production metrics: resident set size, allocator stats, per-pool high-water marks;
- ownership review: prefer single-owner graphs and explicit lifetime domains.

## Dangling pointers and use-after-free

A dangling pointer refers to storage that no longer contains the original live object. Common causes:
- returning a pointer/reference to a local object;
- storing a pointer into a `std::vector` element across reallocation;
- using an object after `delete` or after pool recycle;
- capturing references in asynchronous callbacks whose owner has died.

Use-after-free is particularly dangerous because it may appear to work in debug builds and fail only under optimization or load.

## Buffer overflows

Buffer overflows occur when writes or reads go past object bounds. In C++, this is classic undefined behavior and a security problem. The source can be manual indexing, incorrect length fields from network messages, or stale assumptions after protocol changes.

Defensive patterns:
- prefer spans, iterators, and bounds-aware interfaces;
- keep length with data;
- validate external lengths before copying;
- use `std::array` for fixed-size buffers when possible;
- enable ASan in CI.

## Memory alignment and padding

Alignment is the boundary requirement for an object's address. Padding is extra space inserted so members satisfy alignment and arrays of the type remain correctly aligned.

```cpp
struct X {
    char c;
    int i;
}; // likely 8 bytes, not 5
```

Misunderstanding padding leads to serialization bugs and false-sharing bugs. In HFT, aligning frequently written counters to cache-line boundaries can matter more than shaving a few bytes from structure size.

## `std::aligned_storage`

`std::aligned_storage` historically provided untyped storage suitable for objects with a given size and alignment. It was often used in small-object containers or optional-like types. In modern C++, it is largely superseded by `alignas`, `std::byte` storage, and lifetime helpers such as `std::construct_at`. Treat it as legacy knowledge you may still encounter in older codebases.

## Practical guidance

- Prefer values and automatic storage first.
- Use `unique_ptr` for ownership on the heap.
- Use `shared_ptr` only when shared ownership is semantically required.
- Avoid raw owning pointers; raw pointers are best as non-owning observers.
- Avoid allocator calls in market-data or order-routing hot loops unless intentionally amortized.

## Interview questions with answers

**When should you prefer stack allocation?**  
For small, scope-bound objects where lifetime is lexical and deterministic reclamation matters.

**What is the difference between `new` and `malloc`?**  
`new` allocates and constructs; `malloc` only allocates raw bytes.

**Why can `shared_ptr` hurt latency?**  
Refcount updates create extra atomic/coherence work and destruction happens at less predictable times.

**What is a dangling pointer?**  
A pointer or reference that still exists after the target object's lifetime ended.

**Why does alignment matter?**  
Misaligned access can be slower or illegal, and layout affects cache behavior, serialization, and false sharing.

**How do you detect memory bugs in practice?**  
AddressSanitizer, LeakSanitizer, Valgrind, targeted stress tests, and careful ownership design.
