"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Starfield from "./Starfield";
import SignalCore from "./SignalCore";
import ProjectArtifacts from "./ProjectArtifacts";
import CameraRig from "./CameraRig";
import Effects from "./Effects";
import { useDeviceTier, usePrefersReducedMotion } from "@/lib/hooks";

export default function Experience({
  activeProject,
}: {
  activeProject: number | null;
}) {
  const tier = useDeviceTier();
  const reduced = usePrefersReducedMotion();
  const low = tier === "low";

  return (
    <div className="webgl" aria-hidden="true">
      <Canvas
        frameloop="always"
        dpr={[1, low ? 1.5 : 2]}
        camera={{ position: [0, 0.7, 7], fov: 42, near: 0.1, far: 120 }}
        gl={{
          antialias: !low,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
        }}
      >
        <color attach="background" args={["#060709"]} />
        <Suspense fallback={null}>
          <Starfield count={low ? 3500 : 9000} />
          <SignalCore detail={low ? 8 : 18} />
          <ProjectArtifacts activeIndex={activeProject} simplify={low} />
          <CameraRig />
          {!low && !reduced && <Effects />}
        </Suspense>
      </Canvas>
    </div>
  );
}
