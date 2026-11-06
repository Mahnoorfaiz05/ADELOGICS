// Company-level content: technologies, process, reasons, industries, and the
// evidence collections (projects, testimonials, team, client logos).
//
// DEMO CONTENT RULE
// Entries marked `demo: true` are fictional, replaceable development content.
// They appear only in the review build (npm run build:review), always with a
// visible "Demo" label, and are removed from the production build.
// Replace them with real, approved information before launch: see
// docs/CONTENT-NEEDED.md for the full list.

// `confirmed: true` = named in the Adelogix requirements document.
// Everything else must be confirmed by the team before it is published.
export const technologies = {
  groups: [
    { id: 'frontend', name: 'Frontend', items: ['react', 'nextjs', 'typescript', 'javascript', 'tailwind'] },
    { id: 'backend', name: 'Backend', items: ['nodejs', 'laravel', 'php', 'python'] },
    { id: 'mobile', name: 'Mobile', items: ['android', 'ios', 'flutter', 'reactnative', 'swift', 'kotlin'] },
    { id: 'data', name: 'Data & Infrastructure', items: ['postgresql', 'mysql', 'firebase', 'docker', 'aws'] },
    { id: 'cms', name: 'CMS & Commerce', items: ['wordpress', 'woocommerce', 'strapi', 'stripe'] },
    { id: 'ai', name: 'AI & Automation', items: ['openai', 'anthropic', 'langchain', 'n8n', 'zapier'] },
    { id: 'design', name: 'Design', items: ['figma', 'figjam', 'adobe'] },
  ],
  items: {
    react: { name: 'React' },
    nextjs: { name: 'Next.js' },
    typescript: { name: 'TypeScript' },
    javascript: { name: 'JavaScript' },
    tailwind: { name: 'Tailwind CSS' },
    nodejs: { name: 'Node.js' },
    laravel: { name: 'Laravel' },
    php: { name: 'PHP' },
    python: { name: 'Python' },
    android: { name: 'Android', confirmed: true },
    ios: { name: 'iOS', confirmed: true },
    flutter: { name: 'Flutter' },
    reactnative: { name: 'React Native' },
    swift: { name: 'Swift' },
    kotlin: { name: 'Kotlin' },
    postgresql: { name: 'PostgreSQL' },
    mysql: { name: 'MySQL' },
    firebase: { name: 'Firebase' },
    docker: { name: 'Docker' },
    aws: { name: 'AWS' },
    wordpress: { name: 'WordPress', confirmed: true },
    woocommerce: { name: 'WooCommerce' },
    strapi: { name: 'Strapi' },
    stripe: { name: 'Stripe' },
    openai: { name: 'OpenAI API' },
    anthropic: { name: 'Claude API' },
    langchain: { name: 'LangChain' },
    n8n: { name: 'n8n' },
    zapier: { name: 'Zapier' },
    figma: { name: 'Figma', confirmed: true },
    figjam: { name: 'FigJam' },
    adobe: { name: 'Adobe Creative Cloud' },
  },
};

// Section 8 of the requirements: four steps. `icon` refers to lib.mjs icons.
export const process = [
  { title: 'Discover', icon: 'search', text: 'We learn how your business works, who the users are and what the project has to achieve.', output: ['Goals and requirements summary', 'Users and key journeys', 'Risks and open questions'] },
  { title: 'Plan', icon: 'map', text: 'We agree the scope, technical approach and timeline, so you know what will be delivered and when.', output: ['Scope and phased estimate', 'Technical approach', 'Timeline and milestones'] },
  { title: 'Build', icon: 'code', text: 'We design, develop and test in stages, sharing working software for your feedback along the way.', output: ['Designs and prototypes', 'Staged, reviewable releases', 'Testing before every release'] },
  { title: 'Launch & Support', icon: 'rocket', text: 'We deploy, hand over what your team needs and provide the support we agreed at the start.', output: ['Deployment and go-live', 'Documentation and access', 'Agreed ongoing support'] },
];

