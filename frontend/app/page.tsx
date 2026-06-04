"use client";

import dynamic from "next/dynamic";

const Root = dynamic(() => import("@/components/Root"), {
  ssr: false,
  loading: () => null,
});

export default function Page() {
  return <Root />;
}
