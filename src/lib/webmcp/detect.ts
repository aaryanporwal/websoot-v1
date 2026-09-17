export function getModelContext(): WebMCP.ModelContext | undefined {
  if (typeof document === "undefined") return undefined;
  return document.modelContext;
}

export function supportsWebMCP() {
  return getModelContext() !== undefined;
}
