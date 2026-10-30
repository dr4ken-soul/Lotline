import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/newsreader";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lotline — Evidence-linked lot review",
  description: "A synthetic cold-chain workflow prototype. Deterministic scope, visible evidence gaps, and an explicit human review pause.",
  applicationName: "Lotline",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#20232a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
