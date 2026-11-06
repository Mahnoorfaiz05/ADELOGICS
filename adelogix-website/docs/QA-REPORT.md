# QA report: redesign

Date: 1 November 2026. All tests ran in the build environment with Chromium (Playwright) against locally served builds.

## Limitations

- **Reference websites not inspected.** elexoft.com and nextwys.com are blocked by the environment's network policy. Design direction comes from the supplied screenshots (VYRO, Numera, Spora, MOVA). For the same reason the NextWys logo could not be fetched.
- **Google Fonts blocked in the environment.** Previews used the locally installed Inter and JetBrains Mono, the same families the live site loads.
- **No Lighthouse score, no Safari/Firefox, no real devices.** Only Chromium at emulated widths. Nothing is deployed.
- **No lint or type-check tooling exists** in this dependency-free project (npm is unreachable). JavaScript syntax was checked with Node.

## Automated crawl (`npm run qa`)

| Build | Pages | Viewports | Result |
|---|---|---|---|
| Review (`dist-review`) | 22 + 404 check | 1440, 834, 390px | No problems found |
| Production (`dist`) | 16 + 404 check | 1440, 834, 390px | No problems found |

Checks per page: HTTP status, internal links and anchors, failed requests, broken images, missing alt text, empty or `#` links, console and page errors, exactly one `h1`, meta description length, horizontal overflow at each width, em/en dashes in visible text. Unknown URLs return the custom 404 with status 404.

A class audit (every class used in the HTML has a CSS rule) found and fixed a missing two-column layout after the stylesheet rewrite.

## Interaction tests (Playwright)

| Test | Result |
|---|---|
| Header is dark glass over the hero, light glass over paper sections, dark again over the process panel | Pass |
| Home link present and marked as the active page | Pass |
| Hero video autoplays muted when visible; native controls replaced by a labelled play/pause button | Pass |
| Pause button pauses and relabels to "Play video" | Pass |
| Reduced motion: video does not autoplay; button offers "Play video" | Pass |
| Testimonial carousel: previous disabled at start, next scrolls one card, dots track position, arrow keys work, next disabled at end | Pass |
| Project page opens with the case study collapsed (blocks hidden, content still in the HTML) | Pass |
| "Read the case study" expands, relabels to "Hide the case study", moves focus to the case study heading, updates the URL to `#case-study` | Pass |
| Direct link to `/work/<slug>/#case-study` opens the case study | Pass |
| Related projects show 3 cards and no "View all projects" button; no client name field on project pages | Pass |
| Portfolio filter "Mobile" shows only mobile projects | Pass |
| Mobile menu includes Home, opens, and closes with Escape | Pass |
| Production build contains no demo badges, demo assets or demo routes (demo project URLs return 404); hero shows the diagram fallback | Pass |
| No JavaScript errors on any tested page | Pass |

Contact form behaviour (validation, honest "not connected" state, success only on a 2xx response, input kept on failure) was tested in the previous round and the form markup and script are unchanged apart from reading the endpoint at submit time.

## Visual review

Full-page screenshots of the home, about, services, a service page, work, a project page and contact were reviewed at desktop and mobile. Fixed during review: demo label colliding with video captions, badge text invisible on dark cards and in the footer, list indentation in process stages, an orphan card in the portfolio grid, the skip link peeking above the page, and the fallback diagram rendering at 300px instead of filling its column.

Note: Chromium's full-page screenshot does not paint lazy-loaded images far below the fold. A scroll test confirmed all project images load (naturalWidth 1600) in normal use, and the QA script now scrolls the page before capturing.

## Weight

| Build | Size | Notes |
|---|---|---|
| Production | about 1.1 MB in total | No demo assets; one CSS file (about 70 KB unminified) and one JS file (about 19 KB), no frameworks |
| Review | about 3.0 MB in total | Includes the 1 MB demo reel and 18 WebP mockups (22 to 35 KB each) |

Below-the-fold images use `loading="lazy"` with explicit width and height to prevent layout shift; the hero poster is preloaded; the video uses `preload="metadata"` and plays only while visible.
