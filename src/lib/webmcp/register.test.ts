import { describe, expect, test } from "bun:test";
import { registerSiteTools } from "./register";
import type { SiteTool } from "./tools";

function tool(name: string, execute = async () => ({ ok: true })): SiteTool {
  return {
    name,
    title: name,
    description: name,
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    execute,
  };
}

describe("registerSiteTools", () => {
  test("is a no-op when modelContext is missing", async () => {
    await registerSiteTools([tool("get_site_context")], {
      signal: new AbortController().signal,
    });
  });

  test("registers each tool with the abort signal and skips after abort", async () => {
    const registered: string[] = [];
    const controller = new AbortController();
    const modelContext = {
      async registerTool(definition: { name: string }) {
        registered.push(definition.name);
      },
    } as unknown as WebMCP.ModelContext;

    await registerSiteTools([tool("search_site"), tool("set_theme")], {
      signal: controller.signal,
      modelContext,
    });
    expect(registered).toEqual(["search_site", "set_theme"]);

    controller.abort();
    await registerSiteTools([tool("open_destination")], {
      signal: controller.signal,
      modelContext,
    });
    expect(registered).toEqual(["search_site", "set_theme"]);
  });

  test("swallows NotAllowedError so missing permissions stay silent", async () => {
    const modelContext = {
      async registerTool() {
        throw new DOMException("blocked", "NotAllowedError");
      },
    } as unknown as WebMCP.ModelContext;

    await registerSiteTools([tool("get_site_context")], {
      signal: new AbortController().signal,
      modelContext,
    });
  });
});
