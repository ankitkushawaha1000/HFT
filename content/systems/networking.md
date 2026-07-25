# Networking for HFT Engineers

HFT networking discussions focus on latency, packet loss, fan-out, and how application design interacts with the NIC and kernel. Interviews usually emphasize layers 2-4, socket behavior, multicast, and the tradeoff between throughput-oriented and latency-oriented designs.

## OSI model with focus on L2-L4

- **Layer 2**: Ethernet framing, MAC addresses, VLANs.
- **Layer 3**: IP routing and addressing.
- **Layer 4**: TCP and UDP transport.

HFT engineers typically care less about the full seven-layer model than about where work happens: switching at L2, routing at L3, reliability and ordering at L4.

## TCP vs UDP for market data

TCP provides ordered, reliable byte streams with retransmission and congestion control. That is useful for order entry, administrative APIs, and back-office traffic.

UDP provides datagrams without built-in retransmission or ordering. It is commonly used for market data, especially multicast, because it avoids head-of-line blocking and lets the application decide how to handle loss.

In market data, stale data can be worse than dropped data. That is why UDP plus gap detection/recovery is often preferred.

## Socket programming basics

Core socket calls:
- `socket()` creates a socket FD.
- `bind()` assigns a local address/port.
- `listen()` marks a TCP socket as passive.
- `accept()` accepts incoming TCP connections.
- `connect()` establishes outgoing connections.
- `send()` / `recv()` transfer data.

Senior candidates should remember that TCP is a byte stream, not a message protocol; framing is the application's job.

## Non-blocking sockets and readiness APIs

Non-blocking sockets avoid sleeping the thread on I/O. If an operation cannot proceed immediately, it returns `EAGAIN`/`EWOULDBLOCK`. Readiness APIs help multiplex many FDs:
- `select`: old, FD-set limited.
- `poll`: more scalable but still O(n) scanning.
- `epoll`: scalable readiness notification on Linux.

For many-feed or gateway processes, `epoll` is the standard kernel API baseline.

## UDP multicast

Multicast lets one sender distribute market data to many receivers efficiently. Receivers join a group, usually with `setsockopt()` and `IP_ADD_MEMBERSHIP`, then receive UDP datagrams sent to the multicast group address.

Operational realities matter:
- IGMP membership and network switch configuration must be correct;
- packet loss can occur due to bursts or socket buffer overflow;
- applications often implement sequence-number gap detection and replay requests.

## Network latency sources

Latency comes from many layers:
- serialization and application processing;
- kernel queues and syscalls;
- interrupt handling or polling;
- NIC buffering;
- switch hops and propagation delay;
- congestion or retransmission;
- cache misses and cross-core handoff inside the application.

Strong answers trace the end-to-end path rather than blaming “the network” as a black box.

## NIC hardware and drivers

NICs have RX/TX queues, DMA engines, interrupt moderation settings, offloads, and driver/NAPI behavior that materially affect latency. Queue-to-core steering, RSS, checksum offloads, and timestamping support are all relevant topics.

In HFT, engineers often prefer explicit queue/core mapping and may disable features that help bulk throughput but hurt determinism.

## HFT guidance

- Use UDP multicast for one-to-many market data when the venue supports it.
- Use TCP when reliability and ordering outweigh head-of-line concerns.
- Keep packet processing on the core that received the packet when possible.
- Size socket buffers deliberately and monitor drops.
- Understand the NIC and switch path, not just the socket API.

## Interview questions with answers

**Why is UDP often preferred for market data?**  
It avoids TCP retransmission and head-of-line blocking, letting the application manage loss and freshness explicitly.

**Why is TCP still used in trading systems?**  
Reliable ordered delivery is valuable for order entry, control channels, and many administrative interfaces.

**What does non-blocking I/O change?**  
It prevents the thread from sleeping in socket calls and shifts control flow to readiness-driven or polling logic.

**Why is `epoll` preferred over `select`?**  
It scales better for large FD sets and avoids rescanning fixed-size bitmaps on every call.

**What is the main operational challenge with multicast?**  
Handling packet loss, buffer pressure, and correct network-group configuration while preserving low latency.

**What part of the NIC matters to software engineers?**  
Queue layout, interrupt/polling behavior, DMA, offloads, and how traffic is steered to cores.
## Practical interview angle

    Networking answers are strongest when they separate transport semantics from implementation cost. For example: choose UDP multicast for freshness and fan-out, then discuss loss detection, replay, socket buffering, NIC queue steering, and timestamping. That shows you understand that protocol choice is only the start; system design around the protocol is where latency engineering actually happens.

## Useful operational checks

When diagnosing drops or jitter, inspect socket buffer drops, NIC statistics, multicast group membership, RX queue placement, interrupt affinity, and application queue backlogs together. Looking at only one layer usually hides the true bottleneck.

## Extra design note

A senior answer should also mention backpressure: when downstream consumers cannot keep up, you must decide whether to drop, batch, shed work, or replay later. That decision is domain-specific and often more important than the raw socket API choice.
