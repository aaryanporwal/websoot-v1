export const SITE_PROFILE = {
  name: "Aaryan Porwal",
  role: "AI Systems & Web Engineer",
  summary:
    "Aaryan Porwal builds software with care and curiosity: interfaces, systems, React, agents, LLMs, and RAG tools that feel good to use.",
  site: "https://aaryanporwal.com",
} as const;

export const SITE_CONTACT = {
  email: "aaryan@aaryanporwal.com",
  linkedin: "https://www.linkedin.com/in/aaryan-porwal/",
  calendar: "https://cal.com/aaryan",
  github: "https://github.com/aaryanporwal",
} as const;

export const SKILL_ROW_A = [
  "JavaScript",
  "TypeScript",
  "React",
  "Astro",
  "Node.js",
  "GSAP",
] as const;

export const SKILL_ROW_B = [
  "Tailwind CSS",
  "Docker",
  "AWS",
  "CI/CD",
  "PostgreSQL",
  "GraphQL",
] as const;

export const SITE_SKILLS = [...SKILL_ROW_A, ...SKILL_ROW_B];
