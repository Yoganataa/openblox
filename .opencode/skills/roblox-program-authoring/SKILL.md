---
description: BloxBot-inspired deterministic Roblox helper authoring and MCP-contract discipline
---

# Roblox Program Authoring

This skill captures the strongest idea in BloxBot's `bloxbot-programs` layer: deterministic procedures should have explicit contracts and defensive parsing instead of relying on repeated free-form model reasoning.

## When to use

Use this skill when designing or maintaining a helper procedure that:

- discovers Studio targets
- selects/verifies a target
- normalizes Explorer output
- aggregates read-only Studio information

## Contract

A helper should define:

- input shape
- output shape
- allowed Studio tools
- expected failure conditions
- normalization rules

Never silently change a helper's output contract.

## Tool discipline

Prefer explicitly known Studio tools.

If a tool is renamed or its schema changes, inspect the current MCP catalog instead of guessing.

For read-only context helpers, prefer tools that Studio marks as read-only and closed-world when annotations are available.

## Defensive output parsing

Accept structured JSON and text-wrapped JSON. Normalize known alternate field names and fail with a useful message when required information is missing.

## Why this exists

BloxBot used small deterministic TypeScript programs for Studio discovery/selection and Explorer snapshots. In this OpenCode port, the same philosophy belongs in skills and the orchestration plugin rather than in a separate desktop runtime.
