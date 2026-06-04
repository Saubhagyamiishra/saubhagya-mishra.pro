"use client";

import { useEffect } from "react";
import "../../app/_mobile.css";
import { Navigation } from "./Navigation";
import { Hero } from "./Hero";
import { InfiniteMarquee } from "./Marquee";
import { About } from "./About";
import { Capabilities } from "./Capabilities";
import { Projects } from "./Projects";
import { ProcessTimeline } from "./ProcessTimeline";
import { Testimonials } from "./Testimonials";
import { ContactCard } from "./ContactCard";
import { Footer } from "./Footer";
import { InkCursor } from "./InkCursor";
import { LabModeEasterEgg } from "./LabModeEasterEgg";
import { DesktopHint } from "./DesktopHint";

// The full Editorial Tech Lab portfolio — served only on viewports < 1024px.
// All Tailwind utilities live under `.mobile-root` so the SIGNAL build (which
// uses pure CSS) is untouched.
export default function MobilePortfolio() {
  // Signal to the inline boot splash (rendered in app/layout.tsx) that the
  // mobile client bundle has hydrated. The splash listens for this event
  // (with `window.load` and a 7s timeout as fallbacks) and fades itself out.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event("app-ready"));
  }, []);

  return (
    <div className="mobile-root min-h-screen">
      <InkCursor />
      <Navigation />
      <main>
        <Hero />
        <InfiniteMarquee />
        <About />
        <Capabilities />
        <Projects />
        <ProcessTimeline />
        <Testimonials />
        <ContactCard />
      </main>
      <Footer />
      <LabModeEasterEgg />
      <DesktopHint />
    </div>
  );
}
