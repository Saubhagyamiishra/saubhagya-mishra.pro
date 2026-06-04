"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FIELD_VERT, FIELD_FRAG } from "./shaders";
import { scrollState, band, damp } from "@/lib/scroll";

const AMBER = new THREE.Color("#ffb24c");
const STEEL = new THREE.Color("#6fe0e6");
const BONE = new THREE.Color("#f2eee6");

export default function Starfield({ count = 9000 }: { count?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pull = useRef(0);
  const travel = useRef(0);
  const gl = useThree((s) => s.gl);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const seed = new Float32Array(count);
    const hue = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // flattened cloud: wide in x/z, shallower in y, denser toward center
      const r = Math.pow(Math.random(), 0.6) * 15;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3 + 0] = Math.cos(theta) * r + (Math.random() - 0.5) * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7 * (1 - r / 22);
      pos[i * 3 + 2] = Math.sin(theta) * r + (Math.random() - 0.5) * 2;

      scale[i] = 0.4 + Math.random() * 1.8;
      seed[i] = Math.random();
      // bias hue: more amber near center, more steel outside
      hue[i] = THREE.MathUtils.clamp(r / 15 + (Math.random() - 0.5) * 0.5, 0, 1);
    }

    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aHue", new THREE.BufferAttribute(hue, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: FIELD_VERT,
        fragmentShader: FIELD_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPull: { value: 0 },
          uTravel: { value: 0 },
          uSize: { value: 2.2 },
          uPixelRatio: { value: 1 },
          uAmber: { value: AMBER },
          uSteel: { value: STEEL },
          uBone: { value: BONE },
        },
      }),
    []
  );

  useFrame((_, dt) => {
    const m = matRef.current;
    if (!m) return;
    const p = scrollState.progress;
    // singularity pulse near the very end (before the final reveal)
    const collapse = band(p, 0.86, 0.92);
    const release = band(p, 0.92, 0.98);
    const targetPull = collapse * (1 - release * 0.85);
    // inward dive during hero -> identity, plus a surge entering Work
    const heroDive = band(p, 0.04, 0.22) * (1 - band(p, 0.26, 0.34));
    const workWarp = band(p, 0.26, 0.34) * (1 - band(p, 0.34, 0.44));
    const targetTravel = Math.max(heroDive, workWarp * 1.1);

    pull.current = damp(pull.current, targetPull, 6, dt);
    travel.current = damp(travel.current, targetTravel, 5, dt);

    m.uniforms.uTime.value += dt;
    m.uniforms.uPull.value = pull.current;
    m.uniforms.uTravel.value = travel.current;
    m.uniforms.uPixelRatio.value = gl.getPixelRatio();
  });

  return (
    <points geometry={geometry}>
      <primitive object={material} ref={matRef} attach="material" />
    </points>
  );
}
