import { esc, attr, u, icon, pad, svgIcon, serviceIcon, systemMap, visual, serviceVisualKind } from './lib.mjs';

// ------------------------------------------------------------- helpers
export const demoBadge = (on, label = 'Demo') => (on ? `<span class="ph-badge">${esc(label)}</span>` : '');
export const ph = demoBadge;
export const txt = (s) => esc(s);

export function workImg(p, index = 0, { eager = false, sizes = '(min-width: 900px) 50vw, 100vw', cls = '' } = {}) {
  const img = p.images && p.images[index];
  if (!img) return visual(p.visual || 'web');
  const base = p.demo ? `/assets/demo/work/${p.slug}/` : `/assets/${p.imageDir || 'work'}/${p.slug}/`;
  return `<img class="${cls}" src="${u(base + img.file)}" alt="${attr(img.alt || '')}" width="1600" height="1000" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" sizes="${sizes}">`;
}

export function sectionHead({ eyebrow, title, intro, action, id, center = false }) {
  return `<div class="section-head${center ? ' section-head--center' : ''}" data-reveal>
    <div class="section-head__main">
      ${eyebrow ? `<p class="eyebrow"><span class="node" aria-hidden="true"></span>${esc(eyebrow)}</p>` : ''}
      <h2 class="h2"${id ? ` id="${id}"` : ''}>${title}</h2>
    </div>
    ${intro || action ? `<div class="section-head__side">${intro ? `<p class="lead">${intro}</p>` : ''}${action || ''}</div>` : ''}
  </div>`;
}

export function breadcrumb(crumbs) {
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${crumbs
    .map(([label, href], i) => (i === crumbs.length - 1 ? `<li><span aria-current="page">${esc(label)}</span></li>` : `<li><a href="${u(href)}">${esc(label)}</a></li>`))
    .join('')}</ol></nav>`;
}

// Inner-page hero: text on the left, an optional visual panel on the right.
export function pageHero({ crumbs, eyebrow, title, lead, actions = '', aside = '' }) {
  return `<section class="page-hero surface-paper">
  <div class="container page-hero__grid${aside ? ' page-hero__grid--aside' : ''}">
    <div class="page-hero__copy">
      ${crumbs ? breadcrumb(crumbs) : ''}
      ${eyebrow ? `<p class="eyebrow"><span class="node" aria-hidden="true"></span>${esc(eyebrow)}</p>` : ''}
      <h1 class="h1">${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      ${actions ? `<div class="actions">${actions}</div>` : ''}
    </div>
    ${aside ? `<div class="page-hero__aside">${aside}</div>` : ''}
  </div>
</section>`;
}

// Verified facts only: counts derived from the requirements document.
export function factCards(site, { dark = false } = {}) {
  return `<ul class="fact-grid${dark ? ' fact-grid--dark' : ''}" role="list">
    <li class="fact fact--brand"><img src="${u('/assets/brand/adelogix-mark-white.png')}" alt="" width="514" height="439" loading="lazy"><p>Design, development and support from one team.</p></li>
    <li class="fact"><span class="fact__num">${site.services.length}</span><p>core services, from websites and apps to CRMs and AI automation</p></li>
    <li class="fact"><span class="fact__num">${site.process.length}</span><p>clear stages: discover, plan, build, launch and support</p></li>
    <li class="fact"><span class="fact__num">${site.industries.length}</span><p>sectors we design and build software for</p></li>
  </ul>`;
}

// ------------------------------------------------------------ Hero media
export function heroMedia(site) {
  const m = site.heroMedia;
  if (!m) {
    return `<div class="hero-media hero-media--diagram">${systemMap()}</div>`;
  }
  return `<div class="hero-background" data-hero-media>
    <video class="hero-background-video" data-hero-video autoplay muted loop playsinline preload="metadata" poster="${u(m.poster)}" aria-hidden="true" tabindex="-1">
      <source src="${u(m.src)}" type="video/mp4">
    </video>
    <div class="hero-background-overlay" aria-hidden="true"></div>
  </div>`;
}

// ---------------------------------------------------------------- Clients
export function clientsStrip(site) {
  const list = site.clients;
  if (!list.length) return '';
  const item = (c) => {
    const inner = c.file
      ? `<img src="${u(`/assets/${c.dir || 'clients'}/${c.file}`)}" alt="${attr(c.name)}" width="150" height="28" loading="lazy">`
      : `<span class="client-logo__text">${esc(c.name)}</span>`;
    return `<li class="client-logo${c.demo ? ' client-logo--demo' : ''}">${inner}</li>`;
  };
  const group = (hidden) => `<ul class="marquee__group"${hidden ? ' aria-hidden="true"' : ''}>${list.map(item).join('')}</ul>`;
  const anyDemo = list.some((c) => c.demo || !c.file);
  return `<section class="logo-strip surface-paper" aria-label="Companies we work with">
  <div class="container logo-strip__inner">
    <p class="logo-strip__label">Companies we work with ${demoBadge(site.review && anyDemo, 'Logos to confirm')}</p>
    <div class="marquee" tabindex="0" aria-label="Company logos"><div class="marquee__track">${group(false)}${group(true)}</div></div>
  </div>
</section>`;
}

// ----------------------------------------------------------- Services
export function serviceCard(s, { headingTag = 'h3' } = {}) {
  return `<a class="service-tile" href="${u(`/services/${s.slug}/`)}">
    <span class="icon-badge">${svgIcon(serviceIcon[s.slug])}</span>
    <${headingTag} class="service-tile__title">${esc(s.name)}</${headingTag}>
    <p>${esc(s.short)}</p>
    <span class="service-tile__more">Explore ${svgIcon('chevronRight', 16)}</span>
  </a>`;
}

export function servicesOverview(site) {
  return `<section class="section surface-paper" id="services" aria-labelledby="services-title">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Services', id: 'services-title',
      title: 'What we design and build.',
      intro: 'Nine core services covering websites, apps, product design, business systems and AI. Each one has its own page with scope, process and common questions.',
      action: `<a class="link-arrow" href="${u('/services/')}">All services ${icon.arrowRight}</a>`,
    })}
    <ul class="service-grid" role="list">
      ${site.services.map((s, i) => `<li data-reveal style="--reveal-delay:${(i % 3) * 60}ms">${serviceCard(s)}</li>`).join('')}
    </ul>
  </div>
