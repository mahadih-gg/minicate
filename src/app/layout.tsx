import type { Metadata } from "next";
import { Caveat, Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
});

export const metadata: Metadata = {
  title: "Minicate - Modern Chat App",
  description: "Minicate is a modern chat app built with Next.js, Tailwind CSS, and Shadcn UI.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Minicate - Modern Chat App",
    description: "Minicate is a modern chat app built with Next.js, Tailwind CSS, and Shadcn UI.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        outfit.variable,
        fraunces.variable,
        caveat.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
