# Virtual Memory

Virtual memory is central to systems performance because every load/store in your program travels through this abstraction. HFT interviews often ask about page tables, TLBs, huge pages, `mmap`, and NUMA because these determine whether the machine treats your working set as a fast local structure or a source of translation stalls and page faults.

## Virtual-to-physical translation and page tables

Each process uses virtual addresses. The CPU and MMU translate them to physical addresses through page tables managed by the OS. This provides isolation, protection, and the illusion of a contiguous address space.

Page-table walks are expensive, so modern CPUs cache translations in the TLB.

## TLBs and TLB misses

The Translation Lookaside Buffer caches recent virtual-to-physical translations. A TLB hit avoids walking page tables. A TLB miss forces extra work, often several memory accesses, and may cascade badly under large or fragmented working sets.

Large page footprints, pointer-heavy structures, and random access patterns can all raise TLB pressure.

## Page faults: minor and major

A page fault happens when the referenced page is not currently mapped in the required way.

- **Minor fault**: the page can be mapped without disk I/O, e.g. zero-fill-on-demand or page already in memory.
- **Major fault**: requires disk I/O, such as loading a file-backed page from storage.

Major faults are catastrophic for latency-sensitive paths. Good HFT systems warm memory and avoid runtime paging activity as much as possible.

## `mmap`

`mmap` maps files or anonymous memory into a process address space. It is used for:
- file-backed access;
- shared memory between processes;
- large anonymous allocations;
- custom allocators and ring buffers.

Anonymous `mmap` can provide page-aligned storage without the usual heap path. File-backed `mmap` can simplify I/O but changes the faulting/caching model.

## Huge pages

Huge pages use larger mappings, commonly 2 MB or 1 GB instead of 4 KB. Benefits include:
- fewer TLB entries needed for a given working set;
- fewer page-table levels to traverse;
- lower translation overhead.

In HFT, huge pages are often used for packet buffers, shared-memory regions, DPDK memory, or large hot structures. They are not automatically better for every allocation; internal fragmentation and management complexity increase.

## NUMA memory allocation

On NUMA systems, memory is attached more closely to some CPUs than others. Accessing local memory is faster than remote memory. Allocation policy therefore matters: a thread pinned to one socket but touching memory first allocated on another pays extra latency.

First-touch policy, explicit NUMA APIs, and careful thread/data placement are common tools.

## Memory-mapped I/O

Memory-mapped I/O maps device or kernel-visible regions into an address space so software interacts through loads/stores rather than traditional read/write syscalls. This is common in device drivers and some user-space I/O frameworks, though semantics differ sharply from ordinary RAM because ordering and caching rules may be special.

## Copy-on-write

Copy-on-write lets multiple processes share physical pages until one writes. It makes `fork()` practical. But the first write then incurs a page-fault-like copy cost. That is one reason `fork()` in a large, warm, latency-critical process is undesirable.

## HFT implications

- Minimize unpredictable faults in the hot path.
- Use huge pages where TLB pressure justifies them.
- Keep data NUMA-local to the cores that use it.
- Understand when `mmap` changes failure and latency behavior versus ordinary reads.
- Pre-fault and warm important memory regions before trading starts.

## Interview questions with answers

**Why does virtual memory exist?**  
To provide isolation, protection, flexible address spaces, and controlled mapping from process-visible addresses to physical memory.

**What is a TLB miss?**  
A missing translation cache entry that forces extra page-table-walk work and increases access latency.

**Why are huge pages useful?**  
They reduce TLB pressure and translation overhead for large hot memory regions.

**What is the difference between a minor and major page fault?**  
A minor fault resolves without disk I/O; a major fault requires loading data from storage.

**Why does NUMA matter?**  
Remote memory access has higher latency and lower bandwidth than local memory, so thread/data placement affects performance.

**Why can `fork()` be problematic in a large process?**  
Copy-on-write avoids immediate copying, but duplicating page tables and later page writes still impose significant cost and unpredictability.
## Practical tuning notes

    Memory policy should be deliberate before the trading session starts: pre-fault large regions, prefer NUMA-local allocation, monitor page-fault counters, and avoid surprise `mmap`/`munmap` churn in hot services. The main lesson is that virtual memory is fast when the mapping working set is stable and local, and painfully slow when translation or paging becomes dynamic under load.

## One interview pattern

When answering virtual-memory questions, connect the abstraction to latency: page tables affect translation, TLBs hide that cost, huge pages reduce misses, and NUMA determines whether memory is near the CPU doing the work.

## Operational red flags

Unexpected major faults, high minor-fault churn after warmup, remote-NUMA allocation, or frequent map/unmap activity are all warning signs for a low-latency service. These usually indicate either unstable working-set size or poor lifecycle design around memory ownership.