</section>`;
}

// ----------------------------------------------------------- Projects
export function projectMeta(p) {
  return `<p class="project-meta"><span>${esc(p.category)}</span><span>${esc(p.industry)}</span><span>${esc(p.year)}</span></p>`;
}

export function projectCard(site, p, { size = 'md', headingTag = 'h3', imageIndex = 0 } = {}) {
  const kind = p.category.toLowerCase().includes('mobile') ? 'mobile' : /web|e-commerce/i.test(p.category) ? 'web' : 'systems';
  return `<article class="project-card project-card--${size}" data-filter-item="${kind}" data-reveal>
    <a class="project-card__link" href="${u(`/work/${p.slug}/`)}">
      <div class="frame">${demoBadge(p.demo, 'Demo project')}${workImg(p, imageIndex)}</div>
      <div class="project-card__body">
        ${projectMeta(p)}
        <${headingTag} class="project-card__title">${esc(p.name)}</${headingTag}>
        <p>${esc(size === 'lg' ? p.headline : p.summary)}</p>
        ${size === 'lg' ? `<ul class="chip-list chip-list--sm">${techChips(site, p.tech.slice(0, 4))}</ul>` : ''}
      </div>
    </a>
  </article>`;
}

export function featuredWork(site) {
  if (!site.projects.length) return '';
  const realProjects = site.projects.filter((p) => !p.demo).slice(0, 3);
  if (!realProjects.length) return '';
  return `<section class="section surface-paper-2 section--tight" aria-labelledby="work-title">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Selected work', id: 'work-title',
      title: 'Software we have shaped around real operations.',
      action: `<a class="btn btn--light" href="${u('/work/')}" data-track="cta_view_projects">View all projects ${icon.arrow}</a>`,
    })}
    <div class="work-grid">
      ${realProjects.map((p) => projectCard(site, p, { size: 'md' })).join('')}
    </div>
  </div>
