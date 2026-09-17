import { getModelContext } from "./detect";
import type { SiteTool } from "./tools";

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function isNotAllowed(error: unknown) {
  return error instanceof DOMException && error.name === "NotAllowedError";
}

export async function registerSiteTools(
  tools: SiteTool[],
  options: {
    signal: AbortSignal;
    modelContext?: WebMCP.ModelContext;
  },
) {
  const context = options.modelContext ?? getModelContext();
  if (!context || options.signal.aborted) return;

  await Promise.all(
    tools.map(async (tool) => {
      try {
        await context.registerTool(
          {
            name: tool.name,
            title: tool.title,
            description: tool.description,
            inputSchema: tool.inputSchema,
            annotations: tool.annotations,
            execute: (input, executeOptions) =>
              tool.execute(input as Record<string, unknown>, executeOptions),
          },
          { signal: options.signal },
        );
      } catch (error) {
        if (options.signal.aborted || isAbortError(error) || isNotAllowed(error)) {
          return;
        }
        console.warn(`[webmcp] failed to register ${tool.name}`, error);
      }
    }),
  );
}
