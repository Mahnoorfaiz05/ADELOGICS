# Content to replace before launch

The site has two builds:

- **Review build** (`npm run build:review`): shows demo content, always labelled *Demo* or *Sample*, so every section can be judged with realistic material.
- **Production build** (`npm run build`): removes all demo content automatically. Sections without real content are hidden.

Every demo item lives in one place: `src/content/company.mjs`, marked `demo: true`. Replace an entry with real information and delete `demo: true`, and it appears in production. Nothing marked demo is presented as real anywhere on the site.

## Demo content to replace

| Item | Where it lives | Where it appears | What is needed |
|---|---|---|---|
| **6 demo projects** (Carevia, Pitlane, Learnloop, Keyline, Oakbasket, Ledgerline) | `projects` in `company.mjs`; images in `src/assets/demo/work/<slug>/` | Home "Selected work", Portfolio, project pages, related work on service pages | Per project: name, category, industry, year, headline, intro, overview, context, challenge, solution, features, technologies, 3 or more screenshots (16:10, at least 1600px wide), and **verified** results with their source. Client names only with written approval. Put images in `src/assets/work/<slug>/`. |
| **Hero demo reel** | `heroMedia` in `company.mjs`; `src/assets/demo/hero/` | Home hero | The company film: MP4 (H.264), 16:9 or 16:10, ideally under 6 MB, no audio needed, plus a poster image. Until then production shows the illustrated system diagram. |
| **5 sample testimonials** | `testimonials` | Home, Portfolio, Contact, project pages | Exact quote, name, role, company, written permission; optional headshot. |
| **4 demo team profiles + leadership message** | `team`, `companyMessage` | Home team section, About | Name, role, one-line focus, portrait photo (4:5, at least 800x1000, consistent style) and a short message from leadership in their own words. |
| **Company story** | `story` | About page | When and where founded, by whom, why, and where the company is today. |
| **NextWys logo file** | `clients` (first entry) | Logo strip under the hero | Official logo as SVG (or transparent PNG) saved as `src/assets/clients/nextwys.svg`, then set `file: 'nextwys.svg'`. Until then the review build shows the name as text and production hides the strip. The reference site nextwys.com could not be reached from the build environment. |
| **7 placeholder logos** | `clients` (generic marks in `src/assets/demo/clients/`) | Logo strip | Approved logos of real clients or partners, with permission to display. |
| **Unconfirmed technologies** | `technologies` (`confirmed: true` marks approved ones) | Technologies sections, service and project pages | Tick the tools the team genuinely uses. Only Figma, WordPress, Android and iOS are confirmed so far. |

## Business facts and settings (`site.config.mjs` or environment variables)

| # | Item | Notes |
|---|---|---|
| 1 | Business email | Contact page, footer, form fallback |
| 2 | Phone and/or WhatsApp | Contact page, footer |
| 3 | Location | Contact page, footer, Privacy Policy |
| 4 | Form delivery | `FORM_ENDPOINT` plus Resend API key and inbox (see README) |
| 5 | Final domain | `SITE_URL`, currently assumed `https://www.adelogix.com` |
| 6 | Booking link | Enables "Book a call" in the CTA, contact page, footer and menu |
| 7 | Social profile URLs | Footer and Organization schema |
| 8 | GA4 ID, Search Console token | Analytics loads only after cookie consent |
| 9 | Vector logo (SVG/AI/EPS) | Supplied logos are small JPEGs; a vector master would sharpen large uses |
| 10 | Legal details | Registered address, governing law, retention period and processors in the legal pages; legal review before launch |

## Statements to confirm

Written from the requirements document and phrased conservatively. Please confirm they match how Adelogix works:

- "One point of contact", "regular progress updates at an agreed rhythm", "decisions recorded in writing", "working software on a staging link"
- "We are happy to sign a non-disclosure agreement" (Services FAQ)
- Source code ownership approach (Web Development FAQ)
- Budget ranges on the contact form (USD)
- The seven industries and the services linked to each
