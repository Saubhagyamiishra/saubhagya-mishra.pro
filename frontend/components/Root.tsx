"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Both bundles are client-only so the viewport gate decides what to render
// without any SSR hydration mismatch. SIGNAL (desktop) and MobilePortfolio
// (mobile) never co-exist in the DOM at the same time.
const Site = dynamic(() => import("@/components/Site"), {
  ssr: false,
  loading: () => null,
});
const MobilePortfolio = dynamic(
  () => import("@/components/_mobile/MobilePortfolio"),
  { ssr: false, loading: () => null }
);

const MOBILE_QUERY = "(max-width: 1023px)";

export default function Root() {
  // `null` = unknown (first render). Render nothing until matchMedia resolves.
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (isMobile === null) return null;
  return isMobile ? <MobilePortfolio /> : <Site />;
}
