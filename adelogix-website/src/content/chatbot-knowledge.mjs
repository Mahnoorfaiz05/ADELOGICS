// Chatbot knowledge base — Phase 1 (predefined FAQ engine)
// All content is sourced from the ADELOGIX website: services, projects,
// case studies, and contact information. Nothing here is invented.
// This module is designed so the response engine can later be swapped
// for an OpenAI-powered backend without changing the UI.

import { services } from './services.mjs';
import { projects } from './company.mjs';

const contact = {
  email: 'Adelogixteam@gmail.com',
  phone: '+92 313 8711670',
  whatsapp: '923138711670',
  location: 'Commercial Area, Bahawalpur, Punjab, Pakistan',
};

// Real (non-demo) projects only — these match what ships in production.
const realProjects = projects.filter((p) => !p.demo);

// ---------------------------------------------------------------------------
// FAQ entries
// Each entry has patterns (keywords/phrases to match), a response, optional
// internal links, and optional suggested follow-up questions.
// ---------------------------------------------------------------------------
export const faqEntries = [
  {
    id: 'about-company',
    patterns: [
      'what is adelogix', 'who is adelogix', 'about adelogix',
      'what does adelogix do', 'company information',
      'adelogix software technology', 'who are you',
    ],
    response: `Adelogix Software Technology designs, builds and supports web platforms, mobile apps and custom business software for startups, growing companies and established teams. We start with your process, choose technology that suits it, and stay involved after launch.`,
    links: [
      { text: 'About Adelogix', url: '/about/' },
      { text: 'Contact us', url: '/contact/' },
    ],
    followUp: ['What services do you offer?', 'Can I see your case studies?', 'How can I start a project?'],
  },
  {
    id: 'services-overview',
    patterns: [
      'what services do you offer', 'services', 'what do you offer',
      'what can you build', 'service list', 'offerings',
    ],
    response: `We offer twelve core services across websites, mobile apps, product design, business systems and AI:

${services.map((s) => `• ${s.name} — ${s.short}`).join('\n')}

Each service has its own detail page with scope, process and common questions.`,
    links: [
      { text: 'All services', url: '/services/' },
    ],
    followUp: ['Do you develop websites?', 'Do you develop mobile apps?', 'Do you build AI products?'],
  },
  {
    id: 'web-development',
    patterns: [
      'do you develop websites', 'web development', 'website', 'web app',
      'web development services', 'build a website', 'website development',
    ],
    response: `Yes. We build business websites, customer portals and web applications — from the frontend to the backend. Our web development service includes responsive design, technical SEO, documented code, and ongoing support.`,
    links: [
      { text: 'Web Development', url: '/services/web-development/' },
    ],
    followUp: ['Do you develop mobile apps?', 'What is included in web development?', 'Can you build a web application?'],
  },
  {
    id: 'mobile-app-development',
    patterns: [
      'do you develop mobile apps', 'mobile app development', 'ios app',
      'android app', 'mobile application', 'build an app', 'app development',
      'iphone app', 'mobile app',
    ],
    response: `Yes. We design and develop iOS and Android apps for customers, staff and field teams. We handle the backend, admin tools and store release as part of the same project, including App Store and Google Play submission.`,
    links: [
      { text: 'Mobile App Development', url: '/services/mobile-app-development/' },
    ],
    followUp: ['iOS or Android?', 'Can you publish to app stores?', 'What is the timeline for an app?'],
  },
  {
    id: 'ai-development',
    patterns: [
      'do you build ai', 'ai development', 'artificial intelligence',
      'automation', 'ai-powered', 'ai features', 'openai', 'chatbot',
    ],
    response: `Yes. We add practical AI features and workflow automation to applications — document extraction and classification, AI assistants trained on your content, and workflow automation between business tools. We start with tasks where the time saved is easy to measure.`,
    links: [
      { text: 'AI Development & Automation', url: '/services/ai-development-automation/' },
    ],
    followUp: ['Is our data safe with AI?', 'What AI features can you add?', 'Do we need lots of data?'],
  },
  {
    id: 'custom-software',
    patterns: [
      'custom software', 'do you build custom software', 'software development',
      'internal tools', 'business software', 'workflow system',
    ],
    response: `Yes. We build custom software shaped around your process — internal tools, admin panels, databases, reporting dashboards and integrations. We map your process with your team before writing any code and deliver in phases.`,
    links: [
      { text: 'Custom Software Development', url: '/services/custom-software-development/' },
    ],
    followUp: ['Can you connect to our existing tools?', 'How is custom software priced?', 'What happens to our existing data?'],
  },
  {
    id: 'crm-development',
    patterns: [
      'crm development', 'custom crm', 'do you build crm', 'customer relationship',
      'crm system', 'crm dashboard', 'sales pipeline', 'build a crm',
    ],
    response: `Yes. We build custom CRM systems and extend existing ones — pipeline stages, lead capture, follow-up reminders, dashboards and integrations. We can also customise existing CRM platforms.`,
    links: [
      { text: 'CRM Development', url: '/services/crm-development/' },
    ],
    followUp: ['Custom CRM or existing platform?', 'Can you migrate our data?', 'Will it work on mobile?'],
  },
  {
    id: 'ui-ux-design',
    patterns: [
      'ui ux design', 'ui/ux', 'ux design', 'ui design', 'do you do design',
      'product design', 'figma', 'interface design', 'user experience',
      'wireframe', 'prototype',
    ],
    response: `Yes. We design websites, apps, dashboards and admin panels in Figma — starting with user flows and wireframes, then visual design, and finishing with developer-ready files including design systems and handoff specs.`,
    links: [
      { text: 'UI/UX Design', url: '/services/ui-ux-design/' },
    ],
    followUp: ['What do we receive at the end?', 'Can you redesign part of a product?', 'How many revision rounds?'],
  },
  {
    id: 'devops-cloud',
    patterns: [
      'devops', 'cloud', 'aws', 'google cloud', 'infrastructure',
      'deployment', 'ci/cd', 'devops and cloud', 'it services',
    ],
    response: `Yes. We design, deploy and manage cloud infrastructure on AWS and Google Cloud Platform, with DevOps pipelines, monitoring and IT support. We build infrastructure as code and automate deployments.`,
    links: [
      { text: 'IT Services', url: '/services/it-services/' },
      { text: 'DevOps & Cloud', url: '/services/devops-cloud/' },
    ],
    followUp: ['Which cloud platforms do you support?', 'Can you take over existing infrastructure?', 'What support do you provide?'],
  },
  {
    id: 'saas-development',
    patterns: [
      'saas', 'software as a service', 'subscription', 'multi-tenant',
      'saas development', 'mvp',
    ],
    response: `Yes. We help founders build software-as-a-service products: multi-tenant architecture, subscription billing, user roles, admin panels and product analytics — from MVP to growing platform.`,
    links: [
      { text: 'SaaS Development', url: '/services/saas-development/' },
    ],
    followUp: ['How long does an MVP take?', 'Which payment providers?', 'Do you help after launch?'],
  },
  {
    id: 'erp-cms-development',
    patterns: [
      'erp', 'cms', 'content management', 'inventory', 'order management',
      'erp cms development', 'headless cms',
    ],
    response: `Yes. We build modular ERP systems connecting inventory, orders, purchasing and finance, and content management systems your team can run without developers.`,
    links: [
      { text: 'ERP & CMS Development', url: '/services/erp-cms-development/' },
    ],
    followUp: ['Modular or all at once?', 'Can it connect to accounting software?', 'Headless or traditional CMS?'],
  },
  {
    id: 'wordpress-development',
    patterns: [
      'wordpress', 'woocommerce', 'wordpress development', 'custom theme',
      'wordpress site', 'page builder',
    ],
    response: `Yes. We build custom WordPress themes and plugins — lightweight, fast and secure, without heavy page builders. We also handle WooCommerce stores, speed improvements and maintenance.`,
    links: [
      { text: 'WordPress Development', url: '/services/wordpress-development/' },
    ],
    followUp: ['Do you use page builders?', 'Can you speed up WordPress?', 'WordPress maintenance?'],
  },
  {
    id: 'product-development',
    patterns: [
      'product development', 'end to end', 'full product', 'product lifecycle',
      'build a product from scratch',
    ],
    response: `Yes. We take products from strategy through to release — research, design, development, QA, user testing and release management. One team responsible for the complete product.`,
    links: [
      { text: 'Product Development', url: '/services/product-development/' },
    ],
    followUp: ['Can you build from scratch?', 'Do you test with real users?', 'What happens after release?'],
  },
  {
    id: 'case-studies-overview',
    patterns: [
      'case studies', 'previous projects', 'portfolio', 'our work',
      'past projects', 'projects', 'see your work',
    ],
    response: `Yes. We have case studies for seven projects: Uplift.ai, Fast VPN, Emyy, USR CRM, OriusPay, TruNext and XENPOP. Each covers the project overview, challenge, solution, features and technologies.`,
    links: [
      { text: 'Our work', url: '/work/' },
    ],
    followUp: ['Tell me about Uplift.ai', 'Tell me about Fast VPN', 'Tell me about Emyy'],
  },
  {
    id: 'uplift-ai',
    patterns: [
      'uplift.ai', 'uplift', 'ai fitness', 'fitness app', 'health app',
    ],
    response: `Uplift.ai is a mobile fitness app that combines training, meals and daily health tracking with an AI coach. Adelogix designed, developed and deployed it in 2023 over about 3–4 months. It includes 11 user flows and a design system with colour, type and effect styles.`,
    links: [
      { text: 'Uplift.ai case study', url: '/work/uplift-ai/' },
    ],
    followUp: ['What features does Uplift.ai have?', 'How long did it take?', 'Other case studies?'],
  },
  {
    id: 'fast-vpn',
    patterns: [
      'fast vpn', 'vpn app', 'ios vpn', 'private browsing',
    ],
    response: `Fast VPN is an iOS app that connects users to a secure server in a single tap. Adelogix designed, developed and delivered it in 2025 over about 2–2.5 months. It includes 193 screens in light and dark mode, a built-in speed test, and Face ID/Touch ID/PIN security.`,
    links: [
      { text: 'Fast VPN case study', url: '/work/fast-vpn/' },
    ],
    followUp: ['How many screens does Fast VPN have?', 'What security features?', 'Timeline?'],
  },
  {
    id: 'emyy',
    patterns: [
      'emyy', 'marketplace', 'local services', 'freelancer', 'booking app',
    ],
    response: `Emyy is a local services marketplace connecting customers with local freelancers. Adelogix developed the mobile app and website, delivered in February 2026. It has 57 mobile screens, 6 web pages and 2 user roles (customer and freelancer), with Stripe payments and real-time booking states.`,
    links: [
      { text: 'Emyy case study', url: '/work/emyy/' },
    ],
    followUp: ['How many screens does Emyy have?', 'What are the two user roles?', 'When was it delivered?'],
  },
  {
    id: 'usr-crm',
    patterns: [
      'usr crm', 'usr', 'crm redesign', 'dj crm', 'events crm',
    ],
    response: `USR CRM is a web CRM for a UK team of international DJs and music producers. Adelogix redesigned and developed it in 2026 with a calm stone and sage interface, 14 desktop screens each with a matching mobile layout, live quotes, event sheets, a DJ colour-coded calendar and admin reports.`,
    links: [
      { text: 'USR CRM case study', url: '/work/usr-crm/' },
    ],
    followUp: ['How many screens does USR CRM have?', 'What industries does it serve?', 'Is it responsive?'],
  },
  {
    id: 'oriuspay',
    patterns: [
      'oriuspay', 'orius pay', 'fintech dashboard', 'finance dashboard',
      'merchant dashboard', 'horus',
    ],
    response: `OriusPay is a merchant finance dashboard designed and developed end to end by Adelogix in 2026. It has 17 modules on one sidebar — KPI cards, cash flow, transaction pipeline, Horus AI assistant, Quick Actions for payment links and QR codes, VAT compliance, and MFA security.`,
    links: [
      { text: 'OriusPay case study', url: '/work/oriuspay/' },
    ],
    followUp: ['How many modules does OriusPay have?', 'What is Horus AI?', 'Security features?'],
  },
  {
    id: 'trunext',
    patterns: [
      'trunext', 'crypto investment', 'gnse', 'crypto app',
      'investment platform',
    ],
    response: `TruNext is a crypto investment platform built around GNSE, its gold-backed token. Adelogix designed the full UI/UX across three surfaces — web app, mobile app and admin panel — in 2026. It features four investment packages, USDT and gold-backed token wallets, Skrill cashout, and a referral program.`,
    links: [
      { text: 'TruNext case study', url: '/work/trunext/' },
    ],
    followUp: ['How many surfaces does TruNext have?', 'What is GNSE?', 'UI/UX design only?'],
  },
  {
    id: 'xenpop',
    patterns: [
      'xenpop', 'crypto mining', 'mining app', 'xen coin',
      'community-powered',
    ],
    response: `XENPOP is a community-powered crypto mining platform. People mine and earn coins from their phone with no special hardware. Adelogix designed and developed the complete platform in 2026: a 76-screen mobile app, a landing page, and a 16-screen admin panel, all on one shared design system.`,
    links: [
      { text: 'XENPOP case study', url: '/work/xenpop/' },
    ],
    followUp: ['How many screens does XENPOP have?', 'Three touchpoints?', 'Design system?'],
  },
  {
    id: 'start-project',
    patterns: [
      'how can i start', 'start a project', 'begin a project',
      'how do we start', 'get started', 'next step',
    ],
    response: `Send us a short description of your project through the contact form or book a call. We will arrange an initial conversation to understand your goals, then suggest next steps — usually a discovery phase or a proposal.`,
    links: [
      { text: 'Contact us', url: '/contact/' },
    ],
    followUp: ['What happens after I contact you?', 'How are projects priced?', 'Do you sign NDAs?'],
  },
  {
    id: 'contact-details',
    patterns: [
      'contact', 'contact adelogix', 'email', 'phone', 'whatsapp',
      'location', 'where are you', 'where is adelogix', 'address', 'get in touch',
      'office location',
    ],
    response: `You can reach Adelogix at:

• Email: ${contact.email}
• Phone/WhatsApp: ${contact.phone}
• Location: ${contact.location}

Or use the contact form on our website.`,
    links: [
      { text: 'Contact page', url: '/contact/' },
    ],
    followUp: ['How can I start a project?', 'What are your hours?', 'Do you offer consultations?'],
  },
  {
    id: 'pricing-quotation',
    patterns: [
      'pricing', 'price', 'cost', 'quotation', 'quote', 'estimate',
      'how much', 'budget', 'request a quote', 'project quotation',
    ],
    response: `Pricing depends on your project requirements. Most projects are priced per phase after we understand the scope. For ongoing work we can agree a monthly arrangement. We explain what is included in every estimate so there are no surprises.

To get a quotation, send us your project details through the contact form.`,
    links: [
      { text: 'Contact us', url: '/contact/' },
    ],
    followUp: ['How are projects priced?', 'Can you work with our team?', 'What support after launch?'],
  },
  {
    id: 'service-recommendation',
    patterns: [
      'which service', 'which service do i need', 'recommend',
      'help me choose', 'what service fits', 'unsure',
    ],
    response: `I'd be happy to help you choose. Could you tell me a bit about what you're building — for example, a website, mobile app, CRM, or custom software? In the meantime, here's how our services map to common needs:

• Website or web app → Web Development
• iOS/Android app → Mobile App Development
• CRM system → CRM Development
• Custom internal tool → Custom Software Development
• UI/UX design → UI/UX Design
• SaaS product → SaaS Development

Send us your details and we'll recommend the right service.`,
    links: [
      { text: 'All services', url: '/services/' },
      { text: 'Contact us', url: '/contact/' },
    ],
    followUp: ['How can I start a project?', 'What is your process?', 'Do you offer discovery?'],
  },
  {
    id: 'fallback',
    patterns: [],
    response: `I'm not sure I can answer that from the information available on our website. The ADELOGIX team would be happy to help — you can contact us through the contact form, by email, or by phone/WhatsApp.`,
    links: [
      { text: 'Contact us', url: '/contact/' },
    ],
    followUp: ['What services do you offer?', 'Can I see your case studies?', 'How can I contact your team?'],
  },
];

