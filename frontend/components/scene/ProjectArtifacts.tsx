"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PROJECTS } from "../../lib/data";
import { scrollState, band, damp } from "../../lib/scroll";

const RADIUS = 3.25;

function makeGeometry(i: number, simplify: boolean): THREE.BufferGeometry {
  const seg = simplify ? 0.6 : 1;
  switch (i) {
    case 0:
      return new THREE.TorusKnotGeometry(0.5, 0.16, Math.round(140 * seg), 14, 2, 3);
    case 1:
      return new THREE.OctahedronGeometry(0.72, 0);
    case 2:
      return new THREE.IcosahedronGeometry(0.72, 0);
    default:
      return new THREE.TorusGeometry(0.62, 0.05, 14, Math.round(96 * seg));
  }
}

function Artifact({
  index,
  angle,
  color,
  geometry,
  active,
}: {
  index: number;
  angle: number;
  color: THREE.Color;
  geometry: THREE.BufferGeometry;
  active: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const wire = useRef<THREE.MeshBasicMaterial>(null);
  const fill = useRef<THREE.MeshBasicMaterial>(null);
  const s = useRef(0);

  const baseX = Math.cos(angle) * RADIUS;
  const baseZ = Math.sin(angle) * RADIUS;
  const baseY = Math.sin(index * 1.7) * 0.5;
  const spin = 0.18 + index * 0.05;

  useFrame((_, dt) => {
    const g = group.current;
    if (!g || !wire.current || !fill.current) return;
    const p = scrollState.progress;
    const vis = band(p, 0.28, 0.34) * (1 - band(p, 0.5, 0.56));

    const targetScale = vis * (active ? 1.5 : 1);
    s.current = damp(s.current, targetScale, 6, dt);
    g.scale.setScalar(s.current);

    wire.current.opacity = damp(wire.current.opacity, vis * (active ? 1 : 0.5), 8, dt);
    fill.current.opacity = damp(fill.current.opacity, vis * (active ? 0.18 : 0.06), 8, dt);

    const t = performance.now() * 0.001;
    g.position.set(baseX, baseY + Math.sin(t * 0.6 + index) * 0.18, baseZ);
    g.rotation.y += dt * spin;
    g.rotation.x += dt * spin * 0.6;
  });

  return (
    <group ref={group} scale={0}>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          ref={wire}
          color={color}
          wireframe
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={geometry} scale={0.82}>
        <meshBasicMaterial
          ref={fill}
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function ProjectArtifacts({
  activeIndex,
  simplify = false,
}: {
  activeIndex: number | null;
  simplify?: boolean;
}) {
  const ring = useRef<THREE.Group>(null);

  const items = useMemo(
    () =>
      PROJECTS.map((proj, i) => ({
        color: new THREE.Color().setHSL(proj.hue, 0.72, 0.6),
        geometry: makeGeometry(i, simplify),
        angle: (i / PROJECTS.length) * Math.PI * 2 + Math.PI / 4,
      })),
    [simplify]
  );

  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.y += dt * 0.04;
  });

  return (
    <group ref={ring} rotation={[-0.34, 0, 0]}>
      {items.map((it, i) => (
        <Artifact
          key={i}
          index={i}
          angle={it.angle}
          color={it.color}
          geometry={it.geometry}
          active={activeIndex === i}
        />
      ))}
    </group>
  );
}
