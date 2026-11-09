import { esc, attr, u, icon, svgIcon } from './lib.mjs';
import { renderChatbot } from './components/chatbot.mjs';
import * as chatbotKnowledge from '../content/chatbot-knowledge.mjs';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/services/', label: 'Services' },
  { href: '/work/', label: 'Work' },
  { href: '/contact/', label: 'Contact' },
];

const isActive = (page, href) => (href === '/' ? page.path === '/' : page.path.startsWith(href));

export function layout(site, page) {
  const { config } = site;
  const canonical = config.siteUrl.replace(/\/$/, '') + page.path;
  const title = page.path === '/' ? page.title : `${page.title} | Adelogix`;
  const ogImage = config.siteUrl.replace(/\/$/, '') + '/assets/og-image.png';
  const noindex = site.review || page.noindex;
  const clientConfig = {
    email: config.contact.email || '',
    bookingUrl: config.bookingUrl || '',
    ga4Id: site.review ? '' : config.ga4Id || '',
  };
  const jsonLd = [organizationLd(site), ...(page.jsonLd || [])];
  // Header starts in the theme of the first section; JS keeps it in sync on scroll.
  const navTheme = page.navTheme || 'light';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${attr(page.description)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
${page.path !== '/404.html' ? `<link rel="canonical" href="${attr(canonical)}">` : ''}
<meta name="theme-color" content="#0E0B18">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Adelogix">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(page.description)}">
<meta property="og:url" content="${attr(canonical)}">
<meta property="og:image" content="${attr(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
${config.searchConsoleToken && !site.review ? `<meta name="google-site-verification" content="${attr(config.searchConsoleToken)}">` : ''}
<link rel="icon" href="${u('/assets/brand/icon-32.png')}" sizes="32x32" type="image/png">
<link rel="icon" href="${u('/assets/brand/icon-192.png')}" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="${u('/assets/brand/apple-touch-icon.png')}">
<link rel="manifest" href="${u('/site.webmanifest')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..600&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" href="${u('/assets/site.css')}?v=${site.version}">
${page.preload || ''}
<script>window.ADELOGIX=${JSON.stringify(clientConfig)};</script>
<script src="${u('/assets/site.js')}?v=${site.version}" defer></script>
${jsonLd.map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body class="page-${attr(page.bodyClass || 'default')}">
<a class="skip-link" href="#main">Skip to content</a>
${header(site, page, navTheme)}
<main id="main">
${page.body}
</main>
${footer(site)}
${consentBanner(site)}
${site.review ? reviewFlag() : ''}
${renderChatbot(chatbotKnowledge)}
</body>
</html>
`;
}

function header(site, page, theme) {
  const cur = (href) => (isActive(page, href) ? ' aria-current="page"' : '');
  return `<header class="site-header" data-header data-theme="${theme}">
  <div class="container">
    <div class="header-bar">
      <a class="header-logo" href="${u('/')}" aria-label="Adelogix home">
        <img class="logo-on-dark" src="${u('/assets/brand/adelogix-logo-white.png')}" alt="" width="585" height="133">
        <img class="logo-on-light" src="${u('/assets/brand/adelogix-logo.png')}" alt="" width="585" height="128">
      </a>
      <nav class="header-nav" aria-label="Main">
        <ul>${NAV.map((n) => `<li><a href="${u(n.href)}"${cur(n.href)}>${n.label}</a></li>`).join('')}</ul>
      </nav>
      <a class="btn btn--sm header-cta" href="${u('/contact/')}" data-track="cta_header">Discuss your project ${icon.arrow}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle><span class="menu-icon" aria-hidden="true"></span><span class="sr-only">Open menu</span></button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu" hidden>
    <nav aria-label="Mobile">
      <ul>${NAV.map((n) => `<li><a href="${u(n.href)}"${cur(n.href)}>${n.label}${svgIcon('chevronRight', 22)}</a></li>`).join('')}</ul>
    </nav>
    <div class="menu-footer">
      <a class="btn btn--light btn--lg" href="${u('/contact/')}" data-track="cta_mobile_menu">Discuss your project ${icon.arrow}</a>
      ${site.config.bookingUrl ? `<a class="btn btn--outline btn--lg" href="${attr(site.config.bookingUrl)}" target="_blank" rel="noopener" data-track="booking_click">Book a call</a>` : ''}
      ${site.config.contact.email ? `<a class="menu-email" href="mailto:${attr(site.config.contact.email)}">${esc(site.config.contact.email)}</a>` : ''}
    </div>
  </div>
</header>`;
}

function footer(site) {
  const { config, services } = site;
  const c = config.contact;
  const mapsUrl = c.location
    ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.location)
    : '';
  const socials = Object.entries({
    LinkedIn: config.social.linkedin, Instagram: config.social.instagram, Facebook: config.social.facebook,
    X: config.social.x, GitHub: config.social.github, Behance: config.social.behance, Dribbble: config.social.dribbble, Clutch: config.social.clutch,
  }).filter(([, v]) => v);
  const contactItems = [
    c.email && `<li><a href="mailto:${attr(c.email)}">${svgIcon('mail', 18)}${esc(c.email)}</a></li>`,
    c.phone && `<li><a href="tel:${attr(c.phone.replace(/[^\d+]/g, ''))}">${svgIcon('phone', 18)}${esc(c.phone)}</a></li>`,
    c.whatsapp && `<li><a href="https://wa.me/${attr(c.whatsapp)}" target="_blank" rel="noopener">${svgIcon('chat', 18)}WhatsApp</a></li>`,
    c.location && `<li><a href="${attr(mapsUrl)}" target="_blank" rel="noopener">${svgIcon('pin', 18)}${esc(c.location)}</a></li>`,
    config.bookingUrl && `<li><a href="${attr(config.bookingUrl)}" target="_blank" rel="noopener" data-track="booking_click">${svgIcon('calendar', 18)}Book a call</a></li>`,
  ].filter(Boolean);
  const year = new Date().getFullYear();
  // Interactive map for the confirmed business address. Uses the keyless
  // Google Maps embed URL built from the same `contact.location` value that
  // drives every other location link, so no new location is introduced.
  const mapEmbed = c.location
    ? `https://www.google.com/maps?q=${encodeURIComponent(c.location)}&output=embed&hl=en`
    : '';
  const socialList = socials.map(([k, v]) => `<li><a href="${attr(v)}" target="_blank" rel="noopener">${esc(k)}</a></li>`).join('');
  return `<footer class="site-footer surface-ink" data-nav-dark>
  <img class="footer-watermark" src="${u('/assets/brand/adelogix-mark-white.png')}" alt="" width="514" height="439" loading="lazy">
  <div class="container footer-inner">
    <div class="footer-intro">
      <img class="footer-logo" src="${u('/assets/brand/adelogix-logo-white.png')}" alt="Adelogix" width="585" height="133" loading="lazy">
      <p>Adelogix designs and builds web platforms, mobile apps and custom business software for startups, growing companies and established teams.</p>
      <div class="footer-actions">
        <a class="btn btn--light" href="${u('/contact/')}" data-track="cta_footer">Discuss your project ${icon.arrow}</a>
      </div>
    </div>
    ${mapEmbed
      ? `<div class="footer-map-embed">
      <div class="footer-map-placeholder" aria-hidden="true">
        ${svgIcon('pin', 22)}
        <span>${esc(c.location)}</span>
      </div>
      <iframe
        src="${attr(mapEmbed)}"
        title="Adelogix office location: ${attr(c.location)}"
        width="600" height="360"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen></iframe>
      <a class="footer-map-caption" href="${attr(mapsUrl)}" target="_blank" rel="noopener">
        ${svgIcon('pin', 16)}<span class="footer-map-caption__text"><strong>${esc(c.location)}</strong><span>Open in Google Maps</span></span>${svgIcon('chevronRight', 16)}
      </a>
    </div>`
      : ''}
    <div class="footer-cols">
      <div class="footer-col footer-col--brand">
        <h2>Company</h2>
        <img class="footer-col-logo" src="${u('/assets/brand/adelogix-logo-white.png')}" alt="Adelogix" width="585" height="133" loading="lazy">
        <p class="footer-col-text">${esc(config.legalName)} designs and builds web platforms, mobile apps and custom business software from Bahawalpur, Pakistan.</p>
      </div>
      <div class="footer-col">
        <h2>Quick links</h2>
        <ul>${NAV.map((n) => `<li><a href="${u(n.href)}">${n.label}</a></li>`).join('')}</ul>
      </div>
      <div class="footer-col footer-col--services">
        <h2>Services</h2>
        <ul>${services.map((s) => `<li><a href="${u(`/services/${s.slug}/`)}">${esc(s.name)}</a></li>`).join('')}</ul>
      </div>
      <div class="footer-col footer-col--contact">
        <h2>Get in touch</h2>
        <ul class="footer-contact">
          ${contactItems.join('')}
          <li><a href="${u('/contact/#form')}">${svgIcon('doc', 18)}Send an enquiry</a></li>
          ${site.review && !c.email ? '<li><span class="ph-badge">Email, phone and location needed</span></li>' : ''}
        </ul>
      </div>
    </div>
    ${socials.length ? `<div class="footer-social"><ul>${socialList}</ul></div>` : ''}
    <div class="footer-bottom">
      <span>&copy; ${year} ${esc(config.legalName)}. All rights reserved.</span>
      <ul>
        <li><a href="${u('/privacy-policy/')}">Privacy Policy</a></li>
        <li><a href="${u('/terms/')}">Terms &amp; Conditions</a></li>
        <li><button type="button" data-consent-open>Cookie settings</button></li>
        <li><a href="${u('/sitemap.xml')}">Sitemap</a></li>
        <li><a class="to-top" href="#main">Back to top ${svgIcon('arrowUp', 16)}</a></li>
      </ul>
    </div>
  </div>
</footer>`;
}

function consentBanner(site) {
  if (site.review || !site.config.ga4Id) return '';
  return `<div class="consent" role="dialog" aria-live="polite" aria-label="Cookie consent" data-consent hidden>
  <strong>Analytics cookies</strong>
  <p>We would like to use Google Analytics cookies to understand how visitors use this site. They are only set if you accept. See our <a href="${u('/privacy-policy/')}">Privacy Policy</a>.</p>
  <div class="actions">
    <button class="btn btn--outline btn--sm" type="button" data-consent-choice="denied">Decline</button>
    <button class="btn btn--light btn--sm" type="button" data-consent-choice="granted">Accept</button>
  </div>
</div>`;
}

function reviewFlag() {
  return `<aside class="review-flag" data-review-flag aria-label="Review build notice">
  <strong>Review build</strong>
  Items labelled <em>Demo</em> are temporary, fictional content for layout review. They are removed from the production build.
  <button type="button" aria-label="Dismiss notice">&times;</button>
</aside>`;
}

function organizationLd(site) {
  const { config } = site;
  const sameAs = Object.values(config.social).filter(Boolean);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.legalName,
    alternateName: config.name,
    url: config.siteUrl,
    logo: config.siteUrl.replace(/\/$/, '') + '/assets/brand/adelogix-mark.png',
  };
  if (config.contact.email) ld.email = config.contact.email;
  if (config.contact.phone) ld.telephone = config.contact.phone;
  if (config.contact.location) ld.address = config.contact.location;
  if (config.company.founded) ld.foundingDate = config.company.founded;
  if (sameAs.length) ld.sameAs = sameAs;
  return ld;
}