</section>`;
}

// -------------------------------------------------------- Technologies
export function techChips(site, ids) {
  const { items } = site.technologies;
  return ids
    .filter((id) => items[id] && (site.review || items[id].confirmed))
    .map((id) => `<li class="chip${items[id].confirmed ? '' : ' chip--unconfirmed'}"${items[id].confirmed ? '' : ' title="To be confirmed by the Adelogix team"'}>${esc(items[id].name)}</li>`)
    .join('');
}

export function techSection(site, { surface = 'surface-paper', title = 'The tools we build with.' } = {}) {
  const rows = site.technologies.groups.map((g) => ({ ...g, chips: techChips(site, g.items) })).filter((g) => g.chips);
  if (!rows.length) return '';
  const hasUnconfirmed = site.review && Object.values(site.technologies.items).some((t) => !t.confirmed);
  return `<section class="section ${surface}" aria-labelledby="tech-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'Technologies', id: 'tech-title', title, intro: 'The stack for each project is chosen for what it has to do, who will maintain it and how it is expected to grow.' })}
    <dl class="tech-grid" data-reveal>
      ${rows.map((g) => `<div class="tech-group"><dt>${esc(g.name)}</dt><dd><ul class="chip-list">${g.chips}</ul></dd></div>`).join('')}
    </dl>
    ${hasUnconfirmed ? '<p class="tech-note"><span class="ph-badge">To confirm</span> Dashed items are likely candidates. Only technologies the team confirms are published.</p>' : ''}
  </div>
</section>`;
}

// ---------------------------------------------------- Why Adelogix
export function whySection(site, { title = 'Why teams choose to work with us.' } = {}) {
  const reasons = site.reasons;
  return `<section class="section surface-paper" aria-labelledby="why-title">
  <div class="container why-bento">
    <div class="why-feature surface-ink" data-nav-dark data-reveal>
      <div class="aura" aria-hidden="true"></div>
      <p class="eyebrow"><span class="node" aria-hidden="true"></span>Why Adelogix</p>
      <h2 class="h2" id="why-title">${title}</h2>
      <p>Most software projects that struggle do so because of unclear scope, poor communication or the wrong technology. These are the habits we use to avoid all three.</p>
      <a class="btn btn--light" href="${u('/about/')}">How we work ${icon.arrow}</a>
      <img class="why-feature__mark" src="${u('/assets/brand/adelogix-mark-white.png')}" alt="" width="514" height="439" loading="lazy">
    </div>
    <ul class="why-grid" role="list">
      ${reasons.map((r, i) => `<li class="why-card${i === reasons.length - 1 && reasons.length % 2 ? ' why-card--wide' : ''}" data-reveal style="--reveal-delay:${i * 60}ms">
        <span class="icon-badge">${svgIcon(r.icon)}</span>
        <h3>${esc(r.title)}</h3>
        <p>${esc(r.text)}</p>
      </li>`).join('')}
    </ul>
  </div>
</section>`;
}

// ------------------------------------------------------------ Process
export function processSection(steps, { title = 'From first conversation to launch.', intro, id = 'process', eyebrow = 'Our process' } = {}) {
  return `<section class="section section--tight" id="${id}" aria-labelledby="${id}-title">
  <div class="process-panel surface-ink" data-nav-dark>
    <div class="aura aura--top" aria-hidden="true"></div>
    <div class="container">
      ${sectionHead({ eyebrow, id: `${id}-title`, title, intro: intro || 'Every project follows the same four stages, so you always know where things stand and what comes next.' })}
      <ol class="process-track" data-reveal>
        ${steps.map((s, i) => `<li class="process-stage" style="--i:${i}">
          <div class="process-stage__node"><span class="process-stage__icon">${svgIcon(s.icon || 'check', 22)}</span></div>
          <div class="process-stage__card">
            <span class="process-stage__step">Stage ${i + 1} of ${steps.length}</span>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.text)}</p>
            ${s.output ? `<ul>${s.output.map((o) => `<li>${svgIcon('tick', 16)}${esc(o)}</li>`).join('')}</ul>` : ''}
          </div>
        </li>`).join('')}
      </ol>
    </div>
  </div>
