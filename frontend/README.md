# SIGNAL — Saubhagya Mishra

A cinematic personal portfolio. One persistent WebGL world that the camera
travels through as you scroll: particles resolve into the name, you dive into
the signal, projects orbit a luminous core, everything collapses to a
singularity, then pulls back to reveal one interconnected system.

Built with **Next.js (App Router) + TypeScript**, **React Three Fiber / three.js**,
**GSAP ScrollTrigger**, **Framer Motion**, and **Lenis** smooth scroll.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

Production:

```bash
npm run build
npm start
```

Requires Node 18.17+ (Node 20+ recommended).

## What to customize

Almost everything lives in **`lib/data.ts`**:

- `PROJECTS` — your work. Each has a `hue` (0..1) that tints its 3D artifact.
- `STORY` — the About beats.
- `SKILL_NODES` / `SKILL_LINKS` — the interactive ecosystem graph.
- `STATUS` — the bottom-left instrument rail.
- `CONTACT` — **edit the email and social links** (currently placeholders).

Other quick edits:

- **Portrait**: `components/sections/About.tsx` has a monogram placeholder.
  Drop an image into `/public` and replace the `.portrait` block with
  `next/image`.
- **Colors / fonts**: CSS variables at the top of `app/globals.css`.
- **The 3D feel**: scroll-driven camera waypoints are in
  `components/scene/CameraRig.tsx`; particle behaviour and the singularity
  collapse are in `components/scene/shaders.ts` + `Starfield.tsx`.

## Performance

The scene auto-detects low-power / mobile devices (`lib/hooks.ts → useDeviceTier`)
and drops particle counts, lowers the pixel ratio, and disables post-processing
(bloom, chromatic aberration). It also respects `prefers-reduced-motion`,
shortening the intro and calming the motion.

If you want it lighter everywhere, lower the `count` passed to `Starfield` and
the `detail` on `SignalCore` in `components/scene/Experience.tsx`.

## Structure

```
app/            layout, page, globals.css
components/
  scene/        WebGL: Experience (Canvas), Starfield, SignalCore,
                ProjectArtifacts, CameraRig, Effects, shaders
  sections/     DOM: Hero, Identity, Projects, About, Skills, Contact
  Site.tsx      orchestrator (preloader + canvas + scroll + UI)
  SmoothScroll, Preloader, Cursor, Nav, StatusRail
lib/            data, scroll store, hooks
```

All copy avoids em dashes by design.