// ---------------------------------------------------------------------------
// Response engine — keyword scoring with fallback
// ---------------------------------------------------------------------------
export function getResponse(message) {
  const normalized = message.toLowerCase().trim();
  if (!normalized) return faqEntries.find((e) => e.id === 'fallback');

  let best = faqEntries.find((e) => e.id === 'fallback');
  let bestScore = 0;

  for (const entry of faqEntries) {
    if (entry.id === 'fallback') continue;
    let score = 0;
    for (const pattern of entry.patterns) {
      if (normalized.includes(pattern.toLowerCase())) {
        score += pattern.length; // longer matches score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 0 ? best : faqEntries.find((e) => e.id === 'fallback');
}

// ---------------------------------------------------------------------------
// Suggested questions shown when chat opens
// ---------------------------------------------------------------------------
export const suggestedQuestions = [
  'What services do you offer?',
  'Can you build a custom CRM?',
  'Show me your recent projects.',
  'I need a website for my business.',
  'How can I start a project with ADELOGIX?',
];

// ---------------------------------------------------------------------------
// Welcome message
// ---------------------------------------------------------------------------
export const welcomeMessage = {
  text: `Hello! I'm the ADELOGIX assistant. I can help you with information about our services, case studies, and how to start a project. What would you like to know?`,
  links: [
    { text: 'All services', url: '/services/' },
    { text: 'Our work', url: '/work/' },
    { text: 'Contact us', url: '/contact/' },
  ],
};

// ---------------------------------------------------------------------------
// Real project summaries for detailed responses
// ---------------------------------------------------------------------------
export const projectSummaries = realProjects.map((p) => ({
  slug: p.slug,
  name: p.name,
  category: p.category,
  industry: p.industry,
  year: p.year,
  summary: p.summary,
  services: p.services,
  url: `/work/${p.slug}/`,
}));