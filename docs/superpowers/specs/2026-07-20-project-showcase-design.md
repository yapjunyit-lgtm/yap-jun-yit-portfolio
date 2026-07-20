# Project Showcase Redesign — Design Spec

**Date:** 2026-07-20
**Status:** Approved
**Scope:** portfolio-v5 — project cards + modal + project images

## Overview

Upgrade the portfolio's project display from a text-heavy carousel to a premium visual showcase. Rich cards with placeholder images, hover effects, and a cinematic detail modal. Designed so demo videos can replace placeholder images later with zero component changes.

## 1. Data + Images

### 1.1 Extended Project Data

Add three optional fields to the `projects` array in `src/data/projects.js`:

```js
{
  // existing fields preserved
  liveUrl: "https://...",        // optional — external link
  repoUrl: "https://...",        // optional — source code link
  longDescription: "..."         // optional — longer text for modal (falls back to `description` if omitted)
}
```

Each existing project entry stays intact; only `longDescription` needs content for projects that have more to say. `liveUrl` and `repoUrl` added where applicable.

### 1.2 Placeholder Images

- Generate 12 unique gradient+icon placeholder images
- Saved to `public/projects/project-01.svg` through `project-12.svg`
- Each image uses the project's accent color family (`cyan`, `magenta`, `green`) for visual distinction
- Cards reference `project.image = "/projects/project-NN.svg"`
- When ready for demo videos: swap `.svg` path to `.mp4` path in the data file — component handles `<img>` vs `<video>` based on file extension

### 1.3 Favicon Fix

`index.html` line 5: change `href="/vite.svg"` to `href="/favicon.svg"`

### 1.4 Background Video Filename

Rename `public/backgroud.mp4` → `public/background.mp4` and update `Hero.jsx` line 14 reference.

## 2. Card Redesign

### 2.1 Visual Structure

```
┌────────────────────────────┐
│                            │
│   Placeholder Image        │  ← 60% of card height
│   (gradient + icon)       │     hover: scale 1.03, 400ms ease
│                            │
│   ┌───┬───┬───┐           │  ← first 3 tags as chips
│   │tag│tag│tag│           │     overlayed on bottom of image
│   └───┴───┴───┘           │     gradient overlay below them
├────────────────────────────┤
│                            │
│  Project Title             │  ← fontWeight 600
│  Short description         │  ← 2-line clamp, text-secondary
│                            │
└────────────────────────────┘
```

### 2.2 States

| State | Behavior |
|-------|----------|
| **Default** | BorderGlow active, subtle continuous glow |
| **Hover** | Card lifts translateY(-4px), glow intensifies, cursor pointer, image zooms 1.03 |
| **Active (centered)** | Slightly stronger glow than peers, visible as active dot in carousel |

### 2.3 Click Behavior

- Entire card is clickable — opens `ProjectModal` for that project
- `cursor: pointer` on the card
- Passes the full project object to the modal

### 2.4 Component Changes

- `ProjectCard.jsx` — adds image, gradient overlay, tag preview chips, click handler
- `ProjectCard.module.css` — new styles for image area, overlay, hover states
- `BorderGlow/BorderGlow.jsx` — no changes needed
- `Projects.jsx` — passes `onSelect` callback to each card; manages modal open state

## 3. Project Modal

### 3.1 Layout

```
┌──────────────────────────────────────────┐  ← modal overlay (backdrop blur)
│  ┌──────────────────────────────────────┐│
│  │  [×]                         [←] [→] ││  ← close button + prev/next arrows
│  │                                      ││
│  │  ┌──────────────────────────────────┐││
│  │  │     Image / Video Area           │││  ← reuses project.image/video
│  │  │     (16:9, rounded, full width)  │││     <img> or <video> by extension
│  │  │                                  │││
│  │  └──────────────────────────────────┘││
│  │                                      ││
│  │  Project Title                       ││  ← 32px, fontWeight 600
│  │  ┌──────┬──────┬──────┬──────┐      ││
│  │  │ Tag  │ Tag  │ Tag  │ Tag  │      ││  ← all tags, not truncated
│  │  └──────┴──────┴──────┴──────┘      ││
│  │                                      ││
│  │  Long description paragraph.         ││  ← full text, text-secondary
│  │  Second paragraph if provided.       ││
│  │                                      ││
│  │  [🌐 Live Demo]  [📂 Source Code]    ││  ← conditional buttons
│  │                                      ││     hidden if URL not provided
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
```

### 3.2 Animations

- **Entry:** Scale 0.92 → 1.0, opacity 0 → 1, backdrop fade in — 400ms spring
- **Exit:** Reverse — 250ms ease-in (faster exit so user doesn't wait)
- **Navigation transition:** Content crossfades 200ms when switching between projects

### 3.3 Interaction

| Trigger | Action |
|---------|--------|
| Click card | Open modal for that project |
| ← / → arrows | Navigate to prev/next project (wraps around) |
| Left/Right keyboard | Same as arrows |
| Escape key | Close modal |
| Click backdrop | Close modal |
| Click × button | Close modal |

### 3.4 Accessibility

- Body scroll locked while modal is open (`overflow: hidden` on `<body>`)
- Focus trapped inside modal while open
- `aria-modal="true"` and `role="dialog"` on the modal
- Close button has `aria-label="Close"`
- Arrow buttons have `aria-label="Previous project"` / `"Next project"`

## 4. New Components

### 4.1 New: `ProjectModal`

- **Purpose:** Full-screen overlay showing project details
- **Props:** `project`, `projects` (full array for nav), `onClose`, `onNavigate`
- **Owns:** open/close animation, keyboard handling, scroll lock

### 4.2 Modified: `ProjectCard`

- **Adds:** `onSelect` callback prop, image rendering, hover states, click handler
- **Removes:** nothing

### 4.3 Modified: `Projects`

- **Adds:** `selectedProject` state, `handleSelect` / `handleClose` / `handleNavigate` callbacks
- **Adds:** `<ProjectModal>` rendered conditionally when `selectedProject` is set

### 4.4 New: `public/projects/`

- **Contents:** 12 SVG placeholder images (`project-01.svg` through `project-12.svg`)
- Generated with unique gradient+icon combinations per project

## 5. What Stays the Same

- Carousel navigation (arrows, dots, scroll snapping)
- DarkVeil background
- BorderGlow on cards
- All existing sections (Hero, Profile, Capabilities, Footer)
- Navbar intersection observer
- ScrollReveal wrapper
- Data file structure (additive only)

## 6. Testing Notes

- Modal opens on card click and closes on escape, backdrop click, × button
- Arrow nav wraps correctly (last → first, first → last)
- Keyboard left/right navigates, escape closes
- Body scroll is locked during modal
- Cards without `liveUrl`/`repoUrl` hide those buttons
- Cards without `longDescription` fall back to `description`
- Images load for all 12 projects
- Carousel scroll + arrow/dot nav still works
- No regressions on existing sections
