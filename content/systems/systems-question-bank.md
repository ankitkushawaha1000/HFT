# Systems Question Bank

Below are 55 compact interview drills for senior HFT candidates. Each item includes the question, what it assesses, a concise but complete answer, and follow-ups worth practicing.

## Linux / OS Concepts (15)

1. **Q:** Process vs thread? **Assessing:** isolation vs sharing. **Answer:** A process owns an address space and kernel resources; threads share that state inside one process but have separate stacks and registers. **Follow-ups:** Why are threads cheaper to communicate between? When prefer processes?
2. **Q:** What does `fork()` really cost? **Assessing:** copy-on-write. **Answer:** Linux avoids eager memory copying, but `fork()` still duplicates kernel metadata/page tables and can trigger later CoW faults. **Follow-ups:** Why risky in large warm processes? Why paired with `exec()`?
3. **Q:** What is a syscall? **Assessing:** user/kernel boundary. **Answer:** A controlled transition into kernel mode to request privileged services such as I/O, memory mapping, or scheduling changes. **Follow-ups:** Why is it slower than a function call? Which syscalls dominate your app?
4. **Q:** What is a file descriptor? **Assessing:** Unix resource model. **Answer:** A per-process integer handle to kernel-managed objects like files, sockets, pipes, and epoll instances. **Follow-ups:** How do FD leaks show up? Why are FDs shared across threads?
5. **Q:** Why use `epoll`? **Assessing:** scalable I/O multiplexing. **Answer:** It avoids rescanning fixed-size FD sets and scales better than `select` for many sockets. **Follow-ups:** Edge vs level triggering? Why still use busy polling sometimes?
6. **Q:** What is CFS optimizing for? **Assessing:** scheduler model. **Answer:** Fair CPU distribution across runnable normal tasks via virtual runtime, not minimum tail latency. **Follow-ups:** How reduce scheduler jitter? Why use affinity?
7. **Q:** Nice vs real-time priority? **Assessing:** scheduler classes. **Answer:** Nice affects CFS weighting; real-time classes like `SCHED_FIFO` outrank normal tasks and require more care. **Follow-ups:** What can go wrong with FIFO? When use it?
8. **Q:** What are signals good for? **Assessing:** asynchronous process control. **Answer:** Delivery of asynchronous events such as terminate, interrupt, or segmentation fault, but handlers must stay async-signal-safe. **Follow-ups:** What is unsafe in a handler? How shut down cleanly?
9. **Q:** What is context-switch cost? **Assessing:** CPU locality awareness. **Answer:** Saving/restoring execution state is only part of the cost; cache and TLB disruption often dominate. **Follow-ups:** How measure it? How avoid excessive switches?
10. **Q:** What does `/proc` buy you? **Assessing:** observability. **Answer:** Live process/kernel state including maps, FDs, interrupts, and CPU information useful for debugging performance or correctness issues. **Follow-ups:** Which files matter for NUMA? For memory maps?
11. **Q:** User thread vs kernel thread? **Assessing:** scheduling layers. **Answer:** Kernel threads are scheduled by the OS; user threads/fibers are multiplexed in user space over kernel threads. **Follow-ups:** What happens on blocking syscalls? Why use coroutines?
12. **Q:** What is `futex` for? **Assessing:** Linux synchronization internals. **Answer:** Fast user-space synchronization with kernel help only on contended sleep/wake paths. **Follow-ups:** Why do uncontended mutexes stay cheap? What wakes waiters?
13. **Q:** Why pin threads? **Assessing:** affinity. **Answer:** To reduce migrations, preserve cache warmth, and align work with NUMA-local memory and NIC queues. **Follow-ups:** Why is pinning alone incomplete? How steer interrupts?
14. **Q:** What is a major page fault? **Assessing:** paging cost. **Answer:** A fault requiring disk I/O to bring the page in, which is catastrophic for low-latency code. **Follow-ups:** Minor fault difference? How pre-fault memory?
15. **Q:** What is `mmap` useful for? **Assessing:** memory mapping. **Answer:** Mapping files or anonymous pages for shared memory, large allocations, or file-backed access. **Follow-ups:** How does it differ from `read`? When use huge pages?

## Memory Management (10)

