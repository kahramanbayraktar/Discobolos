import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: {
    default: "Discobolos | Ultimate Frisbee Team",
    template: "%s | Discobolos",
  },
  description:
    "Join Discobolos - an energetic Ultimate Frisbee community inspired by the spirit of ancient athletics. Experience the Spirit of the Game, competitive play, and lifelong friendships.",
  keywords: [
    "ultimate frisbee",
    "disc sports",
    "frisbee team",
    "spirit of the game",
    "discobolos",
    "ultimate team",
  ],
  authors: [{ name: "Discobolos Ultimate" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Discobolos Ultimate",
    title: "Discobolos | Ultimate Frisbee Team",
    description:
      "Join Discobolos - an energetic Ultimate Frisbee community dedicated to competitive play and Spirit of the Game.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discobolos | Ultimate Frisbee Team",
    description:
      "Join Discobolos - an energetic Ultimate Frisbee community.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5a623" },
    { media: "(prefers-color-scheme: dark)", color: "#3d4f5f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
