# Templates and Concepts

    Templates are C++'s compile-time abstraction mechanism. In HFT, they matter because they let you write zero-overhead generic code: fixed-size containers, policy-based dispatch, strongly typed wrappers, and compile-time checks that remove runtime branches. The danger is unreadable diagnostics and accidental complexity. Concepts help fix that.

    ## Function and class templates

    Function templates generalize behavior across types:

    ```cpp
    template <typename T>
    T max2(const T& a, const T& b) {
        return a < b ? b : a;
    }
    ```

    Class templates generalize data structures:

    ```cpp
    template <typename T, std::size_t N>
    class RingBuffer {
        std::array<T, N> data_{};
        std::size_t head_{};
        std::size_t tail_{};
    };
    ```

    Non-type template parameters such as `N` are especially useful when capacity is part of the contract and should be compile-time visible.

    ## Full and partial specialization

    Full specialization provides a completely custom implementation for one exact type set.

    ```cpp
    template <typename T>
    struct WireFormat;

    template <>
    struct WireFormat<std::uint32_t> { static constexpr int tag = 7; };
    ```

    Partial specialization customizes a family, usually for class templates:

    ```cpp
    template <typename T>
    struct IsPointerLike : std::false_type {};

    template <typename T>
    struct IsPointerLike<T*> : std::true_type {};
    ```

    Function templates cannot be partially specialized; overload them instead.

    ## SFINAE and `enable_if`

    SFINAE means *Substitution Failure Is Not An Error*. If substituting template arguments makes a declaration invalid in certain contexts, that candidate is removed from overload resolution rather than causing a hard error.

    ```cpp
    template <typename T,
              std::enable_if_t<std::is_integral_v<T>, int> = 0>
    T next_pow2(T x);
    ```

    Pre-C++20 generic libraries used heavy SFINAE. It works, but concepts are clearer and produce much better diagnostics.

    ## Type traits and template metaprogramming basics

    Type traits are compile-time predicates or transformations such as `std::is_integral_v<T>`, `std::remove_reference_t<T>`, and `std::conditional_t<B, X, Y>`. They let code vary by type without runtime cost.

    ```cpp
    template <typename T>
    constexpr bool trivially_wireable_v =
        std::is_trivially_copyable_v<T> && std::is_standard_layout_v<T>;
    ```

    For systems code, traits often encode serialization constraints, lock-free safety conditions, or API admissibility.

    ## Variadic templates

    Variadic templates accept zero or more template arguments or function parameters.

    ```cpp
    template <typename... Ts>
    struct TypeList {};

    template <typename... Args>
    void log(Args&&... args);
    ```

    They power tuples, formatters, forwarding utilities, and heterogenous containers.

    ## Fold expressions (C++17)

    Fold expressions compress parameter-pack recursion into direct syntax.

    ```cpp
    template <typename... Args>
    auto sum(Args... args) {
        return (... + args);
    }

    template <typename... Args>
    void log_line(Args&&... args) {
        (std::cout << ... << args) << '
';
    }
    ```

    This is simpler and usually clearer than recursive pack expansion idioms.

    ## `constexpr if`

    `if constexpr` discards the non-taken branch during compilation.

    ```cpp
    template <typename T>
    void encode(const T& x) {
        if constexpr (std::is_integral_v<T>) {
            encode_int(x);
        } else {
            encode_object(x);
        }
    }
    ```

    This removed large amounts of tag dispatch boilerplate from modern C++ code.

    ## Concepts and `requires` clauses (C++20)

    Concepts are named compile-time predicates used to constrain templates.

    ```cpp
    template <typename T>
    concept Hashable = requires(T t) {
        { std::hash<T>{}(t) } -> std::convertible_to<std::size_t>;
    };

    template <Hashable K, typename V>
    class FastMap;
    ```

    A `requires` clause can appear directly on templates:

    ```cpp
    template <typename T>
    requires std::totally_ordered<T>
    T clamp_bid(T x, T lo, T hi);
    ```

    Concepts document intent and control overload sets in a first-class way.

    ## Abbreviated function templates

    With C++20, `auto` in a parameter can denote a constrained or unconstrained template.

    ```cpp
    auto twice(std::integral auto x) {
        return x * 2;
    }
    ```

    This is concise and often ideal for local utilities, though for public APIs many teams still prefer explicit template parameter lists for readability.

    ## Production guidance

    - Put meaningful constraints on public generic APIs.
    - Prefer concepts over `enable_if` in new code.
    - Keep metaprogramming close to domain value; avoid “template cleverness” without a measured benefit.
    - Expose capacities, alignments, and policies as template parameters when they are true compile-time invariants.
    - In HFT, template instantiation bloat can hurt build times and I-cache; genericity still has a cost model.

    ## Interview questions with answers

    **What is SFINAE?**  
    During template substitution, invalid candidates can be removed from overload resolution instead of causing a hard error.

    **Why are concepts better than `enable_if`?**  
    They express requirements directly, are easier to read, and usually produce much better diagnostics.

    **Can function templates be partially specialized?**  
    No. Use overloading or helper class templates instead.

    **What problem does `if constexpr` solve?**  
    It allows compile-time branching without instantiating the discarded branch.

    **When would you use a non-type template parameter?**  
    When a value such as capacity, alignment, or protocol width is part of the type-level contract.

    **What is a fold expression?**  
    A compact syntax for reducing a parameter pack with an operator, replacing recursive pack-expansion patterns.
## Interview framing

Senior candidates should connect templates to engineering tradeoffs, not only syntax. Good generic code removes duplication while preserving the same data layout and machine code quality you would expect from hand-written specialization. Bad generic code explodes compile times, diagnostics, and binary size. Concepts help by making the contract explicit at the API boundary rather than buried in template instantiation errors.

