// Contact form handler for Vercel Edge Functions.
// Validates the enquiry, filters spam and emails it through the Resend API.
//
// Required environment variables (set in Vercel project settings):
//   RESEND_API_KEY   API key from Resend
//   CONTACT_TO       inbox that receives enquiries, e.g. hello@adelogix.com
//   CONTACT_FROM     verified sender, e.g. "Adelogix Website <website@adelogix.com>"
// Optional:
//   ALLOWED_ORIGIN   e.g. https://www.adelogix.com (rejects other origins)
//
// The frontend posts to /api/contact (configured via FORM_ENDPOINT env var).

const MAX = { name: 120, email: 200, company: 160, service: 80, budget: 60, details: 5000, contact_method: 20, phone: 40 };

export async function POST(request) {
  const env = process.env;

  const origin = request.headers.get('origin');
  if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) {
    return json({ ok: false, error: 'Forbidden' }, 403);
  }

  let data;
  try { data = await request.json(); } catch { return json({ ok: false, error: 'Invalid JSON' }, 400); }

  // Spam: honeypot filled or submitted faster than a person could type.
  if (data.website || Number(data.elapsed_ms) < 2500) {
    return json({ ok: true }, 200); // silently accept, do not send
  }

  const clean = {};
  for (const [k, max] of Object.entries(MAX)) {
    clean[k] = String(data[k] ?? '').trim().slice(0, max);
  }
  const errors = [];
  if (!clean.name) errors.push('name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email)) errors.push('email');
  if (!clean.service) errors.push('service');
  if (clean.details.length < 20) errors.push('details');
  if (['phone', 'whatsapp'].includes(clean.contact_method) && !clean.phone) errors.push('phone');
  if (errors.length) {
    return json({ ok: false, error: 'Validation failed', fields: errors }, 422);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return json({ ok: false, error: 'Email delivery is not configured' }, 500);
  }

  const lines = [
    ['Name', clean.name], ['Email', clean.email], ['Company', clean.company], ['Service', clean.service],
    ['Budget', clean.budget], ['Preferred contact', clean.contact_method], ['Phone', clean.phone],
    ['Page', String(data.page || '').slice(0, 300)],
  ].filter(([, v]) => v);
  const text = `${lines.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nProject details:\n${clean.details}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: clean.email,
      subject: `New enquiry: ${clean.service} from ${clean.name}${clean.company ? ` (${clean.company})` : ''}`,
      text,
    }),
  });
  if (!res.ok) {
    return json({ ok: false, error: 'Delivery failed' }, 502);
  }
  return json({ ok: true }, 200);
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
