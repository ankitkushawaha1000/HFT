# Code Review Exercises for HFT Interviews

Research date: 2026-07-24

Some HFT interviews assess review skill rather than greenfield coding. The interviewer wants to know whether you can spot correctness, concurrency, memory, API, and performance issues quickly. These exercises are intentionally compact and discussion-oriented.

## Exercise 1: Multi-threaded producer/consumer review

### Code with issues

```cpp
std::queue<int> q;
bool done = false;

void producer() {
    for (int i = 0; i < 1000; ++i) q.push(i);
    done = true;
}

void consumer() {
    while (!done || !q.empty()) {
        if (!q.empty()) {
            int x = q.front();
            q.pop();
            process(x);
        }
    }
}
```

### What to look for

- data race on `q`
- data race on `done`
- busy-spin wastes CPU
- check-then-act race around `empty`, `front`, and `pop`

### Correct version sketch

Use a mutex, condition variable, and a predicate loop. If low latency is required and topology allows it, an SPSC queue may be better.

## Exercise 2: Memory management review

### Code with issues

```cpp
int* build_array(std::size_t n) {
    int* p = new int[n];
    if (n == 0) return nullptr;
    return p;
}
```

### What to look for

- leak when `n == 0`
- raw ownership unclear
- caller burden and exception safety concerns

### Correct version sketch

Prefer `std::vector<int>` or `std::unique_ptr<int[]>` depending on the API. Make ownership explicit and avoid returning raw owning pointers unless required.

## Exercise 3: Performance review

### Code with issues

```cpp
std::vector<std::string> symbols = load_symbols();
for (auto s : symbols) {
    if (is_active(s)) {
        publish(format_message(s));
    }
}
```

### What to look for

- copies each string in the range loop
- likely repeated allocation in `format_message`
- may need precomputed active set or cheaper representation

### Correct version sketch

Use `const auto&`, prefer `string_view` if safe, and consider building messages into reusable buffers on hot paths.

## Exercise 4: Error handling review

### Code with issues

```cpp
void send_order(const Order& o) {
    socket_send(encode(o));
    mark_live(o.id);
}
```

### What to look for

- if `encode` or `socket_send` fails, state may diverge
- no retry or error path
- no explicit ordering of local journal/state update versus send semantics

### Correct version sketch

Define the invariant precisely: when is an order considered “sent”? Journal or reserve state before the send if recovery requires it, then only mark live on confirmed transition.

## Exercise 5: API design review

### Code with issues

```cpp
class Book {
public:
    void update(std::string type, double price, int qty);
};
```

### What to look for

- `std::string` for a tiny finite action set
- `double` for price is risky
- ambiguous semantics around update kinds
- no error signaling or type safety

### Correct version sketch

Use strong enums, integer tick prices, and separate well-defined operations such as `add_order`, `cancel_order`, and `execute_trade` if the domain requires it.

## Review process advice

In a review interview:

1. start with correctness and safety issues
2. then cover concurrency or memory problems
3. then discuss performance and API clarity
4. rank findings by severity
5. explain concrete fixes, not just criticisms

This mirrors how strong engineers review production changes.

## How to rank findings by severity

A good review distinguishes between correctness bugs, crash or data-loss risks, performance issues, and style concerns. In HFT-oriented code, data races, silent state divergence, and incorrect price or quantity representations should be raised before cosmetic naming issues.

## What a strong spoken review sounds like

For each snippet, say what is wrong, why it matters operationally, and how you would fix it. For example: “This queue access has a race and can corrupt state under concurrent producer and consumer activity. I would protect the queue with a mutex and condition variable, or redesign to SPSC if topology permits.”

## Extra review lens: API contracts

Interviewers often reward candidates who ask what guarantees the API is supposed to provide. Ambiguous ownership, unclear lifetime, or hidden blocking behavior are design problems even if the local code seems technically correct.

## Additional review questions interviewers may ask

They may ask which issue you would fix first, how you would test the correction, or whether the bug is likely in production versus only under rare stress. Strong answers prioritize issues that can corrupt state, lose money, or create silent divergence ahead of mere inefficiency.

## Review mindset for senior candidates

The best review answers are calm and structured: start with severity, explain impact, propose a concrete remediation, and mention one preventative practice such as stronger typing, better tests, or stricter API contracts. That shows you can improve team code quality, not just spot isolated mistakes.

## Fast checklist during the interview

Ask yourself: Is there a race? A lifetime bug? A state-machine bug? A silent data corruption path? An unnecessary copy or allocation on the hot path? This checklist helps you cover the highest-value findings first.
