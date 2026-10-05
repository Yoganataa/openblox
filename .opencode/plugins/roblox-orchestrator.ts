import { Plugin } from "@opencode-ai/plugin/v2"

type StudioTarget = {
  studioId: string
  placeId: string | null
  label: string | null
  pinnedAt: string
}

const BUILDER_AGENT = "roblox-builder"
const TARGET_PREFIX = "roblox/studio/"
const MCP_PREFIX = "roblox-studio_"
const PLUGIN_TOOL_PREFIX = "roblox_"

function key(sessionID: string) {
  return `${TARGET_PREFIX}${sessionID}`
}

function isRobloxMcpTool(name: string) {
  return name.startsWith(MCP_PREFIX)
}

function isRobloxPluginTool(name: string) {
  return name.startsWith(PLUGIN_TOOL_PREFIX)
}

const plugin = Plugin.define({
  id: "roblox.bloxbot-orchestrator",

  async setup(ctx) {
    await ctx.tool.transform((tools) => {
      tools.namespace({
        name: "roblox",
        description: "BloxBot-style Roblox Studio orchestration for roblox-builder",
      })

      tools.add({
        name: "pin_studio",
        description:
          "Pin an exact Roblox Studio instance for the current roblox-builder session. Use the exact studio ID returned by roblox-studio_list_roblox_studios. This does not activate or mutate Studio.",
        options: { namespace: "roblox", codemode: false },
        input: {
          type: "object",
          additionalProperties: false,
          properties: {
            studioId: { type: "string", minLength: 1 },
            placeId: { type: ["string", "null"] },
            label: { type: ["string", "null"] },
          },
          required: ["studioId", "placeId", "label"],
        },
        execute: async (input, toolContext) => {
          if (toolContext.agent !== BUILDER_AGENT) {
            throw new Error(`Roblox orchestration is private to ${BUILDER_AGENT}.`)
          }

          const value = input as {
            studioId: string
            placeId: string | null
            label: string | null
          }

          const target: StudioTarget = {
            studioId: value.studioId.trim(),
            placeId: value.placeId?.trim() || null,
            label: value.label?.trim() || null,
            pinnedAt: new Date().toISOString(),
          }

          if (!target.studioId) throw new Error("studioId cannot be empty.")

          await ctx.storage.set(key(toolContext.sessionID), target)

          return {
            content: JSON.stringify({
              ok: true,
              target,
              routing: `Route every Roblox Studio MCP call to studio_id ${JSON.stringify(target.studioId)}.`,
              activeStudioMutation: false,
            }),
          }
        },
      })

      tools.add({
        name: "studio_target",
        description:
          "Return the exact Roblox Studio target pinned for the current roblox-builder session. Does not change routing or Studio.",
        options: { namespace: "roblox", codemode: false },
        input: {
          type: "object",
          additionalProperties: false,
          properties: {},
        },
        execute: async (_input, toolContext) => {
          if (toolContext.agent !== BUILDER_AGENT) {
            throw new Error(`Roblox orchestration is private to ${BUILDER_AGENT}.`)
          }

          const target = (await ctx.storage.get(key(toolContext.sessionID))) as StudioTarget | undefined

          return {
            content: JSON.stringify(
              target
                ? {
                    ok: true,
                    target,
                    routing: `Route every Roblox Studio MCP call to studio_id ${JSON.stringify(target.studioId)}.`,
                  }
                : {
                    ok: false,
                    target: null,
                    message: "No Studio target is pinned. Discover Studios and pin one first.",
                  },
            ),
          }
        },
      })

      tools.add({
        name: "release_studio",
        description: "Release the pinned Roblox Studio target for the current roblox-builder session.",
        options: { namespace: "roblox", codemode: false },
        input: {
          type: "object",
          additionalProperties: false,
          properties: {},
        },
        execute: async (_input, toolContext) => {
          if (toolContext.agent !== BUILDER_AGENT) {
            throw new Error(`Roblox orchestration is private to ${BUILDER_AGENT}.`)
          }

          await ctx.storage.remove(key(toolContext.sessionID))
          return { content: JSON.stringify({ ok: true, target: null }) }
        },
      })
    })

    await ctx.session.hook("context", async (event) => {
      const isBuilder = event.agent === BUILDER_AGENT

      if (!isBuilder) {
        for (const name of Object.keys(event.tools)) {
          if (isRobloxMcpTool(name) || isRobloxPluginTool(name)) delete event.tools[name]
        }
        return
      }

      const target = (await ctx.storage.get(key(event.sessionID))) as StudioTarget | undefined

      event.system.push({
        type: "text",
        text: [
          "You are operating under the BloxBot-style Roblox orchestration layer.",
          "Roblox Studio is the source of truth.",
          "Use explicit studio_id routing for every Roblox Studio MCP call.",
          "Never call set_active_studio.",
          target
            ? `The pinned Studio target is ${target.label ? JSON.stringify(target.label) + " " : ""}with studio_id ${JSON.stringify(target.studioId)}${target.placeId ? ` and Place ID ${JSON.stringify(target.placeId)}` : ""}. Do not route calls to another Studio. Re-discover and re-pin if this target becomes unavailable.`
            : "No Studio target is pinned yet. Call roblox-studio_list_roblox_studios, choose the intended target, then call roblox_pin_studio before other Studio MCP operations.",
        ].join(" "),
      })

      if (!target) {
        for (const name of Object.keys(event.tools)) {
          if (name.startsWith(MCP_PREFIX) && name !== "roblox-studio_list_roblox_studios") {
            delete event.tools[name]
          }
        }
      } else {
        delete event.tools["roblox-studio_set_active_studio"]
      }
    })

    return undefined
  },
})

export default plugin
