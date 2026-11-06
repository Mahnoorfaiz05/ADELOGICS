# Adelogix website: design specification

## 1. Direction: "Connected logic"

The Adelogix mark is three nodes joined into one shape. The site borrows that idea literally: things that are connected. Nodes and hairline connectors appear in the hero system map, the process timeline and list markers. Everything else stays quiet so the content and the mark carry the identity.

Two surfaces alternate to give rhythm:

- **Paper** (warm off-white) for reading-heavy sections. Editorial, calm, high contrast.
- **Ink** (violet-tinted near-black) for moments of emphasis: hero, process, final CTA, footer. Here the brand gradient appears as a soft aura, never as a flat fill.

Purple is an accent, not a background colour. It appears in the mark, the aura, focus states, small indicators and links.

## 2. Reference analysis

The two reference websites (elexoft.com, nextwys.com) could not be inspected: the build environment's network policy blocks both hosts. The direction below is based on the five supplied Behance screenshots only.

| Reference | What works | Used for Adelogix |
|---|---|---|
| VYRO (AI glasses) | Black canvas with a single indigo/violet light source; huge wordmark sign-off; mono-weight sans display type with grey/white two-tone statements | Ink hero and CTA with a single violet aura from the logo gradient; full-width logo sign-off in the footer; two-tone intro statement |
| Numera (accounting) | Editorial cream background, left-aligned large headings, small numbered eyebrows, strong grid, one dark surface colour for contrast blocks, tokenised radius/spacing | Paper surface, numbered mono eyebrows, 12-column grid, documented tokens, alternating paper/ink sections |
| Spora (plant app) | Generous whitespace, product framed as large objects, tight type pairing | Large framed visuals in featured cards; restraint in section count per screen |
| MOVA (real estate) | Confident single accent colour, oversized "Thanks" type, clean property cards with consistent crops | One accent colour family; consistent 16:10 project crops; giant type used once, as a sign-off |

What we deliberately did not take: lime/green palettes (not Adelogix), heavy product photography we do not have, and literal copies of any layout.

| Design area | Reference evidence | Adelogix implementation |
|---|---|---|
| Header | VYRO/Numera floating top bars | Floating ink capsule, white logo, four links, white CTA pill |
| Hero | VYRO dark canvas + glow | Ink canvas, violet aura, left-aligned headline, system map derived from the mark |
| Client logos | Behance footer carousels | Slow, pausable marquee with normalised logo heights; static grid for reduced motion |
| Services | Numera building-blocks grid | Three featured cards with abstract visuals, then an indexed list for the other six |
| Case studies | Spora/MOVA large framed screens | 16:10 framed visual + challenge / solution / outcome columns |
| Testimonials | Numera editorial quotes | Single large editorial quote with attribution rail |
| Team | Behance owner cards | 4:5 portraits, name and role, short company message beside |
| Footer | VYRO wordmark sign-off | Four-column navigation, then full-width logo |

## 3. Colour tokens

| Token | Value | Use |
|---|---|---|
| `--brand-700` | `#3F3282` | Logo gradient start, links on paper |
| `--brand-500` | `#6A42A0` | Accents |
| `--brand-400` | `#7B499E` | Logo gradient end |
| `--brand-300` | `#A792D8` | Accents on ink |
| `--brand-100` | `#ECE7F7` | Tints, chips |
| `--ink-950` | `#0E0B18` | Ink sections |
| `--ink-900` | `#15121F` | Primary text, buttons on paper |
| `--ink-800` | `#1E1A2C` | Cards on ink |
| `--text-2` | `#4F4A5E` | Secondary text (7.9:1 on paper) |
| `--text-3` | `#6E6980` | Metadata (4.9:1 on paper) |
| `--paper` | `#F4F2EE` | Page background |
| `--paper-2` | `#EAE7E1` | Alternate surface |
| `--card` | `#FFFFFF` | Cards |
| `--line` | `rgb(21 18 31 / 0.12)` | Hairlines |
| `--success / --warning / --error` | `#1E7A4C / #9A5B06 / #B42318` | Form states |

## 4. Typography