// Section 7 of the requirements.
export const reasons = [
  { title: 'Clear communication', icon: 'chat', text: 'You always know what is in progress, what is finished and what needs your input.' },
  { title: 'Practical problem-solving', icon: 'puzzle', text: 'We look for the simplest solution to the real problem, and say so when a feature can wait.' },
  { title: 'Suitable technology', icon: 'layers', text: 'Tools are chosen for your budget, team and growth plans, not for what is fashionable.' },
  { title: 'Organised delivery', icon: 'calendar', text: 'Agreed scope, visible milestones and staged releases keep the project predictable.' },
  { title: 'Support after launch', icon: 'shield', text: 'We can stay on to fix issues, monitor and improve the product, on terms agreed upfront.' },
];

// Section 9 of the requirements: sectors we build for, the kinds of software
// each typically needs, and the related services. No claims of past clients.
export const industries = [
  { name: 'Healthcare & Medical', icon: 'health', text: 'Appointment booking, patient portals and staff scheduling.', services: ['custom-software-development', 'mobile-app-development'] },
  { name: 'Education & E-Learning', icon: 'education', text: 'Course platforms, student portals and assessment tools.', services: ['saas-development', 'web-development'] },
  { name: 'E-Commerce & Retail', icon: 'cart', text: 'Online stores, inventory and order management.', services: ['wordpress-development', 'erp-cms-development'] },
  { name: 'Finance & FinTech', icon: 'finance', text: 'Client dashboards, onboarding flows and approval tools.', services: ['custom-software-development', 'ai-development-automation'] },
  { name: 'Real Estate & Property', icon: 'building', text: 'Listings, enquiry management and agent CRMs.', services: ['crm-development', 'web-development'] },
  { name: 'Travel & Hospitality', icon: 'plane', text: 'Booking engines, guest apps and availability tools.', services: ['mobile-app-development', 'web-development'] },
  { name: 'Automotive', icon: 'car', text: 'Workshop systems, service booking and customer apps.', services: ['mobile-app-development', 'crm-development'] },
];

export const principles = [
  { title: 'Understand before we build', icon: 'search', text: 'Every project starts with questions about your business, not a list of features.' },
  { title: 'Say what we will do, then do it', icon: 'check', text: 'Scope, timelines and costs are written down. If something changes, we raise it early.' },
  { title: 'Choose the right tool for the job', icon: 'layers', text: 'Technology is picked for fit and maintainability, so your product never depends on a trend.' },
  { title: 'Leave things documented', icon: 'doc', text: 'Code, decisions and access are documented, so your product is never a black box.' },
];

// Hero media. Replace `src`/`poster` with the official company film when it
// is ready (MP4, H.264, 16:10 or 16:9, ideally under 6 MB, no audio needed).
// `demo: true` media is shown only in the review build; production falls back
// to the illustrated system diagram until a real film is configured.
export const heroMedia = {
  demo: true,
  src: '/assets/demo/hero/reel.mp4',
  poster: '/assets/demo/hero/poster.webp',
  label: 'Demo reel',
  note: 'Temporary demo reel built from demo project visuals. Replace with the Adelogix company film.',
};

// ---------------------------------------------------------------------------
// PROJECTS (all demo until real case studies are supplied)
// Images live in src/assets/demo/work/<slug>/ (generated by
// scripts/demo-assets.mjs). For a real project, put images in
// src/assets/work/<slug>/ and set `imageDir: 'work'`.
// ---------------------------------------------------------------------------
const demoImages = (name) => [
  { file: 'cover.webp', alt: `${name} interface shown on desktop and mobile (demo visual)` },
  { file: 'screen.webp', alt: `${name} main application screen (demo visual)` },
  { file: 'mobile.webp', alt: `${name} mobile screens (demo visual)` },
];

