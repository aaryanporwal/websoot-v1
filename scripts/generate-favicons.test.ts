import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import {
  DARK_STROKE,
  LIGHT_STROKE,
  generateFavicons,
  signatureSvg,
} from "./generate-favicons";

const repoRoot = path.resolve(import.meta.dir, "..");

async function meanOpaquePixel(filePath: string) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let count = 0;
  let r = 0;
  let g = 0;
  let b = 0;
  let transparent = 0;

  for (let i = 0; i < data.length; i += info.channels) {
    const alpha = data[i + 3];
    if (alpha < 16) {
      transparent += 1;
      continue;
    }
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count += 1;
  }

  return {
    transparentRatio: transparent / (data.length / info.channels),
    mean: count === 0 ? { r: 0, g: 0, b: 0 } : { r: r / count, g: g / count, b: b / count },
  };
}

describe("adaptive signature favicon", () => {
  test("SVG has no painted backdrop and flips stroke with color scheme", () => {
    const svg = signatureSvg({ stroke: DARK_STROKE, adaptive: true });

    expect(svg).not.toMatch(/<rect\b/);
    expect(svg).toContain("prefers-color-scheme: dark");
    expect(svg).toContain(`stroke: ${LIGHT_STROKE}`);
    expect(svg).toContain(`stroke: ${DARK_STROKE}`);
  });

  test("dark-tab SVG is white in the markup so Chrome does not need CSS", () => {
    const svg = signatureSvg({ stroke: DARK_STROKE });

    expect(svg).not.toMatch(/<rect\b/);
    expect(svg).not.toContain("prefers-color-scheme");
    expect(svg).toContain(`stroke="${DARK_STROKE}"`);
    expect(svg).not.toContain(LIGHT_STROKE);
  });

  test("light SVG stays dark-ink so a white tab remains readable", () => {
    const svg = signatureSvg({ stroke: LIGHT_STROKE });

    expect(svg).not.toMatch(/<rect\b/);
    expect(svg).toContain(`stroke="${LIGHT_STROKE}"`);
    expect(svg).not.toContain("prefers-color-scheme");
    expect(svg).not.toContain(DARK_STROKE);
  });

  test("layout serves light and dark icons via prefers-color-scheme", async () => {
    const layout = await readFile(
      path.join(repoRoot, "src/layouts/SiteLayout.astro"),
      "utf8",
    );

    expect(layout).toContain('media="(prefers-color-scheme: dark)"');
    expect(layout).toContain('media="(prefers-color-scheme: light)"');
    expect(layout).toContain('href="/favicon-dark.svg?v=2"');
    expect(layout).toContain('href="/favicon-light.svg?v=2"');
    expect(layout).toContain('href="/favicon-dark.png?v=2"');
    expect(layout).toContain('href="/favicon-light.png?v=2"');
    expect(layout).not.toContain('href="/favicon.png"');
    expect(layout).not.toContain('href="/favicon.svg"');
    expect(layout).not.toContain('favicon.ico');
  });

  test("raster icons keep a transparent field and readable ink", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "favicon-"));
    try {
      await generateFavicons(tmp);

      const dark = await meanOpaquePixel(path.join(tmp, "favicon-dark.png"));
      const light = await meanOpaquePixel(path.join(tmp, "favicon-light.png"));

      expect(dark.transparentRatio).toBeGreaterThan(0.7);
      expect(light.transparentRatio).toBeGreaterThan(0.7);
      expect(dark.mean.r).toBeGreaterThan(240);
      expect(light.mean.r).toBeLessThan(20);

      const darkSvg = await readFile(path.join(tmp, "favicon-dark.svg"), "utf8");
      expect(darkSvg).toContain(`stroke="${DARK_STROKE}"`);
      expect(darkSvg).not.toContain(LIGHT_STROKE);
      expect(darkSvg).not.toContain("prefers-color-scheme");
    } finally {
      await rm(tmp, { recursive: true, force: true });
    }
  });
});
