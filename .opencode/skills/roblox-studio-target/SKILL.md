---
description: BloxBot-style Roblox Studio discovery, target selection, pinning, and stateless routing
---

# Roblox Studio Target

Use this skill whenever a task needs Roblox Studio MCP access.

## Objective

Work against exactly one live Studio target per OpenCode session.

## Procedure

1. Call `roblox-studio_list_roblox_studios`.
2. Read the returned Studio instance IDs, names, and Place IDs.
3. Select the intended target. Prefer exact Studio instance ID; use Place ID and name as confirmation.
4. Call `roblox_pin_studio` with the exact returned `studioId`.
5. Use that exact ID as `studio_id` on every subsequent Studio MCP request.
6. Never call `roblox-studio_set_active_studio`.

## Stale target

If a Studio call reports that the target disappeared or is invalid:

1. stop mutations
2. call `roblox-studio_list_roblox_studios` again
3. resolve the current target
4. call `roblox_pin_studio` again
5. continue only after the new target is known

## Multiple Studio instances

Do not select solely by a friendly name when multiple sessions could match. Place ID is the preferred secondary discriminator.

## Important distinction

Pinning is OpenCode session routing state. It does not change Roblox Studio's global active Studio state.
