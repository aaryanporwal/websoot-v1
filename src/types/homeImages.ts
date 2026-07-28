import type { ResolvedPicture } from "../lib/resolvePicture";

export type WorkProjectPicture = {
  tag: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  logo: string;
  picture: ResolvedPicture;
};

export type HomeImages = {
  work: WorkProjectPicture[];
  contact: {
    headSleepy: ResolvedPicture;
    headAlert: ResolvedPicture;
    headNeutral: ResolvedPicture;
    treat: ResolvedPicture;
  };
};
