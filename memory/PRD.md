# Saubhagya Mishra — Personal Portfolio

## Original Problem Statement
Build a premium, interactive personal portfolio website. Frontend follows the
"Editorial Tech Lab" aesthetic (light cream `#f4f1ea` base, deep ink `#0f0e0d`,
electric orange `#ff5a1f` accent, Fraunces serif display + Geist body).
Backend (FastAPI + MongoDB) and admin panel remain untouched.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, inline SVG/CSS animations,
  HTML5 Canvas (ink-streak cursor).
- **Backend**: FastAPI (Python), MongoDB + GridFS.
- **Routing**: `/admin` (preserved legacy panel), all sections live in `src/components/new/`.

## Sections (13)
Navigation · Hero · Marquee · About · **Capabilities** · Projects · Dashboard ·
Timeline · Lab · Testimonials · Contact · Footer · InkCursor.

## Completed Work
- 2026-02 — Complete UI redesign to Editorial Tech Lab theme
- 2026-02 — New projects: Mirsonics, Inn of Joy, Damage Culture
- 2026-02 — Trailing Ink Streak Cursor (Canvas, desktop fine-pointer only)
- 2026-02 — Hero mobile fix + underline refinement; favicon + nav logo
- 2026-02 — Code review pass, 15 unused legacy components removed
- 2026-02 — **Capabilities Section Restructured into split-panel interactive layout**
  - Left: 12-row list with active expansion (70→124px), orange sidebar, glowing dot,
    accent-glow gradient wipe; hover nudges right.
  - Right: Sticky stage (`top-28`) with active tag, large faded index (`opacity 0.07`),
    unique animated visual, title, description, progress dots.
  - 12 lightweight CSS/SVG visuals (mock browser, react tree, wireframes, roadmap,
    channel orbit, bar chart, workflow nodes, funnel, AI typewriter, perf ring,
    line chart draw, brand badge).
  - Auto-advance every 2.6s via IntersectionObserver; permanent handoff on hover/click.
  - Responsive: collapses to single column at ≤1024px, stage moves above list.

## Files of Reference
- `/app/frontend/src/components/new/Capabilities.jsx` — split-panel logic
- `/app/frontend/src/components/new/CapabilityVisuals.jsx` — 12 SVG/CSS visuals
- `/app/frontend/src/components/new/InkCursor.jsx`
- `/app/frontend/tailwind.config.js` — design tokens
- `/app/frontend/src/index.css` — global tokens & utilities

## Credentials
- Admin: `/admin` · password `admin2025`

## DB Schema
- `contact_submissions`: `{id, name, email, message, project_tags, uploaded_files, timestamp, status}`

## API Endpoints
- `POST /api/contact/submit`
- `GET  /api/contact/submissions`

## Roadmap
- **P2** Verify Ink Streak Cursor visibility in production (user noted not seeing it earlier)
- **P2** Potential: add scroll-progress narrative panel next to Timeline section
- **P3** Convert mocked contact-form success state to real backend roundtrip on the new design

## Project Health
- All services running. No known bugs. No mocked APIs in current Capabilities work.