</section>`;
}

// --------------------------------------------------------- Industries
export function industriesSection(site) {
  const bySlug = Object.fromEntries(site.services.map((s) => [s.slug, s]));
  return `<section class="section surface-paper" aria-labelledby="ind-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'Industries', id: 'ind-title', title: 'Sectors we build for.', intro: 'Each sector has its own users, rules and pressures. These are the industries we design and develop for, with the services that most often apply.' })}
    <ul class="industry-grid" role="list">
      ${site.industries.map((ind, i) => `<li class="industry-card" data-reveal style="--reveal-delay:${(i % 4) * 60}ms">
        <span class="icon-badge icon-badge--soft">${svgIcon(ind.icon)}</span>
        <h3>${esc(ind.name)}</h3>
        <p>${esc(ind.text)}</p>
        <ul class="industry-card__links" aria-label="Related services">${(ind.services || []).map((sl) => `<li><a href="${u(`/services/${sl}/`)}">${esc(bySlug[sl].name)}</a></li>`).join('')}</ul>
      </li>`).join('')}
      <li class="industry-card industry-card--cta" data-reveal>
        <h3>Working in another sector?</h3>
        <p>Tell us about your business and the problem you want to solve.</p>
        <a class="btn btn--light btn--sm" href="${u('/contact/')}">Start a conversation ${icon.arrow}</a>
      </li>
    </ul>
  </div>
</section>`;
}

// ------------------------------------------------------- Testimonials
export function testimonialsSection(site, { list = site.testimonials, title = 'What clients say about working with us.', surface = 'surface-paper-2' } = {}) {
  if (!list.length) return '';
  const bySlug = Object.fromEntries(site.projects.map((p) => [p.slug, p]));
  const anyDemo = list.some((t) => t.demo);
  return `<section class="section ${surface}" aria-labelledby="t-title">
  <div class="container">
    <div class="carousel" data-carousel aria-roledescription="carousel" aria-labelledby="t-title">
      <div class="carousel__head" data-reveal>
        <div class="section-head__main">
          <p class="eyebrow"><span class="node" aria-hidden="true"></span>Client feedback</p>
          <h2 class="h2" id="t-title">${title}</h2>
          ${anyDemo ? '<p class="small muted">Sample feedback for layout review. Only genuine quotes, published with permission, will appear here.</p>' : ''}
        </div>
        <div class="carousel__controls" ${list.length < 2 ? 'hidden' : ''}>
          <button class="icon-btn" type="button" data-carousel-prev aria-label="Previous feedback">${svgIcon('chevronLeft', 20)}</button>
          <button class="icon-btn" type="button" data-carousel-next aria-label="Next feedback">${svgIcon('chevronRight', 20)}</button>
        </div>
      </div>
      <ul class="carousel__track" data-carousel-track tabindex="0" aria-label="Feedback, use arrow keys to scroll">
        ${list.map((t, i) => {
          const proj = t.project && bySlug[t.project];
          return `<li class="quote-card" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${list.length}">
            <div class="quote-card__top">${svgIcon('quote', 28, 'icon quote-mark')}${demoBadge(t.demo, 'Sample')}</div>
            <blockquote><p>${esc(t.quote)}</p></blockquote>
            <footer class="quote-card__by">
              <span class="avatar">${t.image ? `<img src="${u(`/assets/people/${t.image}`)}" alt="" loading="lazy">` : svgIcon('users', 20)}</span>
              <span class="attribution"><strong>${esc(t.name || t.role)}</strong><span>${esc(t.name ? `${t.role}, ${t.company}` : t.company)}</span></span>
            </footer>
            ${proj ? `<a class="quote-card__project" href="${u(`/work/${proj.slug}/`)}">${esc(proj.name)} ${svgIcon('chevronRight', 16)}</a>` : ''}
          </li>`;
        }).join('')}
      </ul>
      <div class="carousel__dots" data-carousel-dots ${list.length < 2 ? 'hidden' : ''}></div>
    </div>
  </div>