export const projects = [
  {
    demo: true,
    slug: 'carevia-clinic-desk',
    name: 'Carevia Clinic Desk',
    category: 'Web application',
    industry: 'Healthcare & Medical',
    year: '2025',
    accent: '#2F7D6D',
    ui: 'clinic',
    services: ['custom-software-development', 'ui-ux-design', 'web-development'],
    headline: 'One schedule for every clinician, room and appointment.',
    summary: 'A scheduling and patient check-in system for a multi-room outpatient clinic.',
    intro: 'Reception staff were juggling paper diaries and a shared spreadsheet. Carevia brings bookings, rooms and patient check-in into one screen, with reminders sent automatically.',
    overview: 'Carevia Clinic Desk is a browser-based system used by reception and clinical staff to manage appointments, rooms and patient arrivals across a working day.',
    context: 'A growing outpatient clinic with several practitioners and treatment rooms, booking by phone and walk-in, with no single view of the day.',
    challenge: 'Double bookings happened when two receptionists edited the same spreadsheet. Clinicians could not see their next patient without walking to the front desk, and no-shows were rarely followed up.',
    solution: 'We mapped the day from first phone call to checkout, then designed a timeline view of rooms and clinicians with conflict checks built in. Check-in updates every clinician’s screen instantly, and reminder messages go out the day before each appointment.',
    features: ['Room and clinician timeline with conflict checks', 'Patient check-in with live status for clinicians', 'Automated SMS and email reminders', 'Role-based access for reception, clinicians and managers', 'Daily and weekly utilisation reports', 'Audit log of every booking change'],
    tech: ['react', 'typescript', 'nodejs', 'postgresql', 'aws', 'figma'],
    goals: ['Remove double bookings caused by shared spreadsheets', 'Give clinicians a live view of their next patient', 'Reduce manual reminder calls at reception'],
    images: demoImages('Carevia Clinic Desk'),
  },
  {
    demo: true,
    slug: 'pitlane-service-app',
    name: 'Pitlane Service',
    category: 'Mobile app',
    industry: 'Automotive',
    year: '2025',
    accent: '#C2551F',
    ui: 'garage',
    services: ['mobile-app-development', 'ui-ux-design', 'crm-development'],
    headline: 'Car servicing booked, tracked and approved from a phone.',
    summary: 'A customer app and workshop dashboard for a vehicle servicing business.',
    intro: 'Customers book a service, follow progress and approve extra work with photos from the technician, while the workshop manages bays and jobs from one dashboard.',
    overview: 'Pitlane Service pairs an iOS and Android customer app with a web dashboard for the workshop team.',
    context: 'An independent servicing workshop taking bookings by phone and approving additional repairs through long calls with customers at work.',
    challenge: 'Approvals for extra work stalled because customers could not be reached, cars sat waiting in bays, and the team had no reliable record of what was agreed.',
    solution: 'Technicians attach photos and a quote to each job; customers approve or decline in the app with one tap, and the decision is stored with the job. Bay scheduling and job status are shared between app and dashboard in real time.',
    features: ['Online service booking with available slots', 'Live job status for customers', 'Photo-based approval of additional work', 'Workshop bay and technician scheduling', 'Service history per vehicle', 'Push notifications at each stage'],
    tech: ['flutter', 'firebase', 'nodejs', 'android', 'ios', 'figma'],
    goals: ['Shorten the wait for approvals on additional work', 'Keep a written record of every customer decision', 'Free reception from status-update phone calls'],
    images: demoImages('Pitlane Service'),
  },
  {
    demo: true,
    slug: 'learnloop-platform',
    name: 'Learnloop',
    category: 'SaaS platform',
    industry: 'Education & E-Learning',
    year: '2024',
    accent: '#3F5BD8',
    ui: 'learning',
    services: ['saas-development', 'ui-ux-design', 'web-development'],
    headline: 'Short courses that companies can roll out to whole teams.',
    summary: 'A subscription learning platform for professional training providers.',
    intro: 'Training providers publish courses, sell team licences and track completion, while learners study in short lessons on any device.',
    overview: 'Learnloop is a multi-tenant SaaS product: each training provider gets its own branded academy, course builder and reporting.',
    context: 'A training company running in-person workshops that wanted to sell online courses to corporate clients without building a separate platform for each.',
    challenge: 'Off-the-shelf course tools could not handle team licences bought by one company and assigned to many employees, and reporting for corporate buyers was manual.',
    solution: 'We built a multi-tenant platform with team seats, invitations and manager dashboards, plus subscription billing. Course content is authored in a block editor and delivered as short, trackable lessons.',
    features: ['Branded academies per training provider', 'Course builder with video, quizzes and files', 'Team licences with seat management', 'Manager dashboards for completion and scores', 'Subscription billing and invoices', 'Certificates generated on completion'],
    tech: ['nextjs', 'typescript', 'postgresql', 'stripe', 'aws', 'docker'],
    goals: ['Sell courses to companies, not only individuals', 'Give corporate buyers self-serve progress reports', 'Launch new academies without new code'],
    images: demoImages('Learnloop'),
  },
  {
    demo: true,
    slug: 'keyline-property-crm',
    name: 'Keyline',
    category: 'CRM system',
    industry: 'Real Estate & Property',
    year: '2024',
    accent: '#8A5A2B',
    ui: 'crm',
    services: ['crm-development', 'custom-software-development'],
    headline: 'Every enquiry, viewing and offer in one pipeline.',
    summary: 'A custom CRM for a property agency handling sales and lettings.',
    intro: 'Keyline captures enquiries from the website and listing portals, assigns them to agents and follows each buyer or tenant from first contact to completion.',
    overview: 'Keyline is a CRM shaped around a property agency’s pipeline, from enquiry to viewing, offer and completion.',
    context: 'A property agency with a sales and a lettings team, using a generic CRM that did not reflect how deals progress in property.',
    challenge: 'Enquiries arrived from several portals and were copied in by hand. Viewings lived in personal calendars, and managers could not see which properties were stalling.',
    solution: 'We built a pipeline with property-specific stages, automatic lead import from web forms and portals, shared viewing calendars and a dashboard showing time-in-stage for every listing.',
    features: ['Automatic lead capture from web forms and portals', 'Pipeline stages for sales and lettings', 'Viewing scheduling with shared calendars', 'Property and applicant matching', 'Follow-up reminders for agents', 'Listing performance dashboard'],
    tech: ['laravel', 'php', 'mysql', 'react', 'figma'],
    goals: ['Stop re-typing enquiries from listing portals', 'Show managers where each listing is stalling', 'Make sure every applicant gets a follow-up'],
    images: demoImages('Keyline'),
  },
  {
    demo: true,
    slug: 'oakbasket-store',
    name: 'Oakbasket',
    category: 'E-commerce website',
    industry: 'E-Commerce & Retail',
    year: '2025',
    accent: '#4F7A2A',
    ui: 'store',
    services: ['wordpress-development', 'ui-ux-design', 'erp-cms-development'],
    headline: 'A faster store with stock that stays in sync.',
    summary: 'A WooCommerce rebuild for a speciality food retailer with a physical shop.',
    intro: 'Oakbasket replaces a slow, plugin-heavy store with a custom WordPress theme and keeps online and in-shop stock in step.',
    overview: 'Oakbasket is a custom WooCommerce store with an inventory link to the retailer’s shop till system.',
    context: 'A speciality food shop selling online and in person, with a theme bought years ago and more than forty plugins installed.',
    challenge: 'Product pages loaded slowly, the team avoided editing them for fear of breaking the layout, and items sold in the shop were still available online.',
    solution: 'We designed and built a lightweight block-based theme, reduced the plugin set to what was needed, and connected stock levels between the till system and WooCommerce.',
    features: ['Custom block-based WooCommerce theme', 'Editor blocks for products, recipes and offers', 'Stock sync between shop and website', 'Delivery slot selection at checkout', 'Image optimisation and caching', 'Backups and update routine'],
    tech: ['wordpress', 'woocommerce', 'php', 'mysql', 'javascript'],
    goals: ['Make product pages fast on mobile', 'Let staff edit pages without breaking them', 'Stop selling items already sold in the shop'],
    images: demoImages('Oakbasket'),
  },
  {
    demo: true,
    slug: 'ledgerline-onboarding',
    name: 'Ledgerline',
    category: 'Client portal + AI',
    industry: 'Finance & FinTech',
    year: '2025',
    accent: '#1F6E8C',
    ui: 'finance',
    services: ['ai-development-automation', 'custom-software-development'],
    headline: 'Client onboarding without the document chase.',
    summary: 'A secure onboarding portal with AI-assisted document checks for an accounting firm.',
    intro: 'New clients upload their documents once; Ledgerline reads and classifies them, flags what is missing and passes everything to an adviser for review.',
    overview: 'Ledgerline is a client-facing portal combined with an internal review tool that uses AI to extract and check document details.',
    context: 'An accounting and advisory firm onboarding new clients through long email threads and repeated requests for the same documents.',
    challenge: 'Advisers spent hours each week chasing documents, renaming files and re-keying details into their practice software.',
    solution: 'We built a guided upload portal and an AI step that classifies each document and extracts key fields. Nothing is accepted automatically: an adviser reviews every extraction before it is saved.',
    features: ['Guided document upload for new clients', 'AI document classification and field extraction', 'Adviser review queue with side-by-side view', 'Missing-document reminders', 'Encrypted storage and access logs', 'Export to practice management software'],
    tech: ['python', 'openai', 'react', 'postgresql', 'aws'],
    goals: ['Reduce time spent chasing client documents', 'Remove manual re-keying of document details', 'Keep an adviser in control of every decision'],
    images: demoImages('Ledgerline'),
  },
];

