# Value Categories

Value categories explain overload resolution, move semantics, perfect forwarding, and many “why did the compiler choose that overload?” questions. They are not academic: if you understand them well, you write interfaces that preserve performance without accidental copies or dangling references.

## The categories

The modern taxonomy is:
- **lvalue**: has identity and can generally appear on the left side of assignment; named objects are usually lvalues.
- **prvalue**: pure rvalue, typically a temporary value such as `42` or `make_order()`.
- **xvalue**: eXpiring value, an object near the end of its lifetime, such as `std::move(x)`.
- **glvalue**: generalized lvalue = lvalue or xvalue.
- **rvalue**: prvalue or xvalue.

The operational distinction is usually identity and move-eligibility. `std::move(x)` is an xvalue: it still denotes `x`, but as an expiring object.

## Reference types

`T&` binds to lvalues. `T&&` binds to rvalues. `const T&` binds to both lvalues and rvalues and is the classic read-only sink.

```cpp
void f(const std::string&); // read-only, no ownership transfer
void f(std::string&&);      // sink / may move from argument
```

A forwarding reference is a special case: `T&&` where `T` is a deduced template parameter, or `auto&&` in deduction contexts.

## `std::move` vs `std::forward`

`std::move` unconditionally casts to an xvalue. Use it when you want to treat a named object as movable because you no longer need its current value.

`std::forward<T>(x)` conditionally preserves the caller's value category in generic code. If `T` deduced to an lvalue reference, forwarding yields an lvalue; otherwise it yields an rvalue.

```cpp
template <typename T>
void wrapper(T&& x) {
    consume(std::forward<T>(x));
}
```

Using `std::move` instead of `std::forward` inside forwarding code turns lvalues into rvalues and can move from objects the caller expected to keep using.

## Perfect forwarding pattern

Perfect forwarding is about passing arguments through a wrapper without changing lvalue/rvalue-ness or cv-qualification more than necessary.

```cpp
template <typename F, typename... Args>
decltype(auto) invoke(F&& f, Args&&... args) {
    return std::forward<F>(f)(std::forward<Args>(args)...);
}
```

This pattern is central to emplace-style APIs and generic factories.

## Forwarding-reference deduction rules

If a function template parameter is `T&&` and the argument is:
- an lvalue of type `U`, `T` deduces as `U&`, so `T&&` collapses to `U&`;
- an rvalue of type `U`, `T` deduces as `U`, so `T&&` stays `U&&`.

Reference collapsing rules:
- `& &` -> `&`
- `& &&` -> `&`
- `&& &` -> `&`
- `&& &&` -> `&&`

This is why forwarding references work.

## Returning by value, reference, or move

Return by value when the function creates a new object or cheap/movable value. Modern C++ relies heavily on copy elision and efficient moves.

Return by reference only when the returned object outlives the call and the aliasing is part of the API contract.

Do not return references to locals. Do not `return std::move(local);` from a local unless you have a very specific reason; it usually blocks NRVO.

Good default for factory-style code:

```cpp
OrderBook build_book(); // by value
```

## Common mistakes

1. **Moving from an object and then assuming its value is unchanged.** Moved-from objects are valid but their value is unspecified unless documented otherwise.
2. **Binding a reference to a temporary and storing it.** Lifetime extension rules are narrower than many engineers remember.
3. **Using `std::move` on `const` objects.** Moving from `const T` usually falls back to copying because move operations typically require mutation.
4. **Returning `T&&` from functions.** Usually wrong unless forwarding a subexpression with extremely careful lifetime reasoning.
5. **Forgetting `decltype(auto)` in forwarding wrappers.** You can accidentally strip references from return types.

## UB-adjacent traps

The value-category model itself is not UB, but misuse causes it:
- forwarding a dangling reference;
- returning references to destroyed objects;
- using objects after moving when class invariants no longer satisfy assumptions;
- storing references into containers whose elements later relocate.

## Mental model for interviews

Ask three questions:
1. Does the expression have identity?
2. Is the object about to expire?
3. What reference type is the template actually deducing?

If you answer those, most value-category questions become mechanical.

## Interview questions with answers

**What is the difference between an lvalue and an rvalue?**  
An lvalue has persistent identity; an rvalue is generally a temporary or expiring value used to initialize, not to be assigned through.

**What is an xvalue?**  
A glvalue denoting an object whose resources may be reused, e.g. `std::move(x)`.

**When is `T&&` a forwarding reference?**  
Only when `T` is deduced in that context, such as a function template parameter or `auto&&` deduction.

**Why use `std::forward`?**  
To preserve the caller's value category through a generic wrapper.

**When should you return by value?**  
When producing a new object; modern compilers elide or move efficiently, and value return is safer than aliasing.

**What is wrong with moving from a `const` object?**  
Most move operations mutate the source, so a `const` source usually cannot bind to move overloads and ends up copied.
