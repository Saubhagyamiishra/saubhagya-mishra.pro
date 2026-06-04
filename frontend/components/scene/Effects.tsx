"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { scrollState, band } from "@/lib/scroll";

export default function Effects() {
  const ca = useRef<{ offset: THREE.Vector2 }>(null);

  useFrame(() => {
    if (!ca.current) return;
    // aberration intensifies during transitions / singularity
    const p = scrollState.progress;
    const t = band(p, 0.6, 0.72) * (1 - band(p, 0.72, 0.82));
    const base = 0.0006;
    const amt = base + t * 0.004 + Math.min(Math.abs(scrollState.velocity) * 0.000004, 0.0016);
    ca.current.offset.set(amt, amt);
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.7}
      />
      <ChromaticAberration
        ref={ca as never}
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0005, 0.0005)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.3} darkness={0.82} />
    </EffectComposer>
  );
}
