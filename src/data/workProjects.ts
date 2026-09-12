import type { ImageMetadata } from "astro";
import canonicalImg from "../assets/works/canonical.png";
import fusedImg from "../assets/works/fused.png";
import gsocImg from "../assets/works/gsoc.png";
import hackclubImg from "../assets/works/hackclub.png";
import ubuntuSummitImg from "../assets/works/ubuntu-summit.png";
import { WORK_ENTRIES, type WorkEntry } from "./work";

export type WorkProject = WorkEntry & {
  image: ImageMetadata;
};

const WORK_IMAGES: Record<string, ImageMetadata> = {
  Fused: fusedImg,
  Canonical: canonicalImg,
  GSoC: gsocImg,
  "Hack Club": hackclubImg,
  "Ubuntu Summit": ubuntuSummitImg,
};

export const WORK_PROJECTS: WorkProject[] = WORK_ENTRIES.map((entry) => {
  const image = WORK_IMAGES[entry.title];
  if (!image) {
    throw new Error(`Missing work image for ${entry.title}`);
  }

  return { ...entry, image };
});
