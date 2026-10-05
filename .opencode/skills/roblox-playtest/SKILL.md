---
description: BloxBot-style structured Roblox playtest planning, execution, observation, and retest
---

# Roblox Playtest

Use this skill whenever runtime behavior matters.

## Plan format

Create a focused test plan with:

- Goal
- Steps
- Watch for
- Success criteria

Each step should be executable and each success criterion observable.

## Execution

Run the playtest against the currently pinned Studio.

Use the official Roblox Studio MCP runtime facilities and the official playtest subagent when it provides the cleanest observation path.

Do not change the experience during a validation-only test unless a step explicitly requires it.

## Observe

Look for:

- console errors/warnings
- incorrect hierarchy/state
- missing UI
- broken remotes
- client/server divergence
- initialization races
- failed gameplay conditions
- performance regressions

## Failure

On failure:

1. capture the actual error/state
2. classify it
3. load `roblox-debugging`
4. make the smallest coherent repair
5. restart the relevant test
6. verify the success criteria again

## Completion

A playtest passes only when the observable success criteria pass. Do not equate "Play started" with "feature works."
