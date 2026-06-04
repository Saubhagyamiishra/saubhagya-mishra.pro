"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState, band, smooth, lerp, damp } from "@/lib/scroll";

export default function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const easedP = useRef(0);
  const lookAt = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05); // clamp for stability on frame spikes
    easedP.current = damp(easedP.current, scrollState.progress, 5, d);
    const p = easedP.current;

    // --- distance from center ---
    let radius = lerp(7.0, 2.5, smooth(band(p, 0.0, 0.13)));
    radius = lerp(radius, 3.5, smooth(band(p, 0.13, 0.24)));
    radius = lerp(radius, 2.0, smooth(band(p, 0.24, 0.3))); // dive in toward Work
    radius = lerp(radius, 7.5, smooth(band(p, 0.3, 0.5))); // open field across Work
    radius = lerp(radius, 5.2, smooth(band(p, 0.5, 0.6))); // calm bed for Skills
    radius = lerp(radius, 1.9, smooth(band(p, 0.86, 0.92))); // collapse near the end
    radius = lerp(radius, 13.0, smooth(band(p, 0.93, 1.0))); // final pull-back

    // --- height ---
    let y = lerp(0.7, 0.0, smooth(band(p, 0.0, 0.13)));
    y = lerp(y, 0.4, smooth(band(p, 0.13, 0.24)));
    y = lerp(y, 1.05, smooth(band(p, 0.3, 0.5)));
    y = lerp(y, 0.45, smooth(band(p, 0.5, 0.6)));
    y = lerp(y, 0.2, smooth(band(p, 0.86, 0.92)));
    y = lerp(y, 2.4, smooth(band(p, 0.93, 1.0)));

    // --- orbit angle ---
    let ang = 0.0;
    ang += smooth(band(p, 0.13, 0.24)) * 0.3;
    ang += smooth(band(p, 0.3, 0.5)) * 1.4; // sweep across the Work river
    ang += smooth(band(p, 0.5, 0.88)) * 0.6; // slow drift through Skills
    ang += smooth(band(p, 0.93, 1.0)) * 0.8;

    const px = scrollState.pointerX;
    const py = scrollState.pointerY;

    const targetX = Math.sin(ang) * radius + px * 0.6;
    const targetZ = Math.cos(ang) * radius;
    const targetY = y + py * 0.35;

    camera.position.x = damp(camera.position.x, targetX, 4, d);
    camera.position.y = damp(camera.position.y, targetY, 4, d);
    camera.position.z = damp(camera.position.z, targetZ, 4, d);

    // lens warp at the Work dive and at the end collapse
    const collapse = band(p, 0.86, 0.92) * (1 - band(p, 0.92, 0.97));
    const warpIn = band(p, 0.24, 0.3) * (1 - band(p, 0.3, 0.38));
    const targetFov = 42 + collapse * 22 + warpIn * 16;
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = damp(camera.fov, targetFov, 5, d);
      camera.updateProjectionMatrix();
    }

    lookAt.current.set(px * 0.4, 0.1 + py * 0.25, 0);
    camera.lookAt(lookAt.current);
  });

  return null;
}
