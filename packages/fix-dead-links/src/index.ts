export {
  extractUrls,
  getArchiveUrl,
  isDeadLink,
  isDefinitelyDeadStatus,
  mapWithConcurrency,
  replaceUrls,
  shouldCheckUrl,
  snapshotUrlFromWaybackResponse,
  type LinkReplacement,
} from "./dead-links.js";

export { fixDeadLinks, listScannableFiles, type FixDeadLinksOptions } from "./fix.js";
export { runCli } from "./cli.js";