16. **Q:** Stack vs heap? **Assessing:** allocation model. **Answer:** Stack allocation is scope-bound and very cheap; heap allocation is flexible but introduces allocator overhead, fragmentation, and jitter. **Follow-ups:** Why avoid heap in hot paths? When is heap unavoidable?
17. **Q:** `new` vs `malloc`? **Assessing:** C++ object model. **Answer:** `new` allocates and constructs; `malloc` only returns raw storage. **Follow-ups:** Why is mixing release APIs wrong? What about placement new?
18. **Q:** What is copy elision? **Assessing:** value semantics. **Answer:** Direct construction into destination storage avoids temporary copies/moves and is guaranteed in important cases since C++17. **Follow-ups:** Why avoid `return std::move(local)`? What is NRVO?
19. **Q:** Why can `shared_ptr` hurt latency? **Assessing:** hidden cost model. **Answer:** Reference counting adds atomic/coherence traffic and destruction timing becomes less deterministic. **Follow-ups:** When is it still justified? Why use `weak_ptr`?
20. **Q:** What is a dangling pointer? **Assessing:** lifetime correctness. **Answer:** A pointer/reference to storage whose original object lifetime ended. **Follow-ups:** How can vector reallocation create one? How catch it?
21. **Q:** Why do huge pages help? **Assessing:** translation overhead. **Answer:** They reduce TLB pressure and page-table walk overhead for large hot memory regions. **Follow-ups:** What is the tradeoff? When not useful?
22. **Q:** What is NUMA locality? **Assessing:** topology awareness. **Answer:** Local memory attached to a CPU/socket is faster than remote memory accessed across an interconnect. **Follow-ups:** How does first touch matter? How detect remote access?
23. **Q:** What is false sharing? **Assessing:** cache-line behavior. **Answer:** Independent variables on one cache line bounce between cores because coherence works at line granularity. **Follow-ups:** How pad it away? Where is it common?
24. **Q:** What makes out-of-bounds access dangerous? **Assessing:** UB. **Answer:** It is undefined behavior, so compilers may optimize assuming it never happens and hardware may expose arbitrary corruption. **Follow-ups:** Which tools detect it? Why are reads also dangerous?
25. **Q:** What is memory reclamation in lock-free code? **Assessing:** advanced lifetime management. **Answer:** Safely freeing removed nodes only after proving no thread can still access them. **Follow-ups:** Hazard pointers? Epoch reclamation?

## CPU and Cache (10)

26. **Q:** Why do caches dominate performance? **Assessing:** hardware cost model. **Answer:** Latency jumps massively from L1 to DRAM, so locality often matters more than raw instruction count. **Follow-ups:** How measure misses? Why does layout matter?
27. **Q:** Typical cache line size? **Assessing:** practical architecture knowledge. **Answer:** Usually 64 bytes on mainstream x86-64 servers. **Follow-ups:** Why does this matter for structs? For atomics?
28. **Q:** Why is `std::vector` often faster than `std::list`? **Assessing:** locality vs asymptotics. **Answer:** Contiguous memory gives better prefetching and fewer cache misses than pointer-chasing linked nodes. **Follow-ups:** When can list still win? What about stable iterators?
29. **Q:** What is branch misprediction? **Assessing:** pipeline behavior. **Answer:** The CPU speculates down the wrong path and pays a recovery penalty when reality differs. **Follow-ups:** How reduce it? When is branchless code worse?
30. **Q:** Why can `-O3` lose to `-O2`? **Assessing:** optimizer tradeoffs. **Answer:** More aggressive inlining/unrolling can bloat code and hurt I-cache or heuristic decisions. **Follow-ups:** How verify with perf? When prefer size optimization?
31. **Q:** What is MESI? **Assessing:** coherence basics. **Answer:** A cache-coherence protocol family managing Modified/Exclusive/Shared/Invalid line states across cores. **Follow-ups:** Why do contended atomics hurt? What causes invalidations?
32. **Q:** What is prefetching? **Assessing:** memory latency hiding. **Answer:** Fetching data before use via hardware pattern detection or explicit software hints. **Follow-ups:** When can software prefetch backfire? How know it helped?
33. **Q:** AoS vs SoA? **Assessing:** data-layout optimization. **Answer:** Array-of-structs is convenient; struct-of-arrays often improves vectorization and selective-field locality. **Follow-ups:** Which is better for feed parsing? For full-record traversal?
34. **Q:** Why pin producer/consumer indices apart? **Assessing:** false-sharing avoidance. **Answer:** Separate cache lines prevent coherence bouncing between threads updating adjacent atomics. **Follow-ups:** Where else pad structures? How validate?
35. **Q:** What does a TLB miss cost? **Assessing:** translation awareness. **Answer:** Extra work for page-table translation that can significantly amplify memory access latency, especially with poor locality. **Follow-ups:** How do huge pages help? What patterns cause TLB pressure?

## Networking (10)

