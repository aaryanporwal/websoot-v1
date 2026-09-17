import { describe, expect, test } from "bun:test";
import { getModelContext, supportsWebMCP } from "./detect";

describe("supportsWebMCP", () => {
  test("is false in a non-browser test runner", () => {
    expect(getModelContext()).toBeUndefined();
    expect(supportsWebMCP()).toBe(false);
  });
});
