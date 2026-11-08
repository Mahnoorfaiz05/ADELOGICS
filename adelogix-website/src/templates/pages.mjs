import { esc, attr, u, icon, pad, svgIcon, serviceIcon, systemMap, visual, serviceVisualKind } from './lib.mjs';
import {
  sectionHead, pageHero, breadcrumb, clientsStrip, servicesOverview, serviceCard, featuredWork, projectCard, projectMeta,
  workImg, techSection, techChips, whySection, processSection, industriesSection, testimonialsSection,
  teamSection, faqSection, ctaSection, factCards, heroMedia, demoBadge, ph,
} from './sections.mjs';

const STEP_ICONS = ['search', 'map', 'code', 'rocket'];
const withIcons = (steps) => steps.map((s, i) => ({ icon: STEP_ICONS[i] || 'check', ...s }));

// ================================================================== HOME
export function homePage(site) {
  const hasWork = site.projects.length > 0;
  const capabilities = [
    ['Web platforms', 'web-development'], ['Mobile apps', 'mobile-app-development'], ['SaaS products', 'saas-development'],
    ['Business systems', 'custom-software-development'], ['AI & automation', 'ai-development-automation'], ['Product design', 'ui-ux-design'],
  ];
  const body = `
<section class="hero surface-ink" data-nav-dark aria-labelledby="hero-title">
  <div class="hero__background">${heroMedia(site)}</div>
  <div class="aura" aria-hidden="true"></div>
  <div class="dot-grid" aria-hidden="true"></div>
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="pill-label"><span class="node" aria-hidden="true"></span>Software development partner</p>
      <h1 class="display" id="hero-title">Software built around how your business really works.</h1>
      <p class="lead">Adelogix designs and develops web platforms, mobile apps and custom business systems for startups, growing companies and established teams. We start with your process, choose technology that suits it, and stay involved after launch.</p>
      <div class="actions">
        <a class="btn btn--light btn--lg" href="${u('/contact/')}" data-track="cta_hero_primary">Discuss your project ${icon.arrow}</a>
        ${hasWork
          ? `<a class="btn btn--glass btn--lg" href="${u('/work/')}" data-track="cta_hero_secondary">Explore our work</a>`
          : `<a class="btn btn--glass btn--lg" href="${u('/services/')}" data-track="cta_hero_secondary">Explore our services</a>`}
      </div>
      <ul class="hero__points" role="list">
        <li>${svgIcon('tick', 16)}Design to deployment</li>
        <li>${svgIcon('tick', 16)}Web, iOS and Android</li>
        <li>${svgIcon('tick', 16)}Support after launch</li>
      </ul>
    </div>
    <div class="hero__media" aria-hidden="true"></div>
  </div>
  <div class="container">
    <ul class="capability-strip" aria-label="What we build">
      ${capabilities.map(([label, slug]) => `<li><a href="${u(`/services/${slug}/`)}">${svgIcon(serviceIcon[slug], 20)}<span>${esc(label)}</span></a></li>`).join('')}
    </ul>
  </div>
</section>

${clientsStrip(site)}

<section class="section surface-paper" aria-labelledby="intro-title">
  <div class="container about-split">
    <div class="about-split__copy" data-reveal>
      <p class="eyebrow"><span class="node" aria-hidden="true"></span>About Adelogix</p>
      <h2 class="h2" id="intro-title">A software partner that starts with your business, not the code.</h2>
      <p class="lead">We help businesses turn requirements into dependable products, from the first workshop to the releases that follow launch.</p>
      <ul class="check-list check-list--compact">
        <li>Your process is understood before anything is built</li>
        <li>Scope, timeline and cost agreed in writing</li>
        <li>Proven technology your team can maintain</li>
      </ul>
      <a class="link-arrow" href="${u('/about/')}">More about Adelogix ${icon.arrowRight}</a>
    </div>
    <div class="about-split__visual" data-reveal>${factCards(site)}</div>
  </div>
</section>

${servicesOverview(site)}
${featuredWork(site)}
${processSection(withIcons(site.process))}
${whySection(site)}
${industriesSection(site)}
${techSection(site, { surface: 'surface-paper-2' })}
${testimonialsSection(site, { surface: 'surface-paper' })}
${teamSection(site, { surface: 'surface-paper-2' })}
${ctaSection(site)}
`;
  const preload = site.heroMedia ? `<link rel="preload" as="image" href="${u(site.heroMedia.poster)}" type="image/webp">` : '';
  return {
    path: '/',
    title: 'Adelogix | Web, Mobile & Custom Software Development',
    description: 'Adelogix designs and develops web platforms, mobile apps, SaaS products and custom business software for startups, growing companies and established teams.',
    bodyClass: 'home',
    navTheme: 'dark',
    preload,
    body,
  };
}

