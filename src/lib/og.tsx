import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

const rootDir = process.cwd();

function loadFont(weight: 400 | 600 | 700) {
  return readFileSync(
    join(
      rootDir,
      `node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`,
    ),
  );
}

const fonts = [
  {
    name: "Inter",
    data: loadFont(400),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Inter",
    data: loadFont(600),
    weight: 600 as const,
    style: "normal" as const,
  },
  {
    name: "Inter",
    data: loadFont(700),
    weight: 700 as const,
    style: "normal" as const,
  },
];

function titleFontSize(title: string) {
  if (title.length > 90) return 42;
  if (title.length > 60) return 52;
  if (title.length > 40) return 60;
  return 68;
}

function truncate(text: string, max = 140) {
  return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
}

export type OgImageOptions = {
  title: string;
  description?: string;
  label?: string;
  meta?: string;
};

export async function renderOgImage({
  title,
  description,
  label = "Blog",
  meta = "aaryanporwal.com",
}: OgImageOptions) {
  const summary = description ? truncate(description) : undefined;

  const svg = await satori(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        backgroundColor: "#08080B",
        color: "#F5F5F7",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#C6FF3D",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: titleFontSize(title),
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: 1000,
            color: "#F5F5F7",
          }}
        >
          {title}
        </div>
        {summary ? (
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#9A9AB0",
              maxWidth: 960,
            }}
          >
            {summary}
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #23232E",
          paddingTop: 28,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 600, color: "#F5F5F7" }}>
          Aaryan Porwal
        </div>
        <div style={{ fontSize: 22, color: "#9A9AB0" }}>{meta}</div>
      </div>
    </div>,
    {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts,
    },
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
