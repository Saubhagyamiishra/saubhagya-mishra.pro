"use client";

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

// The full Editorial Tech Lab portfolio — served only on viewports < 1024px.
// All Tailwind utilities live under `.mobile-root` so the SIGNAL build (which
// uses pure CSS) is untouched.
export default function MobilePortfolio() {
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
    </div>
  );
}
