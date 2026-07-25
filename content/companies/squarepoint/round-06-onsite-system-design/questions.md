# Squarepoint Capital — Round 6: System Design

**What this round assesses:** Low-latency systems thinking, failure modes, and tradeoff reasoning.

## Format

Architectural discussion for a performance-critical financial infrastructure problem.

## Representative questions

1. Design a low-latency market data publication system from raw feed to 100 consumers at <5 microsecond fan-out latency. `inferred`
2. Design a real-time position management system across multiple strategies with shared limits. `inferred`
3. Build a deterministic simulation environment to replay production market data and order events. `inferred`
4. Design a high-throughput logging system that does not block a trading thread and has <100ns logging budget. `inferred`
5. Design a watchdog / health-monitoring system for a multi-process trading deployment with strict recovery SLAs. `inferred`

## Sources

- https://www.squarepoint-capital.com/careers
