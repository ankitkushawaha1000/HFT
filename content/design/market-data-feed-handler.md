# Market Data Feed Handler Design

Research date: 2026-07-24

A market data feed handler receives raw exchange traffic, validates and parses it, detects gaps, recovers missing data, normalizes messages, and publishes them to downstream consumers such as order books, analytics, and strategies. For HFT interviews, this problem tests networking, systems design, sequencing, failure handling, and low-latency engineering.

## Requirements

### Functional

- receive multicast UDP market data
- parse binary or textual protocols such as ITCH, SBE, or FIX/FAST where relevant
- detect sequence gaps and duplicates
- recover missing messages through retransmit or replay channels
- publish normalized events to downstream components
- support monitoring, replay, and failover

### Non-functional

- microsecond-sensitive steady-state latency
- high burst tolerance at market open and news events
- loss detection must be exact
- no blocking I/O or heap allocation on the critical path
- deterministic ordering per feed and instrument partition

## Architecture overview

A strong baseline design uses staged ownership with bounded queues:

```text
NIC / socket
   │
Receive thread(s) ──> Parse thread(s) ──> Dispatch thread(s) ──> Consumers
   │                    │                    │
   └─ gap detector      └─ protocol decode   └─ symbol routing / fan-out
                        └─ normalization
```

### Receive thread

The receive stage owns the socket or NIC queue. It timestamps arrivals, copies or references packet buffers from a pre-allocated ring, validates basic framing, and feeds sequence tracking. In a very low-latency design, receive and parse may be fused to remove a queue hop, but separating them can improve observability and simplify burst absorption.

### Parse thread

The parser decodes protocol fields into a compact normalized representation. It should be protocol-aware but not strategy-aware. Important responsibilities include endianness handling, bounds checks, message-type classification, and extraction of sequence numbers, instrument IDs, prices, quantities, and flags.

### Dispatch thread

Dispatch fans out normalized events to per-symbol or per-partition consumers. The objective is to maintain ordering where required while isolating slow consumers. Many real systems use SPSC or partitioned queues so each downstream book has a clear owner.

## Protocol handling

### FIX

FIX is common for order-entry and some market-data contexts but is generally heavier than binary feeds. A strong answer notes that FIX parsing is allocation-sensitive and often too verbose for the most latency-critical data paths.

### ITCH

ITCH-style feeds provide compact binary messages with sequence numbers and message-specific layouts. Feed handlers should specialize common message types and avoid generic reflection-based parsing.

### SBE

Simple Binary Encoding is explicitly designed for low-latency binary messaging with fixed layouts and optional flyweight-style access. It is well suited to in-place decoding and code generation.

The interviewer may not care which protocol you know best, but they do care that you distinguish text-heavy flexible protocols from compact binary ones.

## Gap detection

Sequence numbers are central. For each channel or partition, maintain the next expected sequence number.

- if incoming sequence == expected: process and increment
- if incoming sequence < expected: duplicate or late message; handle per venue semantics
- if incoming sequence > expected: declare a gap and trigger recovery

Gap state must be explicit. A common pattern is to hold downstream publication for the affected channel until missing messages arrive, while continuing to track late packets so recovery can merge correctly.

## Recovery mechanisms

Typical recovery options include:

- **retransmit request:** request a missing sequence range from the venue
- **TCP replay channel:** use an alternate reliable stream for missed data
- **hot/hot redundant multicast lines:** compare A and B feeds and use the first complete copy

Recovery design questions:

- Can live processing continue while waiting for missing data?
- Is publication paused globally, per channel, or per symbol partition?
- How are duplicates filtered when replayed data overlaps with live packets?

A senior answer usually proposes per-channel or per-partition recovery to minimize blast radius.

## Backpressure handling

Feed handlers cannot simply “slow the exchange down.” Therefore backpressure must be absorbed internally or by shedding downstream work that is not required for correctness.

Useful strategies:

- bounded queues between stages
- lossy side channels for non-critical analytics only
- priority separation between trading-critical consumers and secondary consumers
- replay buffers sized for expected bursts
- explicit overload alarms before queues saturate

If a candidate proposes blocking the receive thread on a slow consumer, that is a design smell.

## Latency considerations at each stage

### Receive

Pin receive threads, align NIC and CPU topology, use large enough rings for bursts, and minimize work before sequence extraction.

### Parse

Parse in place, avoid dynamic allocation, separate common and rare message types, and keep normalized events compact.

### Dispatch

Route by symbol or partition to preserve locality. Avoid large fan-out copies on the hot path; consumers should receive handles or compact events.

## Failover and redundancy

Production feed handlers usually consume redundant lines and prefer the earliest valid packet while still tracking completeness. Design choices include:

- active/active dual-line ingestion
- active/passive failover
- per-channel health monitoring
- automatic switchover when loss or latency thresholds are breached

The system should also support operator-controlled source changes and replay after failover.

## Persistence and replay hooks

Even if persistence is not on the hot path, journaling raw packets or normalized events to a capture system is valuable for audit, simulation, and incident debugging. A senior design cleanly separates this from the critical path via asynchronous capture.

## Interview rubric

A strong answer includes:

- clear sequencing and gap logic
- explicit recovery behavior
- bounded, low-contention stage handoff
- per-stage latency thinking
- redundancy and observability

A weak answer treats the feed as generic UDP ingestion with no discussion of loss, replay, or ordering.

## Tradeoffs to discuss

- fused receive+parse versus easier stage isolation
- kernel sockets versus kernel bypass
- global ordering guarantees versus partition scalability
- immediate fan-out versus normalized central bus
- synchronous journaling versus asynchronous capture
