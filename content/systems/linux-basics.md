# Linux Basics for HFT Engineers

Linux is the operating system most HFT engineers meet in production, so interview questions usually focus on resource ownership, scheduling, observability, and latency implications rather than end-user administration. The goal is to understand how your C++ process interacts with the kernel and where microseconds disappear.

## Process vs thread

A **process** is an operating-system abstraction with its own virtual address space, file descriptor table, credentials, and other kernel-managed resources. A **thread** is an execution context within a process; threads in the same process share memory and most resources but have separate stacks, registers, and scheduling state.

For HFT, this distinction matters because process boundaries provide isolation, while threads offer lower communication overhead but introduce synchronization cost and memory-sharing complexity.

## System calls overview

A system call is the controlled transition from user mode to kernel mode to request a privileged service: file I/O, socket operations, memory mapping, timers, scheduling changes, and so on. Each syscall has overhead: mode switch, validation, potential locking, and possibly sleeping.

Hot-path design often aims to reduce syscall frequency by batching work, using memory-mapped I/O, busy-polling selectively, or preallocating resources.

Common syscalls visible in trading systems include:
- `read`, `write`, `recv`, `send`
- `epoll_wait`
- `mmap`, `munmap`, `mprotect`
- `clock_gettime`
- `futex`
- `sched_setaffinity`

## File descriptors

A file descriptor (FD) is a small integer indexing a per-process table of open files, sockets, pipes, eventfds, epoll instances, and more. “Everything is a file” is not literally true, but the FD abstraction is pervasive.

Important properties:
- FDs are process resources, though threads in the same process share them.
- FDs must be closed to release kernel resources.
- Readiness APIs like `epoll` monitor FDs.
- FD exhaustion is a real operational failure mode.

In production systems, leaking FDs is as dangerous as leaking heap memory.

## Signals

Signals are asynchronous notifications delivered to a process or thread. Examples include `SIGINT`, `SIGTERM`, `SIGSEGV`, `SIGPIPE`, and timer-related signals.

Signals are tricky because only a small set of operations is async-signal-safe inside a signal handler. Complex logic in handlers is a bug magnet. A typical production pattern is minimal handler work: set an atomic flag or write to a pipe/eventfd that the main loop observes.

## Process scheduling: CFS overview

The default Linux scheduler for normal tasks is the Completely Fair Scheduler (CFS). It tries to allocate CPU time fairly using virtual runtime. CFS is excellent for general workloads, but fairness is not the same as low latency.

For performance-sensitive code, the important questions are:
- Is the thread migrating between CPUs?
- Is it contending with noisy neighbors?
- Is it being preempted by unrelated work?

HFT systems often combine CPU affinity, isolated cores, and carefully chosen priorities to reduce scheduler-induced jitter.

## `/proc` filesystem

`/proc` exposes process and kernel state as virtual files. Useful entries include:
- `/proc/<pid>/maps`: memory mappings
- `/proc/<pid>/status`: basic process status
- `/proc/<pid>/fd/`: open file descriptors
- `/proc/cpuinfo`: CPU details
- `/proc/interrupts`: interrupt distribution
- `/proc/meminfo`: system memory view

`/proc` is invaluable when debugging memory maps, core affinity issues, open sockets, or thread counts.

## Commands useful in interviews and real work

### `top` and `htop`

`top` and `htop` show CPU, memory, process, and thread activity. `htop` is more interactive, while `top` is universal. For trading systems, look beyond overall CPU percent: watch per-thread CPU, migrations, run queue pressure, and unexpected kernel time.

### `strace`

`strace` traces syscalls and signals.

```bash
strace -tt -f -p <pid>
```

Use it to discover blocking syscalls, unexpected `futex` waits, excessive `clock_gettime` calls, or descriptor churn. It is very high signal for understanding kernel interaction, but it perturbs timing.

### `ltrace`

`ltrace` traces user-space library calls. It is less central than `strace` for low-latency work, but useful for spotting libc allocation patterns or dynamic library behavior.

### `lsof`

`lsof` lists open files for processes. It is excellent for diagnosing FD leaks, checking active sockets, and understanding what files/devices a process currently uses.

### `netstat` / `ss`

`ss` is the modern preferred tool for socket inspection. It shows established connections, listen sockets, queue depths, and more.

```bash
ss -tinp
```

Networking questions often turn into “how would you prove the socket state?” and `ss` is a strong answer.

## Interview context: what to emphasize

When asked Linux fundamentals in an HFT interview, emphasize that system abstractions have cost. Threads share memory, so they are cheap to communicate through but expensive to reason about. Syscalls create mode switches. FDs are finite kernel resources. Scheduling and CPU migration add jitter. Observability tools tell you where those costs are showing up.

## Interview questions with answers

**What is the difference between a process and a thread?**  
A process has its own address space and resources; threads are execution contexts within a process sharing most resources but not stacks or registers.

**Why are syscalls expensive?**  
They cross the user/kernel boundary and may trigger validation, locking, context switches, or sleeps.

**What is a file descriptor?**  
A per-process handle to a kernel object such as a file, socket, pipe, or epoll instance.

**Why are signals tricky?**  
They are asynchronous and only a very small set of operations is safe inside handlers.

**What does CFS optimize for?**  
Fairness among runnable tasks, not necessarily minimum tail latency.

**Why is `/proc` useful?**  
It exposes live kernel/process state for debugging memory maps, FDs, CPU details, interrupts, and more.
