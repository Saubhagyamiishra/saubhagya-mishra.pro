"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CORE_VERT, CORE_FRAG } from "./shaders";
import { scrollState, band, damp, lerp } from "@/lib/scroll";

const COLOR = new THREE.Color("#ff9b3d");
const COLOR2 = new THREE.Color("#ffd9a0");

export default function SignalCore({ detail = 16 }: { detail?: number }) {
  const group = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const energy = useRef(0.2);
  const scaleRef = useRef(0.6);

  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(1.05, detail),
    [detail]
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: CORE_VERT,
        fragmentShader: CORE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uEnergy: { value: 0.2 },
          uPull: { value: 0 },
          uColor: { value: COLOR },
          uColor2: { value: COLOR2 },
        },
      }),
    []
  );

  useFrame((_, dt) => {
    const g = group.current;
    const m = matRef.current;
    if (!g || !m) return;
    const p = scrollState.progress;

    // grows from a quiet ember (hero) to a full presence (identity/work)
    const grow = band(p, 0.05, 0.26);
    const calm = band(p, 0.5, 0.9);
    const targetScale = lerp(0.55, 1.25, grow) * (1 - calm * 0.15);
    scaleRef.current = damp(scaleRef.current, targetScale, 4, dt);
    g.scale.setScalar(scaleRef.current);

    // energy peaks during the dive and the end collapse
    const dive = band(p, 0.1, 0.26);
    const collapse = band(p, 0.86, 0.92) * (1 - band(p, 0.92, 0.98));
    const targetEnergy =
      0.18 + dive * 0.5 + collapse * 0.9 + Math.abs(scrollState.velocity) * 0.0015;
    energy.current = damp(energy.current, targetEnergy, 5, dt);

    g.rotation.y += dt * 0.12;
    g.rotation.x = Math.sin(performance.now() * 0.0002) * 0.25;

    m.uniforms.uTime.value += dt;
    m.uniforms.uEnergy.value = energy.current;
    m.uniforms.uPull.value = collapse;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <primitive object={material} ref={matRef} attach="material" />
      </mesh>
    </group>
  );
}