// ---------------------------------------------------------------------------
// TESTIMONIALS: sample feedback only. No names or companies are used, so
// nothing can be mistaken for a real endorsement. Replace with exact,
// approved quotes: { quote, name, role, company, image?, project? }.
// ---------------------------------------------------------------------------
export const testimonials = [
  { demo: true, quote: 'They asked better questions about our process than we had asked ourselves. The first release was smaller than we planned, and that was the right call.', role: 'Operations lead', company: 'Healthcare provider', project: 'carevia-clinic-desk' },
  { demo: true, quote: 'Weekly demos meant there were no surprises at the end. We always knew what was finished and what was next.', role: 'Founder', company: 'Education start-up', project: 'learnloop-platform' },
  { demo: true, quote: 'Our team can update the site without calling a developer, and the pages are noticeably quicker on phones.', role: 'Marketing manager', company: 'Retail business', project: 'oakbasket-store' },
  { demo: true, quote: 'The pipeline finally matches how our agents work. Nobody keeps their own spreadsheet any more.', role: 'Sales director', company: 'Property agency', project: 'keyline-property-crm' },
  { demo: true, quote: 'They were clear about what the AI should and should not do, which made it easy for our advisers to trust it.', role: 'Managing partner', company: 'Accounting firm', project: 'ledgerline-onboarding' },
];

