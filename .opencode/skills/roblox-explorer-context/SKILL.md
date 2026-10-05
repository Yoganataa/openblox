---
description: BloxBot-style defensive Roblox Explorer snapshot and compact live project context
---

# Roblox Explorer Context

Use this skill before substantive Roblox changes.

## Objective

Create a compact, trustworthy model of the live Roblox project without flooding model context.

## BloxBot inspection pattern

For broad inspection, prefer:

1. `roblox-studio_search_game_tree` with the pinned `studio_id` and `datamodel_type: "Edit"`.
2. If unavailable, try `datamodel_type: "Server"`.
3. If unavailable, try `datamodel_type: "Client"`.

Use a depth around 10 for broad tree discovery and a high enough result limit for ordinary places. When output is large, narrow subsequent requests instead of repeatedly requesting the whole tree.

## Defensive parsing

MCP output may be:

- JSON content
- text containing JSON
- JSON preceded by a note/diagnostic line
- slightly different field names across Studio versions

Look for equivalent fields such as:

- `fullPath` / `path`
- `id` / `studio_id` / `studioId`
- `name`
- `className`
- `properties`
- child-count indicators

Never infer a missing value when a targeted inspection can provide it.

## Explorer representation

Reason using real Roblox services and paths. Common top-level services include:

- Workspace
- Players
- Lighting
- ReplicatedFirst
- ReplicatedStorage
- ServerScriptService
- ServerStorage
- StarterGui
- StarterPack
- StarterPlayer
- SoundService
- TextChatService
- Teams

Inspect the relevant branch after the broad scan. Use `roblox-studio_inspect_instance` for important properties and dependencies.

## Context discipline

Maintain only the context necessary for the current task:

- relevant hierarchy
- relevant scripts/modules
- remotes
- important properties
- initialization dependencies
- known runtime issues

Refresh the affected branch after major mutations because the old snapshot can become stale.
