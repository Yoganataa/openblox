---
description: BloxBot-style Roblox feature construction workflow from inspection through verified implementation
---

# Roblox Build Workflow

Use this skill for non-trivial feature implementation.

## Workflow

DISCOVER → SELECT → INSPECT → PLAN → IMPLEMENT → VERIFY

## Plan in systems

Before changing code, identify the responsibilities involved.

Examples:

### Combat

- input
- target acquisition
- server authority
- damage calculation
- cooldowns
- replication
- effects
- UI

### Economy

- server state
- transactions
- validation
- persistence
- UI presentation

### UI

- ScreenGui hierarchy
- client controller
- state source
- events
- responsive layout
- interaction feedback

Do not build only the visible surface while leaving the underlying system incomplete.

## Preserve existing architecture

Search for existing systems before creating new ones.

Prefer extension over duplication.

Do not rename or replace important project structures unless the task requires it.

## Incremental mutations

After a structural change:

1. inspect the affected hierarchy
2. verify class and parent
3. inspect relevant properties
4. verify script/module placement
5. continue

This mirrors BloxBot's preference for deterministic helper operations over a single uncontrolled mutation burst.

## Security

Any client-controlled argument crossing a RemoteEvent/RemoteFunction boundary is untrusted.

Authoritative state must be validated on the server.

## Definition of done

A feature is done when the requested Studio state exists, the relevant code is coherent, and applicable runtime behavior has been verified.
