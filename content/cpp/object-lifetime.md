# Object Lifetime

Object lifetime is one of the most important and most misunderstood parts of C++. In interview settings, many “trick” questions are really about distinguishing storage duration, initialization, and lifetime. In production HFT code, getting lifetime wrong leads to use-after-free, type punning bugs, stale references, or subtle data corruption under optimization.

## Creation order

There are several relevant notions:
- **Storage duration**: static, thread, automatic, dynamic.
- **Initialization**: when the object's constructor or initialization logic runs.
- **Lifetime**: begins when initialization is complete for most objects, ends when the destructor begins for class types or when storage is released/reused.

Global and namespace-scope objects with static storage duration are initialized before `main`, but across translation units the order of dynamic initialization is only partially defined. This is the classic static initialization order fiasco.

Local automatic objects are created when control passes through their declarations. Member subobjects are initialized before the constructor body, in declaration order, not the order written in the initializer list.

```cpp
struct Engine {
    Logger log;
    Socket sock;
    Engine() : sock(open_socket()), log(make_logger()) {} // log still initializes first
};
```

The code above is dangerous if `sock` depends on `log`, because declaration order dominates.

## Destructor order guarantees

Destruction happens in reverse construction order:
- local automatic objects: reverse order within scope;
- members: reverse declaration order;
- bases: reverse base construction order;
- arrays: reverse element order.

Static objects are destroyed after `main` exits, again with cross-translation-unit pitfalls. Function-local statics are often preferred because initialization is lazy and thread-safe since C++11.

## Copy elision and NRVO/RVO

Copy elision allows the implementation to construct directly into the destination storage rather than create a temporary and move/copy from it. Since C++17, prvalues do not necessarily materialize temporary objects in the old sense; many cases are guaranteed elision.

```cpp
OrderBook make_book() {
    OrderBook b;
    return b; // NRVO if named object is returned
}

OrderBook book = make_book();
```

RVO refers to returning a temporary directly, while NRVO refers to returning a named local. Do not write `return std::move(b);` here; that can inhibit NRVO and is usually counterproductive.

## Placement `new` and manual lifetime management

Placement `new` constructs an object in pre-allocated storage.

```cpp
alignas(Order) std::byte storage[sizeof(Order)];
Order* p = new (storage) Order{"AAPL", 100};
std::destroy_at(p);
```

This pattern matters in memory pools, arenas, ring buffers, and lock-free data structures. But manual lifetime management is advanced C++: storage can exist without a live object inside it, and after destruction you must not access the former object as though it were still alive.

Placement `new` does **not** allocate; it only constructs.

## `std::construct_at` (C++20)

`std::construct_at(ptr, args...)` is the library facility that expresses placement construction more clearly and composes better with generic code.

```cpp
auto* p = std::construct_at(reinterpret_cast<Order*>(storage), "AAPL", 100);
std::destroy_at(p);
```

Prefer `construct_at`/`destroy_at` in modern code when manually controlling lifetime.

## `std::launder`

`std::launder` exists for the cases where an object is created in storage formerly occupied by another object and the optimizer may treat old pointers as referring to the old object model. It is mainly relevant after placement `new`, especially when reusing storage for the same type or when const/reference subobjects are involved.

```cpp
alignas(int) unsigned char buf[sizeof(int)];
int* p = new (buf) int(1);
p->~int();
new (buf) int(2);
int* q = std::launder(reinterpret_cast<int*>(buf));
```

If you never do manual storage reuse, you usually do not need `launder`. If you do, know it well.

## Object lifetime and undefined behavior

Common lifetime UB includes:
- reading an object before its lifetime begins;
- using a pointer/reference after the object's lifetime ended;
- reinterpreting raw storage as a live object when no object exists there;
- accessing inactive union members incorrectly;
- reusing storage without respecting alignment and lifetime restart rules.

A frequent interview trap is confusing allocated bytes with a constructed object. `malloc(sizeof(T))` gives storage, not a live `T`.

## Trivial vs non-trivial types

Trivial and non-trivial types matter because they determine what operations are legal and cheap. A trivially destructible type does not require destructor execution. A trivially copyable type can be copied by `memcpy` without changing meaning. Many low-latency structures are intentionally designed to remain simple, standard-layout, or trivially copyable because that improves interoperability with shared memory, NIC DMA buffers, and binary protocols.

But never assume “POD-like enough”; know the exact trait you need: `std::is_trivially_copyable_v<T>`, `std::is_trivially_destructible_v<T>`, and so on.

## Practical rules

1. Prefer ordinary automatic storage and RAII unless you have a measured reason not to.
2. Avoid global objects that depend on other globals.
3. Never `memcpy` non-trivially copyable objects.
4. In factory functions, return by value and let copy elision work.
5. When using object pools, separate storage management from object lifetime management in your mental model.

## Interview questions with answers

**In what order are class members initialized?**  
Declaration order in the class, not initializer-list order.

**In what order are local variables destroyed?**  
Reverse order of construction within the scope.

**Why is `return std::move(local);` usually wrong?**  
It may prevent NRVO and is unnecessary because the compiler can elide or move automatically.

**What is placement `new` for?**  
Constructing an object in already-allocated storage, commonly used in arenas, pools, and custom containers.

**What does `std::launder` solve?**  
It gives a pointer that the optimizer must treat as referring to the newly created object after storage reuse.

**Can you use `memset` or `memcpy` on any type?**  
No. Only trivial/trivially copyable cases are safe; doing so on non-trivial types is undefined behavior.