// ================================================================= ABOUT
export function aboutPage(site) {
  const { story } = site;
  const body = `
${pageHero({
  crumbs: [['Home', '/'], ['About us', '/about/']],
  eyebrow: 'About Adelogix',
  title: 'A software team that starts with your business, not the code.',
  lead: 'Adelogix Software Technology designs, builds and supports digital products for startups, growing businesses and established companies.',
  actions: `<a class="btn btn--lg" href="${u('/contact/')}" data-track="cta_about_hero">Discuss your project ${icon.arrow}</a><a class="btn btn--outline btn--lg" href="#process">How we work</a>`,
  aside: factCards(site),
})}

<section class="section surface-paper section--flush-top" aria-labelledby="story-title">
  <div class="container story">
    <div class="story__head" data-reveal>
      <p class="eyebrow"><span class="node" aria-hidden="true"></span>Our story</p>
      <h2 class="statement" id="story-title">We want to be the development partner we would hire ourselves: <span class="soft">clear about what will be delivered, honest about trade-offs, and still around after launch.</span></h2>
    </div>
    <div class="story__cols" data-reveal>
      <p class="body-text">Many businesses have a story about a software project that ran late, went over budget or produced something nobody wanted to use. Usually the cause was not the code. It was unclear goals, missing conversations and decisions made without the people who would live with the result.</p>
      <p class="body-text">Our aim is practical, reliable software that solves the problem it was built for, delivered in a way that keeps you informed and in control from the first workshop to the last release.</p>
    </div>
    ${story ? `<div class="story__facts card" data-reveal>
      ${demoBadge(story.demo, 'Company story needed')}
      <ul role="list">${story.paragraphs.map((p) => `<li>${svgIcon('doc', 18)}<span>${esc(p)}</span></li>`).join('')}</ul>
    </div>` : ''}
  </div>
</section>

<section class="section surface-paper-2" aria-labelledby="principles-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'Who we are', id: 'principles-title', title: 'Four principles behind every project.', intro: 'The working habits that shape how we plan, build and communicate, whatever the size of the project.' })}
    <ul class="principle-grid" role="list">
      ${site.principles.map((p, i) => `<li class="principle" data-reveal style="--reveal-delay:${i * 60}ms"><span class="icon-badge">${svgIcon(p.icon)}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join('')}
    </ul>
  </div>
</section>

${teamSection(site, { title: 'Meet the team.' })}

${processSection(withIcons(site.process), { title: 'How we work with you.', intro: 'One point of contact, regular progress updates at an agreed rhythm, and decisions recorded in writing. This is how a typical project runs.' })}

