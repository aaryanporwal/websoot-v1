import { useEffect } from "react";
import {
  createBrowserActions,
  createSiteTools,
  registerSiteTools,
  supportsWebMCP,
  type SiteCatalog,
} from "../src/lib/webmcp";

type Props = {
  catalog: SiteCatalog;
};

export default function WebMcp({ catalog }: Props) {
  useEffect(() => {
    if (!supportsWebMCP()) return;

    const controller = new AbortController();
    const tools = createSiteTools(catalog, createBrowserActions());
    void registerSiteTools(tools, { signal: controller.signal });

    return () => controller.abort();
  }, [catalog]);

  return null;
}
