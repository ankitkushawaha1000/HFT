# Google — Round 4: Onsite — System Design

**What this round assesses:** Scalable architecture, distributed systems primitives, API/data modeling, and tradeoff reasoning.

## Format

Whiteboard-style virtual discussion, usually 45 min, for L4+; candidate leads requirements, scale, architecture, deep dives, and tradeoffs.

## Representative questions

1. Design YouTube — upload pipeline, transcoding, CDN delivery, recommendations. `anecdotal`
2. Design Google Maps — routing, tile serving, real-time traffic, geospatial indexing. `anecdotal`
3. Design a URL Shortener — hashing, DB choice, redirect latency, analytics. `anecdotal`
4. Design a Distributed Key-Value Store — replication, consistency, compaction. `anecdotal`
5. Design Google Search — crawling, indexing, query processing, ranking. `anecdotal`
6. Design a Rate Limiter — token bucket vs. sliding window, distributed Redis-backed limits. `anecdotal`
7. Design Gmail — email storage, threading, search indexing, push notifications. `anecdotal`
8. For infrastructure/platform teams, discuss minimizing hot-path allocations, IPC mechanisms, or lock-free designs. `inferred`

## Sources

- https://sre.google/books/ `official`
- Glassdoor Google system design interview questions `anecdotal`
- https://leetcode.com/discuss/interview-experience/ `anecdotal`
