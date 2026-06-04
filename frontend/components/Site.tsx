"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "./SmoothScroll";
import Preloader from "./Preloader";
import Nav from "./Nav";
import StatusRail from "./StatusRail";
import Ambient from "./Ambient";
import Hero from "./sections/Hero";
import Identity from "./sections/Identity";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";
import { useMounted } from "../lib/hooks";

// R3F must stay client-only.
const Experience = dynamic(() => import("./scene/Experience"), {
  ssr: false,
  loading: () => null,
});

export default function Site() {
  const [started, setStarted] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  // Gate the WebGL Canvas behind hydration to avoid the dynamic-import
  // removeChild race React + R3F can hit on slow tiers / mobile.
  const mounted = useMounted();

  // Lock scroll until the preloader is done.
  useEffect(() => {
    const el = document.body;
    if (started) el.removeAttribute("data-loading");
    else el.setAttribute("data-loading", "true");
    return () => el.removeAttribute("data-loading");
  }, [started]);

  return (
    <SmoothScroll>
      <Preloader onDone={() => setStarted(true)} />
      {mounted && <Experience activeProject={activeProject} />}
      <div className="scrim" aria-hidden="true" />
      <Nav />
      <StatusRail />
      <Ambient />
      <div className="grain" aria-hidden="true" />

      <main className="content">
        <Hero ready={started} />
        <Identity />
        <Projects onHover={setActiveProject} />
        <Skills />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