</section>`;
}

// --------------------------------------------------------------- Team
export function teamSection(site, { title = 'The people behind Adelogix.', surface = 'surface-paper' } = {}) {
  const { team, companyMessage: msg } = site;
  if (!team.length && !msg) return '';
  const initials = (n) => (n.match(/\b[A-Z]/g) || ['A']).slice(0, 2).join('');
  return `<section class="section ${surface}" aria-labelledby="team-title">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Team', id: 'team-title', title,
      intro: 'You work directly with the people designing and building your product, not through layers of account management.',
      action: team.some((t) => t.demo) ? demoBadge(true, 'Demo profiles: names, roles and photos needed') : '',
    })}
    <div class="team-layout">
      ${msg ? `<figure class="team-message surface-ink" data-nav-dark data-reveal>
        <div class="aura" aria-hidden="true"></div>
        ${svgIcon('quote', 32, 'icon quote-mark')}
        <blockquote><p>${esc(msg.text)}</p></blockquote>
        <figcaption class="attribution"><strong>${esc(msg.author)}</strong><span>${esc(msg.role)}</span>${demoBadge(msg.demo)}</figcaption>
      </figure>` : ''}
      ${team.length ? `<ul class="team-grid" role="list">
        ${team.map((m, i) => `<li class="team-card" data-reveal style="--reveal-delay:${i * 60}ms">
          <div class="team-card__photo" style="--hue:${[262, 280, 248, 300][i % 4]}">${m.photo
            ? `<img src="${u(`/assets/people/${m.photo}`)}" alt="${attr(m.name)}, ${attr(m.role)}" loading="lazy" width="800" height="1000">`
            : `<span class="team-card__initials" aria-hidden="true">${m.demo ? svgIcon('users', 34) : initials(m.name)}</span>${demoBadge(m.demo)}`}</div>
          <div class="team-card__body"><strong>${esc(m.name)}</strong><span>${esc(m.role)}</span>${m.bio ? `<p>${esc(m.bio)}</p>` : ''}</div>
        </li>`).join('')}
      </ul>` : ''}
    </div>
  </div>
</section>`;
}

// ----------------------------------------------------------------- FAQ
export function faqSection(faqs, { title = 'Frequently asked questions', intro } = {}) {
  return `<section class="section surface-paper" aria-labelledby="faq-title">
  <div class="container split">
    <div class="split__aside"><div class="split__aside-inner" data-reveal>
      <p class="eyebrow"><span class="node" aria-hidden="true"></span>FAQ</p>
      <h2 class="h2" id="faq-title">${title}</h2>
      <p class="lead">${intro || 'Something else on your mind? Ask us directly and we will give you a straight answer.'}</p>
      <a class="link-arrow" href="${u('/contact/')}">Ask a question ${icon.arrowRight}</a>
    </div></div>
    <div class="split__main faq-list" data-reveal>
      ${faqs.map((f) => `<details class="faq-item"><summary>${esc(f.q)}<span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer"><p>${esc(f.a)}</p></div></details>`).join('')}
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- CTA
export function ctaSection(site, {
  title = 'Let’s build something great together.',
  text = 'Tell us what you are working on. We will ask the right questions and suggest a practical way forward, whether that is a full project or a short discovery phase.',
  primary = 'Discuss your project',
} = {}) {
  const { config } = site;
  return `<section class="section section--tight surface-paper" aria-labelledby="cta-title">
  <div class="container">
    <div class="cta-panel surface-ink" data-nav-dark data-reveal>
      <div class="aura" aria-hidden="true"></div>
      <div class="cta-panel__copy">
        <h2 id="cta-title">${title}</h2>
        <p>${text}</p>
        <div class="actions">
          <a class="btn btn--light btn--lg" href="${u('/contact/')}" data-track="cta_final">${esc(primary)} ${icon.arrow}</a>
          ${config.bookingUrl
            ? `<a class="btn btn--outline btn--lg" href="${attr(config.bookingUrl)}" target="_blank" rel="noopener" data-track="booking_click">${svgIcon('calendar', 18)} Book a call</a>`
            : `<a class="btn btn--outline btn--lg" href="${u('/services/')}">Explore services</a>`}
        </div>
      </div>
      <div class="cta-panel__visual" aria-hidden="true">
        <div class="orbit orbit--1"></div><div class="orbit orbit--2"></div><div class="orbit orbit--3"></div>
        <img src="${u('/assets/brand/adelogix-mark-white.png')}" alt="" width="514" height="439" loading="lazy">
      </div>
      <ul class="cta-panel__steps" role="list">
        <li>${svgIcon('doc', 20)}<span><strong>Share a short brief</strong>A few sentences is enough</span></li>
        <li>${svgIcon('chat', 20)}<span><strong>We talk it through</strong>By your preferred method</span></li>
        <li>${svgIcon('map', 20)}<span><strong>You get a clear proposal</strong>Scope, approach and estimate</span></li>
      </ul>
    </div>
  </div>
</section>`;
}
