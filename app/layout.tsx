import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Cursor from "@/components/motion/Cursor";
import Preloader from "@/components/motion/Preloader";
import FloatingCTA from "@/components/FloatingCTA";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-brand",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const SITE_URL = "https://lockrhythm-portfolio.vercel.app";
const DESCRIPTION =
  "LockRhythm is a digital product studio from Sahiwal, Pakistan. We design and engineer websites, web apps, mobile apps and AI tools that turn visitors into customers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LockRhythm — Websites, Apps & AI Software That Win",
    template: "%s · LockRhythm",
  },
  description: DESCRIPTION,
  keywords: [
    "web development agency",
    "web design Pakistan",
    "mobile app development",
    "UI/UX design",
    "AI software",
    "Next.js developers",
    "Sahiwal",
    "LockRhythm",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "LockRhythm",
    title: "LockRhythm — We Build Digital Experiences That Win",
    description: DESCRIPTION,
    images: [{ url: "/logo.png", width: 1200, height: 1200, alt: "LockRhythm" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LockRhythm — We Build Digital Experiences That Win",
    description: DESCRIPTION,
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#040408",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Preloader />
        <SmoothScroll />
        <Cursor />
        <Navbar />
        {children}
        <FloatingCTA />
      </body>
    </html>
  );
}
