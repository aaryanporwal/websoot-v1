import { describe, expect, test } from "bun:test";
import worker from "./index.js";

describe("blog-redirect worker", () => {
  test("301 redirects root to the main blog index", async () => {
    const response = await worker.fetch(new Request("https://blog.aaryanporwal.com/"));

    expect(response.status).toBe(301);
    expect(response.headers.get("Location")).toBe("https://aaryanporwal.com/blog");
  });

  test("preserves nested paths and query strings", async () => {
    const response = await worker.fetch(
      new Request("https://blog.aaryanporwal.com/old-post?utm=1"),
    );

    expect(response.status).toBe(301);
    expect(response.headers.get("Location")).toBe(
      "https://aaryanporwal.com/blog/old-post?utm=1",
    );
  });
});
