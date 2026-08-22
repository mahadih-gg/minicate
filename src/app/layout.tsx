import { AppProviders } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Archivo_Black, Inter, Short_Stack } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const shortStack = Short_Stack({
  weight: "400",
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
        inter.variable,
        archivoBlack.variable,
        shortStack.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
