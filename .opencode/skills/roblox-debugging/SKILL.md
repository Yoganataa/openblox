---
description: Structured Roblox Studio diagnosis and repair loop modeled after BloxBot's defensive orchestration
---

# Roblox Debugging

Use this skill when a Roblox task fails in Studio or during playtest.

## Diagnose before editing

Classify the failure:

1. MCP/Studio connectivity
2. wrong Studio target
3. hierarchy/path
4. property/configuration
5. Luau syntax/runtime
6. client/server replication
7. initialization/lifecycle
8. gameplay state
9. UI/input
10. persistence
11. performance

## Evidence first

Inspect the actual failing state.

Use the relevant MCP tools such as:

- `get_studio_state`
- `search_game_tree`
- `inspect_instance`
- `get_console_output`
- runtime/playtest facilities

Use the exact pinned `studio_id` on every Studio call.

## Repair loop

OBSERVE → HYPOTHESIZE → MINIMAL FIX → VERIFY → RETEST

Prefer root-cause changes.

Do not mask an error with:

- arbitrary waits
- unconditional retries
- blanket `pcall`
- silent fallback behavior

unless the resulting behavior is intentionally part of the design.

## Regression check

After fixing one failure, re-check adjacent behavior. A fix that makes one test pass while breaking initialization, replication, or another system is not complete.
