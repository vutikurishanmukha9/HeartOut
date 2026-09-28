# Enterprise Frontend Design Reference: 50 Standout Design Picks

This file has four parts. Part 0 is the operating manual for building non-generic, enterprise-grade pages. Part 1 is the summary table and index. Part 2 holds the 50 picks with the original specification detail preserved. Part 3 holds each brand's guardrails, the things it refuses to do.

# Part 0: Operating Manual for Building Enterprise-Grade Frontends

Read this part first, every time. It tells you how to turn the 50 picks in Part 2 into a page that looks designed for one specific product instead of assembled from defaults. Parts 1 to 3 are reference material. Do not load all of it into a build. Load only what the protocol below tells you to.

## 0.1 The rule that matters most

Spend boldness in exactly one place. One element is the memorable thing (a type treatment, a color system, a hero artifact, a geometry rule). Everything around it stays quiet and disciplined. The 50 picks are 50 examples of that rule, each with a different memorable thing.

A page built from five brands' best ideas at once has no memorable thing. That is the most common way to misuse this document.

## 0.2 Build protocol (follow in order)

1. **Confirm the brief.** Identify the product, the audience, and the page's primary job. If the brief does not say, propose one concrete answer for each and state it before designing. Real product content (real feature names, real numbers, real UI) must appear in the design. Never lorem ipsum, never "Supercharge your workflow."
2. **Choose picks.** Open the Summary Table (Part 1). Choose one dominant pick and at most two supporting picks, each from a different element type (for example: a color system, a type system, a component idea). Use the archetype blueprints in 0.5 as a starting point, then adjust to the brief.
3. **Read only what you chose.** Read the full entry for each chosen pick in Part 2, plus that brand's guardrails in Part 3. Ignore the rest.
4. **Write a design plan before any code.** Four parts, kept compact:
   - Color: 4 to 6 named hex values with roles.
   - Type: typefaces and their roles, plus the scale (sizes, weights, tracking, line height).
   - Layout: one sentence of concept, an ASCII wireframe of the hero and one more section, and alignment guidance.
   - Principles: 3 to 5 lines on what makes this page different from a generic page for the same product.
5. **Review the plan against 0.3 and 0.4.** If any part of the plan is what you would produce for any similar brief, change it, and say what you changed and why. Only then write code.
6. **Build to the quality floor in 0.6.** It is not optional and is not announced in the UI.
7. **Critique.** Screenshot at 375, 768, 1280, and 1920 pixels if the environment allows it. Then apply the Chanel test: remove one accessory. Delete one decorative element and see if the page gets better.
8. **Report.** Tell the user which picks you used, what you adapted, and what you deliberately left out.

## 0.3 Generated-page tells to avoid

These are the patterns that make a page read as machine-made. Each is legitimate for some briefs, but each is a default, so use one only when the brief calls for it.

