// All site copy + structured content lives here so it is easy to edit in one place.
// Zero em dashes anywhere in copy (per preference) — only hyphens / commas / periods.

export type Project = {
  id: string;
  index: string; // "01"
  name: string;
  kind: string; // short category label
  year: string;
  blurb: string;
  stack: string[];
  href?: string;
  // hue drives the artifact + accent tint in WebGL (0-1, fed to shaders / hsl)
  hue: number;
  // brand-themed tile treatment
  theme: "sonic" | "lux" | "glitch" | "neural";
  accent: string;
};

export const PROJECTS: Project[] = [
  {
    id: "mirsonics",
    index: "01",
    name: "Mirsonics",
    kind: "Health-tech platform",
    year: "2025",
    blurb: "Sonic therapeutics, made into a product and the system that grows it.",
    stack: ["Product", "Dashboards", "Growth"],
    href: "https://mirsonics.com",
    hue: 0.48,
    theme: "sonic",
    accent: "#36d2c4",
  },
  {
    id: "innofjoy",
    index: "02",
    name: "Inn of Joy",
    kind: "Luxury hospitality",
    year: "2024",
    blurb: "Booking, brand and a guest experience that feels like the stay.",
    stack: ["Booking", "CX", "Brand"],
    href: "https://innofjoy.com",
    hue: 0.11,
    theme: "lux",
    accent: "#e6c27a",
  },
  {
    id: "damage-culture",
    index: "03",
    name: "Damage Culture",
    kind: "Streetwear commerce",
    year: "2024",
    blurb: "A storefront with the attitude of a lookbook.",
    stack: ["Commerce", "Art Direction", "Motion"],
    href: "https://www.damageculture.com",
    hue: 0.0,
    theme: "glitch",
    accent: "#ff3b3b",
  },
  {
    id: "jarvislive",
    index: "04",
    name: "Jarvislive",
    kind: "Personal AI systems",
    year: "Ongoing",
    blurb: "Agents, Claude and n8n, running the work in the background.",
    stack: ["Agents", "Claude", "n8n"],
    hue: 0.72,
    theme: "neural",
    accent: "#9b8cff",
  },
];

// Skills & Tools, grouped into animated categories.
export type SkillCategory = {
  n: string;
  title: string;
  accent: string;
  tools: string[];
};

export const SKILLS: SkillCategory[] = [
  {
    n: "01",
    title: "Frontend Development",
    accent: "#5cc8ff",
    tools: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Three.js"],
  },
  {
    n: "02",
    title: "Backend & Databases",
    accent: "#57e08f",
    tools: [
      "Supabase",
      "MongoDB",
      "Database architecture",
      "API integrations",
      "Backend logic",
    ],
  },
  {
    n: "03",
    title: "Automations & Marketing",
    accent: "#ffb24c",
    tools: [
      "n8n",
      "ActiveCampaign",
      "Resend",
      "Zapier",
      "Email automation",
      "CRM workflows",
      "Lead nurture",
    ],
  },
  {
    n: "04",
    title: "AI Tools & Development",
    accent: "#a78bfa",
    tools: ["Claude", "Claude Code", "ChatGPT", "Codex", "Gemini", "AI-assisted building"],
  },
  {
    n: "05",
    title: "Design & Creative",
    accent: "#ff7ab8",
    tools: ["Figma", "Canva", "UI / UX redesign", "Brand design", "Layout design"],
  },
  {
    n: "06",
    title: "Video & Content",
    accent: "#6fe0e6",
    tools: ["DaVinci Resolve", "Video editing", "Short-form content", "Visual storytelling"],
  },
];

// Live "instrument panel" status rail items.
export const STATUS = [
  { k: "CRAFT", v: "Marketer + builder" },
  { k: "BASE", v: "Boston, US" },
  { k: "BUILD", v: "Jarvislive v1" },
  { k: "STATE", v: "Open to the extraordinary" },
];

export const NAV = [
  { id: "hero", label: "Signal" },
  { id: "identity", label: "About" },
  { id: "projects", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export const CONTACT = {
  email: "saubhagyamiishra@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/Saubhagyamiishra" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/saubhagya-mishra-16867718b/",
    },
  ],
};
