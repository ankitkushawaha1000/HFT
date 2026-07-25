# Virtu Financial — Round 2: Technical Phone Screen / Interview (Market Making + Systems)

**What this round assesses:** C++ proficiency, low-latency data pipelines, order books, FIX, and market microstructure.

## Format

Engineer or trading-technologist interview mixing C++ fundamentals, system design basics, and market microstructure questions.

## Representative questions

1. What is the difference between const and constexpr? Where would you use each in a market data handler? `inferred`
2. Explain the cost of a cache miss in clock cycles. How would you structure an order book to minimise them? `inferred`
3. What mechanisms does C++ provide for compile-time polymorphism? Compare templates with virtual dispatch in a low-latency context. `inferred`
4. How would you design a single-producer single-consumer lock-free queue? What memory orderings are needed? `inferred`
5. Describe how a FIX connection works. What happens during logon, and how do you handle a sequence-number gap? `inferred`
6. What is adverse selection in market making? How does Virtu hedge it at scale? `inferred`
7. Explain the bid-ask spread as compensation for order processing, inventory holding, and adverse selection. `inferred`
8. What is a VWAP algorithm? Why would a large institutional order use it? `inferred`

## Sources

- https://github.com/ankitkushawaha1000/HFT/blob/main/data/companies.json
- https://github.com/garymmmjw/QuantGym/blob/main/src/features/companies/companyProfiles.js