<section class="section surface-paper" aria-labelledby="collab-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'Collaboration', id: 'collab-title', title: 'What working together looks like.' })}
    <ul class="principle-grid" role="list">
      ${[
        ['users', 'One point of contact', 'A named project lead who knows your project and answers your questions.'],
        ['globe', 'Visible progress', 'Working software on a staging link, reviewed at agreed milestones.'],
        ['doc', 'Decisions in writing', 'Scope, changes and approvals are documented, so nothing depends on memory.'],
        ['shield', 'Agreed support', 'Clear terms for what happens after launch, written into the proposal.'],
      ].map(([ic, t, d], i) => `<li class="principle principle--plain" data-reveal style="--reveal-delay:${i * 60}ms"><span class="icon-badge icon-badge--soft">${svgIcon(ic)}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}
    </ul>
  </div>
</section>

${ctaSection(site, { title: 'Have a project in mind?', text: 'Tell us about your requirements. We will reply with questions, ideas and a practical next step.' })}
`;
  return {
    path: '/about/',
    title: 'About Us',
    description: 'Meet Adelogix Software Technology: a team that designs, builds and supports web, mobile and custom software, with clear communication and organised delivery.',
    bodyClass: 'about',
    body,
  };
}

// ============================================================== SERVICES
export function servicesPage(site) {
  const bySlug = Object.fromEntries(site.services.map((s) => [s.slug, s]));
  const catIcon = { web: 'globe', mobile: 'mobile', design: 'pen', systems: 'boxes', ai: 'sparkle', it: 'cloud', product: 'blocks', devops: 'terminal' };
  const body = `
${pageHero({
  crumbs: [['Home', '/'], ['Services', '/services/']],
  eyebrow: 'Services',
  title: 'Design, development and the systems in between.',
  lead: 'Five groups of services covering websites, apps, product design, business software and AI. Tell us what you need to achieve and we will recommend where to start.',
  actions: `<a class="btn btn--lg" href="${u('/contact/')}" data-track="cta_services_hero">Discuss your needs ${icon.arrow}</a>`,
  aside: `<nav class="category-jump card" aria-label="Service groups">${site.serviceCategories.map((c) => `<a href="#${c.id}"><span class="icon-badge icon-badge--soft">${svgIcon(catIcon[c.id])}</span><span><strong>${esc(c.name)}</strong><small>${c.items.length} services</small></span>${svgIcon('chevronDown', 18)}</a>`).join('')}</nav>`,
})}

<section class="section surface-paper section--flush-top" aria-label="Core services">
  <div class="container">
    <ul class="service-grid" role="list">${site.services.map((s) => `<li data-reveal>${serviceCard(s)}</li>`).join('')}</ul>
  </div>
</section>

<section class="section surface-paper-2" aria-labelledby="groups-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'Everything we offer', id: 'groups-title', title: 'Services by group.', intro: 'Related services are grouped together. Each item links to the page that covers it in detail.' })}
    <div class="category-list">
    ${site.serviceCategories.map((cat) => {
      const main = [...new Set(cat.items.map(([, slug]) => slug))];
      return `<article class="category" id="${cat.id}" data-reveal>
        <div class="category__head">
          <span class="icon-badge">${svgIcon(catIcon[cat.id])}</span>
          <h3>${esc(cat.name)}</h3>
          <p>${esc(cat.intro)}</p>
          <div class="chip-links">${main.map((slug) => `<a class="chip" href="${u(`/services/${slug}/`)}">${esc(bySlug[slug].name)} ${icon.arrowUpRight}</a>`).join('')}</div>
        </div>
        <ul class="category__items" role="list">
          ${cat.items.map(([label, slug]) => `<li><a href="${u(`/services/${slug}/`)}">${esc(label)} ${svgIcon('chevronRight', 16)}</a></li>`).join('')}
        </ul>
      </article>`;
    }).join('')}
    </div>
  </div>
</section>

${processSection(withIcons(site.process), { title: 'Our development process.' })}
${techSection(site)}
${whySection(site)}
${faqSection(site.servicesFaqs)}
${ctaSection(site)}
`;
  return {
    path: '/services/',
    title: 'Services: Web, Mobile, Design, Custom Software & AI',
    description: 'Adelogix services: web and WordPress development, iOS and Android apps, UI/UX design, custom software, SaaS, CRM, ERP and CMS development, AI and automation.',
    bodyClass: 'services',
    body,
    jsonLd: [faqLd(site.servicesFaqs)],
  };
}

// ======================================================== SERVICE DETAIL
const CTA_NOUN = {
  'web-development': 'a new website or web app',
  'mobile-app-development': 'a mobile app',
  'custom-software-development': 'custom software',
  'ui-ux-design': 'a design project',
  'saas-development': 'a SaaS product',
  'ai-development-automation': 'AI or automation',
  'crm-development': 'a CRM that fits',
  'erp-cms-development': 'an ERP or CMS',
  'wordpress-development': 'a WordPress site',
  'it-services': 'cloud infrastructure or DevOps support',
  'product-development': 'a new product',
  'devops-cloud': 'DevOps and cloud support',
};

export function servicePage(site, s) {
  const related = site.projects.filter((p) => p.services.includes(s.slug));
  const others = site.services.filter((o) => o.slug !== s.slug);
  const chips = techChips(site, s.tech);
  const lead = related[0];
  const body = `
<section class="service-hero surface-paper">
  <div class="container service-hero__grid">
    <div class="service-hero__copy">
      ${breadcrumb([['Home', '/'], ['Services', '/services/'], [s.name, `/services/${s.slug}/`]])}
      <p class="pill-label pill-label--light"><span class="icon-badge icon-badge--xs">${svgIcon(serviceIcon[s.slug], 16)}</span>${esc(s.name)}</p>
      <h1 class="h1">${esc(s.heroTitle)}</h1>
      <p class="lead">${esc(s.heroLead)}</p>
      <div class="actions">
        <a class="btn btn--lg" href="${u('/contact/')}?service=${attr(s.slug)}" data-track="cta_service_hero">Discuss your project ${icon.arrow}</a>
        <a class="btn btn--outline btn--lg" href="#scope">What is included</a>
      </div>
    </div>
    <div class="service-hero__visual">
      ${lead
        ? `<a class="frame frame--shadow" href="${u(`/work/${lead.slug}/`)}" aria-label="${attr(lead.name)} project">${demoBadge(lead.demo, 'Demo project')}${workImg(lead, 0, { eager: true })}</a>`
        : `<div class="frame frame--shadow">${visual(serviceVisualKind[s.slug])}</div>`}
    </div>
  </div>
</section>

<section class="section surface-paper section--flush-top" aria-labelledby="challenges-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'Client challenges', id: 'challenges-title', title: 'Does any of this sound familiar?' })}
    <ul class="challenge-grid" role="list">
      ${s.challenges.map((c, i) => `<li class="challenge" data-reveal style="--reveal-delay:${i * 60}ms"><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section surface-paper-2" aria-labelledby="solution-title">
  <div class="container split">
    <div class="split__aside"><div class="split__aside-inner" data-reveal>
      <p class="eyebrow"><span class="node" aria-hidden="true"></span>Our solution</p>
      <h2 class="h2" id="solution-title">${esc(s.solutionTitle)}</h2>
    </div></div>
    <div class="split__main" data-reveal>
      <p class="lead lead--strong">${esc(s.solution)}</p>
      <ul class="check-list">${s.solutionPoints.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
    </div>
  </div>
</section>

<section class="section surface-paper" id="scope" aria-labelledby="scope-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'Scope of services', id: 'scope-title', title: 'What we can deliver.', intro: 'Every project is scoped individually. These are the deliverables most often included in this service.' })}
    <ul class="scope-grid" role="list">${s.scope.map((d) => `<li data-reveal>${svgIcon('tick', 18)}<span>${esc(d)}</span></li>`).join('')}</ul>
  </div>
</section>

${processSection(withIcons(s.process), { title: 'How the work runs, stage by stage.', id: 'svc-process' })}

${chips ? `<section class="section section--tight surface-paper" aria-labelledby="stack-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'Relevant technologies', id: 'stack-title', title: 'Tools we use for this work.', intro: 'The final stack is chosen during planning, based on your requirements and the team that will maintain the product.' })}
    <ul class="chip-list" data-reveal>${chips}</ul>
  </div>
</section>` : ''}

${related.length ? `<section class="section surface-paper-2" aria-labelledby="case-studies-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'Selected Case Studies', id: 'case-studies-title', title: 'Case studies for this service.' })}
    <div class="project-grid">${related.map((p) => projectCard(site, p)).join('')}</div>
  </div>
</section>` : ''}

${faqSection(s.faqs, { title: `${esc(s.name)}: common questions` })}

<section class="section section--tight surface-paper" aria-labelledby="other-title">
  <div class="container">
    <h2 class="h4 other-title" id="other-title">Other services</h2>
    <ul class="other-grid" role="list">${others.map((o) => `<li><a href="${u(`/services/${o.slug}/`)}"><span class="icon-badge icon-badge--xs">${svgIcon(serviceIcon[o.slug], 16)}</span>${esc(o.name)}</a></li>`).join('')}</ul>
  </div>
</section>

${ctaSection(site, { title: `Thinking about ${CTA_NOUN[s.slug] || 'a new project'}?`, text: 'Share a few details about what you need. We will come back with questions, an initial view on approach and the next practical step.' })}
`;
  return {
    path: `/services/${s.slug}/`,
    title: s.seoTitle,
    description: s.seoDescription,
    bodyClass: 'service',
    body,
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'Service', name: s.name, description: s.seoDescription, provider: { '@type': 'Organization', name: site.config.legalName, url: site.config.siteUrl }, serviceType: s.name },
      faqLd(s.faqs),
      breadcrumbLd(site, [['Home', '/'], ['Services', '/services/'], [s.name, `/services/${s.slug}/`]]),
    ],
  };
}

// ================================================================== WORK
// Rows of two large cards or three medium cards, chosen so no row is left
// with a single orphan card.
function workRows(n) {
  if (n <= 2) return Array(n).fill('lg');
  if (n === 3) return Array(3).fill('md');
  const sizes = ['lg', 'lg'];
  let rem = n - 2;
  while (rem > 0) {
    const row = rem === 2 || rem === 4 ? 2 : 3;
    sizes.push(...Array(row).fill(row === 2 ? 'lg' : 'md'));
    rem -= row;
  }
  return sizes;
}

export function workPage(site) {
  const { projects } = site;
  const kinds = [...new Set(projects.map((p) => (p.category.toLowerCase().includes('mobile') ? 'mobile' : /web|e-commerce/i.test(p.category) ? 'web' : 'systems')))];
  const labels = { web: 'Web', mobile: 'Mobile', systems: 'Business systems' };
  const anyDemo = projects.some((p) => p.demo);
  const body = `
${pageHero({
  crumbs: [['Home', '/'], ['Our work', '/work/']],
  eyebrow: 'Portfolio',
  title: 'Our work.',
  lead: 'Projects explained the way clients experience them: the problem, the approach and what changed afterwards.',
  actions: anyDemo ? demoBadge(true, 'Demo projects for layout review: replace with real case studies') : '',
})}

${projects.length ? `
<section class="section surface-paper section--flush-top" aria-labelledby="gallery-title">
  <div class="container">
    <h2 class="sr-only" id="gallery-title">Projects</h2>
    ${kinds.length > 1 ? `<div class="filter-bar" role="group" aria-label="Filter projects" data-filter-bar hidden>
      <button type="button" data-filter="all" aria-pressed="true">All <span>${projects.length}</span></button>
      ${kinds.map((k) => `<button type="button" data-filter="${k}" aria-pressed="false">${labels[k]}</button>`).join('')}
    </div><p class="sr-only" aria-live="polite" data-filter-status></p>` : ''}
    <div class="project-grid project-grid--work">
      ${workRows(projects.length).map((size, i) => projectCard(site, projects[i], { size })).join('')}
    </div>
  </div>
</section>
${testimonialsSection(site)}
` : `
<section class="section surface-paper section--flush-top">
  <div class="container">
    <div class="card empty-state">
      <span class="icon-badge">${svgIcon('doc')}</span>
      <h2 class="h3">Detailed case studies are being prepared.</h2>
      <p>We publish case studies once clients have approved what we can share. In the meantime, we are happy to walk you through relevant examples of our work on a call.</p>
      <div class="actions">
        <a class="btn" href="${u('/contact/')}">Ask to see examples ${icon.arrow}</a>
        <a class="btn btn--outline" href="${u('/services/')}">Explore our services</a>
      </div>
    </div>
  </div>
</section>`}

${ctaSection(site, { title: 'Planning something similar?', text: 'Tell us about the project you have in mind. We will share relevant experience and suggest how to approach it.', primary: 'Discuss a similar project' })}
`;
  return {
    path: '/work/',
    title: 'Our Work: Projects & Case Studies',
    description: 'Case studies from Adelogix: web platforms, mobile apps and business systems, with the challenge, approach and outcome of each project.',
    bodyClass: 'work',
    body,
  };
}

// ======================================================= PROJECT DETAIL
export function projectPage(site, p) {
  const bySlug = Object.fromEntries(site.services.map((s) => [s.slug, s]));
  const related = site.projects
    .filter((o) => o.slug !== p.slug)
    .sort((a, b) => b.services.filter((s) => p.services.includes(s)).length - a.services.filter((s) => p.services.includes(s)).length)
    .slice(0, 3);
  const testimonial = site.testimonials.find((t) => t.project === p.slug);
  const tech = techChips(site, p.tech);
  const block = (label, iconName, content) => `<div class="case-block" data-reveal><h3 class="case-block__label">${svgIcon(iconName, 20)}${label}</h3><div class="case-block__body">${content}</div></div>`;
  const body = `
<section class="project-hero surface-paper">
  <div class="container">
    ${breadcrumb([['Home', '/'], ['Our work', '/work/'], [p.name, `/work/${p.slug}/`]])}
    <div class="project-hero__grid">
      <div class="project-hero__copy">
        <div class="project-hero__meta">${projectMeta(p)}${demoBadge(p.demo, 'Demo project')}</div>
        <h1 class="project-hero__name">${esc(p.name)}</h1>
        <p class="project-hero__headline">${esc(p.headline)}</p>
      </div>
      <div class="project-hero__side">
        <p class="lead">${esc(p.intro)}</p>
        ${tech ? `<div><p class="tag">Built with</p><ul class="chip-list chip-list--sm">${tech}</ul></div>` : ''}
        <div class="actions">
          <button class="btn btn--lg" type="button" data-case-toggle aria-expanded="true" aria-controls="case-study">${svgIcon('doc', 18)}<span data-case-label>Read the case study</span></button>
          <a class="btn btn--outline btn--lg" href="${u('/contact/')}">Discuss a similar project</a>
        </div>
      </div>
    </div>
    <div class="project-hero__visual frame frame--shadow">${workImg(p, 0, { eager: true, sizes: '(min-width: 1360px) 1320px, 100vw' })}</div>
    <dl class="project-facts">
      <div><dt>Category</dt><dd>${esc(p.category)}</dd></div>
      <div><dt>Industry</dt><dd>${esc(p.industry)}</dd></div>
      <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>
      <div><dt>Services</dt><dd>${p.services.map((s) => `<a href="${u(`/services/${s}/`)}">${esc(bySlug[s] ? bySlug[s].name : s)}</a>`).join(', ')}</dd></div>
    </dl>
  </div>
</section>

<section class="case-study surface-paper" id="case-study" aria-labelledby="case-title" data-case-study>
  <div class="container">
    <div class="case-study__head">
      <p class="eyebrow"><span class="node" aria-hidden="true"></span>Case study</p>
      <h2 class="h2" id="case-title" tabindex="-1">How ${esc(p.name)} came together.</h2>
      ${p.demo ? '<p class="small muted">Demo case study: fictional content showing the structure every real project story will follow.</p>' : ''}
    </div>
    ${block('Project overview', 'globe', `<p class="statement statement--sm">${esc(p.overview)}</p>`)}
    ${block('Business context', 'building', `<p class="lead">${esc(p.context)}</p>`)}
    ${block('The challenge', 'puzzle', `<p class="lead">${esc(p.challenge)}</p>`)}
    ${block('The solution', 'sparkle', `<p class="lead">${esc(p.solution)}</p>`)}
    ${block('Key features and development', 'layers', `<ul class="feature-list">${p.features.map((f) => `<li>${svgIcon('tick', 18)}${esc(f)}</li>`).join('')}</ul>`)}
    ${tech ? block('Technology used', 'code', `<ul class="chip-list">${tech}</ul>`) : ''}
    <div class="case-gallery" data-reveal>
      ${(p.images || []).slice(1).map((img, i) => `<figure class="frame">${workImg(p, i + 1)}<figcaption class="sr-only">${esc(img.alt)}</figcaption></figure>`).join('')}
    </div>
    ${p.results && p.results.length
      ? block('Results and outcomes', 'finance', `<ul class="outcome-grid" role="list">${p.results.map((r) => `<li class="outcome"><span class="num">${esc(r.value)}</span><p>${esc(r.label)}</p></li>`).join('')}</ul>`)
      : p.goals ? block(p.demo ? 'What the project set out to achieve' : 'Project goals', 'check', `<ul class="feature-list">${p.goals.map((g) => `<li>${svgIcon('tick', 18)}${esc(g)}</li>`).join('')}</ul>${p.demo ? '<p class="small muted">Measured results will be added only when they can be supported by evidence.</p>' : ''}`) : ''}
    ${testimonial ? block('Client feedback', 'chat', `<blockquote class="case-quote"><p>${esc(testimonial.quote)}</p><footer>${esc(testimonial.name ? `${testimonial.name}, ${testimonial.role}` : testimonial.role)} ${demoBadge(testimonial.demo, 'Sample')}</footer></blockquote>`) : ''}
  </div>
</section>

${related.length ? `<section class="section surface-paper-2" aria-labelledby="more-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'Relevant projects', id: 'more-title', title: 'Related work.' })}
    <div class="project-grid">${related.map((o) => projectCard(site, o)).join('')}</div>
  </div>
</section>` : ''}

${ctaSection(site, { title: 'Planning something similar?', text: 'Tell us about your project and we will share how we would approach it.', primary: 'Discuss a similar project' })}
`;
  return {
    path: `/work/${p.slug}/`,
    title: `${p.name}: ${p.category} Case Study`,
    description: `${p.summary} ${p.headline}`.slice(0, 160),
    bodyClass: 'project',
    body,
    noindex: !!p.demo,
    jsonLd: [breadcrumbLd(site, [['Home', '/'], ['Our work', '/work/'], [p.name, `/work/${p.slug}/`]])],
  };
}
export const casePage = projectPage;

// =============================================================== CONTACT
export function contactPage(site) {
  const { config } = site;
  const c = config.contact;
  const options = site.services.map((s) => `<option value="${attr(s.slug)}">${esc(s.name)}</option>`).join('');
  const direct = [
    c.email && ['mail', 'Email', `<a href="mailto:${attr(c.email)}" data-track="email_click">${esc(c.email)}</a>`],
    c.phone && ['phone', 'Phone', `<a href="tel:${attr(c.phone.replace(/[^\d+]/g, ''))}" data-track="phone_click">${esc(c.phone)}</a>`],
    c.whatsapp && ['chat', 'WhatsApp', `<a href="https://wa.me/${attr(c.whatsapp)}" target="_blank" rel="noopener" data-track="whatsapp_click">Message us on WhatsApp</a>`],
    c.location && ['pin', 'Location', esc(c.location)],
    c.hours && ['calendar', 'Hours', esc(c.hours)],
  ].filter(Boolean);
  const body = `
<section class="contact-hero surface-paper">
  <div class="container contact-layout">
    <div class="contact-intro">
      ${breadcrumb([['Home', '/'], ['Contact', '/contact/']])}
      <p class="eyebrow"><span class="node" aria-hidden="true"></span>Contact</p>
      <h1 class="h1">Tell us about your project.</h1>
      <p class="lead">Whether you have a detailed brief or just an idea, start here. A short message is enough for us to understand what you need and suggest a next step.</p>
      ${direct.length ? `<ul class="contact-direct" role="list">${direct.map(([ic, k, v]) => `<li><span class="icon-badge icon-badge--soft">${svgIcon(ic, 20)}</span><span><small>${k}</small>${v}</span></li>`).join('')}</ul>`
        : site.review ? `<p>${ph(true, 'Business email, phone/WhatsApp and location needed')}</p>` : ''}
      ${config.bookingUrl ? `<div class="booking-card surface-ink" data-nav-dark>
        <div class="aura" aria-hidden="true"></div>
        <h2>Prefer to talk it through?</h2>
        <p>Book a short introductory call at a time that suits you. We will discuss your goals and whether we are the right fit.</p>
        <a class="btn btn--light" href="${attr(config.bookingUrl)}" target="_blank" rel="noopener" data-track="booking_click">${svgIcon('calendar', 18)} Book a meeting</a>
      </div>` : site.review ? `<div class="booking-card surface-ink" data-nav-dark><div class="aura" aria-hidden="true"></div><h2>Prefer to talk it through?</h2><p>A booking link (Calendly, Cal.com or similar) will appear here once configured.</p>${ph(true, 'Booking link needed')}</div>` : ''}
    </div>

    <div class="card contact-form-card" id="form">
      <h2>Project enquiry</h2>
      <p>Fields marked <span class="req">*</span> are required. It takes about two minutes.</p>
      <form class="form" method="post" action="${attr(config.formEndpoint || '#form')}" data-contact-form data-endpoint="${attr(config.formEndpoint)}">
        <div class="form-row">
          <div class="field"><label for="f-name">Name <span class="req" aria-hidden="true">*</span></label><input class="input" id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="e-name"><span class="field-error" id="e-name" role="alert"></span></div>
          <div class="field"><label for="f-email">Business email <span class="req" aria-hidden="true">*</span></label><input class="input" id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="e-email"><span class="field-error" id="e-email" role="alert"></span></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="f-company">Company <span class="opt">(optional)</span></label><input class="input" id="f-company" name="company" type="text" autocomplete="organization"></div>
          <div class="field"><label for="f-service">Service required <span class="req" aria-hidden="true">*</span></label>
            <select class="select" id="f-service" name="service" required aria-describedby="e-service">
              <option value="">Select a service</option>${options}<option value="not-sure">Not sure yet</option>
            </select><span class="field-error" id="e-service" role="alert"></span></div>
        </div>
        <div class="field"><label for="f-budget">Budget range <span class="opt">(optional)</span></label>
          <select class="select" id="f-budget" name="budget">
            <option value="">Prefer not to say</option>
            <option>Under $5,000</option><option>$5,000 to $15,000</option><option>$15,000 to $50,000</option><option>$50,000 or more</option><option>Not sure yet</option>
          </select>
          <span class="hint">Helps us suggest a realistic scope. It does not commit you to anything.</span>
        </div>
        <div class="field"><label for="f-details">Project details <span class="req" aria-hidden="true">*</span></label><textarea class="textarea" id="f-details" name="details" required aria-describedby="h-details e-details" placeholder="What are you building or improving, who is it for, and is there a deadline?"></textarea><span class="hint" id="h-details">A few sentences is plenty.</span><span class="field-error" id="e-details" role="alert"></span></div>
        <fieldset class="field">
          <legend>Preferred contact method</legend>
          <div class="choice-group">
            ${[['email', 'Email'], ['phone', 'Phone call'], ['whatsapp', 'WhatsApp'], ['video', 'Video call']].map(([v, l], i) => `<label class="choice"><input type="radio" name="contact_method" value="${v}"${i === 0 ? ' checked' : ''}><span>${l}</span></label>`).join('')}
          </div>
        </fieldset>
        <div class="field" data-phone-field hidden><label for="f-phone">Phone / WhatsApp number <span class="req" aria-hidden="true">*</span></label><input class="input" id="f-phone" name="phone" type="tel" autocomplete="tel" aria-describedby="e-phone" placeholder="+44 20 1234 5678"><span class="field-error" id="e-phone" role="alert"></span></div>
        <div class="hp-field" aria-hidden="true"><label for="f-website">Leave this field empty</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        <!-- FormSubmit configuration -->
        <input type="hidden" name="_subject" value="New Project Inquiry – ADELOGIX Website">
        <input type="hidden" name="_replyto" id="f-replyto" value="">
        <div class="form-status" data-form-status role="status" aria-live="polite"></div>
        <div class="form-footer">
          <p>We use these details only to respond to your enquiry. See our <a href="${u('/privacy-policy/')}">Privacy Policy</a>.</p>
          <button class="btn btn--lg" type="submit" data-track="form_submit_click"><span class="spinner" aria-hidden="true"></span>Send enquiry ${icon.arrow}</button>
        </div>
        ${!config.formEndpoint && site.review ? `<p>${ph(true, 'Form endpoint not configured')} <span class="small muted">Submissions show an honest "not connected" message until FORM_ENDPOINT is set.</span></p>` : ''}
      </form>
    </div>
  </div>
</section>

<section class="section surface-paper-2" aria-labelledby="next-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'What happens next', id: 'next-title', title: 'After you get in touch.' })}
    <ol class="next-steps">
      <li data-reveal><span class="icon-badge">${svgIcon('doc')}</span><span class="tag">Step 1</span><h3>We read your message</h3><p>A member of the team reviews every enquiry personally. If anything is unclear, we will ask.</p></li>
      <li data-reveal><span class="icon-badge">${svgIcon('chat')}</span><span class="tag">Step 2</span><h3>We talk it through</h3><p>We arrange a conversation using your preferred contact method to understand your goals, users and constraints.</p></li>
      <li data-reveal><span class="icon-badge">${svgIcon('map')}</span><span class="tag">Step 3</span><h3>You get a clear proposal</h3><p>We recommend an approach, outline the scope and give you an estimate, or suggest a discovery phase if more detail is needed.</p></li>
    </ol>
  </div>
</section>
${testimonialsSection(site, { title: 'Hear it from our clients.', surface: 'surface-paper' })}
`;
  return {
    path: '/contact/',
    title: 'Contact Us: Discuss Your Project',
    description: 'Contact Adelogix to discuss a web, mobile or custom software project. Send an enquiry, book a call or reach the team directly.',
    bodyClass: 'contact',
    body,
  };
}

// ================================================================= LEGAL
function legalPage(site, { path, title, intro, sections, description }) {
  const body = `
${pageHero({ crumbs: [['Home', '/'], [title, path]], title: esc(title), lead: intro })}
<section class="section surface-paper section--flush-top">
  <div class="container legal-layout">
    <aside class="legal-toc"><nav aria-label="On this page"><p class="eyebrow">On this page</p><ol>${sections.map(([h], i) => `<li><a href="#s${i + 1}">${esc(h)}</a></li>`).join('')}</ol></nav></aside>
    <div class="legal-body">
      ${site.review ? '<p class="legal-note"><strong>Draft for review.</strong> This text is a starting point based on how the website currently handles data. Bracketed details must be completed, and the page should be reviewed by a qualified legal adviser before launch.</p>' : ''}
      <div class="prose">
        <p class="muted small">Last updated: ${esc(site.config.legal.lastUpdated)}</p>
        ${sections.map(([h, content], i) => `<h2 id="s${i + 1}">${esc(h)}</h2>${content}`).join('')}
      </div>
    </div>
  </div>
</section>`;
  return { path, title, description, bodyClass: 'legal', body };
}

export function privacyPage(site) {
  const { config } = site;
  const contact = config.contact.email ? `<a href="mailto:${attr(config.contact.email)}">${esc(config.contact.email)}</a>` : `the <a href="${u('/contact/')}">contact form</a>`;
  const address = config.company.registeredAddress || '[registered business address]';
  return legalPage(site, {
    path: '/privacy-policy/',
    title: 'Privacy Policy',
    description: 'How Adelogix Software Technology collects, uses and protects personal information submitted through this website.',
    intro: 'How we collect, use and protect the information you share with us through this website.',
    sections: [
      ['Who we are', `<p>This website is operated by ${esc(config.legalName)} ("Adelogix", "we", "us"), located at ${esc(address)}. For any privacy question, contact us via ${contact}.</p>`],
      ['Information we collect', `<p>We only collect information you choose to give us, and limited technical data needed to run the site:</p><ul><li><strong>Enquiry details:</strong> your name, business email, company, the service you are interested in, an optional budget range, your project description, preferred contact method and, if you choose phone or WhatsApp, your phone number.</li><li><strong>Booking details:</strong> if you book a meeting, the booking provider collects the details you enter there under its own privacy policy.</li><li><strong>Analytics data:</strong> only if you accept analytics cookies, Google Analytics collects information such as pages visited, approximate location, device and browser type.</li><li><strong>Server logs:</strong> our hosting provider may record IP addresses and request information for security and reliability.</li></ul>`],
      ['How we use your information', '<ul><li>To respond to your enquiry and discuss your project.</li><li>To prepare proposals and, if we work together, to deliver the agreed services.</li><li>To understand how visitors use the website so we can improve it (only with your consent).</li><li>To protect the website against spam and abuse.</li></ul><p>We do not sell your personal information, and we do not use your enquiry details for unrelated marketing without your permission.</p>'],
      ['Legal basis', '<p>Where data protection laws such as the UK GDPR or EU GDPR apply, we process enquiry details on the basis of our legitimate interest in responding to you and taking steps at your request before entering into a contract. Analytics cookies are used only with your consent.</p>'],
      ['Cookies and analytics', `<p>The website works without cookies. If analytics is enabled, we ask for your consent before setting any Google Analytics cookies. You can change your choice at any time using "Cookie settings" in the footer.</p>`],
      ['Who we share information with', '<p>We use trusted service providers to operate the website and handle enquiries, such as our hosting provider, email delivery service, booking tool and, with consent, Google Analytics. They process data on our behalf and only as needed to provide their service. [List the specific providers once confirmed.]</p>'],
      ['How long we keep information', '<p>We keep enquiry details for as long as needed to respond and follow up, and for up to [24 months] afterwards unless we start working together, in which case project records are kept for the duration of the relationship and any legally required period.</p>'],
      ['Your rights', `<p>Depending on where you live, you may have the right to access, correct, delete or restrict the use of your personal information, to object to processing and to withdraw consent. To make a request, contact us via ${contact}. You also have the right to complain to your local data protection authority.</p>`],
      ['Security', '<p>The website is served over HTTPS and form submissions are transmitted securely. We limit access to enquiry data to the people who need it to respond to you.</p>'],
      ['Changes to this policy', '<p>We may update this policy when our website or practices change. The "Last updated" date above shows when it was last revised.</p>'],
    ],
  });
}

export function termsPage(site) {
  const { config } = site;
  const law = config.legal.governingLaw || '[governing law, e.g. the laws of the country where Adelogix is registered]';
  return legalPage(site, {
    path: '/terms/',
    title: 'Terms & Conditions',
    description: 'Terms and conditions for using the Adelogix Software Technology website.',
    intro: 'The terms that apply when you use this website. Project work is covered by a separate written agreement.',
    sections: [
      ['About these terms', `<p>These terms govern your use of this website, operated by ${esc(config.legalName)}. By using the site you accept them. If you do not agree, please do not use the site.</p>`],
      ['Our services', '<p>Information on this website describes the services we offer in general terms. It is not an offer capable of acceptance. Any project is subject to a separate proposal and agreement that sets out scope, fees, timelines and responsibilities.</p>'],
      ['Intellectual property', '<p>The content, design, logo and code of this website belong to Adelogix or are used with permission. Project images and client names appear with the permission of the relevant clients. You may not copy or reuse them without written consent.</p>'],
      ['Use of the website', '<p>You agree not to misuse the website, including by attempting to gain unauthorised access, introducing malicious code, or submitting false or abusive information through our forms.</p>'],
      ['Accuracy of information', '<p>We aim to keep the website accurate and up to date, but we do not guarantee that all information is complete or current. Nothing on this website is professional advice for your specific circumstances.</p>'],
      ['Third-party links', '<p>The website may link to third-party sites and tools, such as booking or social media platforms. We are not responsible for their content or privacy practices.</p>'],
      ['Liability', '<p>To the extent permitted by law, we are not liable for any loss arising from the use of, or inability to use, this website. Nothing in these terms limits liability that cannot be limited by law.</p>'],
      ['Governing law', `<p>These terms are governed by ${esc(law)}.</p>`],
      ['Contact', `<p>Questions about these terms can be sent through our <a href="${u('/contact/')}">contact page</a>.</p>`],
    ],
  });
}

// ================================================================== 404
export function notFoundPage(site) {
  const body = `
<section class="notfound surface-ink" data-nav-dark>
  <div class="aura" aria-hidden="true"></div>
  <div class="dot-grid" aria-hidden="true"></div>
  <div class="container notfound__inner">
    <p class="notfound__code">Error 404</p>
    <h1 class="h1">This page is not connected to anything.</h1>
    <p>The link may be out of date, or the page may have moved. These are good places to continue:</p>
    <div class="actions">
      <a class="btn btn--light btn--lg" href="${u('/')}">Back to the homepage ${icon.arrow}</a>
      <a class="btn btn--glass btn--lg" href="${u('/contact/')}">Contact us</a>
    </div>
    <ul class="notfound__links" role="list">
      <li><a href="${u('/services/')}">Services</a></li>
      <li><a href="${u('/work/')}">Our work</a></li>
      <li><a href="${u('/about/')}">About us</a></li>
    </ul>
  </div>
</section>`;
  return { path: '/404.html', title: 'Page not found', description: 'The page you were looking for could not be found. Continue to the Adelogix homepage, services or contact page.', bodyClass: 'notfound-page', navTheme: 'dark', body, noindex: true };
}

// ============================================================== JSON-LD
function faqLd(faqs) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
}
function breadcrumbLd(site, crumbs) {
  const base = site.config.siteUrl.replace(/\/$/, '');
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name: name.replace(/[[\]]/g, ''), item: base + path })) };
}
