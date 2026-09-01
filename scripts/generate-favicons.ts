#!/usr/bin/env bun

import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dir, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

export const VIEWBOX = "0 0 219 213";
export const LIGHT_STROKE = "#08080b";
export const DARK_STROKE = "#ffffff";
export const STROKE_WIDTH = 6;

export const SIGNATURE_PATHS = [
  "M6.20975 142.346C11.0131 146.671 15.4987 151.069 19.7053 155.988C22.5589 159.324 27.7529 168.687 33.2265 163.83C37.9451 159.643 40.7333 151.992 42.8911 146.771C47.5613 135.469 55.1205 113.886 58.9776 103.27C59.089 102.964 80.5071 47.4426 81.3736 48.1609C85.2659 51.388 82.8602 77.6414 82.8676 80.6962C82.9046 96.053 82.5799 111.38 81.514 126.701C81.4633 127.43 81.1854 129.562 81.0523 128.844C80.1253 123.84 79.5085 118.784 78.6964 113.761C76.2096 98.3781 74.2279 82.6775 70.5581 67.5157C68.6406 59.5937 62.373 39.0312 54.2494 53.8905C45.0163 70.7791 38.2234 90.5848 35.8906 109.713C34.8533 118.218 35.6927 128.222 40.4925 135.63C60.789 166.954 76.7194 102.873 82.3786 89.9773C84.2671 85.6741 88.8129 97.2486 89.5455 98.5015C91.3483 101.585 93.6721 105.498 96.5393 107.734C100.239 110.618 102.114 102.727 102.863 100.66C103.665 98.4448 104.48 90.5922 107.983 91.4608C114.874 93.1695 118.356 91.6736 121.769 85.3525C123.357 82.4101 128.033 85.556 130.938 83.1238C133.842 80.6924 134.17 75.5433 138.105 74.2905C144.316 72.3135 148.198 76.31 153 69.4465C159.022 60.8386 162.353 45.8474 155.716 36.5332C152.117 31.4826 147.516 33.5381 145.303 39.0475C139.631 53.1689 139.673 76.2045 140.461 89.7561C142.883 131.398 153.841 171.973 165.622 169",
  "M103.231 153.042C126.144 134.313 148.88 115.327 172.64 97.6662C175.307 95.6835 178.046 93.7979 180.758 91.8769C181.757 91.1686 184.466 90.5272 183.652 89.6115C182.537 88.3571 173.664 89.6115 171.759 89.6115",
] as const;

function pathMarkup(stroke: string): string {
  return SIGNATURE_PATHS.map(
    (d) =>
      `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round"/>`,
  ).join("\n  ");
}

export function signatureSvg(options: {
  stroke: string;
  adaptive?: boolean;
}): string {
  // Presentation attributes carry the ink. Chrome's favicon rasterizer often
  // ignores <style> and prefers-color-scheme, so the dark-tab file must be
  // white in the markup itself — not only inside a media query.
  const paths = pathMarkup(options.stroke);

  if (!options.adaptive) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}">
  ${paths}
</svg>
`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}">
  <style>
    path { stroke: ${LIGHT_STROKE}; }
    @media (prefers-color-scheme: dark) {
      path { stroke: ${DARK_STROKE}; }
    }
  </style>
  ${paths}
</svg>
`;
}

function rasterSvg(stroke: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" width="256" height="249">
  ${SIGNATURE_PATHS.map(
    (d) =>
      `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round"/>`,
  ).join("\n  ")}
</svg>`;
}

async function pngFromStroke(stroke: string, size: number): Promise<Buffer> {
  return sharp(Buffer.from(rasterSvg(stroke)))
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

function encodeIco(images: { size: number; png: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const entries = Buffer.alloc(16 * images.length);
  let offset = 6 + entries.length;
  const payloads: Buffer[] = [];

  images.forEach((image, index) => {
    const entry = entries.subarray(index * 16, index * 16 + 16);
    entry.writeUInt8(image.size >= 256 ? 0 : image.size, 0);
    entry.writeUInt8(image.size >= 256 ? 0 : image.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.png.length, 8);
    entry.writeUInt32LE(offset, 12);
    payloads.push(image.png);
    offset += image.png.length;
  });

  return Buffer.concat([header, entries, ...payloads]);
}

export async function generateFavicons(outDir = PUBLIC_DIR) {
  const darkSvg = signatureSvg({ stroke: DARK_STROKE });
  const lightSvg = signatureSvg({ stroke: LIGHT_STROKE });
  const adaptiveSvg = signatureSvg({ stroke: DARK_STROKE, adaptive: true });

  const darkPng = await pngFromStroke(DARK_STROKE, 64);
  const lightPng = await pngFromStroke(LIGHT_STROKE, 64);
  const ico = encodeIco(
    await Promise.all(
      [16, 32, 48].map(async (size) => ({
        size,
        png: await pngFromStroke(LIGHT_STROKE, size),
      })),
    ),
  );

  await Promise.all([
    writeFile(path.join(outDir, "favicon.svg"), adaptiveSvg),
    writeFile(path.join(outDir, "favicon-dark.svg"), darkSvg),
    writeFile(path.join(outDir, "favicon-light.svg"), lightSvg),
    writeFile(path.join(outDir, "favicon.png"), darkPng),
    writeFile(path.join(outDir, "favicon-dark.png"), darkPng),
    writeFile(path.join(outDir, "favicon-light.png"), lightPng),
    writeFile(path.join(outDir, "favicon.ico"), ico),
  ]);
}

if (import.meta.main) {
  await generateFavicons();
  console.log(
    "Wrote favicon.svg, favicon-dark.svg, favicon-light.svg, favicon.png, favicon-dark.png, favicon-light.png, favicon.ico",
  );
}