| Tell | Why it reads as generated | What to do instead |
|---|---|---|
| Content chopped into identical rounded cards with the same soft grey shadow | One radius and one shadow for everything means no hierarchy | Choose one depth strategy from 0.4 and let hierarchy decide which surfaces lift |
| Purple-to-blue or pink-to-orange gradient washes as decoration | Gradients carrying no information | Use a gradient only as content (MiniMax #27 per-release cards, Framer #20 showcase panels) or drop it |
| A tracked-out all-caps eyebrow above every heading | Template chrome, no information | Remove it. Add a label only when it encodes something the heading does not |
| One word in a headline set in italic, bold, or an accent color | The most common headline gimmick | Set the whole headline with one treatment. Let size, weight, and tracking do the work (Apple #3, Nike #31) |
| Numbered markers 01 / 02 / 03 on content that is not a sequence | Decoration posing as structure | Number only real steps or timelines |
| Labels built as `WORD, fragment` or `A · B · C` middle-dot strings, and `→` on every button | Template chrome | Plain sentence-case labels and verbs that say what happens: "Save changes," not "Continue →" |
| Cream background with serif display and a terracotta accent | The current cluster of AI-generated warm pages, and the accent is close to Anthropic's own | Only use if the brief asks for it. Note that Claude (#9) is in this set as a reference, not a template |
| Near-black background with one acid-green or vermilion accent and a monospace label font | The other big cluster | Fine for a real developer tool. Wrong for most others. If you use it, follow Linear (#24) or NVIDIA (#33) discipline exactly rather than the approximation |
| Fade-and-slide-up entrance on every section, hover lift on every card | Scattered motion with no purpose | One orchestrated moment on load. All other motion answers a user action |
| Three-column feature grid with an icon in a circle above each title | Layout by template | Show the product. A screenshot, a live component, or a real artifact (Notion #32, Composio #14) |
| Row of invented "Trusted by" logos, stock-photo testimonials, "10k+ users, 99.9% uptime" stat strip with invented numbers | Fabricated proof | Use real customers and real numbers, or omit the section. Never invent metrics |
| Emoji as icons | Inconsistent weight and platform rendering | Use one icon set with one stroke weight |
| Centered text in every section | No alignment decision was made | Choose an alignment strategy in the plan. Left-aligned body copy almost always reads better |
| Inter (or system-ui) at default settings for everything | The default font, default tracking | Choose type deliberately. Set tracking and weights on purpose (see 0.7 for stand-ins) |
| Glassmorphism panels stacked on blurred blobs | Depth without purpose | Use backdrop blur only for sticky chrome (Apple #3 sub-nav) |

## 0.4 Composition rules

The picks work because each brand enforces one of these constraints strictly. Combining picks means choosing one option per axis and holding it across the whole page.

**One accent rule.** One chromatic accent, used only for action and focus (Apple, Linear, NVIDIA, Supabaze all state this as non-negotiable). A multi-hue system is allowed only when the hues have a structural job: per-product identity (HashiCorp #21), per-release identity (MiniMax #27), or timeline stages (Cursor #15). Decorative multi-hue is not allowed.

**One radius family per page.** Choose sharp (NVIDIA 2px), medium (Linear 8px), or soft (Airbnb, Meta, pills). The only permitted second radius is a pill or circle reserved for one role, such as the primary action (Apple) or avatars.

**One depth strategy per page.** Choose exactly one:
- Surface ladder with hairlines, no shadows (Linear #24)
- A single shadow reserved for product imagery (Apple #3)
- Flat cards with hairline borders (NVIDIA #33)
- Atmospheric gradient behind content (ElevenLabs #16, Mintlify #28)

**One display voice.** Choose one:
- Light weight at large size (IBM #22, Stripi #48, Coinbase #13 at 400)
- Heavy uppercase or heavy grotesque (Nike #31, BMW #5)
- Monospace throughout (OpenCode #35)
- Editorial serif (Resend #42)
- Custom geometric display (Cal.com #8)

**One rhythm device.** Choose how sections separate: alternating surface colors as the divider (Apple, NVIDIA, PlayStation #37), a closing band (Mistral #30, Superhumon #50), or whitespace only. Do not add decorative dividers on top of these.

**Conflicts that produce muddy results.**

| Do not combine | Reason |
|---|---|
| Apple's single shadow with Linear's surface ladder | Two depth strategies |
| Nike or BMW heavy display with IBM or Stripi light display | Two display voices |
| NVIDIA 2px geometry with Meta or Airbnb pills | Two radius families |
| Figma color blocks with any single-accent system (Apple, Linear, Supabaze) | Contradicts the one accent rule |
| ElevenLabs atmospheric orbs with Linear "no gradients" | Contradicts the depth strategy |

## 0.5 Archetype blueprints

Starting points, not templates. Replace anything that does not fit the brief. Numbers refer to picks in Part 2.

**Developer tool or API platform (dark)**
- Dominant: Linear surface ladder (#24). Supporting: Composio product-in-hero (#14), Raycast type precision (#39).
- Hero: the real product surface (a terminal, a request and response, a command palette), not an illustration.
- Guardrails: one accent, no atmospheric gradients, no pill buttons, screenshots show one bright color at most.

**Fintech and payments**
- Dominant: Stripi type system (#48). Supporting: Coinbase display weight (#13), Revolut product colors used sparingly (#43).
- Rules: tabular numerals wherever money or counts appear, right-aligned numeric columns, calm display weight.
- Guardrails: no neon crypto gradients, no invented performance numbers, error states that state amounts and next steps.

**AI product or research lab**
- Dominant: Cohere type split (#12). Supporting: Mistral closing stripe (#30) or ElevenLabs atmosphere (#16), not both.
- Hero: a live or recorded model interaction, real output, real latency numbers if shown.
- Guardrails: avoid the purple gradient default and the cream plus terracotta default unless the brief requires them.

**Creative, design, and collaboration tool**
- Dominant: Figma color blocks (#19). Supporting: Miro tint palette tied to real product objects (#29), Notion live UI in hero (#32).
- Rules: the colors must come from objects that exist in the product (sticky notes, frames, cursors), not from a mood board.
- Guardrails: keep the grid rigorous and monochrome so the color blocks read as intentional.

**Enterprise infrastructure and multi-product suite**
- Dominant: HashiCorp per-product accent tokens (#21). Supporting: IBM light display (#22), NVIDIA hairline flat cards (#33).
- Rules: each product gets one token color used for its mark, its nav state, and its status chips. The shell stays neutral.
- Guardrails: no gradients, no more than one radius, dense but legible tables.

**Hardware and consumer commerce**
- Dominant: Apple type and rhythm (#3). Supporting: Meta pill actions (#26).
- Rules: photography carries atmosphere, alternating light and dark tiles are the divider, one shadow on product renders only.

**Premium, luxury, and automotive**
- Dominant: Ferrari single accent (#18) or Bugatti type and tracking (#7). Supporting: BMW two-weight discipline (#5), Renault restrained accent (#40).
- Rules: full-bleed photography, very little copy, wide tracking on small text, the accent appears on the call to action and nowhere else.

**Marketplace, media, and community**
- Dominant: Pinterest masonry as the load-bearing layout (#36). Supporting: Airbnb soft shape language (#1), PlayStation chapter rhythm (#37).
- Rules: chrome recedes, imagery leads, filters are pills, cards are consistent in structure but not in height.

**Documentation and developer education**
- Dominant: Mintlify two-mood split (#28), where marketing is atmospheric and docs are flat. Supporting: Ollama restraint (#34).
- Rules: line length under 80 characters, code blocks are first-class, one accent, sticky navigation with visible current-section state.

**Analytics, observability, and admin dashboards (product UI, not marketing)**
- Dominant: Linear surface ladder (#24) or NVIDIA flat hairline cards (#33). Supporting: Stripi tabular figures (#48), HashiCorp status tokens (#21).
- Rules: see 0.6 on density, tables, and states. Color encodes status only. Charts use one hue plus neutrals unless a comparison needs more.

## 0.6 Enterprise quality floor

Build to this without announcing it. If a page cannot meet an item, say so in the report.

**Foundations**
- All colors, type sizes, spacing, radii, shadows, and durations come from tokens (see 0.8). No raw hex values in components.
- Spacing on a 4px base, with a documented scale (4, 8, 12, 16, 24, 32, 48, 64, 96).
- Type scale uses `clamp()` for fluid headings. Body 16 to 18px, line length under 80 characters, serif body gets slightly more line height than sans.
- Semantic HTML first (`nav`, `main`, `section`, `button`, `table`). ARIA only where native semantics cannot express the pattern.

**Accessibility**
- Text contrast at least 4.5:1, large text and UI boundaries at least 3:1, checked in both themes if two exist.
- Visible `:focus-visible` ring on every interactive element, never removed without replacement.
- Touch targets at least 44px on touch layouts, at least 24px on pointer layouts.
- `prefers-reduced-motion` disables all non-essential motion. `prefers-color-scheme` respected if a dark theme exists. Layout works at 200% zoom.
- Never rely on color alone for status. Pair with an icon or label.

**States (design all of them, not only the happy path)**
- Every interactive component: default, hover, focus-visible, active (pressed), disabled, loading.
- Every data region: loading (skeleton, not a spinner, where layout is known), empty (explains what belongs here and offers the action), error (says what happened and how to fix it, never apologizes vaguely), partial data, and permission denied.
- Forms: labels above fields, inline validation on blur, an error summary at the top on submit, preserved input on failure, one primary action per form.

**Data-dense UI**
- Two density modes (comfortable and compact) when tables matter. Compact rows around 32 to 36px.
- Tables: sticky header, numeric columns right-aligned with tabular numerals, sortable columns show the sort state, row selection and bulk actions, truncation with a tooltip for long strings, column resize or a sensible fixed width.
- Show relative time with an absolute time on hover. Show units. Format numbers for the locale.
- Provide a command palette or keyboard shortcuts for power workflows (Raycast #39 is the reference), with shortcuts visible in menus.

**Responsive**
- Design at 375, 768, 1280, and 1920 pixel widths. Nothing scrolls sideways except designated overflow containers (tables, code).
- Navigation collapses with intent, not by accident. Touch layouts keep primary actions reachable by thumb.

**Performance and robustness**
- Target LCP under 2.5s, CLS under 0.1, interaction latency under 200ms.
- Reserve image and embed dimensions to prevent layout shift. Lazy-load below the fold. Subset and preload the display font. Provide a fallback stack so text is visible during font load.
- Long strings, empty strings, right-to-left text, and 40-character names must not break layout.

**Copy**
- Active voice, sentence case, plain verbs. A button says what happens ("Save changes"). The same action keeps the same name through the whole flow, so a button "Publish" leads to a confirmation "Published."
- Name things by what the user understands, not by how the system is built.
- Each written element does one job. Delete filler.

## 0.7 Font stand-ins

Several picks use licensed typefaces. Do not ship a proprietary face without a license. Use a stand-in and keep the scale, weights, and tracking from the pick, since those carry most of the character. Verify every license before shipping.

| Pick | Original face | Stand-in to consider |
|---|---|---|
| Apple #3 | SF Pro Display | System UI stack (`-apple-system, BlinkMacSystemFont`) for authentic rendering on Apple devices, with a tight grotesque such as Inter Tight elsewhere |
| BMW #5 | BMW Type Next | A wide neo-grotesque in two weights (700 and 300) such as Archivo |
| Bugatti #7 | Custom display, text, and mono | A wide sans with generous tracking paired with a quiet mono |
| Cal.com #8 | Cal Sans | Cal Sans (open license, verify current terms) |
| IBM #22 | IBM Plex Sans | IBM Plex Sans (open license) |
| Nike #31 | Futura-style condensed display | Jost or a condensed grotesque, uppercase, tight leading |
| OpenCode #35 | Berkeley Mono | JetBrains Mono or Commit Mono |
| Raycast #39 | Inter with stylistic set ss03 | Inter with the same OpenType feature enabled |
| Replicate #41 | rb-freigeist-neue | A characterful grotesque at 72px and above |
| Resend #42 | Domaine Display | A high-contrast display serif such as Fraunces, with tight tracking |
| Spasex #47 | D-DIN | D-DIN (open license) or Barlow |
| Stripi #48 | Sohne | A refined grotesque such as Hanken Grotesk or Instrument Sans at weight 300 |

## 0.8 Token skeleton

Fill every value from your design plan. Do not paste this with placeholder values. The structure is what matters: semantic names, one layer of indirection, states included.

```css
:root {
  /* color: 4 to 6 named values from the plan, then semantic roles */
  --color-canvas: ;
  --color-surface-1: ;
  --color-surface-2: ;
  --color-ink: ;
  --color-ink-muted: ;
  --color-hairline: ;
  --color-accent: ;          /* action and focus only */
  --color-accent-hover: ;
  --color-accent-pressed: ;
  --color-focus-ring: ;
  --color-status-success: ;
  --color-status-warning: ;
  --color-status-danger: ;

  /* type */
  --font-display: ;
  --font-body: ;
  --font-mono: ;
  --text-hero: clamp(2.5rem, 1.5rem + 4vw, 5rem);
  --text-h2: clamp(1.75rem, 1.2rem + 2vw, 3rem);
  --text-body: 1.0625rem;
  --leading-body: 1.5;
  --tracking-display: ;      /* often negative, taken from the pick */

  /* space, 4px base */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px; --space-24: 96px;

  /* shape and depth: one radius family, one depth strategy */
  --radius-control: ;
  --radius-surface: ;
  --elevation-1: ;
  --elevation-2: ;

  /* motion */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --ease-out: cubic-bezier(0.2, 0, 0, 1);

  /* layers */
  --z-sticky: 10; --z-overlay: 100; --z-toast: 1000;
}

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
```

## 0.9 Using these designs legally and ethically

- The entries describe design principles extracted from public sites. Use the principles, not the identity. Do not reproduce another company's logo, wordmark, mascot, product photography, illustrations, or exact trade dress.
- Entries labeled "(Inspired)" are renamed variants. Treat them the same way.
- A page that is recognizably another brand's page has failed the brief, however polished it is.

## 0.10 Prompt template

Paste this with the file when you start a build. Fill in the brackets.

```
Use the attached design reference and follow its Part 0 protocol.

Product: [what it is, in one sentence]
Audience: [who uses it, and their job title or context]
Page: [landing page, pricing, dashboard, settings, docs, etc.] and its primary job: [what the visitor should do]
Real content: [actual feature names, numbers, screenshots, or copy. If none, propose realistic content and flag it]
Stack: [React and Tailwind, plain HTML and CSS, etc.]
Constraints: [brand colors, required fonts, accessibility target, supported browsers]

Do this in order: (1) confirm or propose the brief, (2) choose one dominant pick and at most two supporting picks and say why,
(3) write the design plan with tokens and an ASCII wireframe, (4) review the plan against 0.3 and 0.4 and revise,
(5) build, (6) critique at four widths and remove one decorative element, (7) report what you used and what you left out.
```

---

# Part 1: Summary and Index

## Summary Table

| # | Brand | Element Picked | Why |
|---|-------|-----------------|-----|
| 1 | Airbnb | Shapes | The rounding scale itself is the brand statement, pill search bars, 14px cards, 32px tabs, and literally no hard corner anywhere on the... |
| 2 | Airtable | Colors | Full-bleed signature color cards (coral, dark green, peach, navy) are the only chromatic event in an otherwise near-monochrome editorial... |
| 3 | Apple | Typography | SF Pro Display with negative letter-spacing carries the entire brand voice, no gradients, no shadows, just type and photography doing... |
| 4 | Binance | Colors | One yellow (#FCD535) has to work across both a near-black marketing theme and a light transactional theme, plus double as the up/down... |
| 5 | BMW | Typography | The entire hierarchy runs on just two weights of one typeface, heavy 700 for display and light 300 for body, which is an unusually... |
| 6 | BMW M | Colors | The M tricolor stripe (light blue to dark blue to red) is used so sparingly, only on logos, dividers, and motorsport chrome, that it... |
| 7 | Bugatti | Typography | Three custom typefaces (Display, Text, Monospace) at wide tracking replace color entirely as the brand's only voltage, there is no... |
| 8 | Cal.com | Typography | A custom geometric display face (Cal Sans) does all the brand signaling; there's no accent-color system at all, just the headline face... |
| 9 | Claude | Overview | The cream-canvas + coral-CTA + slab-serif pairing deliberately breaks from the cool blue/slate convention every other AI brand in this... |
| 10 | Clay | Components | 3D claymation illustrations (mountains, mascots) as full-bleed hero artifacts is a genuinely unusual move for a B2B GTM data product. |
| 11 | ClickHouse | Colors | Electric yellow on near-pure black, used scarcely, reads as pure brand identity with zero atmospheric decoration to lean on. |
| 12 | Cohere | Typography | A deliberate split between monospaced-feeling display headlines and precise Unica77 UI text gives the brand a technical-but-composed voice. |
| 13 | Coinbase | Typography | Display type sits at weight 400, not 700, a fintech brand choosing editorial calm over the bombastic weight the category defaults to. |
| 14 | Composio | Components | The four-pane terminal mockup with a central blue spotlight glow is the single strongest hero pattern in the whole collection for a... |
| 15 | Cursor | Colors | A pastel five-color timeline palette (peach, mint, blue, lavender, gold) exists solely to mark AI-action stages inside one specific UI... |
| 16 | ElevenLabs | Colors | Soft atmospheric gradient orbs (mint to peach to lavender to sky) stand in for a brand color entirely, there is no saturated accent... |
| 17 | Expo | Components | The centered MacBook + iPhone device-mockup hero over a sky-gradient wash is doing all the brand-credibility work that copy would... |
| 18 | Ferrari | Colors | Rosso Corsa used scarcely, only on CTAs, the Cavallino mark, and race-position highlights, against a near-black canvas, is the most... |
| 19 | Figma | Colors | Oversized, hand-cut pastel color blocks dropped into an otherwise rigorous black-and-white grid feel like sticky notes on a clean desk -... |
| 20 | Framer | Colors | Oversized magenta/violet/orange gradient panels are treated as living showcase tiles rather than decoration, which is a distinctive way... |
| 21 | HashiCorp | Colors | A per-product accent system (Terraform purple, Vault yellow, Consul pink, Waypoint cyan, Vagrant blue) functions as identity tokens,... |
| 22 | IBM | Typography | IBM Plex Sans at light weight 300 for display sizes is the signature, light weight at large sizes is a genuinely counterintuitive... |
| 23 | Intercom | Colors | Fin Orange is reserved exclusively for the Fin AI sub-brand, making one color do double duty as both accent and product-line signal. |
| 24 | Linear | Colors | #010102 is the deepest dark surface in the entire 50-brand set, paired with a single lavender-blue accent used only on the mark, focus... |
| 25 | MongoDB | Colors | The signature green pill button has to carry brand identity across two totally different modes: dark-teal hero bands and stark white... |
| 26 | Meta | Shapes | 100px-radius pill buttons paired with 24-32px card rounding give hardware commerce pages an unusually soft, consumer-friendly geometry. |
| 27 | MiniMax | Colors | Each model release gets its own vibrant gradient card (orange-red, magenta-pink, purple, blue), turning color into a versioning system... |
| 28 | Mintlify | Colors | Atmospheric sky-gradient cloud washes on marketing pages contrast sharply with the dense, flat documentation surfaces underneath, two... |
| 29 | Miro | Colors | The pastel feature tints (rose, teal, coral, orange, mint) literally echo the real sticky-note colors used on the live whiteboard... |
| 30 | Mistral AI | Components | A horizontal sunset-gradient stripe that closes every single page is an unusually consistent structural signature to hang an entire... |
| 31 | Nike | Typography | Towering uppercase Futura lockups burned directly into campaign photography is about as confident as display typography gets. |
| 32 | Notion | Components | Showing the actual live workspace UI directly inside the hero band, dotted with real sticky-note colors, blurs the line between... |
| 33 | NVIDIA | Shapes | A strict 2px radius across every single surface is a deliberately angular, almost aggressive geometry choice most tech brands soften. |
| 34 | Ollama | Components | A hand-drawn llama mascot is the only ornamental element in an otherwise pure README-as-homepage system, maximal restraint, one... |
| 35 | OpenCode | Typography | Every character on the page, headline down to footer fine print, is set in Berkeley Mono, the most extreme typographic commitment in... |
| 36 | Pinterest | Layout | The masonry pin grid is the load-bearing layout element of the entire product, chrome exists only to get out of its way. |
| 37 | PlayStation | Layout | Alternating full-bleed black, white, and PlayStation-Blue chapters scroll like a console launch trailer rather than a typical marketing... |
| 38 | PostHog | Components | Hand-drawn hedgehog mascots scattered like sketchbook marginalia actively reject the genre's default somber dark-tech aesthetic. |
| 39 | Raycast | Typography | Inter with the ss03 stylistic set enabled site-wide is a small, precise typographic decision that keeps the marketing chrome feeling... |
| 40 | Renault | Colors | Sunlight Yellow against a strict black-and-white canvas keeps every colored element intentional in a category that usually reaches for... |
| 41 | Replicate | Typography | A single aggressively large (72px+) display face, rb-freigeist-neue, gives an indie ML playground the confidence of a print magazine... |
| 42 | Resend | Typography | Domaine Display at 76-96px with ss01/ss04/ss11 stylistic features turns a utilitarian dev-tool into something with genuine print-serif... |
| 43 | Revolut | Colors | A wide saturated product-color palette (teal, pink, light-green, warning orange) layered against a single cobalt-violet primary is... |
| 44 | Sentri (Inspired) | Colors | Electric lime against a deep purple-violet midnight canvas gives a dev-tools brand a slightly subversive, almost mischievous energy most... |
| 45 | Shopifi (Inspired) | Layout | Running two entirely different canvas polarities, near-black cinematic marketing and cream-mint transactional, and treating that split... |
| 46 | Slacc (Inspired) | Colors | A deep aubergine primary paired with cream-lavender hero gradients is an unusually warm color direction for a workplace messaging product. |
| 47 | Spasex (Inspired) | Typography | Uppercase D-DIN set in tight vertical leading against pure black and full-bleed rocket photography is about as austere and... |
| 48 | Stripi (Inspired) | Typography | Thin 300-weight Sohne with negative tracking for editorial density, plus tabular figures specifically where money is shown, is a... |
| 49 | Supabaze (Inspired) | Colors | A single emerald-green CTA is the only chromatic event on an otherwise near-monochrome canvas, restraint as the entire brand strategy. |
| 50 | Superhumon (Inspired) | Components | A deep-teal closing CTA band deliberately interrupts the indigo/white rhythm as a warm dark interlude, a structural surprise placed... |

## Index by Element Type

**Colors** (21): Airtable (#2), Binance (#4), BMW M (#6), ClickHouse (#11), Cursor (#15), ElevenLabs (#16), Ferrari (#18), Figma (#19), Framer (#20), HashiCorp (#21), Intercom (#23), Linear (#24), MongoDB (#25), MiniMax (#27), Mintlify (#28), Miro (#29), Renault (#40), Revolut (#43), Sentri (Inspired) (#44), Slacc (Inspired) (#46), Supabaze (Inspired) (#49)

**Typography** (14): Apple (#3), BMW (#5), Bugatti (#7), Cal.com (#8), Cohere (#12), Coinbase (#13), IBM (#22), Nike (#31), OpenCode (#35), Raycast (#39), Replicate (#41), Resend (#42), Spasex (Inspired) (#47), Stripi (Inspired) (#48)

**Components** (8): Clay (#10), Composio (#14), Expo (#17), Mistral AI (#30), Notion (#32), Ollama (#34), PostHog (#38), Superhumon (Inspired) (#50)

**Shapes** (3): Airbnb (#1), Meta (#26), NVIDIA (#33)

**Layout** (3): Pinterest (#36), PlayStation (#37), Shopifi (Inspired) (#45)

**Overview** (1): Claude (#9)

---

# Part 2: The 50 Picks

## 1. Airbnb: Shapes

**Why this stood out:** The rounding scale itself is the brand statement, pill search bars, 14px cards, 32px tabs, and literally no hard corner anywhere on the page.

```yaml
rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 14px
  lg: 20px
  xl: 32px
  full: 9999px
```

The shape language is **soft**. Buttons are 8px radius (`{rounded.sm}`), property cards are ~14px (`{rounded.md}`), the search bar is fully pill-shaped (`{rounded.full}`), wishlist hearts and search orbs are circles (`{rounded.full}`), and category strip rounded corners run at 32px (`{rounded.xl}`). There is essentially no hard corner anywhere except the body grid itself, every interactive element is rounded.


---

## 2. Airtable: Colors

**Why this stood out:** Full-bleed signature color cards (coral, dark green, peach, navy) are the only chromatic event in an otherwise near-monochrome editorial system.

### Brand & Accent
- **Primary** (`{colors.primary}`, #181d26): The dominant brand color. Used for the primary CTA background, h1/h2 display type, and the `{component.surface-dark}` band. Not "blue, then black", black IS the primary throughout the marketing system.
- **Primary Active** (`{colors.primary-active}`, #0d1218): The press state on primary buttons.

### Surface
- **Canvas** (`{colors.canvas}`, #ffffff): The default page surface; the floor of every editorial body.
- **Surface Soft** (`{colors.surface-soft}`, #f8fafc): Tabbed feature cards and the featured pricing tier.
- **Surface Strong** (`{colors.surface-strong}`, #e0e2e6): The light gray "Start building with Airtable" CTA banner near the footer.
- **Surface Dark** (`{colors.surface-dark}`, #181d26): The dark navy CTA cards used mid-page (for example "The path to 10× every person in your organization").
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}`, #1d1f25): The articles-page hero base behind the rainbow-stripe overlay.
- **Hairline** (`{colors.hairline}`, #dddddd): The 1px border tone for input outlines, table dividers, secondary-button outlines.

### Text
- **Ink** (`{colors.ink}`, #181d26): The strongest text, h1/h2 display type and primary button text-on-light. Same hex as `{colors.primary}` because they are the same role expressed at type and button layers.
- **Body** (`{colors.body}`, #333840): The default running-text color.
- **Muted** (`{colors.muted}`, #41454d): Footer links, breadcrumbs, captions.
- **Border Strong** (`{colors.border-strong}`, #9297a0): The 1px outline color on disabled secondary buttons.
- **On Primary / On Dark** (`{colors.on-primary}`, #ffffff): The text color on primary buttons and dark surfaces.

### Signature Card Surfaces
These are the colors that carry Airtable's brand voltage. They appear as full-bleed, full-card surfaces, never as accents on a small element.
- **Coral** (`{colors.signature-coral}`, #aa2d00): The largest signature card on the homepage ("Production apps in prototype speed"). Full-bleed dark coral with white type.
- **Forest** (`{colors.signature-forest}`, #0a2e0e): A deep-green signature card used in the homepage demo-grid cluster.
- **Cream** (`{colors.signature-cream}`, #f5e9d4): The cream callout band ("The path to 10× every person in your organization"), a soft beige surface holding dark type and product UI fragments.
- **Peach** (`{colors.signature-peach}`, #fcab79), **Mint** (`{colors.signature-mint}`, #a8d8c4), **Yellow** (`{colors.signature-yellow}`, #f4d35e), **Mustard** (`{colors.signature-mustard}`, #d9a441): Demo-card surfaces that carry small product UI fragments inside the multi-card grid sections.

### Semantic
- **Link** (`{colors.link}`, #1b61c9): Inline body links and anchor text. Darker on press to `{colors.link-active}` (#1a3866). Despite the `--theme_button-background-primary` CSS-variable name, this color is **not** the primary button color, it is the link color.
- **Info** (`{colors.info}`, #254fad) and **Info Border** (`{colors.info-border}`, #458fff): Inline info badges and focused-input outline.
- **Success** (`{colors.success}`, #006400) and **Success Border** (`{colors.success-border}`, #39bf45): Confirmation states.


---

## 3. Apple: Typography

**Why this stood out:** SF Pro Display with negative letter-spacing carries the entire brand voice, no gradients, no shadows, just type and photography doing the work.

### Font Family
- **Display**: `SF Pro Display, system-ui, -apple-system, sans-serif`, Apple's proprietary display face, optimized for sizes ≥ 19px. Defines the voice of every headline.
- **Body / UI**: `SF Pro Text, system-ui, -apple-system, sans-serif`, the text-optimized variant used for body copy, captions, buttons, and links below 20px.
- **OpenType features**: `font-variant-numeric: numerator` is enabled on numeric links (pricing tables, spec sheets). Display sizes rely on tight tracking rather than contextual ligatures.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 56px | 600 | 1.07 | -0.28px | Hero headline; the signature "Apple tight" tracking |
| `{typography.display-lg}` | 40px | 600 | 1.10 | 0 | Tile headlines atop every product tile |
| `{typography.display-md}` | 34px | 600 | 1.47 | -0.374px | Section heads (SF Pro Text at display proportions) |
| `{typography.lead}` | 28px | 400 | 1.14 | 0.196px | Product tile subcopy |
| `{typography.lead-airy}` | 24px | 300 | 1.5 | 0 | Environment-page lead paragraphs (the rare weight 300) |
| `{typography.tagline}` | 21px | 600 | 1.19 | 0.231px | Sub-tile tagline; sub-nav category name |
| `{typography.body-strong}` | 17px | 600 | 1.24 | -0.374px | Inline strong emphasis |
| `{typography.body}` | 17px | 400 | 1.47 | -0.374px | Default paragraph |
| `{typography.dense-link}` | 17px | 400 | 2.41 | 0 | Footer / store utility link lists (relaxed leading) |
| `{typography.caption}` | 14px | 400 | 1.43 | -0.224px | Secondary captions, button text |
| `{typography.caption-strong}` | 14px | 600 | 1.29 | -0.224px | Emphasized captions |
| `{typography.button-large}` | 18px | 300 | 1.0 | 0 | Store hero CTAs (the rare weight 300) |
| `{typography.button-utility}` | 14px | 400 | 1.29 | -0.224px | Utility/nav button labels |
| `{typography.fine-print}` | 12px | 400 | 1.0 | -0.12px | Fine-print, footer body |
| `{typography.micro-legal}` | 10px | 400 | 1.3 | -0.08px | Micro legal disclaimers |
| `{typography.nav-link}` | 12px | 400 | 1.0 | -0.12px | Global nav menu items |

### Principles

- **Negative letter-spacing at display sizes.** Every headline at 17px and up carries a slight tracking tighten (`-0.12 → -0.374px`). This produces the iconic "Apple tight" headline cadence. Never used at 12px or below.
- **Body copy at 17px, not 16px.** Apple breaks the SaaS convention and runs paragraph text at 17px. The extra pixel gives the page an unmistakable "reading, not scanning" pace.
- **Weight 300 is real and rare.** Used deliberately on a handful of large-size reads (`{typography.button-large}` at 18px/300 and `{typography.lead-airy}` at 24px/300). It's not an accident, it's a light-atmosphere cue reserved for moments where the content should feel airy.
- **Weight 600, not 700, for headlines.** Apple's headlines sit at weight 600. Weight 700 is used sparingly for `{typography.tagline}` (21px) when a touch more assertion is needed.
- **Line-height is context-specific.** Display sizes use 1.07–1.19 (tight). Body uses 1.47. Utility link stacks in the footer/store use an unusually relaxed 2.41 (`{typography.dense-link}`). The 2.41 is not a bug, it's how the footer's dense link columns breathe.
- **Weight 500 is deliberately absent.** The ladder is 300 / 400 / 600 / 700. Mid-weight readings always use 600.

### Note on Font Substitutes
SF Pro is Apple's proprietary system font. When building off-system:

- Use `system-ui, -apple-system, BlinkMacSystemFont` as the first stack entry, on macOS/iOS/Safari this resolves to the real SF Pro.
- For non-Apple platforms, **Inter** (Google Fonts, variable) is the closest open-source equivalent. Inter at weight 600 with `font-feature-settings: "ss03"` approximates SF Pro's rounded "a" character.
- Nudge `letter-spacing` down by `-0.01em` on display sizes to re-create the Apple tight feel; Inter's default tracking runs slightly wider than SF Pro.
- For body text, tighten line-height by `0.03` (from 1.47 → 1.44) when substituting Inter, Inter's taller x-height needs less leading.


---

## 4. Binance: Colors

**Why this stood out:** One yellow (#FCD535) has to work across both a near-black marketing theme and a light transactional theme, plus double as the up/down trading signal alongside green/red.

### Brand & Accent
- **Binance Yellow** (`{colors.primary}`, #FCD535): The single brand color. Used for primary CTA backgrounds, the wordmark, brand-claim headlines ("FUNDS ARE SAFU"), trust badges ("No.1 Trading Volume"), large stat numbers in `{component.stat-callout-card}`, and inline links.
- **Binance Yellow Active** (`{colors.primary-active}`, #f0b90b): The press / hover-darker variant. Slightly more saturated yellow.
- **Binance Yellow Disabled** (`{colors.primary-disabled}`, #3a3a1f): A desaturated dark-yellow used on disabled CTAs over dark canvas.
- **Accent Turquoise** (`{colors.accent-turquoise}`, #2dbdb6): A small secondary accent used very sparingly on Smart Money's "Check Now" CTA over dark surfaces. Treat as a single-product accent, not a system color.

### Surface

The system has two canvas modes that map to product context:

**Dark mode (marketing default):**
- **Canvas Dark** (`{colors.canvas-dark}`, #0b0e11): The primary page floor. Near-black with a slight warm tint, never pure black.
- **Surface Card Dark** (`{colors.surface-card-dark}`, #1e2329): Cards, navigation dropdowns, secondary buttons over dark canvas, markets table.
- **Surface Elevated Dark** (`{colors.surface-elevated-dark}`, #2b3139): One step lighter, used for nested cards, hovered nav items, and chart background panels.

**Light mode (transactional):**
- **Canvas Light** (`{colors.canvas-light}`, #ffffff): The page floor on transactional pages (buy crypto, deposit forms, account dialogs).
- **Surface Soft Light** (`{colors.surface-soft-light}`, #fafafa): Footer surface and disabled states.
- **Surface Strong Light** (`{colors.surface-strong-light}`, #f5f5f5): Form input backgrounds in muted contexts.

### Hairlines & Borders
- **Hairline on Light** (`{colors.hairline-on-light}`, #eaecef): The 1px border tone on light surfaces. Dembrandt's frequency analysis confirms this as the highest-count token (1022 occurrences), Binance uses hairlines liberally.
- **Hairline on Dark** (`{colors.hairline-on-dark}`, #2b3139): The 1px border tone on dark surfaces. Same hex as `{colors.surface-elevated-dark}`, borders feel like surface steps, not ink lines.
- **Border Strong** (`{colors.border-strong}`, #cdd1d6): A heavier border tone used on disabled secondary buttons.

### Text
- **Ink** (`{colors.ink}`, #181a20): The strongest text on light surfaces. Display headlines on transactional pages.
- **Body on Dark** (`{colors.body}`, #eaecef): Default running-text on dark canvas, deliberately not pure white, slightly cooler.
- **Body on Light** (`{colors.body-on-light}`, #181a20): Same as ink, light-mode body text reuses the ink token.
- **Muted** (`{colors.muted}`, #707a8a): Footer links, breadcrumbs, captions, table column headers. Works on both light and dark canvas.
- **Muted Strong** (`{colors.muted-strong}`, #929aa5): A second-tier muted for emphasized labels.
- **On Primary** (`{colors.on-primary}`, #181a20): Black text on yellow primary CTAs.
- **On Dark** (`{colors.on-dark}`, #ffffff): Pure white for high-contrast headlines on dark canvas.

### Trading Semantics
- **Trading Up** (`{colors.trading-up}`, #0ecb81): Price-up green, used as text color in tables, charts, and inline ticker arrows. Never as a button background.
- **Trading Down** (`{colors.trading-down}`, #f6465d): Price-down red. Same usage rules as trading-up.

### Info / Focus
- **Info** (`{colors.info}`, #3b82f6): Inline info badges and the focus-ring base. The Tailwind `--tw-ring-color` token surfaced by dembrandt, used on input focus.


---

## 5. BMW: Typography

**Why this stood out:** The entire hierarchy runs on just two weights of one typeface, heavy 700 for display and light 300 for body, which is an unusually disciplined range for a corporate site.

### Font Family
The system runs **BMW Type Next Latin** in two cuts: regular (display + UI labels) and **BMW Type Next Latin Light** (body + secondary copy). Fallback stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

The display/body split is functional:
- BMW Type Next Latin (700) → display headlines, button labels, nav links
- BMW Type Next Latin Light (300) → paragraphs, descriptive copy
- BMW Type Next Latin (400) → caption, neutral nav-link contexts

This three-way split mirrors BMW M's, corporate and the M sub-brand share the same typographic DNA; only the weight/size ratios differ.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 700 | 1.05 | 0 | Hero h1 ("iX3", model name) |
| `{typography.display-lg}` | 48px | 700 | 1.1 | 0 | Section heads |
| `{typography.display-md}` | 32px | 700 | 1.15 | 0 | Sub-section heads |
| `{typography.display-sm}` | 24px | 700 | 1.25 | 0 | CTA-band headlines |
| `{typography.title-lg}` | 20px | 700 | 1.3 | 0 | Card group titles |
| `{typography.title-md}` | 18px | 700 | 1.4 | 0 | Model card title, intro paragraphs |
| `{typography.title-sm}` | 16px | 700 | 1.4 | 0 | Inventory card title, list label |
| `{typography.body-md}` | 16px | 300 (Light) | 1.55 | 0 | Default body, BMW Type Next Latin Light |
| `{typography.body-sm}` | 14px | 300 (Light) | 1.55 | 0 | Footer body, fine-print |
| `{typography.caption}` | 12px | 400 | 1.4 | 0.5px | Photo captions, meta |
| `{typography.label-uppercase}` | 13px | 700 | 1.3 | 1.5px | "LEARN MORE" inline links, category tabs |
| `{typography.button}` | 14px | 700 | 1.0 | 0.5px | Standard CTA button label |
| `{typography.nav-link}` | 14px | 400 | 1.4 | 0.3px | Top-nav menu items |

### Principles
- The **700/300 contrast** is the editorial signature. Weight 500 is absent from the system.
- **No negative letter-spacing**, BMW Type Next Latin works on a wide body, so tracking stays at default. Apple/Cal.com-style tightening reads off-brand here.
- **UPPERCASE inline links**, "LEARN MORE"-style CTAs run uppercase with 1.5px tracking. The "machined precision" voice.
- **Weight 400 lives in a narrow lane**, only caption and nav-link, both neutral utility roles.

### Note on Font Substitutes
BMW Type Next Latin is a licensed BMW typeface. Open-source alternatives:
- **Inter** (variable), close match at weight 700/300. Leave letter-spacing at 0.0em.
- **Saira Condensed**, for a slightly more compressed BMW Type feel.


---

## 6. BMW M: Colors

**Why this stood out:** The M tricolor stripe (light blue to dark blue to red) is used so sparingly, only on logos, dividers, and motorsport chrome, that it reads as a signature rather than a palette.

### Brand & Accent
- **Primary** (`{colors.primary}`, #ffffff): The system's primary type and CTA color. Used for h1/h2/h3 display, body text on dark, and primary button labels (the buttons themselves are transparent or canvas-colored, the white text + outline IS the button).
- **M Blue Light** (`{colors.m-blue-light}`, #0066b1): The first stop in the M tricolor stripe. Used on M-badge accents and motorsport chrome.
- **M Blue Dark** (`{colors.m-blue-dark}`, #1c69d4): The middle stop. The same hex as `{colors.bmw-blue}`, BMW's heritage corporate blue, repurposed as the middle band of the M stripe.
- **M Red** (`{colors.m-red}`, #e22718): The third stop. The signature M-power red, used in the stripe and on motorsport-pace callouts.
- **Electric Blue** (`{colors.electric-blue}`, #0653b6): A separate electric-vehicle accent used on M xDrive electric model pages. Distinct from the heritage blue, feels colder, more digital.

### Surface
- **Canvas** (`{colors.canvas}`, #000000): The default page floor across every marketing surface. True black.
- **Surface Soft** (`{colors.surface-soft}`, #0d0d0d): A barely-different-from-black used for spec table cells and footer-adjacent strips.
- **Surface Card** (`{colors.surface-card}`, #1a1a1a): Cards, secondary buttons, icon-button backgrounds.
- **Surface Elevated** (`{colors.surface-elevated}`, #262626): One step lighter, used for nested cards inside dark bands.
- **Carbon Gray** (`{colors.carbon-gray}`, #2b2b2b): Carbon-fiber-inspired surface tone used on technical-spec cards.

### Hairlines & Borders
- **Hairline** (`{colors.hairline}`, #3c3c3c): The 1px divider tone on dark surfaces. Used between body sections, between table rows, around card outlines.
- **Hairline Strong** (`{colors.hairline-strong}`, #262626): Same hex as `{colors.surface-elevated}`, borders feel like one-step elevations rather than ink lines.

### Text
- **Ink / On Dark** (`{colors.on-dark}`, #ffffff): All headline and primary text on dark canvas.
- **Body** (`{colors.body}`, #bbbbbb): Default running-text color (slightly cooler than pure white). Used for body paragraphs and secondary metadata.
- **Body Strong** (`{colors.body-strong}`, #e6e6e6): Emphasized body / lead paragraph.
- **Muted** (`{colors.muted}`, #7e7e7e): Footer links, breadcrumbs, captions.

### Semantic
- **Warning** (`{colors.warning}`, #f4b400): Used very sparingly on technical-warning callouts.
- **Success** (`{colors.success}`, #0fa336): Order-confirmation states (rare on marketing surfaces).


---

## 7. Bugatti: Typography

**Why this stood out:** Three custom typefaces (Display, Text, Monospace) at wide tracking replace color entirely as the brand's only voltage, there is no accent color anywhere.

### Font Family
The system runs **three custom Bugatti typefaces** as a rigid trinity:
1. **Bugatti Display**, All display headlines (h1, h2, h3), the "BUGATTI" wordmark, model name plates. Uppercase, wide-tracked. The default for any visual emphasis.
2. **Bugatti Text Regular**, A serif text face used exclusively for running body copy, lead paragraphs, model descriptions. Standard sentence-case, no letter-spacing.
3. **Bugatti Monospace**, Button labels, navigation, captions, dates, monospace-precision contexts. Always uppercase with 2-2.5px tracking.

The split is functional and absolute. Bugatti Display in a button breaks the "machined precision" voice; Bugatti Monospace in a paragraph breaks the "engineered elegance" voice; Bugatti Text in a button is unthinkable.

The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for Bugatti Display, `Garamond, "Times New Roman", serif` for Bugatti Text Regular, and `ui-monospace, "SF Mono", "Cascadia Mono", monospace` for Bugatti Monospace.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 400 | 1.1 | 4px | Hero h1 ("THE BUGATTI F.K.P. HOMMAGE", "TOURBILLON"), Bugatti Display, uppercase, wide-tracked |
| `{typography.display-lg}` | 48px | 400 | 1.15 | 3px | Section heads, Bugatti Display, uppercase |
| `{typography.display-md}` | 32px | 400 | 1.2 | 2px | Sub-section heads, model names, Bugatti Display |
| `{typography.display-sm}` | 24px | 400 | 1.3 | 1.5px | Card titles, Bugatti Display |
| `{typography.wordmark}` | 14px | 400 | 1.0 | 6px | The "BUGATTI" brand wordmark in the top nav, Bugatti Display, the widest tracking in the system |
| `{typography.title-md}` | 20px | 400 | 1.3 | 1px | Career listing titles, intro paragraphs, Bugatti Display |
| `{typography.title-sm}` | 16px | 400 | 1.3 | 1.5px | Mid-tier headlines, callout cards |
| `{typography.caption-uppercase}` | 11px | 400 | 1.4 | 2px | Photo captions, metadata, "EXPLORE OUR OPPORTUNITIES", Bugatti Monospace, uppercase |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body, Bugatti Text Regular (a serif face), sentence case, no tracking |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body, fine-print legal, Bugatti Text Regular |
| `{typography.button}` | 14px | 400 | 1.0 | 2.5px | All button labels, Bugatti Monospace, uppercase, 2.5px tracking |
| `{typography.nav-link}` | 12px | 400 | 1.4 | 2px | Top-nav menu items ("MENU", "STORE"), Bugatti Monospace |

### Principles
The system NEVER uses bold weight. Every Bugatti typeface is set at weight 400 (regular). Visual emphasis comes from:
1. **Size**, 64px hero vs 16px body is a 4× hierarchy
2. **Letter-spacing**, 6px wordmark vs 0px body
3. **Case**, Uppercase display vs sentence-case body
4. **Family contrast**, Display vs Text Regular vs Monospace

Going to weight 700 anywhere would break the "modest engineering" feel and make Bugatti read like a generic luxury template.

The serif Bugatti Text Regular sets the brand apart from the all-sans luxury crowd (BMW, Aston Martin, Lamborghini all use sans-serif body type). Bugatti's serif body voice signals literary, considered, slow-reading prose, which is the brand's editorial philosophy.

### Note on Font Substitutes
If Bugatti Display, Bugatti Text Regular, and Bugatti Monospace are unavailable, the closest open-source substitutes are:
- **Bugatti Display** → **Saira Condensed** (variable, weight 400) at +0.05em letter-spacing
- **Bugatti Text Regular** → **Cormorant Garamond** (regular) or **EB Garamond**
- **Bugatti Monospace** → **JetBrains Mono** or **IBM Plex Mono** (regular weight)

The substitution preserves the three-family split, which is more important than exact typeface match.


---

## 8. Cal.com: Typography

**Why this stood out:** A custom geometric display face (Cal Sans) does all the brand signaling; there's no accent-color system at all, just the headline face and product screenshots.

### Font Family
The system runs **Cal Sans** for display + brand wordmark and **Inter** for everything else. Cal Sans is Cal.com's custom geometric display typeface, slightly condensed, weight 600, negative letter-spacing. Inter handles body, buttons, navigation, captions, and tabular code blocks. The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for both families.

The split is functional:
- Cal Sans (display, 600 weight, -0.5 to -2px tracking), h1, h2, h3
- Inter (body + UI, 400-600 weight, 0 letter-spacing), paragraphs, labels, buttons, nav

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 600 | 1.05 | -2px | Homepage h1 ("The better way to schedule your meetings"), Cal Sans |
| `{typography.display-lg}` | 48px | 600 | 1.1 | -1.5px | Section heads ("Your all-purpose scheduling app"), Cal Sans |
| `{typography.display-md}` | 36px | 600 | 1.15 | -1px | Sub-section heads, card titles, Cal Sans |
| `{typography.display-sm}` | 28px | 600 | 1.2 | -0.5px | CTA-band heads, pricing tier prices, Cal Sans |
| `{typography.title-lg}` | 22px | 600 | 1.3 | -0.3px | Pricing plan names, Inter |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Feature card titles, intro paragraphs |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Small card titles, list labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default running-text |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body, fine-print |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions |
| `{typography.code}` | 14px | 400 | 1.5 | 0 | Code snippets, API examples, JetBrains Mono |
| `{typography.button}` | 14px | 600 | 1.0 | 0 | Standard button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
Cal Sans is the brand voice, every display headline uses it. Inter handles the supporting type. The boundary is strict: never put body copy in Cal Sans, never put a display headline in Inter. Cal Sans without negative letter-spacing reads as off-brand, the -0.5 to -2px tracking is part of the voice.

Display weight stays at 600 across all sizes, never 700, never 500. The middle weight is what makes Cal Sans feel modern and confident without becoming bombastic.

### Note on Font Substitutes
If Cal Sans is unavailable, **Inter** at weight 600 with -0.04em letter-spacing is a usable approximation. The geometric character of Cal Sans differs from Inter's humanist forms, but the substitution preserves the weight + tracking signature. **Manrope** at weight 700 is another close alternative.


---

## 9. Claude: Overview

**Why this stood out:** The cream-canvas + coral-CTA + slab-serif pairing deliberately breaks from the cool blue/slate convention every other AI brand in this set uses.

Claude.com is the warmest, most editorial interface in the AI-product category. The base atmosphere is a **tinted cream canvas** (`{colors.canvas}`, #faf9f5), distinctly warm, deliberately not the cool gray-white that every other AI brand uses. Headlines run a **slab-serif display** ("Copernicus" / Tiempos Headline) at weight 400 with negative letter-spacing, paired with **StyreneB / Inter** body sans. The combination feels like a literary publication, not a SaaS marketing page.

Brand voltage comes from the **cream + coral pairing**, coral (`{colors.primary}`, #cc785c) is the signature Anthropic accent, used on every primary CTA, on the brand wordmark, and on full-bleed callout cards. The coral is warm, slightly muted, never cyan/blue, a deliberate counter-positioning against OpenAI's cool slate, Google's saturated blue, and Microsoft's corporate cyan.

The system has three surface modes that alternate page-by-page:
1. **Cream canvas** (`{colors.canvas}`), default body floor
2. **Light cream cards** (`{colors.surface-card}`), feature card backgrounds
3. **Dark navy product surfaces** (`{colors.surface-dark}`), code editor mockups, model showcase cards, pre-footer CTAs, footer itself

The dark surfaces are where Claude shows its product chrome, code blocks, terminal output, model comparison tables, agentic-flow diagrams. The cream-to-dark contrast is the page's pacing rhythm.

**Key Characteristics:**
- Warm cream canvas (`{colors.canvas}`, #faf9f5) with dark warm-ink text (`{colors.ink}`, #141413). The brand's defining color choice.
- Coral primary CTA (`{colors.primary}`, #cc785c). Used scarcely on individual buttons, generously on full-bleed coral callout cards.
- Slab-serif display headlines via Copernicus / Tiempos Headline at weight 400 with negative letter-spacing. Pairs with humanist sans body for a literary editorial voice.
- Dark navy product mockup cards (`{colors.surface-dark}`, #181715) carrying code blocks, terminal panels, model comparison data, the brand shows the product chrome at scale rather than abstract marketing illustrations.
- Light cream feature cards (`{colors.surface-card}`, #efe9de), slightly darker than canvas, used for content-driven feature explanations.
- Anthropic radial-spike mark, a small black asterisk-like glyph (4-spoke radial), appears as the brand wordmark prefix and as a content marker.
- Border radius is hierarchical: `{rounded.md}` (8px) for buttons + inputs, `{rounded.lg}` (12px) for content + product cards, `{rounded.xl}` (16px) for the hero illustration container, `{rounded.pill}` for badges.
- Section rhythm `{spacing.section}` (96px), modern-SaaS standard. Internal card padding stays generous at `{spacing.xl}` (32px).


---

## 10. Clay: Components

**Why this stood out:** 3D claymation illustrations (mountains, mascots) as full-bleed hero artifacts is a genuinely unusual move for a B2B GTM data product.

### Top Navigation

**`top-nav`**, Cream nav bar pinned to top. 64px tall, `{colors.canvas}` background. Carries the Clay logo + wordmark at left, primary horizontal menu (Product, Solutions, Resources, Pricing, Customers) center, right-side cluster with "Sign in" + "Try free" `{component.button-primary}`. Menu items in `{typography.nav-link}` (Inter 14px / 500).

### Buttons

**`button-primary`**, Background `{colors.primary}` (near-black), text `{colors.on-primary}` (white), type `{typography.button}` (Inter 14px / 600), padding 12px × 20px, height 44px, rounded `{rounded.md}` (12px).

**`button-secondary`**, Cream button with hairline outline. Background `{colors.canvas}`, text `{colors.ink}`, 1px hairline border.

**`button-on-color`**, White button used over saturated brand-color feature cards. Same shape as primary but inverted (white background, ink text).

**`button-text-link`**, Inline text button, no background. Used for "Sign in" and inline link CTAs.

**`text-link`**, Inline body links in `{colors.ink}` with underline.

### Cards & Containers

**`hero-band`**, Cream-canvas hero with 7-5 grid: h1 + sub-headline + button row on the left, 3D claymation illustration on the right. Vertical padding `{spacing.section}` (96px).

**`hero-illustration-card`**, Right-side artifact holding 3D claymation illustration (mountains, mascot character, abstract shapes). Background `{colors.surface-soft}`, rounded `{rounded.xl}` (24px). The illustration IS the artifact.

**`feature-card-pink`** / **`feature-card-teal`** / **`feature-card-lavender`** / **`feature-card-peach`** / **`feature-card-ochre`**, Saturated single-color feature cards. Background varies per variant; rounded `{rounded.xl}` (24px); padding `{spacing.xl}` (32px). Each card carries an h3 in `{typography.title-md}`, a body description, and a product UI fragment or mascot illustration. Text color flips to `{colors.on-dark}` (white) on pink and teal cards, `{colors.ink}` (dark) on lavender/peach/ochre cards (the lighter saturations have enough contrast for dark text).

**`feature-card-cream`**, Lower-key feature card variant on `{colors.surface-card}`. Used for less-emphasized features that don't warrant a saturated color.

**`product-mockup-card`**, Card showing actual Clay product UI (Claygent agent runs, sequencer flows, CRM enrichment tables). Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px).

**`testimonial-card`**, Customer quote cards. Background `{colors.surface-card}` (cream), rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). Top row has avatar + name + role; below sits the testimonial in `{typography.body-md}`.

**`pricing-tier-card`**, Standard tier card. Background `{colors.canvas}` with hairline, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px).

**`pricing-tier-card-featured`**, The featured tier flips to `{colors.brand-teal}` (deep teal-green). The teal surface IS the featured signal.

**`expert-card`**, Used on /experts page. Background `{colors.canvas}` with hairline, rounded `{rounded.lg}`, padding `{spacing.lg}`. Carries an avatar at top, expert name, specialization, and a "Book session" link.

### Inputs & Forms

**`text-input`**, Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.md}` (12px), padding 12px × 16px, height 44px. 1px hairline border.

**`text-input-focused`**, Border thickens to ink for emphasis.

### Tabs / Badges

**`category-tab`** + **`category-tab-active`**, Pill-shaped tabs in sub-nav. Inactive: transparent + muted text. Active: cream-card background + ink text. Padding 8px × 16px.

**`badge-pill`**, Small cream-fill pill labels in `{typography.caption}` (13px / 500), rounded `{rounded.pill}`.

### CTA / Footer

**`cta-band-illustrated`**, Pre-footer "Turn your growth ideas into reality today" band. Background `{colors.surface-soft}`, rounded `{rounded.xl}`, padding 80px. Carries an h2 in `{typography.display-md}`, a sub-line, and a `{component.button-primary}`, usually paired with a 3D illustration of a mascot or scene.

**`footer`**, Cream-tinted footer (NOT dark navy unlike most SaaS sites). Background `{colors.surface-soft}`, text `{colors.body}`. 4-column link list. Vertical padding 80px. Often features a horizon-style 3D mountain illustration at the very bottom, Clay's signature footer mountain.


---

## 11. ClickHouse: Colors

**Why this stood out:** Electric yellow on near-pure black, used scarcely, reads as pure brand identity with zero atmospheric decoration to lean on.

### Brand & Accent
- **Primary (Electric Yellow)** (`{colors.primary}`, #faff69): The signature brand color. All primary CTA backgrounds, large stat-callout numbers, full-bleed yellow CTA cards. The yellow is the brand.
- **Primary Active** (`{colors.primary-active}`, #e6eb52): Press / hover-darker variant.
- **Primary Disabled** (`{colors.primary-disabled}`, #3a3a1f): Desaturated dark-yellow on dark canvas.

### Surface
- **Canvas** (`{colors.canvas}`, #0a0a0a): The default page floor. Near-pure black.
- **Surface Soft** (`{colors.surface-soft}`, #121212): Section dividers, very-soft band tints.
- **Surface Card** (`{colors.surface-card}`, #1a1a1a): Feature cards, code windows, product mockups, pricing tier cards.
- **Surface Elevated** (`{colors.surface-elevated}`, #242424): Nested cards inside larger dark cards.
- **Surface Yellow Band** (`{colors.surface-yellow-band}`, #faff69): The yellow CTA card / band fill, same hex as primary.
- **Hairline** (`{colors.hairline}`, #2a2a2a): 1px borders on cards.
- **Hairline Strong** (`{colors.hairline-strong}`, #3a3a3a): Heavier divider on input underlines and emphasis.

### Text
- **Ink / On Dark** (`{colors.on-dark}`, #ffffff): All headline and primary text.
- **Body** (`{colors.body}`, #cccccc): Default running-text color.
- **Body Strong** (`{colors.body-strong}`, #e6e6e6): Emphasized paragraphs.
- **Muted** (`{colors.muted}`, #888888): Footer links, captions, breadcrumbs.
- **Muted Soft** (`{colors.muted-soft}`, #5a5a5a): Tertiary text, fine print.
- **On Primary / On Yellow** (`{colors.on-primary}` / `{colors.on-yellow}`, #0a0a0a): Black text on yellow CTAs and yellow CTA bands. The high-contrast yellow + black combo is the brand action signal.

### Semantic / Accent
- **Accent Emerald** (`{colors.accent-emerald}`, #22c55e): Success states, "active" status indicators in product UI.
- **Accent Rose** (`{colors.accent-rose}`, #ef4444): Error states, "down" indicators.
- **Accent Blue** (`{colors.accent-blue}`, #3b82f6): Info states, code-syntax highlighting.


---

## 12. Cohere: Typography

**Why this stood out:** A deliberate split between monospaced-feeling display headlines and precise Unica77 UI text gives the brand a technical-but-composed voice.

### Font Family

- **Display**: `CohereText`, falling back to `Space Grotesk`, `Inter`, `ui-sans-serif`, and `system-ui`.
- **Body/UI**: `Unica77 Cohere Web`, falling back to `Inter`, `Arial`, `ui-sans-serif`, and `system-ui`.
- **Technical labels**: `CohereMono`, falling back to `Arial`, `ui-sans-serif`, and `system-ui`.
- **Icons**: Cohere uses custom icon fonts and thin-line geometric illustrations.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---:|---:|---:|---:|---|
| Hero Display | CohereText | 96px | 400 | 1.00 | -1.92px | Home page declaration scale. |
| Product Display | CohereText | 72px | 400 | 1.00 | -1.44px | Product and research hero headlines. |
| Section Display | Unica77 | 60px | 400 | 1.00 | -1.2px | Large product-page headings. |
| Section Heading | Unica77 | 48px | 400 | 1.20 | -0.48px | Split hero and CTA headings. |
| Card Heading | Unica77 | 32px | 400 | 1.20 | -0.32px | Feature card and list section titles. |
| Feature Heading | Unica77 | 24px | 400 | 1.30 | 0 | Cards, filters, and article titles. |
| Body Large | Unica77 | 18px | 400 | 1.40 | 0 | Lead text and larger paragraphs. |
| Body | Unica77 | 16px | 400 | 1.50 | 0 | Default copy and link text. |
| Button | Unica77 | 14px | 500 | 1.71 | 0 | Compact CTA labels. |
| Caption | Unica77 | 14px | 400 | 1.40 | 0 | Metadata and small explanatory text. |
| Mono Label | CohereMono | 14px | 400 | 1.40 | 0.28px | Uppercase technical labels. |
| Micro | Unica77 | 12px | 400 | 1.40 | 0 | Footer, nav microcopy, and small links. |

### Principles

- Use massive type sparingly; Cohere pages often have one oversized headline and then settle into restrained 16px-24px UI copy.
- Keep display type tight. Hero copy should feel compact and carved, not airy.
- Avoid heavy bold weights. Size, spacing, and surface contrast do most of the hierarchy work.
- Use uppercase mono labels for category and system markers, especially on product and research pages.
- Editorial pages can use coral chips and blue links, but the base typography remains black and measured.


---

## 13. Coinbase: Typography

**Why this stood out:** Display type sits at weight 400, not 700, a fintech brand choosing editorial calm over the bombastic weight the category defaults to.

### Font Family
The system runs **CoinbaseDisplay** (display headlines), **CoinbaseSans** (body, navigation, captions, buttons), **CoinbaseIcons** (icon font), and **CoinbaseMono** for tabular numerical data. Fallback stack: `-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

The display/body split is functional: CoinbaseDisplay carries hero headlines only; CoinbaseSans carries everything else.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 80px | 400 | 1.0 | -2px | Homepage hero h1 |
| `{typography.display-xl}` | 64px | 400 | 1.0 | -1.6px | Subsidiary heroes |
| `{typography.display-lg}` | 52px | 400 | 1.0 | -1.3px | Section heads |
| `{typography.display-md}` | 44px | 400 | 1.09 | -1px | CTA-band headlines |
| `{typography.display-sm}` | 36px | 400 | 1.11 | -0.5px | Sub-section heads, CoinbaseSans |
| `{typography.title-lg}` | 32px | 400 | 1.13 | -0.4px | Card group titles |
| `{typography.title-md}` | 18px | 600 | 1.33 | 0 | Component titles, asset row primary |
| `{typography.title-sm}` | 16px | 600 | 1.25 | 0 | List labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body |
| `{typography.body-strong}` | 16px | 700 | 1.5 | 0 | Emphasized body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 13px | 400 | 1.5 | 0 | Photo captions |
| `{typography.caption-strong}` | 12px | 600 | 1.5 | 0 | Badge pill labels |
| `{typography.number-display}` | 18px | 500 | 1.4 | 0 | Asset prices, percent changes, CoinbaseMono |
| `{typography.button}` | 16px | 600 | 1.15 | 0 | Standard CTA pill |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
- **Display weight stays at 400.** The single most distinctive typographic choice, signals "calm institutional brand" rather than "trading-platform urgency."
- **Negative letter-spacing on display only.** Display uses -1px to -2px tracking; body stays at 0.
- **CoinbaseMono on every number.** Asset prices, percent changes, anything tabular renders in CoinbaseMono.

### Note on Font Substitutes
CoinbaseDisplay, CoinbaseSans, and CoinbaseMono are licensed Coinbase typefaces.
- **CoinbaseDisplay → Inter** at weight 400, letter-spacing -1.5%.
- **CoinbaseSans → Inter** at weight 400/600.
- **CoinbaseMono → JetBrains Mono** or **Geist Mono** at weight 500.


---

## 14. Composio: Components

**Why this stood out:** The four-pane terminal mockup with a central blue spotlight glow is the single strongest hero pattern in the whole collection for a dev-tools brand.

### Top Navigation

**`top-nav-dark`**, Default top nav. Background `{colors.canvas}`, text `{colors.body-strong}`, height 64px. Layout: Composio wordmark left, primary horizontal menu (Product / Toolkits / Docs / Pricing / Customers / Blog), GitHub stars + Sign In + "Get started" right.

### Buttons

**`button-primary`**, The signature Composio Blue CTA. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (14px / 500), padding 10px × 18px, height 40px, rounded `{rounded.md}` (8px).

**`button-primary-active`**, Press state. Background `{colors.primary-active}`.

**`button-secondary-dark`**, Surface-elevated secondary. Background `{colors.surface-card-elevated}`, text `{colors.body-strong}`.

**`button-outline`**, Transparent with 1px hairline-strong border.

**`button-tertiary-text`**, Inline text link.

### Hero & Atmospheric

**`hero-band`**, Homepage hero. Background `{colors.canvas}`, full-width display headline in `{typography.display-mega}` (72px / 500), subhead, two CTAs, and a spotlight-glow backdrop emanating from behind the centered terminal-mockup grid.

**`terminal-mockup-grid`**, The brand's strongest visual signature. 2×2 grid of dark code/output panels inside a `{rounded.xl}` (16px) container. Background `{colors.canvas-deep}`, padding 32px, gap 16px.

**`terminal-pane`**, Individual code/output panel inside the mockup grid. Background `{colors.surface-card}`, text `{colors.body}` in `{typography.code}`, rounded `{rounded.lg}` (12px), padding 20px.

**`spotlight-glow-card`**, Large feature card with centered display headline and a radial blue glow behind it. Background `{colors.surface-card}`, text `{colors.body-strong}` in `{typography.display-md}`, rounded `{rounded.xl}`, padding 48px.

### Cards

**`feature-card`**, 3-up benefit grid. Background `{colors.surface-card}`, text `{colors.body}`, type `{typography.title-md}`, rounded `{rounded.xl}`, padding 28px.

**`toolkit-card`**, 4-up toolkit grid (Slack, GitHub, Stripe, Notion, Linear, etc.). Background `{colors.surface-card}`, text `{colors.body-strong}`, type `{typography.title-sm}`, rounded `{rounded.lg}`, padding 20px. 40px square `{component.toolkit-icon}` top, toolkit name, one-line description.

**`toolkit-icon`**, Square icon plate. Background `{colors.surface-card-elevated}`, rounded `{rounded.md}`, 40px size.

**`testimonial-card`**, Quote card. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}`, padding 24px.

### Code

**`code-block`**, Inline code/terminal block. Background `{colors.canvas-deep}`, text `{colors.body}` in `{typography.code}`, rounded `{rounded.lg}`, padding 20px.

### Forms

**`text-input`**, Background `{colors.surface-card}`, text `{colors.body-strong}`, rounded `{rounded.md}` (8px), padding 12px × 16px, height 44px.

**`search-input`**, Compact search field. Same surface and radius, smaller padding, 40px height.

### Tags & Badges

**`badge-pill`**, Small uppercase pill. Background `{colors.surface-card-elevated}`, text `{colors.body-strong}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 10px.

### CTA / Footer

**`cta-band-spotlight`**, Pre-footer band. Background `{colors.canvas}` with centered radial spotlight glow. Display headline + single primary CTA pill. 96px padding.

**`footer-dark`**, Closing footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`**, Background transparent, text `{colors.body}`, type `{typography.body-sm}`.


---

## 15. Cursor: Colors

**Why this stood out:** A pastel five-color timeline palette (peach, mint, blue, lavender, gold) exists solely to mark AI-action stages inside one specific UI pattern, restraint applied with real precision.

### Brand & Accent
- **Cursor Orange** (`{colors.primary}`, #f54e00): Primary CTA pills, wordmark, hero accent. Used scarcely.
- **Cursor Orange Active** (`{colors.primary-active}`, #d04200): Press state.

### Surface
- **Canvas** (`{colors.canvas}`, #f7f7f4): Warm cream page floor.
- **Canvas Soft** (`{colors.canvas-soft}`, #fafaf7): IDE-pane background inside mockups.
- **Surface Card** (`{colors.surface-card}`, #ffffff): Pure white card surface, slight contrast against the cream canvas.
- **Surface Strong** (`{colors.surface-strong}`, #e6e5e0): Badges, tag pills.

### Hairlines
- **Hairline** (`{colors.hairline}`, #e6e5e0): 1px divider.
- **Hairline Soft** (`{colors.hairline-soft}`, #efeee8): Lighter divider.
- **Hairline Strong** (`{colors.hairline-strong}`, #cfcdc4): Stronger panel outline.

### Text
- **Ink** (`{colors.ink}`, #26251e): Display, body emphasis. Warm near-black.
- **Body** (`{colors.body}`, #5a5852): Default running-text.
- **Body Strong** (`{colors.body-strong}`, #26251e): Same as ink.
- **Muted** (`{colors.muted}`, #807d72): Sub-titles.
- **Muted Soft** (`{colors.muted-soft}`, #a09c92): Disabled text.
- **On Primary** (`{colors.on-primary}`, #ffffff): White text on Cursor Orange.

### Timeline (AI-action signature)
- **Thinking** (`{colors.timeline-thinking}`, #dfa88f): Peach. Used inside in-product agent timeline only.
- **Grep** (`{colors.timeline-grep}`, #9fc9a2): Mint.
- **Read** (`{colors.timeline-read}`, #9fbbe0): Pastel blue.
- **Edit** (`{colors.timeline-edit}`, #c0a8dd): Lavender.
- **Done** (`{colors.timeline-done}`, #c08532): Warm gold.

### Semantic
- **Success** (`{colors.semantic-success}`, #1f8a65): Confirmation indicators.
- **Error** (`{colors.semantic-error}`, #cf2d56): Validation errors.


---

## 16. ElevenLabs: Colors

**Why this stood out:** Soft atmospheric gradient orbs (mint to peach to lavender to sky) stand in for a brand color entirely, there is no saturated accent anywhere in the system.

### Brand & Accent
- **Ink Primary** (`{colors.primary}`, #292524): The primary action color, warm near-black pill. Used scarcely.
- **Ink Primary Active** (`{colors.primary-active}`, #0c0a09): Press state.

### Surface
- **Canvas** (`{colors.canvas}`, #f5f5f5): Off-white page floor.
- **Canvas Soft** (`{colors.canvas-soft}`, #fafafa): Lighter band for subtle alternating sections.
- **Canvas Deep** (`{colors.canvas-deep}`, #0c0a09): Same as ink, used for the rare dark-mode hero (Agents page).
- **Surface Card** (`{colors.surface-card}`, #ffffff): Pure white card.
- **Surface Strong** (`{colors.surface-strong}`, #f0efed): Badges, voice-icon plates.
- **Surface Dark** (`{colors.surface-dark}`, #0c0a09): Dark hero/CTA band canvas.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}`, #1c1917): Cards on dark canvas.

### Hairlines
- **Hairline** (`{colors.hairline}`, #e7e5e4): Default 1px divider.
- **Hairline Soft** (`{colors.hairline-soft}`, #f0efed): Lighter divider.
- **Hairline Strong** (`{colors.hairline-strong}`, #d6d3d1): Stronger panel outline.

### Text
- **Ink** (`{colors.ink}`, #0c0a09): Display, primary text.
- **Body** (`{colors.body}`, #4e4e4e): Default running-text.
- **Body Strong** (`{colors.body-strong}`, #292524): Same as primary, emphasis.
- **Muted** (`{colors.muted}`, #777169): Sub-titles.
- **Muted Soft** (`{colors.muted-soft}`, #a8a29e): Disabled text.
- **On Primary** (`{colors.on-primary}`, #ffffff): White text on ink pill.
- **On Dark** (`{colors.on-dark}`, #ffffff): White text on dark hero.
- **On Dark Soft** (`{colors.on-dark-soft}`, #a8a29e): Muted off-white on dark.

### Atmospheric Gradient Stops (signature)
- **Gradient Mint** (`{colors.gradient-mint}`, #a7e5d3): Mint green orb.
- **Gradient Peach** (`{colors.gradient-peach}`, #f4c5a8): Peach orb.
- **Gradient Lavender** (`{colors.gradient-lavender}`, #c8b8e0): Lavender orb.
- **Gradient Sky** (`{colors.gradient-sky}`, #a8c8e8): Sky-blue orb.
- **Gradient Rose** (`{colors.gradient-rose}`, #e8b8c4): Rose orb.

These appear ONLY as soft radial-gradient atmospheric orbs inside `{component.gradient-orb-card}` and as background atmospheric blooms behind hero copy. Never as button fills, never as text colors.

### Semantic
- **Success** (`{colors.semantic-success}`, #16a34a): Confirmation.
- **Error** (`{colors.semantic-error}`, #dc2626): Validation errors.


---

## 17. Expo: Components

**Why this stood out:** The centered MacBook + iPhone device-mockup hero over a sky-gradient wash is doing all the brand-credibility work that copy would normally carry.

### Top Navigation

**`top-nav`**, Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: Expo wordmark left, primary horizontal menu (Tools / Workflows / EAS / Pricing / Docs / Showcase), Sign In + Get started CTA right.

### Buttons

**`button-primary`**, Pure black pill. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (14px / 500), padding 10px × 18px, height 40px, rounded `{rounded.md}` (8px).

**`button-primary-active`**, Press state. Background `{colors.primary-active}`.

**`button-secondary`**, White card with 1px hairline-strong border. Background `{colors.surface-card}`, text `{colors.ink}`, 1px `{colors.hairline-strong}` border.

**`button-tertiary-text`**, Inline blue text link. Background transparent, text `{colors.text-link}`.

### Hero & Device Mockup

**`hero-band`**, Background `{colors.canvas}` with a soft sky-blue gradient wash behind the centered headline. Display headline in `{typography.display-mega}` (64px / 600 / -1.92px), subhead in `{typography.body-md}`, single primary CTA, then below, the device mockup composite.

**`device-mockup-card`**, A layered MacBook + iPhone composite showing real Expo dev surfaces. Background `{colors.surface-card}`, rounded `{rounded.xl}`. The MacBook holds the EAS dashboard or Expo Studio screenshot; the iPhone overlay shows the running app in Expo Go. This is the page chrome.

### Cards

**`feature-card`**, Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.title-md}`, rounded `{rounded.lg}`, padding 24px, 1px `{colors.hairline-strong}` border.

**`feature-card-dark`**, Dark variant. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same shape, dark inversion.

**`workflow-step-card`**, Step in the "Get your app on every device" workflow row. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}`, padding 20px. Layout: 32px square `{component.workflow-step-icon}` + step number + label + body.

**`workflow-step-icon`**, Square plate. Background `{colors.surface-strong}`, rounded `{rounded.md}`, 32px size.

**`testimonial-card`**, Quote card. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}`, padding 24px.

### Code & IDE

**`code-block`**, Inline code block. Background `{colors.surface-dark}`, text `{colors.on-dark}` in `{typography.code}` (JetBrains Mono 13px), rounded `{rounded.lg}`, padding 20px. White text on dark.

**`ide-mockup-card`**, Stylized IDE mockup. Background `{colors.surface-dark}`, rounded `{rounded.lg}`. Multi-pane editor + terminal preview.

### Pricing

**`pricing-tier-card`**, Standard pricing tier. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding 32px, 1px `{colors.hairline-strong}` border.

**`pricing-tier-featured`**, Featured tier. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same shape, dark inversion.

### Ecosystem

**`ecosystem-tile`**, Square logo plate for ecosystem partner logos (TypeScript, React, Sentry, etc.). Background `{colors.surface-card}`, rounded `{rounded.md}`, 64px size, 1px `{colors.hairline}` border.

### Forms & Tags

**`text-input`**, Background `{colors.surface-card}`, text `{colors.ink}`, rounded `{rounded.md}` (8px), padding 12px × 16px, height 44px, 1px `{colors.hairline-strong}` border. Focus thickens border to 2px ink.

**`badge-pill`**, Small uppercase pill. Background `{colors.surface-strong}`, text `{colors.ink}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 10px.

### CTA / Footer

**`cta-band`**, Pre-footer band. Background `{colors.canvas}`, centered display headline in `{typography.display-lg}`, single black pill CTA. 96px padding.

**`footer-light`**, Closing white footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`**, Background transparent, text `{colors.body}`, type `{typography.body-sm}`.


---

## 18. Ferrari: Colors

**Why this stood out:** Rosso Corsa used scarcely, only on CTAs, the Cavallino mark, and race-position highlights, against a near-black canvas, is the most disciplined single-accent system here.

### Brand & Accent
- **Rosso Corsa** (`{colors.primary}`, #da291c): The iconic Ferrari racing red. Primary CTA fill, Cavallino mark, F1 driver-position highlights. Used scarcely.
- **Rosso Corsa Active** (`{colors.primary-active}`, #b01e0a): Press state.
- **Rosso Corsa Hover-darker** (`{colors.primary-hover}`, #9d2211): Documented for completeness; per the no-hover policy this is not used in preview HTML.
- **Hypersail Yellow** (`{colors.accent-yellow-hypersail}`, #fff200) + **Yellow** (`{colors.accent-yellow}`, #f6e500): Sub-brand accents reserved for the Hypersail sailing program and the global focus-ring color. Not part of the main automotive palette.

### Surface
- **Canvas** (`{colors.canvas}`, #181818): Near-black page floor, never pure black, slight warmth.
- **Canvas Elevated** (`{colors.canvas-elevated}`, #303030): Cards and panels on dark canvas.
- **Canvas Light** (`{colors.canvas-light}`, #ffffff): White editorial bands (preowned listings, pricing).
- **Surface Card** (`{colors.surface-card}`, #303030): Same as canvas-elevated, driver cards, livery photo plates.
- **Surface Soft Light** (`{colors.surface-soft-light}`, #f7f7f7): Light editorial alternating band.
- **Surface Strong Light** (`{colors.surface-strong-light}`, #ebebeb): Light-canvas dividers, badges.

### Hairlines
- **Hairline** (`{colors.hairline}`, #303030): 1px divider on dark, same hex as `{colors.canvas-elevated}`.
- **Hairline On Light** (`{colors.hairline-on-light}`, #d2d2d2): 1px divider on light bands.
- **Hairline Soft** (`{colors.hairline-soft}`, #ebebeb): Lighter divider.

### Text
- **Ink** (`{colors.ink}`, #ffffff): Display, body emphasis on dark.
- **Body** (`{colors.body}`, #969696): Default running-text on dark.
- **Body Strong** (`{colors.body-strong}`, #ffffff): Same as ink.
- **Body On Light** (`{colors.body-on-light}`, #181818): Default text on light bands.
- **Muted** (`{colors.muted}`, #666666): Sub-titles, captions on dark.
- **Muted Soft** (`{colors.muted-soft}`, #8f8f8f): Disabled link text.
- **On Primary** (`{colors.on-primary}`, #ffffff): White text on Rosso Corsa.

### Semantic
- **Info** (`{colors.semantic-info}`, #4c98b9): Info badges, callout backgrounds.
- **Success** (`{colors.semantic-success}`, #03904a): Confirmation.
- **Warning** (`{colors.semantic-warning}`, #f13a2c): Validation warnings.


---

## 19. Figma: Colors

**Why this stood out:** Oversized, hand-cut pastel color blocks dropped into an otherwise rigorous black-and-white grid feel like sticky notes on a clean desk, playful and technical at once.

> Source pages: figma.com (home), /design/, /figjam/brainstorming-tool/, /pricing/, /contact/.

### Brand & Accent
- **Black** ({colors.primary}): The system primary. Every primary CTA, every headline, every body line, the marquee strip, the inverse canvas of dark sections.
- **White** ({colors.on-primary}): Inverse text on black surfaces; also the canvas color used as the foreground of secondary pill buttons (`{components.button-secondary}`).
- **Magenta Promo** ({colors.accent-magenta}): A single saturated CTA pink reserved for promotional inline buttons, appears, for example, on the lilac "Save your spot" Release Notes banner. Use scarcely; it is not a section color.

### Surface
- **Canvas** ({colors.canvas}): Default page background and the body of every white card.
- **Inverse Canvas** ({colors.inverse-canvas}): Footer, marquee strip, and a subset of "ship products"-style story sections.
- **Surface Soft** ({colors.surface-soft}): Off-white tile background used for icon buttons, template cards, and feature illustration tiles when they sit on the white canvas.
- **Hairline** ({colors.hairline}): 1px borders on form inputs, pricing cards, and table dividers.
- **Hairline Soft** ({colors.hairline-soft}): Even subtler dividers, comparison-table row separators and footer column rules.
- **Block Lime** ({colors.block-lime}): The signature **systems / FAQ / contact-form** color block. Recurs across home, pricing, contact.
- **Block Lilac** ({colors.block-lilac}): Hero block on `/design/`; also the inline Release Notes promo banner.
- **Block Cream** ({colors.block-cream}): Soft warm background, FigJam hero strip, template-grid section.
- **Block Mint** ({colors.block-mint}): FigJam pastel section.
- **Block Pink** ({colors.block-pink}): FigJam pastel section.
- **Block Coral** ({colors.block-coral}): "Ship products" coral story block on home.
- **Block Navy** ({colors.block-navy}): Deep indigo story block, only place dark surfaces appear above the footer.

### Text
- **Ink** ({colors.ink}): All headline, body, and caption type on light surfaces. There is no softer mid-gray text role on marketing, body copy is always black at weight 320–340, and weight (not opacity) carries the hierarchy.
- **Inverse Ink** ({colors.inverse-ink}): Type on inverse-canvas surfaces (footer, marquee strip, navy color block).
- **On-Inverse Soft** ({colors.on-inverse-soft}): White used at ~16% opacity for circular icon-button surfaces against dark sections (token captures the base color; the translucency is applied at render time).

### Semantic
- **Success Green** ({colors.semantic-success}): Comparison-table checkmarks on pricing. Used as a glyph fill, not a surface.
- **Overlay Scrim** ({colors.overlay-scrim}): Black used at ~60% opacity behind modal / video-overlay surfaces (token captures the base; opacity applied at render time).


---

## 20. Framer: Colors

**Why this stood out:** Oversized magenta/violet/orange gradient panels are treated as living showcase tiles rather than decoration, which is a distinctive way to use color as content.

> Source pages: framer.com (home), /ai/, /startups/, /marketplace/templates/nudge/, /gallery/a16z-speedrun-×-tonik, /pricing.

### Brand & Accent
- **Pure White** ({colors.primary}): The brand primary surface. Every primary CTA pill, every display headline, every body line on canvas.
- **Sky Blue** ({colors.accent-blue}): The single chromatic accent. Hyperlinks, focused-input rings, and a few selection states. Never used for backgrounds or as a brand fill.

### Surface
- **Canvas** ({colors.canvas}): Default page background, near-black with a faint warmth. Footer, pricing, hero, and FAQ all sit on it.
- **Surface 1** ({colors.surface-1}): One step above canvas, pricing cards, secondary buttons, mockup tiles.
- **Surface 2** ({colors.surface-2}): Two steps above, featured pricing card, hero pill backdrop, selected pricing tab.
- **Hairline** ({colors.hairline}): 1px borders on input groups, comparison-table dividers.
- **Hairline Soft** ({colors.hairline-soft}): Subtler dividers, between FAQ rows and footer column rules.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure white, used as the surface of light-on-dark pill CTAs and a small set of light-mode template thumbnails embedded in the showcase grid.

### Text
- **Ink** ({colors.ink}): All headline and emphasized body type, pure white.
- **Ink Muted** ({colors.ink-muted}): Secondary type, gray (#999999) used for meta info, footer columns, comparison-row labels, deselected pricing tabs. Hierarchy on the dark canvas is carried by ink → ink-muted contrast, not by weight changes.

### Semantic
- **Success Green** ({colors.semantic-success}): Pricing comparison-table checkmarks. Glyph fill, not surface.

### Brand Gradient (signature)
- **Gradient Magenta** ({colors.gradient-magenta}): Spotlight card variant.
- **Gradient Violet** ({colors.gradient-violet}): Spotlight card variant, most common.
- **Gradient Orange** ({colors.gradient-orange}): Spotlight card variant, sunset wash.
- **Gradient Coral** ({colors.gradient-coral}): Spotlight card variant, coral/pink.

These four sit as oversized atmospheric tiles inside otherwise monochrome card grids, a dark canvas with one or two glowing spotlight cards is a recurring page signature.


---

## 21. HashiCorp: Colors

**Why this stood out:** A per-product accent system (Terraform purple, Vault yellow, Consul pink, Waypoint cyan, Vagrant blue) functions as identity tokens, letting one brand quietly represent five products.

> Source pages: hashicorp.com/en (home), /en/infrastructure-cloud, /en/products/terraform, /en/pricing, /en/resources?contentType=PDF.

### Brand & Accent
- **Black** ({colors.primary}): The system primary surface. Canvas, footer, comparison tables, hero, all black.
- **White** ({colors.on-primary}): Inverse text on black; canvas of `button-primary`.
- **Accent Blue** ({colors.accent-blue}): Hyperlinks across the marketing surface.
- **Visited Purple** ({colors.semantic-visited}): Visited-link state.

### Surface
- **Canvas** ({colors.canvas}): Default page background.
- **Surface 1** ({colors.surface-1}): Charcoal one step above canvas, feature cards, pricing cards, resource tiles.
- **Surface 2** ({colors.surface-2}): Two steps above, featured pricing card, secondary buttons, hovered product chrome.
- **Surface 3** ({colors.surface-3}): Three steps above, small chips, badges, sub-nav backgrounds.
- **Hairline** ({colors.hairline}): 1px borders on cards and dividers.
- **Hairline Soft** ({colors.hairline-soft}): Subtler dividers, comparison-table rows.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure white, used as the surface of `button-primary` only.

### Text
- **Ink** ({colors.ink}): All headline and emphasized body type, pure white.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #b2b6bd, meta info, footer columns.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #656a76, form helper text, timestamps, footnotes.

### Per-Product Identity (signature)
HashiCorp's marketing isn't held together by a single accent color, it's held together by a system of product-specific accents, each used to mark which tool a section represents.

- **Terraform Purple** ({colors.product-terraform}): Terraform sections, terraform CTAs, the violet 3D cube on the home hero.
- **Terraform Bright** ({colors.product-terraform-bright}): Saturated highlight, link emphasis on Terraform pages.
- **Vault Yellow** ({colors.product-vault}): Vault sections and CTAs.
- **Consul Red** ({colors.product-consul}): Consul sections.
- **Waypoint Cyan** ({colors.product-waypoint}): Waypoint sections, deep variant `{colors.product-waypoint-deep}` for hover/active.
- **Vagrant Blue** ({colors.product-vagrant}): Vagrant sections.
- **Nomad Green** ({colors.product-nomad}): Nomad sections.
- **Boundary Coral** ({colors.product-boundary}): Boundary sections.

### Semantic
- **Success** ({colors.semantic-success}): Positive states (also reused as Nomad green).
- **Warning** ({colors.semantic-warning}): Warning states (also Vault yellow).
- **Error** ({colors.semantic-error}): Error states (also Consul red).
- **Amber 100** ({colors.amber-100}): Soft warm highlight, extracted but used sparingly.
- **Amber 200** ({colors.amber-200}): Saturated amber for caution badges.
- **Blue 7** ({colors.blue-7}): Deep navy used in unified-core gradients.


---

## 22. IBM: Typography

**Why this stood out:** IBM Plex Sans at light weight 300 for display sizes is the signature, light weight at large sizes is a genuinely counterintuitive choice for enterprise gravitas.

### Font Family

- **IBM Plex Sans**, IBM's open-source proprietary typeface (free for any use). Geometric, slightly humanist, designed specifically for enterprise UI. Fallback: `Helvetica Neue, Arial, sans-serif`.

The same family carries display, body, and caption, there is no display + body pairing. Hierarchy is carried by **size + weight** rather than by family change. Plex Sans is also free / open-source under the SIL Open Font License, making it the easiest custom face on this list to substitute for in implementation.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 76px | 300 | 1.17 | -0.5px | Largest hero headline |
| `{typography.display-lg}` | 60px | 300 | 1.17 | -0.4px | Section opener headlines |
| `{typography.display-md}` | 42px | 300 | 1.20 | 0 | Sub-section headlines, hero card title |
| `{typography.headline}` | 32px | 400 | 1.25 | 0 | Card collection heading, FAQ category |
| `{typography.card-title}` | 24px | 400 | 1.33 | 0 | Feature card title |
| `{typography.subhead}` | 20px | 400 | 1.40 | 0 | Lead body next to display headlines |
| `{typography.body-lg}` | 18px | 400 | 1.50 | 0 | Hero subhead, lead paragraphs |
| `{typography.body}` | 16px | 400 | 1.50 | 0.16px | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.29 | 0.16px | Card body, footer columns |
| `{typography.body-emphasis}` | 14px | 600 | 1.29 | 0.16px | Selected tab label, emphasized body line |
| `{typography.caption}` | 12px | 400 | 1.33 | 0.32px | Captions, meta, utility bar |
| `{typography.button}` | 14px | 400 | 1.29 | 0.16px | All button labels |
| `{typography.eyebrow}` | 14px | 400 | 1.29 | 0.16px | Section eyebrows (Carbon avoids strong eyebrows; uses sentence case 14px) |

### Principles

- **Light-weight display is the brand voice.** Plex Sans at weight 300 for 76px headlines reads as quietly authoritative, switching to 700 would make it look like every other enterprise site.
- **Carbon's `letter-spacing: 0.16px`** on body sizes is a precision detail. Don't remove it.
- **No mono** on marketing surfaces (Plex Mono exists but lives in product surfaces only).
- **Eyebrow typography uses sentence case 14px**, Carbon resists the all-caps tracked eyebrow common to other enterprise brands.
- **Line-heights tighten on display, relax on body**: 1.17 at display-xl, 1.50 at body, proportional to size.

### Note on Font Substitutes

IBM Plex Sans is **free and open-source** (SIL OFL license) and available on Google Fonts. It is the recommended implementation. The Plex family also includes Plex Mono and Plex Serif if expanded typographic needs arise.


---

## 23. Intercom: Colors

**Why this stood out:** Fin Orange is reserved exclusively for the Fin AI sub-brand, making one color do double duty as both accent and product-line signal.

> Source pages: intercom.com (home), /pricing, /helpdesk, /customers, /helpdesk/inbox.

### Brand & Accent
- **Charcoal** ({colors.ink}): The system primary surface. Headlines, body type, primary CTA pill background, all charcoal.
- **White** ({colors.on-primary}): Text on charcoal CTAs; canvas of floating cards.
- **Fin Orange** ({colors.fin-orange}): The AI-product accent. Used on the Fin CTA, Fin badge, and a small set of inline emphasis moments.
- **Report Orange** ({colors.report-orange}): A slightly different orange used inside the report / analytics palette for in-product mockups.
- **Brand Blue** ({colors.brand-blue}): Saturated brand blue (#0007cb), used on a small set of marketing illustrations.

### Surface
- **Canvas** ({colors.canvas}): Default page background, soft cream-white #f5f1ec.
- **Surface 1** ({colors.surface-1}): Pure white, used for floating cards (pricing, feature, product-mockup).
- **Surface 2** ({colors.surface-2}): Slightly darker cream, startup-discount banner, alt-row stripes.
- **Hairline** ({colors.hairline}): 1px borders on cards, soft warm gray (#d3cec6).
- **Hairline Soft** ({colors.hairline-soft}): Even softer dividers between FAQ rows and footer columns.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure black, only on the testimonial / quote callout strip.
- **Inverse Surface 1** ({colors.inverse-surface-1}): One step lighter, hovered footer items in dark contexts.

### Text
- **Ink** ({colors.ink}): All headlines, body type, button labels, charcoal #111111.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #626260, meta info, deselected pricing tabs.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #7b7b78, footer columns, helper text.
- **Ink Tertiary** ({colors.ink-tertiary}): Quaternary type at #9c9fa5, disabled, footnotes.
- **Inverse Ink** ({colors.inverse-ink}): White on black, quote-strip type.
- **Inverse Ink Muted** ({colors.inverse-ink-muted}): Light gray on black, quote-strip meta.

### Semantic & Report Palette (in-product mockups)
- **Error Red** ({colors.semantic-error}): Form validation, destructive states.
- **Success Green** ({colors.semantic-success}): Positive states (also `{colors.report-green}`).
- **Report Blue** ({colors.report-blue}): Analytics chart blue.
- **Report Pink** ({colors.report-pink}): Analytics chart pink.
- **Report Lime** ({colors.report-lime}): Analytics chart lime.
- **Report Cyan** ({colors.report-cyan}): Phone country selector accent.

The report palette appears INSIDE product UI mockups, these are Intercom's in-product chart colors, not marketing surface colors.


---

## 24. Linear: Colors

**Why this stood out:** #010102 is the deepest dark surface in the entire 50-brand set, paired with a single lavender-blue accent used only on the mark, focus rings, and a few intentional CTAs.

> Source pages: linear.app (home), /intake, /pricing, /contact/sales, /build.

### Brand & Accent
- **Lavender-Blue** ({colors.primary}): The signature Linear accent, primary CTA, brand mark, link emphasis.
- **Lavender Hover** ({colors.primary-hover}): Lighter lavender (#828fff), hovered state of the primary CTA.
- **Lavender Focus** ({colors.primary-focus}): Focus-ring tint (#5e69d1), focused inputs, focused buttons.
- **Brand Secure** ({colors.brand-secure}): Muted lavender-gray (#7a7fad), used in "Linear Security" surfaces.

### Surface
- **Canvas** ({colors.canvas}): Default page background, #010102, near-pure black with a faint blue tint.
- **Surface 1** ({colors.surface-1}): One step above canvas, feature cards, pricing cards, product screenshot panels.
- **Surface 2** ({colors.surface-2}): Two steps above, featured pricing card, hovered cards.
- **Surface 3** ({colors.surface-3}): Three steps above, line-tertiary backgrounds, sub-nav.
- **Surface 4** ({colors.surface-4}): Four steps above, bg-level-3, deepest lifted surface.
- **Hairline** ({colors.hairline}): 1px borders on cards and dividers.
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px borders, input focus rings.
- **Hairline Tertiary** ({colors.hairline-tertiary}): Tertiary borders for nested surfaces.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure white, surface of the inverse pill CTA on a small set of section openers.
- **Inverse Surface 1** ({colors.inverse-surface-1}): One step above inverse canvas.
- **Inverse Surface 2** ({colors.inverse-surface-2}): Two steps above inverse canvas.

### Text
- **Ink** ({colors.ink}): All headlines and emphasized body type, light gray #f7f8f8.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #d0d6e0, meta info on hero panels.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #8a8f98, deselected pricing tabs, footer columns.
- **Ink Tertiary** ({colors.ink-tertiary}): Quaternary at #62666d, disabled, footnotes.

### Semantic
- **Success Green** ({colors.semantic-success}): Status pills, success indicators. The only semantic color on marketing.
- **Overlay** ({colors.semantic-overlay}): Pure black overlay scrim for modals.


---

## 25. MongoDB: Colors

**Why this stood out:** The signature green pill button has to carry brand identity across two totally different modes: dark-teal hero bands and stark white documentation.

> Source pages: mongodb.com/ (homepage), /products/platform/atlas-database (Atlas product), /products/self-managed/community-edition, learn.mongodb.com/ (MongoDB University), /solutions/use-cases/artificial-intelligence (AI), /pricing (3-tier comparison). Token coverage was identical across all six pages.

### Brand & Accent
- **MongoDB Green** ({colors.brand-green}): The brand's most recognizable signal, bright pill-CTA color
- **Green Dark** ({colors.brand-green-dark}): Inline link color, secondary green
- **Green Mid** ({colors.brand-green-mid}): Mid-spectrum green for atmospheric tints
- **Green Soft** ({colors.brand-green-soft}): Pale-mint background tint for success badges and featured pricing tier
- **Brand Teal Deep** ({colors.brand-teal-deep}): Deep navy-teal for hero bands, footer
- **Brand Teal** ({colors.brand-teal}): Mid-spectrum teal
- **Brand Teal Mid** ({colors.brand-teal-mid}): Lighter teal for hero platform cards

### Category Accent (Course Tags)
- **Accent Purple** ({colors.accent-purple}): Course tag for "Database & Security"
- **Accent Orange** ({colors.accent-orange}): Course tag for "Search"
- **Accent Pink** ({colors.accent-pink}): Course tag variant
- **Accent Blue** ({colors.accent-blue}): Course tag variant for atlas/cloud topics

### Surface
- **Canvas White** ({colors.canvas}): Page background and primary card surface
- **Canvas Dark** ({colors.canvas-dark}): Code-block backgrounds, dark mockup canvas
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions
- **Surface Feature** ({colors.surface-feature}): Pale mint background for featured pricing tier
- **Hairline** ({colors.hairline}): 1px borders and primary dividers
- **Hairline Soft** ({colors.hairline-soft}): Quieter dividers
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px border for inputs
- **Hairline Dark** ({colors.hairline-dark}): Border on dark surfaces

### Text
- **Ink** ({colors.ink}): Primary headlines and body text (deep navy-teal)
- **Charcoal** ({colors.charcoal}): Body emphasis
- **Slate** ({colors.slate}): Secondary text
- **Steel** ({colors.steel}): Tertiary text, captions
- **Stone** ({colors.stone}): Muted labels
- **Muted** ({colors.muted}): Disabled, placeholders
- **On Dark** ({colors.on-dark}): White text on dark surfaces
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white

### Semantic
- **Warning Background** ({colors.semantic-warning-bg}): Pale yellow callout bg
- **Warning Text** ({colors.semantic-warning-text}): Warning state copy color


---

## 26. Meta: Shapes

**Why this stood out:** 100px-radius pill buttons paired with 24-32px card rounding give hardware commerce pages an unusually soft, consumer-friendly geometry.

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 2px | Inline checkbox marks, fine UI corners |
| `{rounded.sm}` | 4px | Tags, micro-controls |
| `{rounded.md}` | 6px | Square thumbnail rounding |
| `{rounded.lg}` | 8px | Form inputs, radio-option containers |
| `{rounded.xl}` | 16px | Standard feature cards, FAQ accordion items |
| `{rounded.xxl}` | 24px | Warranty / accessory tiles, ghost-style action cards |
| `{rounded.xxxl}` | 32px | Photographic feature cards, big promo strips |
| `{rounded.feature}` | 40px | Accessory hero panels, "Built for prescriptions" cards |
| `{rounded.full}` | 100px | Pill buttons, tab chips, badges |
| `{rounded.circle}` | 50% | Color swatches, circular icon buttons |

### Photography Geometry
- Product hero photography sits in `{rounded.xxxl}` (32px) frames more often than rectangles.
- Color/material swatches are perfect circles (`{rounded.circle}`, 32px diameter, 2px white border ring when selected).
- Square product thumbnails (`aspect-ratio: 1/1`) use `{rounded.xl}` rounding.
- Six-up "color & SKU" picker rows use 1:1 aspect tiles with `{rounded.lg}` (8px) corners, tighter than the hero photography frames to differentiate selection-grid context from showcase context.


---

## 27. MiniMax: Colors

**Why this stood out:** Each model release gets its own vibrant gradient card (orange-red, magenta-pink, purple, blue), turning color into a versioning system rather than a fixed palette.

> Source pages: minimax.io/ (homepage), /models/text/m27 (product showcase), platform.minimax.io/docs/guides/models-intro (documentation), /subscribe/token-plan (pricing). Token coverage was identical across all four pages.

### Brand & Accent
- **Brand Coral** ({colors.brand-coral}): Signature high-impact accent. Used on M2.7 product card, "Token Plan" hero band, promo CTA strips, and "NEW" badges. Carries the brand's most attention-grabbing energy.
- **Brand Magenta** ({colors.brand-magenta}): Secondary product-card identity (Music 2.6); used for music/audio product encoding.
- **Brand Blue** ({colors.brand-blue}): Hailuo video product identity; primary blue accent across the system.
- **Brand Blue Deep** ({colors.brand-blue-deep}): Form-control activation, link emphasis.
- **Brand Blue 700** ({colors.brand-blue-700}): Documentation tag and reference text color.
- **Brand Cyan** ({colors.brand-cyan}): Atmospheric blue for product gradients and decorative wash.
- **Brand Blue 200** ({colors.brand-blue-200}): Code badges, info-tag backgrounds.
- **Brand Purple** ({colors.brand-purple}): Speech 2.8 and minor purple-product identity; gradient mate for magenta cards.

### Surface
- **Canvas White** ({colors.canvas}): Primary page background and card surface.
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest, sidebar-nav active state.
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions.
- **Hairline** ({colors.hairline}): 1px input border and primary divider.
- **Hairline Soft** ({colors.hairline-soft}): Quieter table-row divider and secondary section break.

### Text
- **Ink** ({colors.ink}): Primary headline and CTA text, the brand's near-black anchor.
- **Ink Strong** ({colors.ink-strong}): Pure black used in promo banners and hero displays for maximum contrast.
- **Charcoal** ({colors.charcoal}): Body text on light surfaces.
- **Slate** ({colors.slate}): Secondary text, metadata.
- **Steel** ({colors.steel}): Tertiary text, table headers, sidebar inactive items.
- **Stone** ({colors.stone}): Muted captions and tab inactive labels.
- **Muted** ({colors.muted}): Footer link text and de-emphasized labels.

### Semantic
- **Success Background** ({colors.success-bg}): Pale-green wash for success badges and confirmations.
- **Success Text** ({colors.success-text}): Deep-green ink for success badge labels.
- Error tones derive from a `#d45656` red used in input border error states (not extracted as a top-level system token).


---

## 28. Mintlify: Colors

**Why this stood out:** Atmospheric sky-gradient cloud washes on marketing pages contrast sharply with the dense, flat documentation surfaces underneath, two moods from one palette.

> Source pages: mintlify.com/ (homepage), /startups (program page), /pricing (comparison), /docs/components/tabs (live documentation). Token coverage was identical across all four pages.

### Brand & Accent
- **Mintlify Mint** ({colors.brand-green}): Signature accent, used on hero "Get started" pill button, green checkmarks in feature lists, featured pricing tier border accent, sidebar active indicator dots.
- **Deep Mint** ({colors.brand-green-deep}): Pressed/active variant of the mint accent.
- **Soft Mint** ({colors.brand-green-soft}): Subtle background tint for success states and confirmation surfaces.
- **Brand Tag** ({colors.brand-tag}): Documentation tag and reference color (used in `<Tabs>` JSX-style annotations and code-tag chips).
- **Brand Annotate** ({colors.brand-annotate}): Inline code annotation green (used in twoslash code annotation system).
- **Brand Warn** ({colors.brand-warn}): Code warning highlight (deprecated, caution).
- **Brand Error** ({colors.brand-error}): Red used for required-field labels and error highlight.
- **Testimonial Orange** ({colors.testimonial-orange}): Warm coral-orange used on the "Cursor" testimonial card and warm callout surfaces.

### Surface
- **Canvas White** ({colors.canvas}): Primary page and card background.
- **Canvas Dark** ({colors.canvas-dark}): Promo banner, dark inversion surfaces, code editor wrapper.
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest, code-inline background, sidebar active state.
- **Surface Soft** ({colors.surface-soft}): Quieter section backgrounds and FAQ accordion.
- **Surface Code** ({colors.surface-code}): Dark code-block wrapper background.
- **Hairline** ({colors.hairline}): 1px borders and primary dividers.
- **Hairline Soft** ({colors.hairline-soft}): Quieter table-row dividers and secondary section breaks.

### Hero Atmospheric
- **Hero Sky From / To** ({colors.hero-sky-from}, {colors.hero-sky-to}): Atmospheric sky-blue to soft cream gradient on the homepage hero.
- **Hero Dark From / To** ({colors.hero-dark-from}, {colors.hero-dark-to}): Dark teal to mint gradient on the startups hero.

### Text
- **Ink** ({colors.ink}): Primary headlines and CTA text.
- **Charcoal** ({colors.charcoal}): Body text, code-inline foreground.
- **Slate** ({colors.slate}): Secondary text and metadata.
- **Steel** ({colors.steel}): Tertiary text, table headers, sidebar inactive items, footer links.
- **Stone** ({colors.stone}): Captions, twoslash cursor color, muted labels.
- **Muted** ({colors.muted}): De-emphasized labels and disabled text.
- **On Dark** ({colors.on-dark}): White text on dark surfaces (hero bands, code blocks, promo banner).
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white for code-block headers and metadata on dark.

### Semantic
- Error tones derive from `{colors.brand-error}` for input borders, required-field labels, and validation messaging.


---

## 29. Miro: Colors

**Why this stood out:** The pastel feature tints (rose, teal, coral, orange, mint) literally echo the real sticky-note colors used on the live whiteboard product, brand and product are the same palette.

> Source pages: miro.com/ (homepage), /pricing/ (4-tier comparison), /products/ai-workflows/ (AI product), /agile/ (vertical landing), /customers/ (story directory). Token coverage was identical across all five pages.

### Brand & Accent
- **Miro Yellow** ({colors.brand-yellow}): The brand's recognizable canary yellow, wordmark color, top promo banner, "yellow tag" pills
- **Yellow Deep** ({colors.brand-yellow-deep}): Darker variant for hover states and emphasis
- **Yellow Light** ({colors.yellow-light}): Pale yellow background tint for tag chips
- **Yellow Dark** ({colors.yellow-dark}): Yellow-tag text color (dark olive) for chip foreground
- **Brand Blue** ({colors.brand-blue}): Action blue for inline links and featured-pricing-tier border
- **Blue Pressed** ({colors.blue-pressed}): Pressed-state blue
- **Brand Coral** ({colors.brand-coral}): Coral accent for warm callouts
- **Coral Light** ({colors.coral-light}): Pale coral for feature card backgrounds
- **Coral Dark** ({colors.coral-dark}): Coral-tag text color (deep wine)
- **Brand Rose** ({colors.brand-rose}): Soft rose-pink for feature card variants
- **Brand Teal** ({colors.brand-teal}): Brand teal
- **Teal Light** ({colors.teal-light}): Pale teal for feature card backgrounds
- **Moss Dark** ({colors.moss-dark}): Deep teal-green text color
- **Brand Pink** ({colors.brand-pink}): Pale pink for soft callouts
- **Brand Orange Light** ({colors.brand-orange-light}): Soft orange for feature card backgrounds

### Surface
- **Canvas White** ({colors.canvas}): Page background and primary card surface
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions
- **Surface Yellow** ({colors.surface-yellow}): Pale yellow-tinted surface for tag chip
- **Surface Pricing Featured** ({colors.surface-pricing-featured}): Pale lavender for featured pricing tier
- **Hairline** ({colors.hairline}): 1px borders and primary dividers
- **Hairline Soft** ({colors.hairline-soft}): Quieter table-row dividers
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px border for inputs

### Text
- **Ink Deep** ({colors.ink-deep}): Headlines on lighter feature cards
- **Ink** ({colors.ink}): Primary headlines and body text
- **Charcoal** ({colors.charcoal}): Body emphasis text
- **Slate** ({colors.slate}): Secondary text, metadata
- **Steel** ({colors.steel}): Tertiary text, footer links
- **Stone** ({colors.stone}): Captions, muted labels
- **Muted** ({colors.muted}): Disabled labels, input placeholders
- **On Dark** ({colors.on-dark}): White text on dark surfaces
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white on dark

### Semantic
- **Success Accent** ({colors.success-accent}): Confirmation/success indicator green
- **Brand Red** ({colors.brand-red}): Soft red for error backgrounds
- **Brand Red Dark** ({colors.brand-red-dark}): Stronger red for error borders


---

## 30. Mistral AI: Components

**Why this stood out:** A horizontal sunset-gradient stripe that closes every single page is an unusually consistent structural signature to hang an entire brand on.

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`**, Saturated-orange primary CTA, the dominant action.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.
- Pressed state `button-primary-pressed` deepens to `{colors.primary-deep}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background and `{colors.muted}` text.

**`button-cream`**, Warm cream-yellow secondary action, common on cream-surface sections.
- Background `{colors.cream}`, text `{colors.ink}`, border `1px solid {colors.beige-deep}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.

**`button-dark`**, Dark/black primary CTA on cream surfaces.
- Background `{colors.ink}`, text `{colors.on-dark}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.

**`button-secondary`**, Outlined secondary action.
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.

**`button-on-cream`**, White button on cream-tinted backgrounds.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.beige-deep}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.

**`button-link`**, Inline orange text link.
- Background transparent, text `{colors.primary}`, typography `{typography.body-sm-medium}`, padding `0`. Underline on activation.

### Cards & Containers

**`card-base`**, Standard content card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`card-feature`**, White feature card with larger padding.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid `{colors.hairline-soft}`.

**`card-cream`**, Warm cream-yellow feature card (services tiers, perk callouts).
- Background `{colors.cream}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.beige-deep}`.

**`card-cream-soft`**, Lighter cream variant.
- Background `{colors.surface-cream-soft}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-feature-product`**, Product showcase card with subtle elevation.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`, shadow `rgba(0, 0, 0, 0.04) 0px 4px 12px`.

**`card-photographic`**, Photographic product card with dark background.
- Background `{colors.surface-code}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `0` (image fills the card).

**`pricing-card`**, Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`.

**`pricing-card-featured`**, Featured pricing tier (cream background + orange border).
- Background `{colors.cream}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `2px solid {colors.primary}`.

### Inputs & Forms

**`text-input`**, Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px.

**`text-input-focused`**, Activated state.
- Border switches to `2px solid {colors.primary}`.

**`text-area`**, Multi-line text area for contact form.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`contact-form-panel`**, Cream-tinted form container on the contact page.
- Background `{colors.cream}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.beige-deep}`. Hosts text-inputs, text-area, submit `button-dark`.

### Tabs

**`pill-tab`** + **`pill-tab-active`**, Pill-style tab nav (used sparingly on product pages).
- Inactive: background `{colors.canvas}`, text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.ink}`, text `{colors.on-dark}`.

**`segmented-tab`** + **`segmented-tab-active`**, Underline-style tab navigation.
- Inactive: text `{colors.steel}`, transparent background, padding `{spacing.sm} {spacing.md}`, no bottom border.
- Active: text `{colors.primary}`, 2px bottom border in `{colors.primary}`.

### Badges & Status

**`badge-orange`**, Saturated orange badge.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-cream`**, Cream-tinted tag chip.
- Background `{colors.cream-deeper}`, text `{colors.ink}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-dark`**, Dark/black status badge.
- Background `{colors.ink}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`promo-banner`**, Sticky black promo strip ABOVE the top nav.
- Background `{colors.ink}`, text `{colors.on-dark}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`. Carries one-line copy + inline CTA.

### Code

**`code-block`**, Syntax-highlighted IDE-style code block (Le Studio page mockup, agent demos).
- Background `{colors.surface-code}`, text `{colors.on-dark}`, typography `{typography.code-md}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`code-block-header`**, Header bar above the code block.
- Background `{colors.surface-code}`, text `{colors.on-dark-muted}`, typography `{typography.caption}`, padding `{spacing.xs} {spacing.md}`, bottom border `1px solid rgba(255,255,255,0.08)`.

### Documentation Components

**`feature-icon-tile`**, Cream-yellow feature icon callout.
- Background `{colors.cream}`, rounded `{rounded.md}`, padding `{spacing.md}`, border `1px solid {colors.beige-deep}`.

**`industry-tile`**, Industry-vertical tile in solutions page grid.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`stat-cell`**, Stat-row cell ("75% more / 80% better").
- Background transparent, text `{colors.ink}`, typography `{typography.stat-display}`, padding `{spacing.lg}`.

**`customer-testimonial-card`**, Customer quote card (used inside Le Studio and Solutions pages).
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`. Quote in `{typography.body-md}`, attribution in `{typography.body-sm}` `{colors.steel}`.

**`logo-wall-item`**, Customer logo wordmark cell.
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.

**`faq-accordion-item`**, FAQ panel.
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, bottom border `1px solid {colors.hairline}`.

**`app-store-badge`**, App Store / Google Play download badge.
- Background `{colors.ink}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`.

### Navigation

**Top Navigation (Marketing)**, Sticky white bar.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline-soft}`.
- Left: Mistral M-mark logo + "MISTRAL AI_" wordmark + horizontal link list (Products, Solutions, Research, Blog, Customers, Company).
- Right: "Contact Sales" link + black-pill "Try Studio" CTA.

### Signature Components

**`hero-band-sunset`**, Atmospheric sunset hero band.
- Background gradient `linear-gradient(135deg, {colors.sunshine-700} 0%, {colors.sunshine-900} 60%, {colors.primary} 100%)` overlaid on photographic mountain landscape.
- Layout: hero headline left in `{typography.hero-display}` ({colors.ink}), subtitle in `{typography.subtitle}` ({colors.ink-tint}), button row (`button-dark` + `button-secondary`), atmospheric mountain photography right.

**`sunset-stripe-band`**, Horizontal closing band at the foot of every page.
- Multi-stop gradient: `{colors.primary}` → `{colors.sunshine-700}` → `{colors.sunshine-500}` → `{colors.yellow-saturated}` → `{colors.cream}`.
- Padding `{spacing.lg} 0`. Spans full width, sits above the footer. THIS IS THE BRAND'S MOST RECOGNIZABLE SIGNATURE ELEMENT.

**`cta-banner-cream`**, Page-bottom CTA band on cream surface.
- Background `{colors.cream}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.section}`. "The next chapter of AI is yours." headline in `{typography.heading-1}` (PP Editorial Old), button row below.

**`footer-region`**, Cream-tinted multi-column footer.
- Background `{colors.footer-cream}`, padding `{spacing.section} {spacing.xxl}`.
- 5-column link grid (Why Mistral / Explore / Build / Legal + brand mark column).
- Bottom: language picker + social icons.

**`footer-link`**, Individual footer link.
- Background transparent, text `{colors.primary}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.


---

## 31. Nike: Typography

**Why this stood out:** Towering uppercase Futura lockups burned directly into campaign photography is about as confident as display typography gets.

### Font Family
- **Nike Futura ND** (display campaign only), proprietary geometric sans for the towering uppercase headlines burned into campaign hero photography. Falls back to Helvetica Now Text Medium → Helvetica → Arial.
- **Helvetica Now Display Medium** (headings 16–32px), modern Helvetica cut tuned for display sizes; carries every section title, PDP product name, and dialog headline.
- **Helvetica Now Text Medium** (UI 12–16px), buttons, captions, swatch labels, badge text. The system's UI workhorse.
- **Helvetica Now Text** (body and links), long-form body and underlined inline links.
- **Neue Frutiger Arabic**, RTL pairing for Arabic locales at `{typography.heading-lg}` and caption sizes.
- **Helvetica Neue 9px**, legal-fine-print utility row only (`{typography.utility-xs}`).

When substituting on systems without proprietary Nike fonts: pair **Inter** (Display 700 for body chrome, Display 500 for buttons) with **Bebas Neue** or **Anton** at 96px/0.9 line-height for the campaign headline tier. Tighten letter-spacing slightly (-0.5%) on the substitute to approximate Futura ND's optical weight.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-campaign}` | 96px | 500 | 0.9 | 0 | Editorial campaign headline burned into hero photography (uppercase) |
| `{typography.heading-xl}` | 32px | 500 | 1.2 | 0 | Section headers, "FEATURED FOOTWEAR", "LATEST IN CLOTHING", PDP product title block |
| `{typography.heading-lg}` | 24px | 500 | 1.2 | 0 | Subsection / member-benefit card title, large CTA label, PDP price |
| `{typography.heading-md}` | 16px | 500 | 1.75 | 0 | Card title, FAQ row label, filter group header |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Body copy, search-pill placeholder, product description |
| `{typography.body-strong}` | 16px | 500 | 1.5 | 0 | Product card name, filter row label, primary nav link |
| `{typography.button-lg}` | 24px | 500 | 1.2 | 0 | Pressed-letter campaign CTA inside hero blocks |
| `{typography.button-md}` | 16px | 500 | 1.5 | 0 | Standard pill CTAs across the system |
| `{typography.button-sm}` | 14px | 500 | 1.5 | 0 | Compact pill CTA, badge label, geo-selector button |
| `{typography.link-md}` | 16px | 500 | 1.75 | 0 | Underlined inline link, "View Product Details" |
| `{typography.caption-md}` | 14px | 500 | 1.5 | 0 | Product subtitle ("Men's Trail Running Shoes"), filter count, footer link |
| `{typography.caption-sm}` | 12px | 500 | 1.5 | 0 | Filter chip label, badge text, color count |
| `{typography.utility-xs}` | 9px | 500 | 1.75 | 0 | Legal copyright / fine-print row at the very bottom |

### Principles
The system runs on extreme typographic contrast: a single 96px uppercase display tier reserved for editorial campaign moments, and a quiet 12–16px Helvetica Now Text/Medium tier carrying everything else. There is almost no middle ground, the jump from `{typography.heading-xl}` (32px) directly to `{typography.body-strong}` (16px) is intentional and creates the "billboard above, catalog below" effect across every page. Letter-spacing is left at 0 (Futura ND and Helvetica Now are both cut for tight optical fit at scale).

### Note on Font Substitutes
The closest open-source path to Nike's display tier is **Bebas Neue** (free, geometric condensed) at 96px / 0.9 / uppercase / 500. For UI text, **Inter** is the safest substitute, match weights 400/500 and the system reads almost identically at button and caption sizes.


---

## 32. Notion: Components

**Why this stood out:** Showing the actual live workspace UI directly inside the hero band, dotted with real sticky-note colors, blurs the line between marketing and product screenshot.

> Per the no-hover policy, hover states are NOT documented.

### Buttons

**`button-primary`**, Signature purple rectangular primary CTA, the dominant action.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.
- Pressed state `button-primary-pressed` deepens to `{colors.primary-pressed}`.
- Disabled state uses `{colors.hairline}` background.

**`button-dark`**, Black rectangular CTA on light backgrounds.
- Background `{colors.ink-deep}`, text `{colors.on-dark}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.

**`button-secondary`**, Outlined rectangular for secondary actions ("Request a demo").
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.

**`button-on-dark`**, White button on dark hero bands.
- Background `{colors.on-dark}`, text `{colors.ink}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.

**`button-secondary-on-dark`**, Outlined button on dark.
- Background transparent, text `{colors.on-dark}`, border `1px solid {colors.on-dark-muted}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.

**`button-ghost`**, Quieter ghost button.
- Background transparent, text `{colors.ink}`, typography `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.sm}`.

**`button-link`**, Inline blue text link (NOT primary purple).
- Background transparent, text `{colors.link-blue}`, typography `{typography.body-sm-medium}`, padding `0`.

### Cards & Containers

**`card-base`**, Standard content card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-feature`**, Feature card with larger padding.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`card-feature-yellow-bold`**, Bold yellow feature banner for high-emphasis content ("Ask your on-demand assistants").
- Background `{colors.card-tint-yellow-bold}`, text `{colors.charcoal}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-feature-peach`** + **`card-feature-rose`** + **`card-feature-mint`** + **`card-feature-sky`** + **`card-feature-lavender`** + **`card-feature-yellow`** + **`card-feature-cream`**, Pastel-tinted feature cards.
- Each variant uses its corresponding `card-tint-*` color as background, text `{colors.charcoal}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-agent-tile`**, Agent assistant tile.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-template`**, Template thumbnail card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.lg}`, border `1px solid {colors.hairline}`.

**`card-startup-perk`**, Startup-program perk grid item.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`pricing-card`**, Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`pricing-card-featured`**, Featured pricing tier (Plus or Business, purple-bordered).
- Background `{colors.surface}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `2px solid {colors.primary}`.

### Inputs & Forms

**`text-input`**, Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px.

**`text-input-focused`**, Activated state.
- Border switches to `2px solid {colors.primary}` (purple).

**`search-pill`**, Search bar.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-md}`, rounded `{rounded.md}`, height 44px, border `1px solid {colors.hairline}`.

### Tabs

**`pill-tab`** + **`pill-tab-active`**, Pill-style tab nav for top-level switching.
- Inactive: text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.ink-deep}`, text `{colors.on-dark}`.

**`segmented-tab`** + **`segmented-tab-active`**, Underline-style tab navigation.
- Inactive: text `{colors.steel}`, no border. Active: text `{colors.ink}`, 2px bottom border in `{colors.ink}`.

### Badges & Status

**`badge-purple`**, Purple status badge (matches primary CTA).
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-pink`**, Pink accent badge.
- Background `{colors.brand-pink}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-orange`**, Orange accent badge.
- Background `{colors.brand-orange}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-tag-purple`**, Soft-purple feature tag chip.
- Background `{colors.card-tint-lavender}`, text `{colors.brand-purple-800}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-tag-orange`**, Soft-orange feature tag.
- Background `{colors.card-tint-peach}`, text `{colors.brand-orange-deep}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-tag-green`**, Soft-mint feature tag.
- Background `{colors.card-tint-mint}`, text `{colors.brand-green}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-popular`**, "Most Popular" tier indicator.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`promo-banner`**, Light surface promo strip ABOVE the top nav.
- Background `{colors.surface}`, text `{colors.ink}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`. ("Developers: Get a first look at our new Developer Platform on May 13.")

### Tables

**`comparison-table`**, Pricing feature comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`comparison-row`**, Individual feature row.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.lg}`, bottom border `1px solid {colors.hairline-soft}`.

### Documentation Components

**`workspace-mockup-card`**, Embedded Notion workspace UI mockup on hero band ("Ramp HQ" kanban board).
- Background `{colors.canvas}`, rounded `{rounded.lg}`, border `1px solid {colors.hairline}`, deep shadow `rgba(15, 15, 15, 0.20) 0px 24px 48px -8px`. Carries actual Notion product UI mock.

**`testimonial-card`**, Customer testimonial card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`logo-wall-item`**, Customer logo wordmark cell.
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.

**`faq-accordion-item`**, FAQ panel.
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, bottom border `1px solid {colors.hairline}`.

**`stat-row`**, Stats strip with bar chart visualization ("More productivity. Fewer tools.").
- Background `{colors.surface}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.section-sm}`.

**`cta-banner-light`**, Light surface CTA banner.
- Background `{colors.surface}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.section}`.

### Navigation

**Top Navigation (Marketing)**, Sticky white bar.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline}`.
- Left: Notion "N" logo + "Product / AI / Solutions / Resources / Enterprise / Pricing / Request a demo" links.
- Right: "Get Notion free" purple button + "Log in" link.

### Signature Components

**`hero-band-dark`**, Deep navy hero band with embedded workspace mockup and decorative dots/wires.
- Background `{colors.brand-navy}`, text `{colors.on-dark}`, padding `{spacing.hero}`.
- Layout: centered headline `{typography.hero-display}`, subtitle, button row (`button-primary` purple + `button-secondary-on-dark`), `workspace-mockup-card` below.
- Atmospheric decoration: scattered colorful sticky-note dots and mesh wire illustrations around the hero content (NOT a literal pattern fill, handled per-page via SVG/illustration).

**`footer-region`**, Multi-column light footer.
- Background `{colors.canvas}`, padding `{spacing.section} {spacing.xxl}`, top border `1px solid {colors.hairline}`.
- 6-column link grid (Product / Download / Resources / Notion for / Company / Legal).

**`footer-link`**, Individual footer link.
- Background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.


---

## 33. NVIDIA: Shapes

**Why this stood out:** A strict 2px radius across every single surface is a deliberately angular, almost aggressive geometry choice most tech brands soften.

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero chapter, footer, dark CTA strips, primary nav |
| `{rounded.xs}` | 1px | Decorative micro-rules and inset accent strips |
| `{rounded.sm}` | 2px | Every interactive element, buttons, cards, inputs, pill tabs, badges |
| `{rounded.full}` | 9999px / 50% | Avatar circles, social-icon dots, brand wordmark icon |

The system is aggressively angular. Outside of avatar/icon circles, no element exceeds 2px radius. The 2px is enough to soften the optical aliasing on a sharp edge but small enough that the system reads as engineering-grade rather than consumer-friendly.

### Photography Geometry
- **Hero imagery:** full-bleed 16:9 (desktop) cropping to 4:5 portrait on mobile.
- **Card imagery:** 16:9 thumbnail at the top of resource cards; 1:1 square for product/SKU cards; 3:2 for editorial article cards.
- **Decorative corner squares:** 12×12px on standard cards, scaled to 16×16 on hero callouts.
- **Avatar/social icons:** 32–40px circles with 1px hairline.


---

## 34. Ollama: Components

**Why this stood out:** A hand-drawn llama mascot is the only ornamental element in an otherwise pure README-as-homepage system, maximal restraint, one deliberate exception.

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`**, the universal Ollama CTA
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `8px 20px`, height `36px`, rounded `{rounded.full}`.
- Used for "Download" (top nav), "Sign in" (top nav, paired with Download), "Create account", "Get Pro", "Get Max", every primary action in the system.
- Pressed state lives in `button-primary-active`, background drops to `{colors.ink-deep}`.

**`button-secondary`**, outline alternative on light canvas
- Background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.hairline-strong}`, type `{typography.button-md}`, padding `8px 20px`, height `36px`, rounded `{rounded.full}`.
- Used as a secondary affordance, e.g., the "Sign in" pill in the top nav when paired with the black "Download" pill, "See more apps →" arrow link in compact form.

**`button-pill-on-dark`**, white pill on dark surface
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button-md}`, rounded `{rounded.full}`.
- Sits inside the dark "Max" pricing card as the "Get Max" CTA, inverts the standard primary so the dark card itself becomes the visual anchor and the white pill reads as the CTA.

**`button-disabled`**
- Background `{colors.surface-soft}`, text `{colors.mute}`, rounded `{rounded.full}`, flat soft gray.

### Inputs & Forms

**`search-pill`** + **`search-pill-focused`**
- Default: background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.body-sm}`, padding `8px 16px`, height `36px`, rounded `{rounded.full}`. Anchored in the center of the primary nav with a small magnifier icon prefix and "Search models" placeholder.
- Focused: background flips to `{colors.canvas}` and the browser-default `{colors.focus-ring}` translucent blue ring appears.

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.canvas}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `8px 16px`, height `40px`, rounded `{rounded.full}`.
- Focused: 1px ink border + browser-default focus ring.

**`install-snippet`**, the signature install pill
- Background `{colors.surface-soft}`, text `{colors.ink}` rendered in `{typography.code-md}`, padding `12px 20px`, height `48px`, rounded `{rounded.full}`.
- Contains the literal `curl -fsSL https://ollama.com/install.sh | sh` install command with a small copy-icon at the right edge. Sits directly below the hero headline as the page's most prominent "CTA."

**`command-tag`**, small inline command chip
- Background `{colors.surface-soft}`, text `{colors.ink}` in `{typography.code-sm}`, padding `6px 12px`, rounded `{rounded.full}`.
- Used inside the "Automate your work" section for the `ollama launch openclaw` example chip and similar inline-command demos.

### Cards & Containers

**`terminal-card`**, the home page's only "product preview"
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `{spacing.lg}` (16px), rounded `{rounded.lg}`.
- Header: three `{component.terminal-traffic-lights}` dots (red/yellow/green at 12px) anchored to the top-left of the card.
- Body: terminal output rendered in `{typography.code-sm}` with comments in `{colors.mute}` and active commands in `{colors.ink}`.

**`terminal-traffic-lights`**
- Three 12px filled circles at `{rounded.full}`: `{colors.terminal-red}`, `{colors.terminal-yellow}`, `{colors.terminal-green}`. Sits as a row of three with `{spacing.xs}` gaps between dots inside the terminal card header.

**`pricing-card`**, Free / Pro tiers
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `{spacing.xxl}` (32px), rounded `{rounded.lg}`.
- Layout: small llama mascot icon (~32px) at top, tier name in `{typography.heading-md}`, one-line tier description, large price in `{typography.display-lg}` (`$0` / `$20`), single `{component.button-primary}` CTA, divider, `{typography.body-sm-strong}` "Everything in Free, plus:" header, list of `{component.feature-bullet}` rows.

**`pricing-card-dark`**, Max tier (inverted)
- Identical layout to `pricing-card` but with `{colors.surface-dark}` background, `{colors.on-dark}` text, `{colors.on-dark-mute}` secondary text, and `{component.button-pill-on-dark}` CTA. The inversion is the system's single "look here" cue.

**`feature-bullet`**, pricing card list item
- Inline `✓` checkmark at `{colors.ink}` followed by `{typography.body-sm}` text in `{colors.charcoal}`. No background, no border, just stacked rows with `{spacing.sm}` between them.

**`faq-row`**, `/pricing` FAQ entry
- Container: background `{colors.canvas}`, padding `16px 0`, 1px bottom border `{colors.hairline}`.
- Question: `{typography.heading-sm}` (18px / 500) in `{colors.ink}`.
- Answer: `{typography.body-md}` (16px / 400) in `{colors.body}`, sitting directly below the question with `{spacing.xs}` gap. Always expanded, no accordion collapse.

**`cta-strip-dark`**, rare dark CTA band
- Background `{colors.surface-dark}`, text `{colors.on-dark}` in `{typography.heading-lg}`, padding `24px 32px`, rounded `{rounded.lg}`. Used sparingly between sections.

### Inline

**`link-inline`**, body-prose anchor link
- `{colors.ink}` text with underline. Default decoration is `text-decoration: underline`.

**`link-mute`**, secondary anchor in long-form prose
- `{colors.body}` text with underline appearing on default, used in FAQ answers ("see [hello@ollama.com](mailto:)") and footer.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}`, text `{colors.ink}`, height 56px, type `{typography.body-sm-strong}`, rounded `{rounded.none}`.
- Layout (desktop): llama icon (left) followed by "Models · Docs · Pricing" text links, centered `{component.search-pill}`, and a right cluster of "Sign in" + black `{component.button-primary}` "Download".

**Top Nav (Mobile)**
- Llama icon at left, hamburger drawer trigger at right. Search pill expands to full-width when triggered. The drawer lists "Models · Docs · Pricing · Sign in · Download" stacked vertically with `{spacing.lg}` row gaps.

### Footer

**`footer-section`**
- Background `{colors.canvas}`, 1px top border `{colors.hairline}`, padding `32px 24px`, type `{typography.caption-sm}` `{colors.body}`.
- Single horizontal row of small links: "Download · Blog · Docs · GitHub · Discord · X · Contact · Privacy · Terms" + a "© 2026 Ollama" copyright at the right edge. Wraps to two rows on narrow screens.


---

## 35. OpenCode: Typography

**Why this stood out:** Every character on the page, headline down to footer fine print, is set in Berkeley Mono, the most extreme typographic commitment in the collection.

### Font Family
**Berkeley Mono** is the proprietary monospaced face used across every text role in the system. It carries weights 400 (regular), 500 (medium), and 700 (bold) and falls back through a long monospace stack, IBM Plex Mono → ui-monospace → SFMono-Regular → Menlo → Monaco → Consolas → Liberation Mono → Courier New.

The single-font decision is the brand. There is no display face, no body sans, no italic alternative, and no fallback to a proportional font anywhere, even the legal copyright row uses Berkeley Mono at 14px. This is the most aggressive typographic restraint of any site in the marketing-tools category: OpenCode's identity is "the marketing page is a man page."

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 38px | 700 | 1.5 | 0 | Hero headline ("The open source AI coding agent") |
| `{typography.heading-md}` | 16px | 700 | 1.5 | 0 | Section label ("What is OpenCode?", "FAQ", "Built for privacy first") |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Body copy, paragraph text, list-row text, install-snippet code |
| `{typography.body-strong}` | 16px | 500 | 1.5 | 0 | Inline emphasis, primary nav link, tab-label active |
| `{typography.body-tight}` | 16px | 500 | 1 | 0 | Compact label rendered without breathing room |
| `{typography.link-md}` | 16px | 400 | 1.5 | 0 | Inline anchor link in body prose |
| `{typography.button-md}` | 16px | 500 | 2 | 0 | Every button label across the system |
| `{typography.caption-md}` | 14px | 400 | 2 | 0 | Footer link text, badge label, copyright row, chart caption |

### Principles
The hierarchy is built almost entirely from size and weight contrast on a single face. The display headline (38px / 700) and the heading-md label (16px / 700) share a weight; the difference is just size. Body and link share size, weight, and line-height, only context distinguishes them. Buttons get a deliberately tall line-height (2.0) so labels feel calmly spaced inside the 4px-radius rectangle.

### Note on Font Substitutes
Berkeley Mono is a paid commercial font. Open-source substitutes that approximate its metrics within ~3% at body sizes:
- **JetBrains Mono**, closest match for stroke contrast and x-height; pair at weights 400 / 500 / 700.
- **IBM Plex Mono**, official secondary fallback in the documented font stack; slightly more open counters but matches line-height behavior.
- **Geist Mono**, modern alternative with similar geometric construction.

When substituting, line-height behavior is preserved by keeping `lineHeight: 1.5` for body and `lineHeight: 2` for buttons, adjusting weight is rarely needed.


---

## 36. Pinterest: Layout

**Why this stood out:** The masonry pin grid is the load-bearing layout element of the entire product, chrome exists only to get out of its way.

### Spacing System
- **Base unit:** 8px (with finer 4/6/7px steps available for tight inline gaps in pill buttons and chips).
- **Tokens (front matter):** `{spacing.xxs}` (4px) · `{spacing.xs}` (6px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (64px).
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (64px) as the vertical gap between major content blocks. Pin grids use `{spacing.sm}` (8px) gutters between tiles, the tightest grid gutter in the system, designed so imagery effectively touches across columns.
- **Modal padding:** `{component.modal-card}` uses 32px internal padding (`{spacing.xxl}`) on all sides.

### Grid & Container
- **Max width:** ~1280px content area at desktop with 24px gutters (~48px at ultrawide).
- **Pin masonry grid:** auto-fitting column-based layout, 5–6 columns at ultrawide, 4 columns at desktop, 3 at tablet, 2 at mobile-landscape, 1 at mobile. Each tile preserves its natural aspect ratio (square / 2:3 / 3:4 / 4:5 portrait, never landscape because pins are vertically-oriented). Gutters are `{spacing.sm}` (8px) horizontal and vertical.
- **Home hero feature row:** asymmetric 2-column split where text and imagery alternate left/right down the page (text-left + image-right, then image-left + text-right, etc.).
- **Footer:** 4-column link grid at desktop, collapsing to 2-up at tablet, 1-up at mobile.

### Whitespace Philosophy
Whitespace is generous on the marketing surfaces and tight on the discovery surfaces. The home page sits sections 64px apart with photo-illustrated feature cards using 32px internal padding, while the search results page collapses to an 8px-gutter masonry grid that tiles imagery edge-to-edge. The system reads as two tools sharing the same chrome: a magazine (hero / feature / CTA / footer) and a search engine (top nav / filter row / pin grid / load more).


---

## 37. PlayStation: Layout

**Why this stood out:** Alternating full-bleed black, white, and PlayStation-Blue chapters scroll like a console launch trailer rather than a typical marketing page.

### Spacing System
- **Base unit:** 8px (with finer 4/12px steps for tight inline gaps).
- **Tokens (front matter):** `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (24px) · `{spacing.xl}` (32px) · `{spacing.xxl}` (48px) · `{spacing.section}` (96px).
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (96px) as the vertical gap between major content blocks. Card grids use `{spacing.lg}` (24px) gutters; in-card padding sits at `{spacing.lg}` to `{spacing.xl}` depending on density.
- **Hero band padding:** 96px vertical / 48px horizontal, the largest spacing in the system, reserved for full-bleed surface chapters.

### Grid & Container
- **Max width:** ~1280px content area for body text on desktop with 24px gutters that expand to ~48px at ultrawide. Hero bands and game-tile rails go full-bleed with no max-width constraint on imagery.
- **Game tile carousel:** 4-up at desktop with horizontal scroll on the same row, collapsing to 3-up at 1024px and 2-up at 768px. Each tile uses 16:9 cover art at `{rounded.md}`.
- **Console showcase grid:** desktop 5-column thumbnail strip below the main hero render, collapsing to 3-up + horizontal scroll at tablet.
- **Support page:** desktop 2-column 30/70 split (sidebar nav + article body), collapsing to single-column with the sidebar promoted to a top accordion at mobile.
- **News strip:** 3-up card grid at desktop, 2-up at tablet, 1-up at mobile.

### Whitespace Philosophy
Whitespace is structural and band-defined. The 96px `{spacing.section}` between chapters reads as silence between trailer cuts, there's no decorative wash, no gradient transition, no mid-section divider. Inside a section, content is left-aligned in a tight column with the imagery breathing in the right 60-70% of the band. Paragraph text is comfortable at 1.5 line-height but column widths stay narrow (~520px at desktop) to keep long-form copy readable.


---

## 38. PostHog: Components

**Why this stood out:** Hand-drawn hedgehog mascots scattered like sketchbook marginalia actively reject the genre's default somber dark-tech aesthetic.

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`**, the universal PostHog CTA
- Background `{colors.primary}` (yellow-orange), text `{colors.on-primary}` (deep olive), type `{typography.button-md}`, padding `8px 16px`, height `40px`, rounded `{rounded.md}`.
- Used for "Get started, free" (sticky top-nav CTA), "Sign up", "Try it free", "Subscribe", every primary action.
- Pressed state lives in `button-primary-pressed`, background drops to `{colors.primary-pressed}`.

**`button-secondary`**, soft alternative on cream canvas
- Background `{colors.surface-soft}` (`#e5e7e0`), text `{colors.ink}`, type `{typography.button-md}`, padding `8px 16px`, height `40px`, rounded `{rounded.md}`.
- "Talk to sales", "Read docs", "Watch demo", second-tier actions paired with the yellow primary.

**`button-tertiary`**, ghost text button
- Background transparent, text `{colors.ink}`, type `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.md}`.
- Lowest-emphasis action: "See all docs →", "Browse all features".

**`button-disabled`**
- Background `{colors.surface-soft}`, text `{colors.ash}`, flat soft cream-gray.

### Tabs & Chips

**`product-tab`** + **`product-tab-active`**, major product section tabs
- Default: transparent background, text `{colors.body}`, type `{typography.body-strong}`, padding `8px 12px`, rounded `{rounded.md}`.
- Active: background flips to `{colors.surface-card}` (white), text `{colors.ink}`, the tab card lifts off the cream canvas as the visual signal of selection.

**`pill-tab`** + **`pill-tab-active`**, compact filter pill
- Default: transparent background, text `{colors.body}`, type `{typography.button-sm}`, padding `6px 14px`, rounded `{rounded.full}`.
- Active: background flips to `{colors.ink}`, text `{colors.on-dark}`, the chip flips fully inverted on selection.

**`badge-uppercase`**, text-only utility label
- Background transparent, text `{colors.body}` in `{typography.utility-xs}` (uppercase), used as in-list category prefix ("FEATURE FLAG", "EXPERIMENT", "HEATMAP").

**`badge-promo`**, small inline pill chip
- Background `{colors.accent-blue-soft}`, text `{colors.link-blue}`, type `{typography.caption-xs}`, padding `2px 8px`, rounded `{rounded.full}`.
- "New", "Beta", "Coming soon" pill labels overlaid on cards.

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.surface-card}`, text `{colors.ink}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `8px 12px`, height `36px`, rounded `{rounded.md}`.
- Focused: same surface; 2px solid `{colors.accent-blue}` border replaces the 1px hairline + a translucent `{colors.focus-ring}` outline.

**`search-input`**, utility search field (doc sidebar, "Ask PostHog AI")
- Same dimensions as `text-input` with a magnifier glyph at the left edge in `{colors.mute}`.

### Cards & Containers

**`product-card`**, marketing tile / feature card
- Container: background `{colors.surface-card}` (white), 1px solid `{colors.hairline}`, padding `{spacing.xl}` (24px), rounded `{rounded.md}`.
- Layout: small hedgehog illustration at top-left, `{typography.heading-sm-mixed}` title, `{typography.body-sm}` description, optional `{component.button-tertiary}` "Learn more →" link.

**`doc-card`**, doc article body card
- Container: background `{colors.surface-doc}` (`#fcfcfa` warm-white), 1px solid `{colors.hairline}`, padding `{spacing.xl}` (24px), rounded `{rounded.md}`.
- Carries article body sections, code blocks, callout banners, and tables inside doc pages.

**`feature-tile`**, small marketing feature tile
- Container: background `{colors.surface-card}`, 1px solid `{colors.hairline}`, padding `{spacing.lg}` (20px), rounded `{rounded.md}`.
- Used in 3-up or 4-up grids on home and workflows pages, paired with a small icon and a 1-line description.

**`pricing-tier-card`**, pricing plan card
- Container: background `{colors.surface-card}`, 1px solid `{colors.hairline}`, padding `{spacing.xxl}` (32px), rounded `{rounded.md}`.
- Layout: tier name in `{typography.display-lg}` (24px / 800 / -0.6px), large price + period, feature checklist with check-icon bullets, primary or secondary CTA at bottom.

**`hedgehog-mascot-card`**, feature card with margin-anchored hedgehog
- Same chrome as `{component.product-card}` but with a hand-drawn hedgehog illustration anchored in the right margin or top-right corner, the brand's signature card variant.

### Callout Banners

**`banner-tip-blue`** + **`banner-tip-green`** + **`banner-tip-red`** + **`banner-tip-purple`**
- Background `{colors.accent-blue-soft}` / `{colors.accent-green-soft}` / `{colors.accent-red-soft}` / `{colors.accent-purple-soft}`, text `{colors.ink}`, type `{typography.body-md}`, padding `16px 20px`, rounded `{rounded.md}`.
- Each prefixed with an inline emoji icon (💡 / ✅ / ⚠️ / 📘) followed by an inline label and body copy.
- Only appear inside doc article body. The four-color callout family is the brand's information-architecture vocabulary for inline tips/warnings/info inside long-form documentation.

### Code

**`code-block`**, dark code sample inside doc card
- Container: background `{colors.surface-dark}` (deep olive-charcoal), text `{colors.on-dark}` in `{typography.code-sm}`, padding `16px 20px`, rounded `{rounded.md}`.
- Syntax highlighting uses muted accent colors (blue for keywords, green for strings, purple for numbers), never the bright accent colors used in callout banners.

**`inline-code`**, small inline `<code>` chip
- Background `{colors.surface-soft}`, text `{colors.ink}` in `{typography.code-xs}`, padding `2px 6px`, rounded `{rounded.xs}` (2px).
- Used inside body prose to mark code snippets and identifiers.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}` (cream, same as the page), text `{colors.ink}`, height `56px`, type `{typography.body-strong}`, rounded `{rounded.none}`.
- Layout (desktop): PostHog wordmark + hedgehog logo at left, nav menu cluster ("Pricing · Docs · Community · Company"), right cluster with a search-glyph, "Login" link, and the always-yellow `{component.button-primary}` "Get started, free" pill anchored to the far right.

**`sub-nav-strip`**, secondary nav bar (under primary)
- Background `{colors.surface-soft}`, text `{colors.body}` in `{typography.body-xs}`, height `40px`, rounded `{rounded.none}`.
- Sits directly below the primary nav on workflows / product pages with section anchor links and a contextual "Get started →" link at the right.

**`doc-sidebar`**, sticky doc-page left sidebar
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.body-xs}`, width `240px`, rounded `{rounded.none}`.
- Layout: search-input "Ask PostHog AI" at top, then a vertical list of section headers each with a small rounded outline-icon mini-illustration, then nested item links indented under the active header.

**Top Nav (Mobile)**
- Hamburger menu icon at left, PostHog wordmark + hedgehog at center, search + sticky yellow "Get started, free" CTA at right. Primary nav collapses into a full-height drawer that slides from the left.

### Footer

**`footer-section`**
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.body-xs}`, padding `32px 24px`, rounded `{rounded.none}`, with a 1px `{colors.hairline}` top rule.
- Layout: 6-column horizontal link grid (Product · Resources · Company · Community · Pricing · Legal), each column with a `{typography.utility-xs}` (uppercase) header and a vertical list of links in `{typography.body-xs}` `{colors.body}`.
- Bottom row: PostHog wordmark + small hedgehog illustration, copyright in `{typography.caption-xs}` `{colors.mute}`, social-icon row at far-right.

### Inline

**`link-inline`**, body-prose anchor link
- `{colors.link-teal}` (`#1078a3`) in body prose with no underline by default; underline appears on focus. The brand's primary inline link color.


---

## 39. Raycast: Typography

**Why this stood out:** Inter with the ss03 stylistic set enabled site-wide is a small, precise typographic decision that keeps the marketing chrome feeling identical to the in-product chrome.

### Font Family
**Inter** is the system's primary face, loaded with the `Inter Fallback` system fallback variant. Critically, Raycast enables `font-feature-settings: "calt", "kern", "liga", "ss03"` site-wide, the **ss03 stylistic set** swaps in Inter's alternate `g` glyph (single-story open `g`), which is the brand's signature typographic detail. Standard ligatures (`liga`), kerning (`kern`), and contextual alternates (`calt`) are also active. The display tier additionally enables `ss02` and `ss08` and disables standard `liga` to render the hero "Raycast Pro" wordmark with its distinctive geometric construction.

There is no monospace face used outside of inline `<code>` chips in documentation; the marketing pages use Inter for everything.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 600 | 1.1 | 0 | Hero "Built for the perfect tools" / "The new way to..." headline (with `liga: 0`, `ss02`, `ss08`) |
| `{typography.display-lg}` | 56px | 500 | 1.17 | 0.2px | Section headline ("Explore", "Pricing", store hero "Store") |
| `{typography.heading-xl}` | 24px | 500 | 1.6 | 0.2px | Sub-section heading, pricing-tier name |
| `{typography.heading-lg}` | 22px | 500 | 1.15 | 0 | Mid-section feature heading |
| `{typography.heading-md}` | 20px | 500 | 1.4 | 0.2px | Card group title, in-card heading |
| `{typography.heading-sm}` | 18px | 500 | 1.4 | 0.2px | Small heading, extension card title |
| `{typography.body-lg}` | 18px | 400 | 1.6 | 0 | Pricing tier description, hero subtitle |
| `{typography.body-md}` | 16px | 400 | 1.6 | 0 | Default body, paragraph text |
| `{typography.body-strong}` | 16px | 500 | 1.4 | 0.2px | Inline emphasis, primary nav link |
| `{typography.body-sm}` | 14px | 400 | 1.6 | 0 | Card description, secondary copy |
| `{typography.body-sm-strong}` | 14px | 500 | 1.6 | 0.2px | In-card label, table-header text |
| `{typography.caption-md}` | 13px | 400 | 1.4 | 0.1px | Caption, metadata |
| `{typography.caption-sm}` | 12px | 400 | 1.5 | 0.4px | Smallest utility text, badge label |
| `{typography.link-md}` | 16px | 500 | 1.4 | 0.3px | Inline body anchor link |
| `{typography.button-md}` | 14px | 500 | 1.6 | 0.2px | Standard button label |

### Principles
The hierarchy works on a 1.6-line-height ladder for body and a 1.1–1.4 ladder for display/heading. Letter-spacing is consistently positive (0.1–0.4px), slightly opening the type, which gives Raycast's chrome an airy quality at body sizes despite the dark canvas. The `ss03` stylistic set is the brand's most distinctive typographic detail; without it, the body face renders identically to plain Inter and loses Raycast's signature rendering.

### Note on Font Substitutes
Inter is open-source and Google-Fonts-hosted; load it directly. To preserve the brand's signature look, you must enable `font-feature-settings: "calt", "kern", "liga", "ss03"` on the body element. Without `ss03`, the typography is recognizably "Inter default" rather than "Raycast." On systems where Inter cannot be loaded, the documented fallback is `Inter Fallback` (a self-hosted variant) → `system-ui`. **JetBrains Mono** or **Geist Mono** are acceptable substitutes for inline code chips when needed, though Raycast's marketing chrome rarely uses code-styled text.


---

## 40. Renault: Colors

**Why this stood out:** Sunlight Yellow against a strict black-and-white canvas keeps every colored element intentional in a category that usually reaches for far more chrome.

### Brand & Accent
- **Sunlight Yellow** (`{colors.primary}`, `#ffed00`): the brand accent. Reserved for primary CTAs, "NEW" / "yeni" badges, configurator dot indicators, and full-bleed promotional tiles. Never decorative.
- **Sunlight Yellow Pressed** (`{colors.primary-deep}`, `#e6d200`): the active/pressed state of `{colors.primary}` buttons and tiles.
- **On-Primary** (`{colors.on-primary}`, `#000000`): label colour on top of `{colors.primary}` surfaces. Yellow always pairs with black text, never white.

### Surface
- **Canvas** (`{colors.canvas}`, `#ffffff`): the default page background and card surface.
- **Surface Soft** (`{colors.surface-soft}`, `#f7f7f7`): subtle elevation step for grouped configurator rows and inactive form fields.
- **Surface Dark** (`{colors.surface-dark}`, `#000000`): the alternate canvas, used for hero bands, footer, and full-bleed storytelling sections.
- **Surface Deep** (`{colors.surface-deep}`, `#111111`): a one-step-up elevation inside `{colors.surface-dark}` regions for inset cards and form panels.
- **Hairline** (`{colors.hairline}`, `#f2f2f2`): the soft 1px divider between rows on white surfaces.
- **Hairline Strong** (`{colors.hairline-strong}`, `#000000`): full-strength dividers on white, plus all card / button outlines.
- **Divider Dark** (`{colors.divider-dark}`, `rgba(255,255,255,0.16)`): the corresponding low-contrast divider used inside `{colors.surface-dark}` regions.

### Text
- **Ink** (`{colors.ink}`, `#000000`): primary text colour on white surfaces. The same value also drives logos, icons, and outline borders, black is structural, not decorative.
- **Body** (`{colors.body}`, `#222222`): secondary body text where pure black would feel too heavy in long paragraphs.
- **Charcoal** (`{colors.charcoal}`, `#333333`): captions, metadata, and small labels.
- **Mute** (`{colors.mute}`, `#666666`): supporting text and inactive nav labels.
- **Ash** (`{colors.ash}`, `#8a8a8a`): placeholder text, disabled labels.
- **Stone** (`{colors.stone}`, `#c4c4c4`): disabled-state foreground.
- **On-Dark** (`{colors.on-dark}`, `#ffffff`): primary text on `{colors.surface-dark}` surfaces.
- **On-Dark Mute** (`{colors.on-dark-mute}`, `rgba(255,255,255,0.72)`): secondary text in dark regions; preserves the brand's high-contrast feel without resorting to mid-grey.

### Semantic
- **Error** (`{colors.error}`, `#be6464`): muted desaturated red used for inline form errors. Notably warmer than typical pure-red error states.
- **Warning** (`{colors.warning}`, `#f0ad4e`): amber alert.
- **Success** (`{colors.success}`, `#8dc572`): muted green confirmation.
- **Info** (`{colors.info}`, `#337ab7`): a desaturated mid-blue used in informational chips.
- **Link** (`{colors.link}`, `#0000ee`): the unstyled-anchor default kept for fallback inline text links, production links inherit `{colors.ink}` and rely on underline/weight rather than colour.


---

## 41. Replicate: Typography

**Why this stood out:** A single aggressively large (72px+) display face, rb-freigeist-neue, gives an indie ML playground the confidence of a print magazine masthead.

### Font Family

Replicate ships a deliberate three-family stack:

- **rb-freigeist-neue**, proprietary heavy grotesque used for all display sizes (30px+). Carries the editorial-magazine personality through tight `lineHeight: 1.0` and negative letter-spacing.
- **basier-square**, proprietary humanist sans-serif used for body, button labels, captions, and metadata.
- **jetbrains-mono**, open-source monospace used in every code well and inline command.

When proprietary families cannot be licensed, **Bricolage Grotesque** or **Migra** are credible substitutes for rb-freigeist-neue, and **Geist** or **Inter** can stand in for basier-square. JetBrains Mono is open-source and should always be used directly.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 128px | 700 | 1.0 | -3px | The single hero "Run AI" / "Imagine what you can build" headline. One per page. |
| `{typography.display-xl}` | 72px | 700 | 1.0 | -1.8px | Section openers ("How it works", "Scale on Replicate"). |
| `{typography.display-lg}` | 48px | 700 | 1.0 | -1px | Sub-section titles, pricing tier names. |
| `{typography.display-md}` | 30px | 600 | 1.2 | -0.5px | Feature card titles. |
| `{typography.heading-lg}` | 38.4px | 600 | 0.83 | -0.5px | Tightly-stacked basier-square headlines, used in pricing and enterprise hero. |
| `{typography.heading-md}` | 24px | 600 | 1.33 | -0.35px | Card titles, model detail headers. |
| `{typography.heading-sm}` | 20px | 600 | 1.4 | -0.3px | List section headers. |
| `{typography.subtitle}` | 18px | 600 | 1.56 | 0 | Lead paragraphs in display sections. |
| `{typography.body-lg}` | 18px | 400 | 1.56 | 0 | Marketing prose. |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body. |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Captions, metadata. |
| `{typography.button-md}` | 16px | 600 | 1.0 | 0 | Default button label. |
| `{typography.button-sm}` | 14px | 600 | 1.0 | 0 | Compact button label, sub-nav pills. |
| `{typography.caption}` | 12px | 400 | 1.33 | 0 | Footer disclosure, copyright. |
| `{typography.caption-tight}` | 14px | 600 | 1.43 | -0.35px | Emphatic small caption used in pricing tier rows. |
| `{typography.code-md}` | 14px | 400 | 1.43 | 0 | Code blocks and inline code. |
| `{typography.code-sm}` | 11px | 400 | 1.5 | 0 | Code-tab labels and small inline tokens. |

### Principles
- Display sizes hold `lineHeight: 1.0` (or 0.83 on `{typography.heading-lg}`) so multi-line stacks read as single typographic blocks.
- Negative letter-spacing scales with size, bigger types tighten more (-3px at 128px down to -0.3px at 20px). Body type stays at 0.
- Body weight sits at 400 across `{typography.body-lg}` and `{typography.body-md}`, never bumped to 500 for emphasis. Emphasis comes from family change (basier-square → rb-freigeist-neue) rather than weight.
- Code is never set in basier-square, even at small sizes, JetBrains Mono carries every literal command, every model slug, every API call.

### Note on Font Substitutes

When the proprietary families are unavailable, clamp display `lineHeight` to 1.0 explicitly and apply a -3% letter-spacing on display-xxl / display-xl to match the original tightness. Substitutes typically render with looser tracking by default.


---

## 42. Resend: Typography

**Why this stood out:** Domaine Display at 76-96px with ss01/ss04/ss11 stylistic features turns a utilitarian dev-tool into something with genuine print-serif confidence.

### Font Family

Resend ships a four-family stack:

- **Domaine Display**, proprietary editorial serif used exclusively for hero headlines at 76px+, with `ss01 / ss04 / ss11` stylistic sets engaged for a slightly tighter, more print-magazine look.
- **ABC Favorit**, proprietary humanist sans-serif used for marketing body copy, hero subtitles, and pill labels. Carries `ss01 / ss03 / ss04` features for tabular figures and alternate glyphs.
- **Inter**, open-source sans-serif used for UI: button labels, captions, card body text, nav links.
- **Geist Mono**, open-source monospace used in code wells.

When proprietary families cannot be licensed, **Söhne** or **Tiempos Headline** stand in for Domaine Display, and **Geist** or **Inter Tight** can replace ABC Favorit. Inter and Geist Mono are open-source and should be used directly.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 96px | 400 | 1.0 | -0.96px | Home hero ("Email for developers"). One per page. |
| `{typography.display-xl}` | 76.8px | 400 | 1.0 | -0.768px | Section openers ("Email reimagined", "Available today"). |
| `{typography.display-lg}` | 56px | 400 | 1.2 | -2.8px | ABC Favorit display sub-titles. |
| `{typography.heading-md}` | 24px | 500 | 1.5 | -0.4px | Card titles, section sub-titles. |
| `{typography.heading-sm}` | 20px | 500 | 1.3 | -0.3px | List headers. |
| `{typography.subtitle}` | 20px | 400 | 1.3 | 0 | Hero subtitles. |
| `{typography.body-lg}` | 18px | 400 | 1.5 | 0 | Marketing prose. |
| `{typography.body-md}` | 16px | 400 | 1.5 | -0.8px | ABC Favorit body. |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Captions, metadata. |
| `{typography.button-md}` | 14px | 500 | 1.43 | 0 | Default button label. |
| `{typography.button-sm}` | 14px | 500 | 1.43 | 0.35px | Pill labels, inline links. |
| `{typography.caption}` | 12px | 400 | 1.5 | 0 | Footer disclosure, copyright. |
| `{typography.caption-emph}` | 14px | 600 | 1.0 | 0 | Emphatic small caption, Helvetica fallback. |
| `{typography.code-md}` | 13px | 400 | 1.6 | 0 | Code blocks, inline code. |

### Principles
- Display sizes always run at `lineHeight: 1.0` with negative letter-spacing, the Domaine Display headlines pack into solid typographic blocks rather than open prose lines.
- Body weight stays at 400 across `{typography.body-lg}` and `{typography.body-md}`. The serif/sans family change carries hierarchy, not weight bumps.
- ABC Favorit always runs with `ss01 / ss04 / ss11` engaged; Inter never carries OpenType features. Code in Geist Mono never carries ligatures.
- Inline links use `{typography.button-sm}` with positive letter-spacing (`0.35px`) and ABC Favorit, the small spacing nudge gives interactive prose its precision.

### Note on Font Substitutes

When Domaine Display is unavailable, clamp `lineHeight` to 1.0 explicitly and apply `font-feature-settings: "ss01", "liga"` on the substitute serif to mimic the alternate glyphs. Söhne or Tiempos Headline will read closest. ABC Favorit substitutes (Geist, Inter Tight) typically default to looser tracking, apply -0.5% letter-spacing on body sizes to compensate.


---

## 43. Revolut: Colors

**Why this stood out:** A wide saturated product-color palette (teal, pink, light-green, warning orange) layered against a single cobalt-violet primary is unusually generous for a fintech brand.

### Brand & Accent
- **Cobalt Violet** (`{colors.primary}`, `#494fdf`): the brand accent. Reserved for featured plan cards (`{component.plan-card-featured}`), the brand wordmark icon, and secondary CTAs in white-canvas regions.
- **Cobalt Bright** (`{colors.primary-bright}`, `#4f55f1`): a one-step-up bright variant used in inline link colour and accent-photo headers.
- **Cobalt Deep** (`{colors.primary-deep}`, `#3a40c4`): the active/pressed state of cobalt elements.
- **On-Primary** (`{colors.on-primary}`, `#ffffff`): label colour on top of `{colors.primary}` surfaces.

### Surface
- **Canvas Light** (`{colors.canvas-light}`, `#ffffff`): the white catalogue mode for FAQ, download tiles, comparison tables.
- **Canvas Dark** (`{colors.canvas-dark}`, `#000000`): the storytelling canvas, true black, never near-black.
- **Surface Soft** (`{colors.surface-soft}`, `#f4f4f4`): a subtle off-white used on download tiles, soft buttons, and inset card groups inside white bands.
- **Surface Card** (`{colors.surface-card}`, `#ffffff`): pure white card surface, used for feature cards in white-canvas regions.
- **Surface Deep** (`{colors.surface-deep}`, `#0a0a0a`): a one-step-up dark surface for inset cards inside black-canvas regions.
- **Surface Elevated** (`{colors.surface-elevated}`, `#16181a`): the planning-section card background, slightly luminous, lifts plan cards off the black canvas.
- **Hairline Light** (`{colors.hairline-light}`, `#e2e2e7`): 1px dividers inside white bands.
- **Hairline Dark** (`{colors.hairline-dark}`, `rgba(255,255,255,0.12)`): the corresponding low-contrast divider in dark regions.
- **Hairline Strong** (`{colors.hairline-strong}`, `#191c1f`): structural full-strength dividers and the outline of light cards.

### Text
- **Ink** (`{colors.ink}`, `#191c1f`): primary text colour. Notably warmer than pure black, paired with the white canvas for body legibility.
- **Body** (`{colors.body}`, `#1f2226`): long-form body where `{colors.ink}` would feel slightly too sharp.
- **Charcoal** (`{colors.charcoal}`, `#3a3d40`): captions, secondary nav.
- **Mute** (`{colors.mute}`, `#505a63`): supporting text.
- **Ash** (`{colors.ash}`, `#5c5e60`): tertiary text, footer copy.
- **Stone** (`{colors.stone}`, `#8d969e`): metadata, subtle captions.
- **Faint** (`{colors.faint}`, `#c9c9cd`): disabled foreground, hairline replacements.
- **On-Dark** (`{colors.on-dark}`, `#ffffff`): primary text on `{colors.canvas-dark}`.
- **On-Dark Mute** (`{colors.on-dark-mute}`, `rgba(255,255,255,0.72)`): secondary text in dark regions.

### Semantic
- **Accent Teal** (`{colors.accent-teal}`, `#00a87e`): used in product mockup illustrations.
- **Accent Light Blue** (`{colors.accent-light-blue}`, `#007bc2`): inline link colour in dark photo headers.
- **Accent Blue Link** (`{colors.accent-blue-link}`, `#376cd5`): default inline link colour on white surfaces.
- **Accent Light Green** (`{colors.accent-light-green}`, `#428619`): success / positive product callouts.
- **Accent Green Text** (`{colors.accent-green-text}`, `#006400`): inline success text.
- **Accent Yellow** (`{colors.accent-yellow}`, `#b09000`): caution / pending state in product mockups.
- **Accent Warning** (`{colors.accent-warning}`, `#ec7e00`): full-saturation orange used in warning illustrations.
- **Accent Pink** (`{colors.accent-pink}`, `#e61e49`): deep pink, used inside product photography and category iconography.
- **Accent Danger** (`{colors.accent-danger}`, `#e23b4a`): destructive / error state.
- **Accent Deep Red** (`{colors.accent-deep-red}`, `#8b0000`): inline error text.
- **Accent Brown** (`{colors.accent-brown}`, `#936d62`): a single warm-neutral used in metals tier card chrome.
- **Link** (`{colors.link}`, `#376cd5`): default inline link colour. Same as `{colors.accent-blue-link}`.


---

## 44. Sentri (Inspired): Colors

**Why this stood out:** Electric lime against a deep purple-violet midnight canvas gives a dev-tools brand a slightly subversive, almost mischievous energy most of the category avoids.

> **Source pages:** home (`/welcome/`), product/error-monitoring, contact/enterprise, pricing.

### Brand & Accent
- **Midnight Violet** (`{colors.primary}`, `#150f23`): The system's primary action color and the deepest surface tone. Used for filled primary buttons on light surfaces, code-block backgrounds, and the strongest dark cards.
- **Ink Violet** (`{colors.ink-deep}`, `#1f1633`): Slightly lifted from primary, this is the marketing hero canvas and the default body-text color on light surfaces, a single token doing double duty as background and ink.
- **Electric Lime** (`{colors.accent-lime}`, `#c2ef4e`): The signature highlight color. Wrapped around individual headline keywords as a syntax-highlight chip (`{rounded.xs}` corner, no padding-y, 12px padding-x). Also used as the squiggly footer divider stroke. Never a button background.
- **Hot Pink** (`{colors.accent-pink}`, `#fa7faa`): Secondary punctuation color used for sticker outlines, chart points, and supporting accents, never on buttons, never on type at body size.
- **Violet Link** (`{colors.accent-violet}`, `#6a5fc1`): Inline link color when emphasis is needed beyond underline.
- **Deep Violet** (`{colors.accent-violet-deep}`, `#422082`): The select-dropdown fill on contact forms; also used on spotlight cards inside dark sections.
- **Mid Violet** (`{colors.accent-violet-mid}`, `#79628c`): Tag-chip fill and faint accent on dark surfaces.

### Surface
- **Dark Canvas** (`{colors.surface-canvas-dark}`, `#1f1633`): Hero, product, and feature-page background. Carries the deepest atmospheric weight.
- **Night** (`{colors.surface-night}`, `#150f23`): Cards on dark canvas, code blocks, and the "featured" pricing tier.
- **Light Canvas** (`{colors.surface-canvas-light}`, `#ffffff`): Pricing, contact, and dense-reference page background.
- **Surface Press Light** (`{colors.surface-press-light}`, `#f0f0f0`) and **Press Stronger** (`{colors.surface-press-stronger}`, `#efefef`): The pressed/active fill of inverted buttons on dark surfaces.
- **Hairline Violet** (`{colors.hairline-violet}`, `#362d59`): 1px borders on dark cards.
- **Hairline Cool** (`{colors.hairline-cool}`, `#cfcfdb`): 1px borders on text inputs and form fields.
- **Hairline Cloud** (`{colors.hairline-cloud}`, `#e5e7eb`): Pricing-table dividers and pricing-card borders on light canvas.

### Text
- **On Primary** (`{colors.on-primary}`, `#ffffff`): All text on dark canvas, all CTA labels on filled dark buttons.
- **Ink** (`{colors.ink}`, `#1f1633`): Body text on light canvas; identical hex to the dark canvas, repurposed as type.
- **Ink Press** (`{colors.ink-press}`, `#1a1a1a`): Reserved for the pressed/active state of inverted buttons.
- **On Dark Muted** (`{colors.on-dark-muted}`, `rgba(255,255,255,0.72)`): Secondary text, captions, and table cell values on dark canvas.
- **On Dark Faint** (`{colors.on-dark-faint}`, `rgba(255,255,255,0.18)`): Translucent surface-on-dark, used for ghost button fills and dimmed nav items.

### Semantic
- **Focus Ring** (`{colors.ring-focus}`, `rgba(59,130,246,0.5)`): Translucent blue focus ring, the only blue in the system, reserved for keyboard focus on form fields.


---

## 45. Shopifi (Inspired): Layout

**Why this stood out:** Running two entirely different canvas polarities, near-black cinematic marketing and cream-mint transactional, and treating that split itself as the brand, is a genuinely distinctive structural choice.

### Spacing System
- **Base unit**: 8px (with denser sub-units 1, 2, 3, 4 for fine work).
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.huge}` 64px.
- **Section padding**: `{spacing.huge}` 64–128px on cinematic marketing pages (extreme negative space is the point); collapses to ~48px on transactional pages where density takes priority.
- **Card internal padding**: `{spacing.xxl}` 32px on pricing cards; `{spacing.xl}` 24px on compact tag rows.

### Grid & Container
- Cinematic hero pages use a wide max-width container (~1440–1600px) with edge-bleeding photography that escapes the container.
- Pricing collapses through 4-up → 2-up → 1-up tiers based on viewport.
- Body content centers in a ~720–840px reading column on long-form pages.

### Whitespace Philosophy
The cinematic track treats whitespace as the brand's most valuable asset, sections often have 128–192px of vertical air between content blocks, with photography filling the rest. The transactional track tightens to ~48–64px between bands because users are scanning, comparing, and acting. The contrast between the two whitespace philosophies is part of the brand voice.


---

## 46. Slacc (Inspired): Colors

**Why this stood out:** A deep aubergine primary paired with cream-lavender hero gradients is an unusually warm color direction for a workplace messaging product.

> **Source pages:** home (`/`), `/features/channels`, `/pricing`, `/contact-sales`.

### Brand & Accent
- **Aubergine** (`{colors.primary}`, `#4a154b`): The brand's primary surface and CTA color. Deep, warm purple with a hint of ruby, used on filled buttons, the featured pricing tier, the footer band, and the brand wordmark.
- **Aubergine Deep** (`{colors.primary-deep}`, `#481a54`): A near-identical sibling of `{colors.primary}` extracted from a different surface; treat as functionally equivalent.
- **Aubergine Press** (`{colors.primary-press}`, `#611f69`): Pressed-state lift of the primary, slightly lighter and warmer.
- **Aubergine Tint** (`{colors.primary-tint}`, `#592466`): Border accent on aubergine-on-aubergine surfaces.
- **Link Blue** (`{colors.link-blue}`, `#1264a3`): Inline link color, saturated, slightly warm blue. The only chromatic alternative to aubergine in body type.
- **Link Hover** (`{colors.link-hover}`, `#3860be`): A more saturated blue used on link hover state.

### Surface
- **Canvas White** (`{colors.canvas}`, `#ffffff`): Default content surface.
- **Canvas Cream** (`{colors.canvas-cream}`, `#f4ede4`): Warm off-white used on hero gradients and feature bands. Adds editorial warmth.
- **Canvas Lavender** (`{colors.canvas-lavender}`, `#f9f0ff`): Pale lavender tint used as the secondary-button surface and as a soft section band.
- **Surface Aubergine** (`{colors.surface-aubergine}`, `#4a154b`): The primary aubergine reused as a surface, featured pricing tier, footer, dark feature bands.
- **Hairline** (`{colors.hairline}`, `#e6e6e6`): 1px borders on cards and table dividers.

### Text
- **Ink** (`{colors.ink}`, `#1d1d1d`): Primary body text on light surfaces. Just shy of pure black.
- **Ink Mute** (`{colors.ink-mute}`, `#696969`): Secondary text, captions, helper copy.
- **On Primary** (`{colors.on-primary}`, `#ffffff`): Text on aubergine surfaces and filled CTAs.
- **On Aubergine Mute** (`{colors.on-aubergine-mute}`, `#d9bdde`): Secondary text on aubergine surfaces, a desaturated mauve that reads as muted-light.

### Semantic
- **Error** (`{colors.semantic-error}`, `#cc4117`): Form error and destructive-action color.
- **Success** (`{colors.semantic-success}`, `#007a5a`): Inline success indicators.


---

## 47. Spasex (Inspired): Typography

**Why this stood out:** Uppercase D-DIN set in tight vertical leading against pure black and full-bleed rocket photography is about as austere and mission-serious as display type gets.

### Font Family

The display tier is **D-DIN-Bold**, a condensed industrial sans inspired by the German DIN 1451 standard (used on autobahn road signage and engineering blueprints). When unavailable, fall back to **Arial Narrow**, then Arial, then Verdana, the fallback chain prioritizes width compression over ornament.

The UI tier is **D-DIN** (regular weight), the same family at standard width, used for body, button labels, and captions.

D-DIN is freely available from the **DIN Type Foundry** (and a free version under the same name is widely distributed). For maximum brand fidelity, use D-DIN directly; as a substitute, **Inter** at heavy weights (700+) with letter-spacing of 1.6px positive tracking approximates the rhythm. Avoid serif or humanist sans alternatives.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 80px | 700 | 0.95 | 1.6px | Hero headline (uppercase) |
| `{typography.display-xl}` | 60px | 700 | 1.2 | 1.2px | Section opener (uppercase) |
| `{typography.display-lg}` | 48px | 700 | 1.25 | 0.96px | Sub-section heading (uppercase) |
| `{typography.body-lg}` | 16px | 400 | 1.7 | 0.32px | Marketing body lead |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0.32px | Default UI body |
| `{typography.button-cap}` | 13.008px | 700 | 0.94 | 1.17px | All-caps button label |
| `{typography.micro-cap}` | 12px | 400 | 2.0 | 0.96px | All-caps eyebrow / nav item |
| `{typography.caption}` | 13.008px | 400 | 1.5 | 0 | Helper / footer text |

### Principles
- **Uppercase across display.** Every display tier renders in uppercase. The brand never uses sentence-case display headlines.
- **Tight vertical leading on display.** 0.95 at 80px and 1.2 at 60px, the type stacks engineer-tight.
- **Wide horizontal tracking.** Positive 0.96–1.6px tracking on display sizes; positive 0.96–1.17px on caps eyebrows. The wide tracking is the brand's signature optical air.
- **No mono.** Code blocks are not part of the brand's typographic system.

### Note on Font Substitutes
**D-DIN** is freely available (the original DIN-style face under that name is widely distributed). When unavailable, use **Inter** at 700 weight with `letter-spacing: 1.6px`, `text-transform: uppercase`, and `line-height: 0.95` for display sizes, this matches the rhythm. Avoid Helvetica or Arial at default weights, the brand needs the condensed industrial cut. Avoid serif fallbacks entirely.


---

## 48. Stripi (Inspired): Typography

**Why this stood out:** Thin 300-weight Sohne with negative tracking for editorial density, plus tabular figures specifically where money is shown, is a precise, purpose-built typographic system.

### Font Family

The display and UI tier is **Sohne** (proprietary, licensed from Klim Type Foundry) at weights 300 (thin) and 400 (regular). The variable font (`sohne-var`) is loaded with `font-feature-settings: "ss01"` enabled globally, the stylistic set substitutes a single-story `a` and other character variants that are part of the brand's typographic signature.

When Sohne is unavailable, fall back to **SF Pro Display** at thin weights, then system-ui. For maximum brand fidelity, **Inter** (open-source) at weight 300 with `font-feature-settings: "ss01"` and `letter-spacing: -1.4px` on display sizes approximates the rhythm closely.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 56px | 300 | 1.03 | -1.4px | Hero headline |
| `{typography.display-xl}` | 48px | 300 | 1.15 | -0.96px | Section opener |
| `{typography.display-lg}` | 32px | 300 | 1.1 | -0.64px | Card title / sub-section |
| `{typography.display-md}` | 26px | 300 | 1.12 | -0.26px | Compact card title |
| `{typography.heading-lg}` | 22px | 300 | 1.1 | -0.22px | Pricing tier name |
| `{typography.heading-md}` | 20px | 300 | 1.4 | -0.2px | Section sub-heading |
| `{typography.heading-sm}` | 18px | 300 | 1.4 | 0 | Mini-section label |
| `{typography.body-lg}` | 16px | 300 | 1.4 | 0 | Marketing body lead |
| `{typography.body-md}` | 15px | 300 | 1.4 | 0 | Default UI body |
| `{typography.body-tabular}` | 14px | 300 | 1.4 | -0.42px | Money / numeric tables (uses `tnum`) |
| `{typography.button-md}` | 16px | 400 | 1.0 | 0 | Pill button label |
| `{typography.button-sm}` | 14px | 400 | 1.0 | 0 | Compact pill label |
| `{typography.caption}` | 13px | 400 | 1.4 | -0.39px | Helper, table labels |
| `{typography.micro}` | 11px | 300 | 1.4 | 0 | Fine print |
| `{typography.micro-cap}` | 10px | 400 | 1.15 | 0.1px | All-caps eyebrow |

### Principles
- **Thin weight is the brand.** Display tiers always render at weight 300. Bumping to 400+ removes the brand's editorial air.
- **Negative tracking on display.** -1.4px at 56px, scaling proportionally down to -0.2px at 20px. The negative tracking is the brand's typographic signature.
- **Tabular figures for money.** Any cell rendering currency, transaction amounts, or numeric counts uses `font-feature-settings: "tnum"` plus a tightening tracking. The brand quietly signals its financial DNA through this micro-detail.
- **`ss01` globally.** Apply `font-feature-settings: "ss01"` to the body element so the stylistic-set substitution is on for every text role.

### Note on Font Substitutes
Sohne is proprietary. Use **Inter** (open-source via Google Fonts) at weight 300 with `letter-spacing: -1.4px` and `font-feature-settings: "ss01"` for display tiers, Inter is the closest open-source analogue. For body sizes, Inter at 300 weight with `font-feature-settings: "tnum"` (where applicable) is the canonical substitute. Avoid Helvetica or system-ui defaults, they're heavier than the brand needs.


---

## 49. Supabaze (Inspired): Colors

**Why this stood out:** A single emerald-green CTA is the only chromatic event on an otherwise near-monochrome canvas, restraint as the entire brand strategy.

> **Source pages:** home (`/`), `/database`, `/partners/integrations`, `/partners/integrations/powersync`, `/solutions/ai-builders`, `/pricing`.

### Brand & Accent
- **Emerald** (`{colors.primary}`, `#3ecf8e`): The signature CTA color. Filled-button background, brand wordmark accent, dot indicator.
- **Emerald Deep** (`{colors.primary-deep}`, `#24b47e`): Pressed-state lift of the primary.
- **Emerald Soft** (`{colors.primary-soft}`, `#4ade80`): Lighter emerald used in chart accents and product UI.
- **Accent Purple** (`{colors.accent-purple}`, `#6b01c2`): Rare accent used in integration logos and chart points; never a button.
- **Accent Violet** (`{colors.accent-violet}`, `#644fc1`): Secondary accent in the same role as accent purple.
- **Accent Yellow** (`{colors.accent-yellow}`, `#ffdb13`): Chart accent / status indicator only.
- **Accent Pink / Crimson / Indigo / Tomato**: Reserved for integration logos and rare chart highlights, never as system colors.

### Surface
- **Canvas** (`{colors.canvas}`, `#ffffff`): Default page background.
- **Canvas Soft** (`{colors.canvas-soft}`, `#fafafa`): Barely-tinted off-white for alternating section bands.
- **Canvas Night** (`{colors.canvas-night}`, `#1c1c1c`): Deep near-black used in code blocks, dashboard mockups, featured pricing tier.
- **Canvas Night Soft** (`{colors.canvas-night-soft}`, `#202020`): Slightly lifted dark for nested chrome.
- **Hairline** (`{colors.hairline}`, `#dfdfdf`): 1px borders on cards and tables.
- **Hairline Strong** (`{colors.hairline-strong}`, `#c7c7c7`): Slightly darker border for emphasis.
- **Hairline Cool** (`{colors.hairline-cool}`, `#ededed`) / **Hairline Cool 2** (`#efefef`) / **Hairline Cool 3** (`#d4d4d4`): The brand's grey ladder for fine chrome work.

### Text
- **Ink** (`{colors.ink}`, `#171717`): Default body text. Near-black, never pure.
- **Ink Secondary** (`{colors.ink-secondary}`, `#212121`): Slightly cooler near-black for body emphasis.
- **Ink Mute** (`{colors.ink-mute}`, `#707070`): Secondary text and helper copy.
- **Ink Mute 2** (`{colors.ink-mute-2}`, `#9a9a9a`): Tertiary text.
- **Ink Faint** (`{colors.ink-faint}`, `#b2b2b2`): Disabled / placeholder text.
- **On Primary** (`{colors.on-primary}`, `#171717`): Text on the emerald primary fill, near-black, not white. The button reads as a "lit" surface with dark type, not a colored chip.
- **On Dark** (`{colors.on-dark}`, `#ffffff`): Text on canvas-night surfaces.


---

## 50. Superhumon (Inspired): Components

**Why this stood out:** A deep-teal closing CTA band deliberately interrupts the indigo/white rhythm as a warm dark interlude, a structural surprise placed right before the page ends.

### Buttons

**`button-primary-dark`**, the dominant rounded-rectangle CTA on white surfaces.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `{spacing.md} {spacing.xl}` (12px 20px), rounded `{rounded.md}` 8px.
- Pressed state `button-primary-dark-pressed` shifts to `{colors.primary-deep}`.

**`button-on-dark-pill`**, the hero CTA in pale violet pill shape.
- Background `{colors.surface-violet-soft}`, text `{colors.primary}`, same typography, padding 12px 20px, rounded `{rounded.full}`. The pill shape only appears on the hero, body CTAs use the rounded rectangle.

**`button-secondary-outline`**, outline alternative on white.
- Background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.hairline-dark}` border, same shape as `button-primary-dark`.

**`button-on-teal`**, CTA inside the closing teal band.
- Background `{colors.canvas}`, text `{colors.surface-teal-deep}`, rounded-rectangle, same typography.

### Cards & Containers

**`card-feature-light`**, feature card on white.
- Background `{colors.canvas}`, padding `{spacing.xxl}`, rounded `{rounded.lg}`, 1px `{colors.hairline}` border.

**`card-pricing`**, standard pricing tier card.
- Background `{colors.canvas}`, padding `{spacing.xxl}`, rounded `{rounded.lg}`, 1px `{colors.hairline}` border.

**`card-pricing-featured`**, inverted indigo featured tier.
- Background `{colors.primary}`, text `{colors.on-primary}`, otherwise identical to `card-pricing`.

**`card-teal-band`**, the closing CTA band on every page.
- Background `{colors.surface-teal-deep}`, text `{colors.on-primary}`, padding `{spacing.huge}` 64px, rounded `{rounded.lg}` 12px (often radius-less in practice when full-bleed). Holds a single closing headline in `{typography.display-lg}` and a `button-on-teal`.

**`card-feature-row`**, alternating feature-row card on the body.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.xl}` 24px, rounded `{rounded.md}` 8px. Used in pairs/triplets to explain features below the hero.

### Inputs & Forms

**`text-input`**, standard form input.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, padding `{spacing.sm}+ {spacing.md}` (10px 12px), rounded `{rounded.sm}` 6px, 1px `{colors.hairline}` border.

### Navigation

**`nav-bar-dark`**, top nav over the indigo hero.
- Background `{colors.primary}`, text `{colors.on-primary}`, padding `{spacing.lg} {spacing.xl}`. Logo on the left, nav center, "Get Started" `button-on-dark-pill` on the right.

**`nav-bar-light`**, top nav on body / pricing pages.
- Background `{colors.canvas}`, text `{colors.ink}`, otherwise same structure with `button-primary-dark` on the right.

### Pills, Tags, and Chips

**`pill-tab-light`**, feature-row tab selector.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button-cap}`, padding `{spacing.sm} {spacing.lg}`, rounded `{rounded.full}`. Used in the feature category picker (Mail / Channels / Code / AI / Calendar etc.) below the hero.

### Signature Components

**Half-Bleed Portrait Hero**, a person photographed at twilight, occupying the right half of the indigo hero with violet-sky atmospheric backdrop behind. Type and CTA sit on the left side. The portrait is the brand's recurring visual signature.

**Closing Teal Band**, every page closes with a `card-teal-band` containing a `{typography.display-lg}` closing headline and a single `button-on-teal`. The teal is the page's resolving chord.

**`link-on-light`**, inline links on body.
- Text `{colors.ink}` rendered in `{typography.body-md}` with persistent underline.

**`footer-light`**, site-wide footer.
- Background `{colors.canvas}`, text `{colors.ink-mute}`, type `{typography.caption}`, padding `{spacing.huge} {spacing.xl}` (64px 24px). Holds 4 columns of link groups, social icons, and a small legal/copyright row.


---

---

# Part 3: Guardrails by Brand

What each system refuses to do. Read the guardrails for every pick you use before you write code. Up to four per brand, taken from the source specification.

## 1. Airbnb

*The source has no explicit Don't list. The rules below are derived from its stated shape language.*

- Don't introduce hard 0px corners on interactive elements. The shape language is soft, with pills for search and circles for icon buttons.
- Don't mix a second radius family into the same page.

## 2. Airtable

- Don't make `{colors.link}` (#1b61c9) the primary button color. It is the link color. The primary button is `{colors.primary}` (#181d26, near-black). Treating link-blue as the brand action is the most common mistake when reading Airtable's CSS variables.
- Don't add a gradient backdrop to the hero. Airtable's hero is white, full stop. Mesh, aurora, spotlight gradients all read as "another SaaS template", not Airtable.
- Don't bold display-weight type. `{typography.display-xl}` and `{typography.display-lg}` are intentionally weight 400 / 500, going to 700 reads as marketing-page-template.
- Don't use `{rounded.pill}` outside the pricing surface. It's a sub-system signal, not a general radius option.

## 3. Apple

- Don't introduce a second accent color; every "click me" signal is `{colors.primary}` (Action Blue).
- Don't add shadows to cards, buttons, or text, shadow is reserved for product imagery.
- Don't use gradients as decorative backgrounds; atmosphere comes from photography.
- Don't set body copy at weight 500, Apple's ladder is 300 / 400 / 600 / 700, with 500 deliberately absent. Body is always 400; strong inline is 600; display is 600.

## 4. Binance

- Don't introduce a second brand color. The system has exactly one accent (`{colors.primary}`) and any expansion dilutes the brand identity. The turquoise on Smart Money is a single-product experiment, not a system token.
- Don't use yellow for body text or large surface fills. It is for focal-point CTAs and headlines only.
- Don't use `{colors.trading-up}` / `{colors.trading-down}` as background fills on cards. They are price-direction signals, expressed as text color or small badge fill, never as a card surface.
- Don't soften display weight. `{typography.hero-display}` and `{typography.display-lg}` are intentionally weight 700, going to 400 reads as design-portfolio, not trading platform.

## 5. BMW

- Don't add a brand color other than blue, BMW Blue is the only primary action color.
- Don't use pill or rounded buttons, `{rounded.none}` (0px) rectangular IS the brand button.
- Don't drop display weight to 500, the system uses 700 / 400 / 300; 500 is absent.
- Don't bold body type, Light 300 is the BMW corporate editorial voice.

## 6. BMW M

- Don't introduce a brand color outside the M tricolor (`{colors.m-blue-light}` / `{colors.m-blue-dark}` / `{colors.m-red}`) and the heritage `{colors.bmw-blue}`.
- Don't bold body type. Body stays at 300 (Light), bumping to 400 or 500 makes the page feel marketing-bombastic instead of European-engineered.
- Don't use rounded buttons. The rectangular silhouette IS the brand. Rounded corners read as consumer-tech, not motorsport.
- Don't put gradient backdrops behind hero type. The hero IS the photography, the page floor stays pure black, and the photo provides the depth.

## 7. Bugatti

- Don't introduce any accent color outside `{colors.link}`. Bugatti's brand discipline is total monochrome + photography. Adding a brand-blue or brand-red breaks the contract.
- Don't bold any type. The system has no bold weight, every typeface stays at 400.
- Don't fill primary buttons. Transparent + outline only. A solid white button reads as off-brand.
- Don't compress whitespace between sections. The 120px rhythm is part of the editorial pacing.

## 8. Cal.com

- Don't use accent colors (`{colors.brand-accent}`, badge pastels) on primary CTAs. The system is monochrome at the action layer.
- Don't bold display weight beyond 600. Cal Sans at 700 reads as bombastic.
- Don't use rounded radius beyond `{rounded.xl}` (16px) on cards. Larger radii read as consumer-app, not professional booking software.
- Don't put dark surface cards anywhere except the footer and the featured pricing tier. The dark surface is a deliberate, scarce signal.

## 9. Claude

- Don't use cool grays or pure white for canvas. Cream is the brand.
- Don't bold serif display weight. Copernicus at 700 reads as bombastic; the system stays at 400.
- Don't use cool blue or saturated cyan as a brand accent. The coral is the brand voltage.
- Don't put coral everywhere. The coral is scarce on individual elements and generous only on full-bleed coral callout cards.

## 10. Clay

- Don't use cool grays for canvas. The cream tint is non-negotiable.
- Don't use a 7th brand-color card. The 6-color palette is saturated enough.
- Don't bold display weight beyond 500. Plain Black at 700 reads as bombastic.
- Don't repeat the same brand-color card twice in a row.

## 11. ClickHouse

- Don't introduce a second brand color. ClickHouse is monochromatic + yellow.
- Don't bold display weight beyond 700 or use weight 500 for headlines. The hierarchy depends on size, not on weight gradation.
- Don't use yellow for body text or large surface fills outside of intentional yellow cards.
- Don't use rounded buttons / pills outside of small badges. The standard button radius is 8px (md).

## 12. Cohere

- Do not turn coral or blue into broad decorative surface colors.
- Do not add heavy drop shadows to cards.
- Do not make every section card-based; Cohere often uses unframed rows, rules, and open space.
- Do not use rounded cards below 8px for major media.

## 13. Coinbase

- Don't introduce a secondary brand color. Coinbase Blue is the only action color; trading green/red are semantic-only.
- Don't bold display copy, display sits at weight 400; bolding shifts the brand voice.
- Don't add drop shadow tiers, system has one shadow tier.
- Don't use sharp `{rounded.none}` (0px) on CTAs.

## 14. Composio

- Don't introduce a secondary brand color. Cyan and violet are illustrative-only.
- Don't use full pills on CTAs.
- Don't drop display weight to 400.
- Don't add drop shadow tiers.

## 15. Cursor

- Don't introduce a secondary brand action color. Cursor Orange is the only one.
- Don't drop display to bold weights (700+). Magazine voice depends on 400.
- Don't add drop shadows. Hairlines + ink-on-cream contrast carry the depth.
- Don't use timeline pastels on non-timeline UI. They're scoped to the agent timeline only.

## 16. ElevenLabs

- Don't introduce a saturated brand action color. Ink pill is the only CTA color.
- Don't bold display copy. Display sits at weight 300, bolding shifts the brand voice from editorial to consumer-marketing.
- Don't use gradient orbs as button fills, text colors, or component backgrounds. They are pure atmosphere.
- Don't use sharp `{rounded.none}` (0px) on CTAs. Pill geometry is the brand button.

## 17. Expo

- Don't introduce a saturated brand action color. Black is the only CTA fill.
- Don't use blue (`{colors.text-link}`) on a CTA. Inline links only.
- Don't drop display below weight 600 or above 700.
- Don't use full pills on CTAs, pills are for badges only.

## 18. Ferrari

- Don't introduce a saturated brand color other than Rosso Corsa.
- Don't use rounded or pill CTAs, sharp 0px corners are the brand button.
- Don't bold display copy. The cinematic photography does the visual heavy-lifting.
- Don't use Hypersail yellow outside the Hypersail sailing program context.

## 19. Figma

- Don't introduce mid-gray text. Body hierarchy comes from `figmaSans` weight, not from opacity.
- Don't add drop shadows to color-block sections, the color is the depth device.
- Don't introduce new accent colors outside the documented `{colors.block-*}` palette and `{colors.accent-magenta}`. Adding, e.g., a saturated brand orange would break the system.
- Don't combine more than one color block visible inside a single viewport, Figma's pacing always lets the white canvas separate them.

## 20. Framer

- Don't ship a light-mode marketing page. Framer's identity is dark.
- Don't introduce mid-tone gray text outside `{colors.ink-muted}`. The hierarchy is binary: `ink` or `ink-muted`.
- Don't use `{colors.accent-blue}` as a brand fill (e.g., a blue CTA pill). The blue is a signal color, not a surface.
- Don't square off CTAs. Pill (`{rounded.pill}`) or full circle is the brand vocabulary.

## 21. HashiCorp

- Don't ship a light-mode marketing page. HashiCorp's marketing brand IS dark.
- Don't introduce mid-tone gray text outside the documented `ink` / `ink-muted` / `ink-subtle` set.
- Don't square off CTA corners, use `{rounded.md}` 8px, not 0px.
- Don't use a product accent color for a CTA on a page that isn't about that product. Terraform purple on the Vault page is a brand violation.

## 22. IBM

- Don't round corners on buttons, cards, or inputs. Even 4px rounded corners break the Carbon look.
- Don't bold display headlines. Plex Sans at weight 300 is the brand voice; weight 700 makes it look generic.
- Don't add atmospheric depth (gradient backdrops, drop shadows, atmospheric overlays) outside the documented soft-blue hero gradient.
- Don't introduce a second brand color. IBM Blue is the only chromatic accent; status semantics use the documented green / yellow / red.

## 23. Intercom

- Don't use pure white as the canvas.
- Don't use Fin Orange as a section background or as a generic primary CTA.
- Don't add drop shadows to floating cards.
- Don't introduce a second display family.

## 24. Linear

- Don't ship a light-mode marketing page.
- Don't use lavender as a section background or card fill.
- Don't introduce a second chromatic accent (orange, pink, green for marketing).
- Don't add atmospheric gradients or spotlight cards.

## 25. MongoDB

- Don't use the bright green for body text or large surfaces
- Don't introduce additional accent colors beyond the brand green and category-encoding palette
- Don't soften corners on buttons; the pill is a brand signature
- Don't replace deep teal hero bands with white hero bands

## 26. Meta

- Don't use `{colors.primary}` (cobalt) for marketing-surface primary buttons, it conflicts with Meta's brand-history positioning of black-CTA-on-white-canvas marketing.
- Don't introduce additional accent colors beyond cobalt + Oculus purple. The hardware brand is deliberately monochromatic outside its product photography.
- Don't soften the corners of pill buttons below `{rounded.full}`. The pill is a brand signature.
- Don't run feature cards without rounding, `{rounded.xxxl}` is the minimum for any photographic surface.

## 27. MiniMax

- Don't use brand-coral or brand-magenta on body text or large surfaces, they lose meaning when overused.
- Don't soften corners on buttons (anything less than `{rounded.full}`); the pill is a brand signature.
- Don't introduce a second display typeface; DM Sans handles every role.
- Don't reduce hero leading below 1.10, the brand needs that breathing room on the 80px display.

## 28. Mintlify

- Don't use `{colors.brand-green}` on body text or large surfaces, it loses signal
- Don't introduce additional accent colors beyond mint, tag-blue, error-red, and the testimonial orange
- Don't apply heavy shadows on flat documentation cards; reserve elevation for the hero product mockup
- Don't reduce documentation line-height below 1.50, long-form readability suffers

## 29. Miro

- Don't use `{colors.brand-yellow}` on standard CTAs or large background surfaces
- Don't introduce additional accent colors beyond yellow + brand pastels
- Don't soften corners on buttons; the pill is a brand signature
- Don't reduce hero leading below 1.05

## 30. Mistral AI

- Don't use pill-shaped buttons (`{rounded.full}`), Mistral's geometry is sober and editorial, not playful
- Don't introduce additional accent colors beyond the orange/yellow/cream sunset palette
- Don't reduce hero leading below 1.05, the editorial display needs that magazine-grade tightness
- Don't replace PP Editorial Old hero displays with Inter, the editorial / sans contrast IS the brand

## 31. Nike

- Don't introduce drop shadows or card elevation. Cards sit flat on the page; the only depth cue is the 1px inset hairline on sticky bars.
- Don't use any of the category accent colors (`{colors.accent-pink}`, `{colors.accent-purple-soft}`, `{colors.accent-teal}`) for primary chrome, they belong to swatch dots, soft tile fills, and editorial moments only.
- Don't replace `{colors.ink}` with a near-black gray like `{colors.charcoal}` for a CTA, Nike's primary pill is true `#111111`.
- Don't pad inside product cards. The image is full-bleed; metadata sits directly below with `{spacing.sm}` (8px) between rows.

## 32. Notion

- Don't use the purple for body text or large background surfaces
- Don't use pill-shaped buttons; Notion's geometry is rectangular-sober
- Don't mix link-blue ({colors.link-blue}) with primary-purple ({colors.primary}), they have distinct roles
- Don't apply heavy shadows on flat documentation cards

## 33. NVIDIA

- Don't introduce drop shadows on cards or content surfaces. The only allowed shadow is the 5px ambient on sticky chrome.
- Don't substitute `{colors.success-deep}`, `{colors.accent-green-pale}`, or any other green for `{colors.primary}` in CTAs. The brand green is precise.
- Don't use `{colors.link-blue}` outside of inline body-prose links. It is not a button color, not a chrome color.
- Don't soften the geometry. No pill buttons, no rounded cards, no `{rounded.lg}` or higher anywhere except avatars and social icons.

## 34. Ollama

- Don't introduce gradients, drop shadows, or atmospheric backgrounds. The canvas is pure `{colors.canvas}`.
- Don't add brand colors. The system is `{colors.primary}` (black) on `{colors.canvas}` (white) with `{colors.body}` (gray) text. That is it.
- Don't soften pills or sharpen cards, pills stay `{rounded.full}`, cards stay `{rounded.lg}`. Don't introduce `{rounded.md}` for buttons or `{rounded.full}` for cards.
- Don't lift cards with shadows. Use a 1px `{colors.hairline}` border or invert to `{colors.surface-dark}`, those are the only two card treatments.

## 35. OpenCode

- Don't introduce a sans-serif body font, a display face, or an italic style. Berkeley Mono carries everything.
- Don't add drop shadows, gradients, or atmospheric backgrounds. The system is flat-on-cream.
- Don't replace the ASCII bracket markers with SVG icons. The brackets are the icons.
- Don't use the semantic accent ramp (`{colors.accent}`, `{colors.warning}`, `{colors.danger}`, `{colors.success}`) on marketing CTAs. They belong to the in-product TUI.

## 36. Pinterest

- Don't use sharp-cornered buttons or cards. There are no `{rounded.none}` interactive elements in the system.
- Don't introduce drop shadows on cards. The only shadow in the system is the 16px ambient under `{component.modal-card}`.
- Don't pad `{component.pin-card}` internally. The image is full-bleed; metadata sits over the image as an overlay pill, not below it.
- Don't replace `{colors.primary}` with another red. The brand red is precise, `#e60023`.

## 37. PlayStation

- Don't introduce drop shadows on resting cards. The system is flat-on-canvas; cards lift only on press.
- Don't replace `{colors.primary}` with another shade of blue. The brand blue is precise, `#0070d1` for default and `#0064b7` for pressed.
- Don't use `{colors.commerce}` (orange) on marketing/hero CTAs. It's reserved exclusively for store actions.
- Don't introduce a sans-serif body font, italic, or monospace style. PlayStation SST carries every text role.

## 38. PostHog

- Don't introduce drop shadows on cards. Cards sit flat on cream with thin olive borders only.
- Don't add a second saturated chromatic CTA. Yellow-orange is the only loud color in the system.
- Don't replace the cream canvas with pure white or full-bleed dark hero bands. The cream is the brand.
- Don't use the four-color callout banner pastels (`{colors.accent-blue-soft}`, `-green`, `-red`, `-purple`) as marketing-card backgrounds. They belong to inline doc content only.

## 39. Raycast

- Don't introduce a light mode. The system is dark-only by design.
- Don't add drop shadows on cards. Elevation is built from the surface ladder, not from shadows.
- Don't replace `{colors.primary}` (white) with a tinted accent for the primary CTA. Pure white is the brand action color.
- Don't use the saturated accent colors (`{colors.accent-yellow}`, `{colors.accent-red}`, `{colors.accent-green}`, `{colors.accent-blue}`) on text, buttons, or chrome surfaces. They belong inside extension illustrations.

## 40. Renault

- Don't introduce a secondary accent colour. Yellow is the only brand accent; semantic colours (`{colors.error}`, `{colors.success}`, `{colors.warning}`) are functional, not decorative.
- Don't round vehicle cards or promo tiles. Square-cornered photography is core to the brand expression.
- Don't soften body weights to 500 or 600, the system relies on the 400 / 700 contrast.
- Don't apply `{colors.primary}` to body text or large surfaces beyond the single accent tile per band.

## 41. Replicate

- Don't replace cream with pure white at the page level. The brand temperature comes from `{colors.canvas}`.
- Don't introduce a secondary brand colour. Orange is the only accent; semantic green and focus blue are functional, not decorative.
- Don't loosen display `lineHeight` past 1.0. Tight stacking is structural.
- Don't bump body weight to 500 for emphasis, change family (`basier-square` → `rb-freigeist-neue`) instead.

## 42. Resend

- Don't use a near-black canvas. The brand sits on `#000000`, not `#0a0a0a`.
- Don't apply solid colour to atmospheric accent tokens. `{colors.accent-orange}` is for inline highlights only, its glow form is for backdrops.
- Don't add drop shadows to feature cards or code wells. Translucent white borders carry depth on this canvas.
- Don't bump body weight to 600 for emphasis. Use family change (Inter → ABC Favorit → Domaine Display) instead.

## 43. Revolut

- Don't use accent colours (`{colors.accent-teal}`, `{colors.accent-pink}`, etc.) as button surfaces. They live inside illustrations only.
- Don't use a near-black canvas. The brand is `#000000`, not `#0a0a0a`.
- Don't pair white text with cobalt violet inside body content, `{colors.primary}` is for the featured plan card surface, not large prose.
- Don't add drop shadows on cards. Elevation is canvas + surface-luminance shifts.

## 44. Sentri (Inspired)

- Don't introduce additional accent colors beyond `{colors.accent-lime}` and `{colors.accent-pink}`, adding teal, orange, or yellow dilutes the violet-and-lime signature.
- Don't apply drop shadows to cards on dark canvas, depth comes from texture and illustration, not from light-on-dark shadows that would muddy the violet.
- Don't use `{typography.display-hero}` (88px) for anything except the marketing hero, even sub-pages cap at `{typography.display-large}` (60px).
- Don't put body text in `{colors.accent-lime}`, it's a chip color, not a type color, and breaks contrast at body sizes.

## 45. Shopifi (Inspired)

- Don't introduce a third canvas color, stick to black or light/cream. Greys, beiges, and blues are not in the system.
- Don't add drop shadows on cinematic dark cards beyond the subtle inset top-highlight; the cinematic track wants flat blackness.
- Don't shrink display tiers below `{typography.display-md}` (48px) on hero surfaces; below that they read as section heads, not display.
- Don't put aloe / pistachio greens behind type, they're surface fills, not text colors.

## 46. Slacc (Inspired)

- Don't add a third accent color to the system, the aubergine + blue link combination is exhaustive.
- Don't shrink button padding below `14px 28px`, the over-padded pill is part of the brand feel.
- Don't render display tiers at default tracking (0), without negative letter-spacing the headlines read loose and unedited.
- Don't put product UI screenshots inside cards, they sit ABOVE the pastel-mesh gradient, never inside chrome.

## 47. Spasex (Inspired)

- Don't introduce brand accent colors, black, white, and photography are the entire palette.
- Don't use drop shadows or gradient overlays on dark canvas, they fight the photography.
- Don't render display tiers in sentence-case or title-case, uppercase is the brand.
- Don't put filled buttons on marketing surfaces, the ghost outlined pill is the only marketing CTA.

## 48. Stripi (Inspired)

- Don't bump display weight above 300, at 400 the brand's editorial air collapses.
- Don't add new accent colors outside the documented gradient stops (cream / orange / lavender / indigo / ruby / magenta).
- Don't use the indigo `{colors.primary}` as a body-text color, it's a CTA and link color, not a type color at body size.
- Don't shrink button padding below `8px 16px`, the tight pill is part of the brand's transactional feel.

## 49. Supabaze (Inspired)

- Don't introduce additional accent colors as system colors, purples, yellows, and pinks belong inside chart points and integration logos only.
- Don't bump display weight above 500, the brand's calibrated mid-weight breaks at 600+.
- Don't use pill-shaped buttons; the brand's button radius is square-ish 6px.
- Don't use white text on the emerald button, the brand specifically uses near-black on green.

## 50. Superhumon (Inspired)

- Don't use pill-shaped buttons in the body of the page; the pill is hero-only.
- Don't bump display weight above 540 unless using `body-strong` (700) for emphasized inline body.
- Don't render body text in pure black, the warm grey `#292827` is part of the brand.
- Don't omit the closing teal band, every marketing page closes with it.

