# Adelogix website

Company website for Adelogix Software Technology. A static, multi-page site built with a small Node script: no frameworks, no npm dependencies, plain HTML/CSS/JS output.

- Design rationale, tokens and reference analysis: [`docs/DESIGN-SPEC.md`](docs/DESIGN-SPEC.md)
- Everything still needed before launch: [`docs/CONTENT-NEEDED.md`](docs/CONTENT-NEEDED.md)
- Tests performed and results: [`docs/QA-REPORT.md`](docs/QA-REPORT.md)

## Requirements

Node.js 18 or newer. Playwright is only needed for `npm run qa` and `scripts/og-image.mjs`.

## Commands

| Command | What it does |
|---|---|
| `npm run build` | Production build to `dist/`. Placeholder content is removed. |
| `npm run build:review` | Review build to `dist-review/`. Includes the labelled demo content (projects, reel, testimonials, team, logos) so every section can be reviewed. `noindex` on every page. |
| `npm run build:portable` | Review build with relative links to `dist-portable/`; open `index.html` directly from disk. |
| `npm run serve` | Serves `dist/` at http://localhost:4321 |
| `npm run serve:review` | Serves `dist-review/` at http://localhost:4322 |
| `npm run qa -- http://localhost:4321 qa-shots` | Crawls every page: links, assets, console errors, overflow at 1440/834/390px, h1 count, meta descriptions, em dashes. Saves full-page screenshots. |
| `npm run og-image` | Regenerates the 1200x630 social share image. |
| `npm run assets:demo` | Regenerates the demo mockups, placeholder logos and the hero demo reel (Playwright + ffmpeg). Add `-- --no-video` to skip the reel. |

The build prints a list of missing facts and settings every time it runs.

## Project structure

```
site.config.mjs            Business facts + integration IDs (email, phone, booking, GA4...)
src/content/services.mjs   The 9 service pages, service categories, services FAQ
src/content/company.mjs    Technologies, process, reasons, industries, principles,
                           projects, testimonials, team, client logos, company story
src/templates/             lib (helpers, icons, illustrative SVGs), layout (head/header/footer),
                           sections (reusable blocks), pages (one function per page type)
src/styles/                tokens.css, base.css, components.css, sections.css
src/scripts/site.js        Menu, reveal motion, work filter, contact form, consent + GA4
src/assets/brand/          Logo variants extracted from the supplied files, favicons
functions/contact.mjs      Serverless contact handler (validation, spam filter, email via Resend)
scripts/                   build, serve, qa, og-image
```

## Updating content

**Demo content.** Everything temporary is in `src/content/company.mjs` and marked `demo: true`; production builds drop it automatically. See `docs/CONTENT-NEEDED.md` for the full list.

**Projects / case studies.** Replace the demo entries in `projects` (remove `demo: true`). Put screenshots in `src/assets/work/<slug>/` and list them in `images: [{ file: 'cover.webp', alt: '...' }]`. The first image is the cover (16:10). A project page with an expandable case study is generated automatically, and the project appears on the homepage, the portfolio and related service pages. Add verified `results: [{ value, label }]` only when they can be evidenced.

**Hero film.** Set `heroMedia` in `company.mjs` to the official MP4 and poster and remove `demo: true`. Without it, production shows the illustrated system diagram.

**Testimonials, team, client logos, company story.** Same file. Team photos go in `src/assets/people/` (4:5 portrait), client logos in `src/assets/clients/` (SVG preferred).

**Technologies.** Set `confirmed: true` on each technology the team genuinely uses. Unconfirmed ones never appear in the production build.

**Services.** Edit `src/content/services.mjs`. Adding an entry there creates a new detail page, footer link and contact-form option.

## Configuration

Set values in `site.config.mjs` or as environment variables at build time:

| Variable | Purpose |
|---|---|
| `SITE_URL` | Production URL for canonical links, sitemap and Open Graph |
| `CONTACT_EMAIL`, `CONTACT_PHONE`, `CONTACT_WHATSAPP`, `CONTACT_LOCATION`, `CONTACT_HOURS` | Direct contact details |
| `BOOKING_URL` | Calendly / Cal.com / similar. Enables every "Book a call" button |
| `FORM_ENDPOINT` | Where the contact form POSTs JSON, e.g. `/api/contact` |
| `GA4_ID` | Google Analytics 4 measurement ID. Loads only after cookie consent |
| `GSC_TOKEN` | Google Search Console HTML-tag verification value |
| `SOCIAL_*` | LinkedIn, Instagram, Facebook, X, GitHub, Behance, Dribbble, Clutch URLs |

Without `FORM_ENDPOINT` the form validates input but tells the visitor honestly that it is not connected; it never shows a false success message.

## Deployment

The output is static, so any static host works. Recommended: **Netlify** (the form function and config are included).

### Netlify
1. Push the project to a Git repository and import it in Netlify. `netlify.toml` sets the build command (`node scripts/build.mjs`), publish folder (`dist`) and functions folder.
2. Under Site settings, Environment variables, add `SITE_URL`, `CONTACT_EMAIL`, etc., plus `FORM_ENDPOINT=/api/contact`.
3. For the contact function add `RESEND_API_KEY`, `CONTACT_TO` and `CONTACT_FROM` (verify the sending domain in Resend first). Optionally `ALLOWED_ORIGIN`.
4. Connect the domain and enable HTTPS (automatic).

### Cloudflare Pages
Build command `node scripts/build.mjs`, output `dist`. For the form, create `functions/api/contact.js` containing:
```js
import handler from '../contact.mjs';
export const onRequestPost = (ctx) => handler(ctx.request, ctx);
```
`_headers` (security and caching headers) is generated automatically.

### Vercel / other hosts
Build command and output as above. For Vercel, wrap the handler as an `api/contact` route (`export const POST = (req) => handler(req)`). Alternatively, point `FORM_ENDPOINT` at a form service such as Formspree or Web3Forms; any endpoint that accepts JSON and returns a 2xx on success works.

### After deploying
- Submit `https://<domain>/sitemap.xml` in Google Search Console.
- Send a test enquiry and confirm it arrives.
- In GA4, mark `generate_lead` as a key event. Clicks on booking links send `booking_click`; CTAs send `cta_*` events.
- Set up uptime/error monitoring (e.g. the host's built-in analytics, UptimeRobot, Sentry) and keep the repository as the backup of record.

## Fonts

Inter (which matches the logo wordmark) and JetBrains Mono load from Google Fonts with `display=swap`. To self-host instead, add WOFF2 files under `src/assets/fonts/`, declare `@font-face` in `tokens.css` and remove the Google Fonts `<link>` in `src/templates/layout.mjs`.