36. **Q:** TCP vs UDP? **Assessing:** transport tradeoffs. **Answer:** TCP gives ordered reliable streams; UDP gives unordered unreliable datagrams with lower protocol overhead and no retransmission delays. **Follow-ups:** Why market data prefers UDP? Why order entry prefers TCP?
37. **Q:** Why is TCP a byte stream? **Assessing:** framing awareness. **Answer:** Application message boundaries are not preserved, so framing must be implemented above the transport. **Follow-ups:** Length prefix? Partial reads?
38. **Q:** Why use multicast? **Assessing:** market-data distribution. **Answer:** One sender can efficiently fan out the same UDP stream to many receivers. **Follow-ups:** How join a group? How detect gaps?
39. **Q:** What is head-of-line blocking? **Assessing:** latency reasoning. **Answer:** Later data waits behind earlier missing/unprocessed data, classically in TCP retransmission and ordered delivery. **Follow-ups:** Why harmful for stale prices? How does UDP avoid it?
40. **Q:** What does `epoll` wait on? **Assessing:** readiness model. **Answer:** Readiness notifications for file descriptors such as sockets, pipes, and eventfds. **Follow-ups:** Edge-trigger caveat? Why still use busy polling?
41. **Q:** Where does network latency come from? **Assessing:** end-to-end decomposition. **Answer:** Application work, kernel queues, NIC behavior, switches, propagation delay, congestion, retransmission, and cache/core handoffs. **Follow-ups:** Which parts can software control? How measure each?
42. **Q:** What is RSS? **Assessing:** NIC queue steering. **Answer:** Receive Side Scaling distributes packets across RX queues/cores based on hash policy. **Follow-ups:** Why can it hurt flow locality? When override it?
43. **Q:** Why use kernel bypass? **Assessing:** user-space networking. **Answer:** To reduce syscall, interrupt, and generic stack overhead and gain explicit packet-queue control. **Follow-ups:** CPU cost? Operational complexity?
44. **Q:** What is RDMA at a high level? **Assessing:** advanced networking. **Answer:** Low-overhead remote memory access using registered memory and queue-based operations with minimal CPU involvement. **Follow-ups:** One-sided vs two-sided? Why not everywhere?
45. **Q:** What is interrupt moderation? **Assessing:** NIC tradeoffs. **Answer:** Batching interrupts improves throughput but can add latency and jitter. **Follow-ups:** Why might HFT disable/tune it aggressively? What replaces interrupts?

## Synchronization (10)

46. **Q:** What is a data race in C++? **Assessing:** language memory model. **Answer:** Concurrent conflicting accesses without synchronization; it is undefined behavior, not just stale reads. **Follow-ups:** How does TSan help? Why can x86 hide bugs?
47. **Q:** What does acquire-release mean? **Assessing:** ordering semantics. **Answer:** A release publishes prior writes and an acquire observing it makes them visible after the acquire. **Follow-ups:** What is happens-before? When use seq_cst instead?
48. **Q:** Why not use relaxed atomics everywhere? **Assessing:** correctness discipline. **Answer:** They guarantee atomicity on that object but not visibility/ordering for related state. **Follow-ups:** Safe use cases? Why are counters different?
49. **Q:** Mutex vs spinlock? **Assessing:** blocking tradeoffs. **Answer:** Mutexes can sleep; spinlocks busy-wait and are only suitable for extremely short critical sections under controlled contention. **Follow-ups:** Why are spinlocks bad under oversubscription? What about kernel use?
50. **Q:** Why wait on condition variables in a loop? **Assessing:** API correctness. **Answer:** Spurious wakeups are allowed, so the shared-state predicate must be rechecked. **Follow-ups:** Lost wakeup patterns? Why hold the mutex?
51. **Q:** What is lock-free vs wait-free? **Assessing:** progress guarantees. **Answer:** Lock-free guarantees system-wide progress; wait-free guarantees every operation finishes in bounded steps. **Follow-ups:** Why is wait-free harder? Is lock-free always faster?
52. **Q:** What is the ABA problem? **Assessing:** CAS pitfalls. **Answer:** A compare-exchange sees value A again after an A→B→A transition and misses a dangerous intermediate change. **Follow-ups:** Version tags? Hazard pointers?
53. **Q:** How do deadlocks happen? **Assessing:** failure modes. **Answer:** Mutual exclusion, hold-and-wait, no preemption, and circular wait all hold simultaneously. **Follow-ups:** How enforce lock ordering? How detect in production?
54. **Q:** What is starvation? **Assessing:** fairness. **Answer:** One thread makes no progress indefinitely while others continue succeeding. **Follow-ups:** Can lock-free code starve? Can RW locks starve writers?
55. **Q:** Why prefer message passing over sharing? **Assessing:** system architecture. **Answer:** It reduces synchronization complexity, coherence traffic, and accidental races by making ownership explicit. **Follow-ups:** When is sharing unavoidable? How design handoff queues?
