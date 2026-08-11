import type { ImageMetadata } from "astro";
import canonicalImg from "../assets/works/canonical.png";
import fusedImg from "../assets/works/fused.png";
import gsocImg from "../assets/works/gsoc.png";
import hackclubImg from "../assets/works/hackclub.png";
import ubuntuSummitImg from "../assets/works/ubuntu-summit.png";

export type WorkProject = {
  tag: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  logo: string;
  image: ImageMetadata;
  /** Max display width in px (used for responsive srcset generation). */
  displayWidth: number;
};

export const WORK_PROJECTS: WorkProject[] = [
  {
    tag: "Full Stack",
    title: "Fused",
    desc: "Shaped an AI-assisted inline diff review in CodeMirror 6, built full-stack Git version control, and made 10K+ file trees easier to navigate.",
    cta: "fused.io",
    href: "https://fused.io",
    logo: "/works/fused-logo.png",
    image: fusedImg,
    displayWidth: 544,
  },
  {
    tag: "Open Source",
    title: "Canonical",
    desc: "Built React components for ubuntu.com's Vanilla Framework, a browser debugging environment for Anbox Cloud, and real-time Android Automotive sensor simulation.",
    cta: "ubuntu.com",
    href: "https://web.archive.org/web/20260805231116/https://ubuntu.com/",
    logo: "/works/canonical-favicon.png",
    image: canonicalImg,
    displayWidth: 544,
  },
  {
    tag: "Open Source",
    title: "GSoC",
    desc: "Added visual regression testing to Ceph Dashboard with Applitools Eyes and Cypress, catching 15+ UI defects a month before they reached users.",
    cta: "View on GitHub",
    href: "https://github.com/ceph/ceph",
    logo: "/works/gsoc-favicon.png",
    image: gsocImg,
    displayWidth: 544,
  },
  {
    tag: "Community",
    title: "Hack Club",
    desc: "Published 3 technical workshops on Node.js, DevOps, and HTML5 Canvas, then taught CLI application building live at Figma HQ.",
    cta: "hackclub.com",
    href: "https://hackclub.com",
    logo: "/works/hackclub-logo.png",
    image: hackclubImg,
    displayWidth: 544,
  },
  {
    tag: "Event",
    title: "Ubuntu Summit",
    desc: "Built the official Ubuntu Summit 2024 site in Flask for a 5,000+ attendee, 3-day conference in The Hague.",
    cta: "Read more",
    href: "https://web.archive.org/web/20260805231116/https://ubuntu.com/summit",
    logo: "/works/canonical-favicon.png",
    image: ubuntuSummitImg,
    displayWidth: 544,
  },
];
