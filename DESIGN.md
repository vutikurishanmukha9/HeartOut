# Design System: HeartOut (Quiet Editorial Sanctuary)

## 1. Visual Theme & Atmosphere
HeartOut is a **Quiet Editorial Sanctuary** designed for emotional storytelling, deep personal reading, and compassionate connection. The interface projects the calm, contemplative warmth of a private library at dusk. It is deliberately anti-SaaS, anti-slop, and content-first.

- **Visual Density:** *Art Gallery Airy (Level 3)* — Generous macro-whitespace (`py-12` to `py-24`), a dedicated 680px reading column, and uncrowded content hierarchy.
- **Design Variance:** *Restrained Editorial (Level 6)* — 65/35 asymmetrical split-screen layouts, editorial typography, and structured category tiles.
- **Motion Intensity:** *Fluid Purposeful CSS (Level 4)* — Hardware-accelerated transitions using custom editorial cubic-bézier easing curves (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 2. Color Palette & Functional Roles
Color is a precious resource, used strictly for emotional grounding and subtle semantic cues.

- **Aged Paper Canvas** (`#FAF7F4`) — Primary background substrate in light mode, simulating unbleached archival paper.
- **Obsidian Midnight Canvas** (`#121214`) — Primary background in dark mode, avoiding harsh `#000000` to prevent eye strain.
- **Pure Paper Surface** (`#FFFFFF`) — Card containers and reading panels in light mode.
- **Obsidian Core Surface** (`#18181B`) — Card containers in dark mode.
- **Carbon Ink** (`#1C1917`) — Primary headline and body typography in light mode.
- **Alabaster Ink** (`#F4F4F5`) — Primary headline and body typography in dark mode.
- **Muted Stone Slate** (`#78716C`) — Secondary captions, telemetry metadata, and timestamps.
- **Structural Hairline** (`rgba(231, 229, 228, 0.8)` / `#E7E5E4`) — 1px razor-thin dividing rules.
- **Warm Sunset Amber Accent** (`#D97706`) — Primary accent for highlights, bookmarks, active tabs, and presence indicators.
- **Quiet Rose Accent** (`#E11D48`) — Emotional accent for empathy gestures, unsent letters, and compassion badges.

---

## 3. Typographic Architecture
HeartOut relies on a distinctive editorial font hierarchy:

- **Display & Story Titles:** `DM Serif Display` / Modern Editorial Serif (`font-serif`) — Deployed with tight tracking (`-0.02em` to `-0.04em`), compact leading (`1.15`), and prominent visual authority.
- **Narrative Reading Body:** `Inter` / Clean Neo-Grotesque (`font-body`) — Generous `1.75` line-height, comfortable 18px reading scale, constrained to max 65 characters per line (`max-w-[680px]`).
- **Telemetry & Metadata:** `JetBrains Mono` / `Geist Mono` (`font-mono`) — Used for real-time live reader counts, word counts, read times, and dates.
- **Banned:** Generic browser serif defaults (`Times New Roman`, `Georgia`), raw unstyled Inter headlines, and mixed rainbow typography.

---

## 4. Component Behaviors & Stylings

### 4.1 Concentric Double-Bezel Story Cards
- **Architecture:** Outer concentric bezel shell (`.double-bezel-shell`) with 24px corner radius (`rounded-3xl`) enclosing an inner core card (`.double-bezel-core`) with 16px radius (`rounded-2xl`).
- **Surface Elevation:** Subtle tinted shadow (`rgba(217, 119, 6, 0.04)`), crisp 1px borders, and zero fluorescent outer glows.

### 4.2 Tactile Island Buttons
- **Primary CTA:** Solid high-contrast pill button (`bg-stone-900 text-white` in light mode, `bg-stone-100 text-stone-900` in dark mode).
- **Active State:** Physical press simulation (`active:scale-[0.98]`).
- **Hover State:** Smooth background tone shift over 200ms (`transition-all duration-200`).

### 4.3 Tactical Reading Telemetry Strip
- Real-time live reader counter using semantic `<data value={liveReaders}>` with pulsating presence indicator (`bg-emerald-500`).
- Estimated read time and word duration calculation.
- Formatted date telemetry using `<time>` semantic elements.

### 4.4 Empathy Reaction Badges
- Replaced clout counters with human emotion gestures (*"I felt this"*, *"Heartfelt"*, *"You are not alone"*).
- Microcopy reassurance: *"A quiet way to say 'I read this.'"*

---

## 5. Layout & Spatial Principles
- **AIDA Structure:** Cinematic Hero (`max-w-7xl`) → 65/35 Editorial Narrative Feed → Live Story Constellation → Safe Support Drawer.
- **The 2-Line Headline Iron Rule:** Headlines flow horizontally in ultra-wide containers, never wrapping past 2-3 lines.
- **Mobile Collapse Guarantee (< 768px):** All split columns collapse seamlessly to a single column (`grid-cols-1`, `w-full`, `px-4`).
- **Viewport Stability:** All full-height sections strictly use `min-h-screen` / `min-h-[100dvh]` to eliminate iOS Safari address-bar jitter.

---

## 6. Motion Philosophy & Micro-Physics
- **Easing Standard:** Custom editorial cubic-bézier easing curves (`--ease-editorial: cubic-bezier(0.16, 1, 0.3, 1)` and `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **GPU Acceleration:** All animations strictly operate on `transform` and `opacity`. Never animate `top`, `left`, `width`, or `height`.
- **Micro-Interactions:** Continuous soft status pulse on active readers and subtle star twinkling in the Story Constellation canvas.

---

## 7. Anti-Patterns (Explicit AI Tells Banned)
- ❌ **No Emojis:** Strictly banned in code, comments, badges, and headings. Replaced with clean SVG line icons (`strokeWidth={1.5}`).
- ❌ **No Pure Black (`#000000`):** Use obsidian charcoal (`#121214`).
- ❌ **No Neon/Purple AI Glows:** Saturated neon shadows and AI-purple gradients are banned.
- ❌ **No 3-Column Equal Feature Blocks:** Banned in favor of asymmetrical 65/35 editorial feed layouts.
- ❌ **No AI Copywriting Clichés:** Words like "Elevate", "Seamless", "Unleash", "Next-Gen", "Game-changer" are banned.
- ❌ **No Clout/Like Chasing Counters:** No competitive public upvote leaderboards; only private empathetic reactions.
