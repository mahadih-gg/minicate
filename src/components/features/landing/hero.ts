export const LANDING_NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Download", href: "#download" },
  { label: "About", href: "#about" },
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
