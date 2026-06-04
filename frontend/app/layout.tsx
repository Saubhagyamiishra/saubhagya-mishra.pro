import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saubhagya Mishra",
  description:
    "Saubhagya Mishra. Director of Digital Marketing, builder, and automation enthusiast. Marketing, analytics and AI, wired into one signal.",
  authors: [{ name: "Saubhagya Mishra" }],
  openGraph: {
    title: "Saubhagya Mishra",
    description:
      "Builder, marketer, automation enthusiast. Marketing, analytics and AI in one signal.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#060709",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Display: Bricolage Grotesque · Accent serif: Instrument Serif · Mono: Space Mono · Body: Sora */}
        {/* Mobile portfolio fonts: Fraunces (display) · Geist (body) · Geist Mono (labels) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Instrument+Serif:ital@0;1&family=Sora:wght@300;400;500;600&family=Space+Mono:wght@400;700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
