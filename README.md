# OpenBlox

BloxBot-style Roblox Studio orchestration for OpenCode V2.

OpenBlox is a native OpenCode extension layer built around the same core ideas used by `Yoganataa/app-bloxbot-ai`:

- explicit Roblox Studio target discovery and selection
- stateless `studio_id` routing
- compact Explorer context
- deterministic orchestration helpers
- structured playtesting
- diagnose → repair → retest

It intentionally does **not** embed BloxBot, Electron, another OpenCode binary, or another Roblox MCP server.

## Architecture

```
OpenCode V2
│
├── roblox-builder agent
│
├── roblox-orchestrator plugin
│   ├── per-session Studio target
│   ├── target pin/inspect helpers
│   ├── Roblox tool isolation
│   └── context injection
│
├── Roblox skills
│   ├── roblox-studio-target
│   ├── roblox-explorer-context
│   ├── roblox-build-workflow
│   ├── roblox-debugging
│   ├── roblox-playtest
│   └── roblox-program-authoring
│
└── official Roblox Studio MCP
```

## Reference implementation

The design follows the Roblox-specific portion of:

https://github.com/Yoganataa/app-bloxbot-ai

The desktop infrastructure from that project is deliberately not copied.

The BloxBot mapping is:

| BloxBot | OpenBlox |
| --- | --- |
| `StudioTargetProvider` | session-scoped plugin state |
| `studio-target-discovery` | `roblox-studio-target` + MCP discovery |
| `studio-target-selection` | `roblox_pin_studio` + stateless routing |
| `explorer-snapshot` | `roblox-explorer-context` |
| `playtestPlan` | `roblox-playtest` |
| `bloxbot-programs` | `roblox-program-authoring` + orchestration tools |
| `StudioMcpBroker` | native OpenCode context/tool layer; no second MCP broker |

## Installation

Copy the `.opencode` directory into the root of a Roblox project opened with OpenCode.

Install the local plugin dependency:

```bash
cd .opencode
bun install
```

The plugin uses the OpenCode V2 package:

```ts
import { Plugin } from "@opencode-ai/plugin/v2"
```

Keep the plugin package compatible with the OpenCode V2 build you use.

## Roblox MCP

Use the official Roblox Studio MCP already connected to OpenCode.

For BloxBot-style direct tool isolation, configure the existing Roblox MCP with:

```jsonc
{
  "mcp": {
    "servers": {
      "roblox-studio": {
        "codemode": false
      }
    }
  }
}
```

Do not create a second Roblox MCP server.

## Agent isolation

OpenBlox intentionally restricts its Roblox-specific tooling and skills to the `roblox-builder` agent.

The agent allows:

```
roblox_*
roblox-studio_*
skill: roblox-*
```

The plugin additionally removes Roblox tools from context for other agents as defense in depth.

## Runtime behavior

A substantive request follows:

```
DISCOVER
  ↓
SELECT
  ↓
INSPECT
  ↓
PLAN
  ↓
IMPLEMENT
  ↓
VERIFY
  ↓
PLAYTEST
  ↓
DIAGNOSE
  ↓
REPAIR
  ↓
RETEST
```

The session keeps its own pinned Studio target. Pinning never changes Roblox Studio's global active Studio.

## Important limitation

The plugin currently provides routing state and visibility/isolation. It does not recreate BloxBot's Electron-side MCP broker because OpenCode already owns the MCP connection.

A live Roblox Studio connection is required for end-to-end validation.
