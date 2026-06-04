"use client";

import dynamic from "next/dynamic";

// The whole site is a client-only WebGL experience. Defer it past SSR so
// useDeviceTier / matchMedia resolve once on the client and we never hit
// the tree-swap reconciliation race (Projects/Skills return different JSX
// when tier flips from "high" → "low" mid-mount on mobile).
const Site = dynamic(() => import("@/components/Site"), {
  ssr: false,
  loading: () => null,
});

export default function Page() {
  return <Site />;
}