The logo wordmark is set in Inter, so the site uses **Inter** for everything (display tracking tightened), with **JetBrains Mono** for small labels and indexes to add an engineered, technical note. Poppins and Roboto are not used. Manrope was considered; Inter wins because it matches the wordmark exactly.

| Token | Size (min to max) | Line height | Tracking | Weight |
|---|---|---|---|---|
| Display | 44 to 104px | 0.96 | -0.045em | 500 |
| H1 | 40 to 76px | 1.0 | -0.04em | 500 |
| H2 | 32 to 56px | 1.04 | -0.035em | 500 |
| H3 | 22 to 28px | 1.18 | -0.02em | 500 |
| H4 | 18px | 1.3 | -0.01em | 600 |
| Body L | 17 to 20px | 1.55 | -0.01em | 400 |
| Body | 16px | 1.6 | 0 | 400 |
| Small | 14px | 1.5 | 0 | 400 |
| Eyebrow (mono) | 12px | 1.4 | 0.06em, uppercase | 500 |
| Button / nav | 15px | 1 | -0.005em | 500 |

Measure: paragraphs max 62ch, leads max 54ch, headings max ~16 to 20ch.

## 5. Layout tokens

- Container: 1320px max, gutter `clamp(20px, 4vw, 56px)`
- Grid: 12 columns, gap `clamp(16px, 2vw, 28px)`
- Section padding: `clamp(80px, 11vw, 152px)` vertical
- Radius: 6 / 12 / 20 / 28px and pill. Cards use 20px; buttons are pills.
- Buttons: 48px (default), 56px (large). Inputs: 52px.
- Image ratios: projects 16:10, team 4:5, service visuals 4:3.
- Breakpoints: 640 / 900 / 1200px.

## 6. Motion

- Ease `cubic-bezier(.2,.7,.2,1)`; durations 160ms (hover), 320ms (UI), 700ms (reveal).
- Reveal: 16px rise + fade, once, via IntersectionObserver.
- Hero map: signal dots travel the connectors (SMIL), paused under reduced motion.
- Logo marquee: 40s linear loop with duplicated track, pauses on hover/focus; static wrap under reduced motion.
- No parallax, no scroll hijacking, no intro sequence.

## 7. Responsive behaviour

- **Header:** full nav at 900px+, menu button and full-screen ink panel below.
- **Hero:** two columns at 1200px+ (headline / system map), stacked below with map scaled down to max 520px.
- **Services:** 3 featured cards to 1 column below 900px; indexed list 2 columns to 1 column below 900px.
- **Projects:** visual and text side-by-side at 900px+, stacked below.
- **Process:** 4 columns at 1200px+, 2 at 640px+, 1 below, with the connector line becoming vertical.
- **Footer:** 4 columns to 2 to 1.

## 8. Redesign additions (November 2026)

- **Header:** floating glass capsule with two themes. Dark glass (white logo and links) over ink sections, light glass (colour logo, ink text) over paper. `data-nav-dark` marks dark sections; a small script switches theme on scroll. Active page is shown with a dot under the link; Home is in the navigation.
- **Hero:** inset ink panel (VYRO reference) with headline and CTAs on the left and a 16:10 media frame on the right for the company film. The demo reel is muted, loops, plays only when visible, pauses for reduced motion and has an accessible play/pause button. Without a film, the illustrated system diagram is shown.
- **Icons:** one 24px line-icon family (1.6 stroke) for services, industries, process stages and reasons, inside 48px rounded badges.
- **Sections:** no numbered section labels; short eyebrows plus meaningful headings. Services are compact icon tiles. Work uses a bento layout and project cards with real-looking interface mockups. Process is a connected track whose line and nodes light up in sequence. Why Adelogix is a bento with a dark feature card. Industries are icon cards linking to related services. Testimonials are a keyboard-accessible carousel. The CTA panel pairs the headline with an orbit graphic and a three-step "what happens next" row. The footer carries the mark as a faint watermark behind the columns.
- **Project pages:** first view shows category, industry, year, name, headline, intro, technologies and the main visual. The full case study sits below in an expandable section (open by default without JavaScript, deep-linkable via `#case-study`).
