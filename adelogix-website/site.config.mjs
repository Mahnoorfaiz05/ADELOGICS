// Business facts and integration settings.
// Leave a value empty ('') when it is not confirmed. The build prints a warning
// for every missing value and the site hides anything that depends on it.
// Never fill these with guesses: they are published as facts.

export default {
  name: 'Adelogix',
  legalName: 'Adelogix Software Technology',

  // Production URL, used for canonical links, sitemap.xml and Open Graph.
  // TO CONFIRM: the final domain.
  siteUrl: process.env.SITE_URL || 'https://www.adelogix.com',

  contact: {
    email: process.env.CONTACT_EMAIL || 'Adelogixteam@gmail.com',        // e.g. hello@yourdomain.com
    phone: process.env.CONTACT_PHONE || '+92 313 8711670',        // international format, e.g. +44 20 1234 5678
    whatsapp: process.env.CONTACT_WHATSAPP || '923138711670',  // digits only, e.g. 442012345678
    location: process.env.CONTACT_LOCATION || 'Commercial Area, Bahawalpur, Punjab, Pakistan',  // e.g. "Lahore, Pakistan" or full address
    hours: process.env.CONTACT_HOURS || '',        // e.g. "Monday to Friday, 9:00 to 18:00 PKT"
  },

  // Meeting booking page (Calendly, Cal.com, Google Calendar booking, etc.)
  bookingUrl: process.env.BOOKING_URL || '',

  // Where the contact form POSTs. Use FormSubmit (formsubmit.co) for
  // email delivery without a backend, or any form provider that accepts
  // form-encoded data (Formspree, Web3Forms, Basin...).
  // Set FORM_ENDPOINT env var to override in production.
  formEndpoint: process.env.FORM_ENDPOINT || 'https://formsubmit.co/Adelogixteam@gmail.com',

  // Google Analytics 4 measurement ID (G-XXXXXXX). Loads only after consent.
  ga4Id: process.env.GA4_ID || '',
  // Google Search Console HTML-tag verification token (content value only).
  searchConsoleToken: process.env.GSC_TOKEN || '',

  social: {
    linkedin: process.env.SOCIAL_LINKEDIN || '',
    instagram: process.env.SOCIAL_INSTAGRAM || '',
    facebook: process.env.SOCIAL_FACEBOOK || '',
    x: process.env.SOCIAL_X || '',
    github: process.env.SOCIAL_GITHUB || '',
    behance: process.env.SOCIAL_BEHANCE || '',
    dribbble: process.env.SOCIAL_DRIBBBLE || '',
    clutch: process.env.SOCIAL_CLUTCH || '',
  },

  // Facts for the About page. Leave empty until confirmed.
  company: {
    founded: '',        // e.g. '2021'
    registeredAddress: '',
    registrationNumber: '',
  },

  legal: {
    lastUpdated: '30 October 2026',
    governingLaw: '',   // e.g. 'the laws of Pakistan'
  },
};
