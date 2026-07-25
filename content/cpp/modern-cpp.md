# Modern C++11-20

Modern C++ is not a list of isolated features; it is a shift toward expressing ownership, lifetime, intent, and constraints in the type system. In HFT code, that matters because performance bugs and correctness bugs are often the same bug viewed from different angles. The useful mindset is: allocate predictably, move instead of copy when ownership transfers, constrain interfaces at compile time, and make invalid states unrepresentable.

## RAII principle and idiom

RAII means *Resource Acquisition Is Initialization*: tie a resource's lifetime to an object's lifetime so release happens deterministically in the destructor. The resource can be memory, a file descriptor, a mutex, a socket, or a kernel handle.

```cpp
class Fd {
public:
    explicit Fd(int fd) noexcept : fd_(fd) {}
    Fd(const Fd&) = delete;
    Fd& operator=(const Fd&) = delete;
    Fd(Fd&& other) noexcept : fd_(std::exchange(other.fd_, -1)) {}
    Fd& operator=(Fd&& other) noexcept {
        if (this != &other) {
            reset();
            fd_ = std::exchange(other.fd_, -1);
        }
        return *this;
    }
    ~Fd() { reset(); }
    int get() const noexcept { return fd_; }
private:
    void reset() noexcept { if (fd_ != -1) ::close(fd_); }
    int fd_{-1};
};
```

RAII is the reason exception-safe code can remain readable. In low-latency systems you may avoid exceptions on hot paths, but RAII remains the right tool for cleanup in all paths.

## Move semantics

Move semantics lets an object transfer ownership of expensive state instead of copying it. A move constructor initializes a new object from an rvalue; a move assignment replaces an existing object's state from an rvalue.

```cpp
class Buffer {
public:
    Buffer(std::size_t n) : n_(n), data_(new std::byte[n]) {}
    ~Buffer() { delete[] data_; }

    Buffer(const Buffer& other) : Buffer(other.n_) {
        std::memcpy(data_, other.data_, n_);
    }

    Buffer(Buffer&& other) noexcept
        : n_(std::exchange(other.n_, 0)),
          data_(std::exchange(other.data_, nullptr)) {}

    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data_;
            n_ = std::exchange(other.n_, 0);
            data_ = std::exchange(other.data_, nullptr);
        }
        return *this;
    }
private:
    std::size_t n_{};
    std::byte* data_{};
};
```

`std::move` does not move anything by itself; it casts to an xvalue, enabling move overloads. Use it only when you are done with the source object's current value.

## Smart pointers

`std::unique_ptr<T>` models exclusive ownership. It is zero-overhead relative to a raw pointer plus a deterministic delete. Prefer it by default for heap ownership.

`std::shared_ptr<T>` models shared ownership using a control block containing reference counts and, usually, deleter and allocator state. It is useful when multiple asynchronous components genuinely co-own an object. It is often the wrong default in HFT because atomic refcount traffic and non-deterministic destruction can increase latency variance.

`std::weak_ptr<T>` is a non-owning observer for `shared_ptr` graphs. Use it to break cycles or probe liveness without extending lifetime.

Typical use cases:
- `unique_ptr`: session objects, strategy components, ownership in container nodes.
- `shared_ptr`: shared config snapshots, long-lived graphs handed across threads when ownership is truly shared.
- `weak_ptr`: callback registries and observer patterns.

## Lambda expressions

Lambdas are unnamed function objects with captured state.

```cpp
auto price_ok = [limit = max_price, &book](double px) {
    return px <= limit && book.best_offer() <= px;
};

auto add = [](auto a, auto b) { return a + b; }; // generic lambda
int x = [] { return 40 + 2; }();                 // IIFE
```

Capture modes matter:
- `[=]`: capture used locals by value.
- `[&]`: capture used locals by reference.
- `[this]`: capture the current object pointer.
- `[ptr = std::move(p)]`: init-capture, often best for move-only state.

In concurrent code, blindly capturing by reference is a common lifetime bug.

## `constexpr` and `consteval`

`constexpr` means a function or variable can participate in constant evaluation if called with constant-evaluable inputs. The same function may still run at runtime.

`consteval` means every call must be evaluated at compile time.

```cpp
constexpr std::uint64_t mask(int bits) {
    return bits == 64 ? ~0ULL : ((1ULL << bits) - 1);
}

consteval int port_for_feed(char venue) {
    return venue == 'X' ? 3001 : 3002;
}
```

`consteval` is useful when runtime evaluation would represent a configuration bug.

## `auto`, `decltype`, range-based `for`

`auto` reduces duplication and preserves maintainability, but type deduction rules matter. `auto` drops top-level references and cv-qualifiers unless you write `auto&`, `const auto&`, or `auto&&`.

`decltype(expr)` yields a type based on expression form, which is essential in generic code. `decltype(auto)` preserves reference-ness in returns.

Range-based `for` improves correctness by avoiding index bugs:

```cpp
for (const auto& order : book.orders()) {
    process(order);
}
```

## Structured bindings (C++17)

Structured bindings unpack tuple-like values and aggregates.

```cpp
auto [it, inserted] = positions.try_emplace(symbol, 0);
if (inserted) {
    // first observation of symbol
}
```

Be careful: the binding may copy unless you bind by reference, e.g. `auto& [bid, ask] = top;`.

## `std::optional`, `std::variant`, `std::any`

`std::optional<T>` expresses “zero or one `T`” without sentinel values.

`std::variant<A, B, C>` is a tagged union with type-safe visitation. It is usually preferable to `void*`, manual tag enums, or inheritance when the set of alternatives is closed.

`std::any` stores any copyable type with type erasure. It is flexible but weakly constrained and generally less desirable in latency-critical paths because it obscures layout and can allocate.

```cpp
std::optional<double> mid_price();
using Event = std::variant<AddOrder, CancelOrder, Trade>;
```

## Concepts overview (C++20)

Concepts let you state template requirements directly.

```cpp
template <typename T>
concept PriceLike = requires(T t) {
    { t.to_ticks() } -> std::integral;
};

template <PriceLike T>
auto normalize(T p) { return p.to_ticks(); }
```

Benefits: better diagnostics, clearer intent, and more structured overload sets than `enable_if`-heavy SFINAE.

## Ranges overview (C++20)

Ranges turn iterator-based composition into pipeline composition.

```cpp
namespace rv = std::ranges::views;
auto aggressive = orders
    | rv::filter([](const auto& o) { return o.is_marketable(); })
    | rv::transform([](const auto& o) { return o.qty; });
```

Ranges improve expression clarity, but in hot paths you should understand whether adaptors create extra indirection, inhibit vectorization, or complicate debugging.

## Interview questions with answers

**Why is RAII superior to manual cleanup?**  
It makes cleanup deterministic and exception-safe, ties ownership to scope, and removes duplicated error-path logic.

**What exactly does `std::move` do?**  
It performs a cast to an rvalue/xvalue; it does not itself transfer resources.

**When is `shared_ptr` a bad choice?**  
When ownership is not genuinely shared, or when refcount traffic and non-deterministic destruction hurt latency and cache behavior.

**Why use `optional` instead of sentinel values?**  
It makes absence explicit in the type system and avoids invalid sentinel collisions.

**What problem do concepts solve?**  
They express template requirements declaratively and produce far better diagnostics than failed substitutions deep inside template machinery.

**Would you use ranges everywhere in HFT code?**  
No. They are excellent for clarity and tooling-friendly non-hot paths, but in the hottest loops a plain loop can be easier to profile and optimize.
