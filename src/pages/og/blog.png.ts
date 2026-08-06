import type { APIRoute } from "astro";
import { renderOgImage } from "../../lib/og";

export const prerender = true;

export const GET: APIRoute = async () => {
  const png = await renderOgImage({
    title: "Blog",
    description:
      "Frontend performance, open source, JavaScript edges, and the occasional systems rabbit hole.",
    label: "Writing",
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
