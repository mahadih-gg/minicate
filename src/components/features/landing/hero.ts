export const LANDING_NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Download", href: "#download" },
  { label: "About", href: "#about" },
  { label: "Builder", href: "#builder" },
] as const

export const LANDING_CTA_HREF = "/login"

export const LANDING_COPY = {
  eyebrow: "More than messaging",
  headlineLines: ["Chat freely.", "Stay closely."] as const,
  headlineAccentPrefix: "Be ",
  headlineAccent: "you.",
  supporting:
    "Minicate is a real-time messenger built for meaningful conversations, beautifully designed for everyday use.",
  primaryCta: "Get Minicate",
  secondaryCta: "Explore features",
  secondaryCtaHref: "#features",
  supportLine: "Fast. Private. Made for people.",
} as const

export const LANDING_FEATURES = [
  {
    title: "Blazing Fast",
    description: "Real-time messaging engine for super smooth conversations.",
    imageSrc: "/assets/images/why/blazing-fast.png",
    imageAlt: "Lightning bolt painted over a blue brush stroke",
  },
  {
    title: "Privacy First",
    description: "End-to-end security so your chats stay between you and your people.",
    imageSrc: "/assets/images/why/privacy-first.png.png",
    imageAlt: "Padlock painted over a peach brush stroke",
  },
  {
    title: "Groups & More",
    description: "Create groups, share files, make calls and do more together.",
    imageSrc: "/assets/images/why/group-and-more.png",
    imageAlt: "People painted over a violet brush stroke",
  },
  {
    title: "Made with Love",
    description: "Designed with personality for people who care about details.",
    imageSrc: "/assets/images/why/made-with-love.png",
    imageAlt: "Heart painted over a cyan brush stroke",
  },
] as const

export const LANDING_MESSENGER = {
  headline: "A messenger that feels",
  headlineAccent: "different.",
  supporting:
    "Minicate brings power and simplicity together in a minimal yet expressive experience.",
  cta: "Explore Features",
  ctaHint: "See what's inside",
  reviewsTitlePrefix: "People ",
  reviewsTitleAccent: "love",
  reviewsTitleSuffix: " Minicate",
} as const

export const LANDING_FOOTER = {
  taglineBefore: "Stay connected, ",
  taglineAccent: "your",
  taglineAfter: " way.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Security", href: "#security" },
        { label: "Download", href: "#download" },
        { label: "Changelog", href: "#changelog" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About us", href: "#about" },
        { label: "Blog", href: "#blog" },
        { label: "Careers", href: "#careers" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Terms of Service", href: "#terms" },
      ],
    },
  ],
} as const

export const LANDING_BUILDER = {
  heading: "Who Built It?",
  name: "Mahadi Hasan",
  role: "Lead Front-end Engineer",
  intro:
    "I design and build interfaces that feel considered: calm to read, sharp to use, and structured so they can grow. Minicate is my take on a real-time messenger with personality.",
  highlights: [
    "Based in Dhaka, shipping React, Next.js, and TypeScript products.",
    "Obsessed with architecture, accessibility, and motion that stays out of the way.",
    "Built Minicate with a thin UI, hooks for logic, and one socket for live chat.",
  ],
  builtWith:
    "Built with a notebook aesthetic, a quiet chat surface, and tools I actually use in production.",
  portrait: {
    src: "/assets/images/mahadi-profile.webp",
    alt: "Portrait of Mahadi Hasan, the developer who built Minicate",
  },
  links: [
    { label: "GitHub", href: "https://github.com/mahadih-gg", kind: "github" },
    { label: "LinkedIn", href: "https://linkedin.com/in/mahadih2", kind: "linkedin" },
    { label: "Portfolio", href: "https://mahadi.dev", kind: "portfolio" },
  ],
  stack: [
    { label: "Next.js", kind: "next" },
    { label: "React", kind: "react" },
    { label: "TypeScript", kind: "typescript" },
    { label: "Tailwind", kind: "tailwind" },
    { label: "shadcn", kind: "shadcn" },
    { label: "Socket.IO", kind: "socket" },
    { label: "TanStack Query", kind: "query" },
    { label: "Motion", kind: "motion" },
  ],
} as const

export const LANDING_REVIEWS = [
  {
    quote:
      "Minicate changed the way our team communicates. It's fast, beautiful and just works.",
    name: "Omar Faruk",
    role: "Product Designer",
  },
  {
    quote:
      "The real-time chat is calm and readable. I actually enjoy opening conversations again.",
    name: "Raisa Islam",
    role: "Community Lead",
  },
  {
    quote:
      "Groups, search, and history all feel considered. It is the messenger our studio needed.",
    name: "Hakim Ali",
    role: "Studio Founder",
  },
] as const
