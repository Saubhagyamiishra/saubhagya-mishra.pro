"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Both bundles are client-only so the viewport gate decides what to render
// without any SSR hydration mismatch. SIGNAL (desktop) and MobilePortfolio
// (mobile) never co-exist in the DOM at the same time.
//
// Note: viewport-gate logic is inlined here (instead of a separate Root.tsx)
// so the build's module-resolution doesn't depend on any single small file
// being uploaded into the build context. Production build was failing with
// "Module not found: Can't resolve '@/components/Root'" because the
// intermediary file wasn't ending up in the deploy zip.
const Site = dynamic(() => import("../components/Site"), {
  ssr: false,
  loading: () => null,
});
const MobilePortfolio = dynamic(
  () => import("../components/_mobile/MobilePortfolio"),
  { ssr: false, loading: () => null }
);

const MOBILE_QUERY = "(max-width: 1023px)";

export default function Page() {
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