// ---------------------------------------------------------------------------
// TEAM: demo profiles only. Replace with { name, role, bio, photo } where
// photo is a file in src/assets/people/ (4:5 portrait, at least 800x1000).
// ---------------------------------------------------------------------------
export const team = [
  { demo: true, name: 'Team member', role: 'Leadership', bio: 'Name, role and a one-line focus to be supplied.' },
  { demo: true, name: 'Team member', role: 'Product design', bio: 'Name, role and a one-line focus to be supplied.' },
  { demo: true, name: 'Team member', role: 'Engineering', bio: 'Name, role and a one-line focus to be supplied.' },
  { demo: true, name: 'Team member', role: 'Delivery', bio: 'Name, role and a one-line focus to be supplied.' },
];

// Short message from the leadership team (shown beside the team).
export const companyMessage = {
  demo: true,
  text: 'A short message from the founder or leadership team goes here, in their own words: why Adelogix exists and what clients can expect from working with the team.',
  author: 'Founder name',
  role: 'Role to be confirmed',
};

// Company story for the About page.
export const story = {
  demo: true,
  paragraphs: [
    'When and where Adelogix was founded, and by whom.',
    'The problem the founders kept seeing with how software projects were delivered, and what they set out to do differently.',
    'Where the company is today: the kind of work it does now and where it is heading.',
  ],
};

// ---------------------------------------------------------------------------
// CLIENT / PARTNER LOGOS
// NextWys comes first, as requested. Its official logo file is not yet in the
// project: until src/assets/clients/nextwys.svg is added, the review build
// shows the name as plain text and production hides the strip.
// The other entries are generic placeholder marks, not real companies.
// ---------------------------------------------------------------------------
export const clients = [
  { name: 'NextWys', file: '', url: 'https://nextwys.com' },
  ...Array.from({ length: 7 }, (_, i) => ({ demo: true, name: `Placeholder logo ${i + 1}`, file: `placeholder-${i + 1}.svg`, dir: 'demo/clients' })),
];
