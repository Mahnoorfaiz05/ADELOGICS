#!/usr/bin/env node
// Generates the DEMO visual assets used by the review build:
//   src/assets/demo/work/<slug>/{cover,screen,mobile}.webp   interface mockups
//   src/assets/demo/hero/{reel.mp4,poster.webp}             hero demo reel
//   src/assets/demo/clients/placeholder-N.svg               generic logo marks
// Everything is rendered from HTML with Playwright and encoded with ffmpeg.
// None of it shows real client work. Run: node scripts/demo-assets.mjs [--no-video]
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { projects } from '../src/content/company.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src/assets/demo');
const noVideo = process.argv.includes('--no-video');

// ------------------------------------------------------------ UI kit
const css = (accent) => `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,system-ui,sans-serif;color:#17151f;-webkit-font-smoothing:antialiased;--a:${accent}}
.app{display:grid;grid-template-columns:220px 1fr;width:1440px;height:900px;background:#f6f6f8}
.side{background:#14121c;color:#cfcbe0;padding:24px 16px;display:flex;flex-direction:column;gap:6px;font-size:14px}
.brand{display:flex;align-items:center;gap:10px;color:#fff;font-weight:600;font-size:16px;margin-bottom:22px}
.brand i{width:26px;height:26px;border-radius:8px;background:var(--a);display:block}
.nav{padding:10px 12px;border-radius:8px}.nav.on{background:#2a2638;color:#fff}
.main{padding:28px 32px;display:flex;flex-direction:column;gap:20px;overflow:hidden}
.top{display:flex;justify-content:space-between;align-items:center}
h1{font-size:26px;letter-spacing:-.02em;font-weight:600}.sub{color:#6b6878;font-size:14px;margin-top:4px}
.btn{background:var(--a);color:#fff;border-radius:10px;padding:10px 16px;font-size:14px;font-weight:600}
.btn.ghost{background:#fff;color:#17151f;border:1px solid #e3e1ea}
.card{background:#fff;border:1px solid #e8e6ee;border-radius:14px;padding:18px}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.kpi b{display:block;font-size:26px;letter-spacing:-.02em;margin-top:6px}.kpi span{color:#6b6878;font-size:13px}
.pill{display:inline-block;padding:4px 10px;border-radius:99px;font-size:12px;font-weight:600}
.p-ok{background:#e4f4ea;color:#1e7a4c}.p-wait{background:#fdf0dc;color:#9a5b06}.p-a{background:color-mix(in srgb,var(--a) 14%,#fff);color:var(--a)}.p-grey{background:#efedf3;color:#5f5b6e}
.row{display:flex;align-items:center;gap:12px}.grow{flex:1}
.av{width:34px;height:34px;border-radius:50%;background:color-mix(in srgb,var(--a) 22%,#fff);color:var(--a);display:grid;place-items:center;font-weight:700;font-size:12px}
table{width:100%;border-collapse:collapse;font-size:14px}td,th{text-align:left;padding:12px 10px;border-bottom:1px solid #eeecf2}th{color:#8a8696;font-weight:500;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
.muted{color:#8a8696;font-size:13px}
.bar{height:8px;border-radius:9px;background:#eeecf2;overflow:hidden}.bar i{display:block;height:100%;background:var(--a);border-radius:9px}
.img{border-radius:10px;background:linear-gradient(135deg,color-mix(in srgb,var(--a) 70%,#fff),color-mix(in srgb,var(--a) 35%,#14121c))}
/* phone */
.phone{width:390px;height:800px;border-radius:52px;background:#14121c;padding:12px;box-shadow:0 40px 80px -30px rgba(20,18,28,.45)}
.screen{width:100%;height:100%;border-radius:42px;background:#f6f6f8;overflow:hidden;display:flex;flex-direction:column}
.notch{width:120px;height:30px;background:#14121c;border-radius:20px;margin:10px auto 0}
.ph{padding:18px 20px;display:flex;flex-direction:column;gap:14px;flex:1}
.ph h2{font-size:24px;letter-spacing:-.02em}
.tabbar{display:flex;justify-content:space-around;padding:14px 0 26px;background:#fff;border-top:1px solid #eeecf2;font-size:11px;color:#8a8696}
.tabbar b{color:var(--a)}
`;

const shell = (p, active, body, navItems) => `
<div class="app"><aside class="side"><div class="brand"><i></i>${p.name.split(' ')[0]}</div>
${navItems.map((n) => `<div class="nav${n === active ? ' on' : ''}">${n}</div>`).join('')}
<div style="margin-top:auto" class="row"><div class="av" style="background:#2a2638;color:#fff">AD</div><div><div style="color:#fff;font-size:13px">Demo user</div><div style="font-size:12px">Admin</div></div></div>
</aside><main class="main">${body}</main></div>`;

const screens = {
  clinic(p) {
    const rooms = ['Room 1', 'Room 2', 'Room 3', 'Physio', 'Room 5'];
    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    const blocks = [[0, 0.2, 1.4, 'Follow-up', 'ok'], [0, 2, 1, 'New patient', 'a'], [0, 4.5, 1.5, 'Review', 'grey'], [1, 0.6, 1, 'Dressing', 'a'], [1, 2.4, 2, 'Minor procedure', 'wait'], [2, 1, 1.2, 'Consultation', 'ok'], [2, 3.5, 1, 'Follow-up', 'a'], [2, 5.4, 1.4, 'New patient', 'grey'], [3, 0, 1, 'Session 3/6', 'a'], [3, 1.2, 1, 'Session 1/6', 'a'], [3, 3, 2, 'Assessment', 'ok'], [4, 2, 1.5, 'Vaccination clinic', 'wait'], [4, 5, 1.6, 'Consultation', 'a']];
    const body = `<div class="top"><div><h1>Today · Tuesday 14 October</h1><div class="sub">42 appointments · 5 rooms · 7 clinicians</div></div><div class="row"><span class="btn ghost">Week</span><span class="btn">+ New booking</span></div></div>
    <div style="display:grid;grid-template-columns:1fr 300px;gap:20px;flex:1">
      <div class="card" style="padding:0;overflow:hidden"><div style="display:grid;grid-template-columns:110px repeat(8,1fr);font-size:12px;color:#8a8696;border-bottom:1px solid #eeecf2"><div></div>${hours.map((h) => `<div style="padding:12px 8px">${h}</div>`).join('')}</div>
      ${rooms.map((r, ri) => `<div style="display:grid;grid-template-columns:110px 1fr;border-bottom:1px solid #f0eef4;height:96px"><div style="padding:14px;font-weight:600;font-size:14px">${r}</div><div style="position:relative">${blocks.filter((b) => b[0] === ri).map((b) => `<div class="p-${b[4]}" style="position:absolute;top:14px;bottom:14px;left:${b[1] * 12.5}%;width:${b[2] * 12.5 - 0.6}%;border-radius:10px;padding:10px;font-size:12px;font-weight:600">${b[3]}<div style="font-weight:400;opacity:.8;margin-top:4px">${['A. M.', 'R. K.', 'S. T.', 'L. P.', 'H. W.'][(ri + Math.round(b[1])) % 5]}</div></div>`).join('')}${ri === 1 ? '<div style="position:absolute;top:0;bottom:0;left:31%;width:2px;background:#e5484d"></div>' : ''}</div></div>`).join('')}
      </div>
      <div class="card" style="display:flex;flex-direction:column;gap:14px"><div class="row"><b class="grow">Arrivals</b><span class="pill p-a">Live</span></div>
      ${[['A. M.', '09:10', 'Checked in', 'ok'], ['R. K.', '09:20', 'Waiting', 'wait'], ['S. T.', '09:40', 'Expected', 'grey'], ['L. P.', '10:00', 'Expected', 'grey'], ['H. W.', '10:15', 'Expected', 'grey'], ['J. O.', '10:30', 'Expected', 'grey']].map(([n, t, s, c]) => `<div class="row"><div class="av">${n.replace(/\W/g, '')}</div><div class="grow"><div style="font-weight:600;font-size:14px">Patient ${n}</div><div class="muted">${t}</div></div><span class="pill p-${c}">${s}</span></div>`).join('')}
      <div style="margin-top:auto" class="card"><div class="muted">Reminders sent today</div><b style="font-size:22px">38</b></div></div>
    </div>`;
    return shell(p, 'Schedule', body, ['Schedule', 'Patients', 'Rooms', 'Clinicians', 'Reminders', 'Reports', 'Settings']);
  },
  garage(p) {
    const bays = [['Bay 1', 'KX21 LMR', 'Full service', 0.7, 'In progress', 'a'], ['Bay 2', 'BD19 TFE', 'Brakes + MOT', 0.35, 'Awaiting approval', 'wait'], ['Bay 3', 'LN70 VSA', 'Diagnostics', 0.9, 'Quality check', 'ok'], ['Bay 4', 'Empty', 'Next: 11:30', 0, 'Free', 'grey']];
    const body = `<div class="top"><div><h1>Workshop</h1><div class="sub">Thursday · 14 jobs booked · 3 approvals pending</div></div><span class="btn">+ Add job</span></div>
    <div class="kpis">${bays.map(([b, reg, job, pr, st, c]) => `<div class="card"><div class="row"><b class="grow">${b}</b><span class="pill p-${c}">${st}</span></div><div style="font-size:20px;font-weight:700;margin:14px 0 4px;letter-spacing:.02em">${reg}</div><div class="muted">${job}</div><div class="bar" style="margin-top:14px"><i style="width:${pr * 100}%"></i></div></div>`).join('')}</div>
    <div style="display:grid;grid-template-columns:1fr 380px;gap:20px;flex:1">
      <div class="card"><b>Today’s jobs</b><table style="margin-top:8px"><tr><th>Vehicle</th><th>Service</th><th>Technician</th><th>Slot</th><th>Status</th></tr>
      ${[['KX21 LMR', 'Full service', 'D. R.', '08:30', 'In progress', 'a'], ['BD19 TFE', 'Brakes + MOT', 'S. A.', '09:00', 'Approval', 'wait'], ['LN70 VSA', 'Diagnostics', 'M. K.', '09:30', 'QC', 'ok'], ['YR68 PLC', 'Tyres', 'D. R.', '11:30', 'Booked', 'grey'], ['GF20 HJK', 'Air con', 'S. A.', '13:00', 'Booked', 'grey'], ['WM17 XPO', 'Interim service', 'M. K.', '14:30', 'Booked', 'grey']].map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td><span class="pill p-${r[5]}">${r[4]}</span></td></tr>`).join('')}</table></div>
      <div class="card" style="display:flex;flex-direction:column;gap:14px"><b>Approval request · BD19 TFE</b><div class="img" style="height:170px"></div><div class="muted">Front brake pads at 2 mm. Replacement recommended.</div><div class="row"><b class="grow" style="font-size:22px">£164.00</b><span class="pill p-wait">Sent 09:42</span></div><div class="row"><span class="btn ghost grow" style="text-align:center">Call customer</span><span class="btn grow" style="text-align:center">Resend</span></div></div>
    </div>`;
    return shell(p, 'Workshop', body, ['Workshop', 'Bookings', 'Customers', 'Vehicles', 'Approvals', 'Invoices', 'Settings']);
  },
  learning(p) {
    const body = `<div class="top"><div><h1>Customer Conversations</h1><div class="sub">Course · 8 lessons · assigned to Sales team</div></div><div class="row"><span class="btn ghost">Preview</span><span class="btn">Assign to team</span></div></div>
    <div style="display:grid;grid-template-columns:1fr 360px;gap:20px;flex:1">
      <div style="display:flex;flex-direction:column;gap:20px"><div style="height:330px;border-radius:14px;background:linear-gradient(135deg,#1c1a2b,var(--a));position:relative;display:grid;place-items:center"><div style="width:84px;height:84px;border-radius:50%;background:rgba(255,255,255,.95);display:grid;place-items:center"><div style="width:0;height:0;border-left:24px solid var(--a);border-top:15px solid transparent;border-bottom:15px solid transparent;margin-left:6px"></div></div><div style="position:absolute;left:24px;bottom:22px;color:#fff"><div style="opacity:.75;font-size:13px">Lesson 3 of 8</div><div style="font-size:22px;font-weight:600">Handling objections calmly</div></div></div>
      <div class="card"><div class="row"><b class="grow">Team progress</b><span class="muted">Sales team · 24 learners</span></div><div style="display:flex;align-items:flex-end;gap:14px;height:150px;margin-top:16px">${[90, 84, 76, 61, 48, 37, 22, 12].map((v, i) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px"><div style="width:100%;height:${v * 1.3}px;border-radius:8px;background:${i === 2 ? 'var(--a)' : 'color-mix(in srgb,var(--a) 28%,#fff)'}"></div><span class="muted">L${i + 1}</span></div>`).join('')}</div></div></div>
      <div class="card" style="display:flex;flex-direction:column;gap:6px"><b style="margin-bottom:8px">Lessons</b>
      ${['Why conversations stall', 'Asking open questions', 'Handling objections calmly', 'Summarising next steps', 'Writing the follow-up', 'Negotiating terms', 'Role-play practice', 'Final assessment'].map((l, i) => `<div class="row" style="padding:11px 0;border-bottom:1px solid #f0eef4"><div class="av" style="${i < 2 ? 'background:var(--a);color:#fff' : ''}">${i < 2 ? '✓' : i + 1}</div><div class="grow" style="font-size:14px;font-weight:${i === 2 ? 700 : 500}">${l}</div><span class="muted">${[6, 8, 7, 5, 9, 8, 12, 15][i]} min</span></div>`).join('')}</div>
    </div>`;
    return shell(p, 'Courses', body, ['Dashboard', 'Courses', 'Learners', 'Teams', 'Certificates', 'Billing', 'Settings']);
  },
  crm(p) {
    const cols = [['Enquiry', 6, [['14 Alder Road', '£425,000'], ['Flat 3, Mill Court', '£1,450 pcm'], ['9 Station Lane', '£610,000']]], ['Viewing booked', 4, [['22 Orchard Way', '£389,000'], ['The Granary', '£725,000']]], ['Offer made', 3, [['5 Brook Close', '£312,000'], ['Flat 11, The Quay', '£1,900 pcm']]], ['Completed', 2, [['18 Hill View', '£540,000']]]];
    const body = `<div class="top"><div><h1>Sales pipeline</h1><div class="sub">15 active applicants · 4 viewings today</div></div><div class="row"><span class="btn ghost">Lettings</span><span class="btn">+ Add applicant</span></div></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;flex:1">${cols.map(([c, n, cards], ci) => `<div style="background:#efedf3;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:12px"><div class="row"><b class="grow">${c}</b><span class="pill p-grey">${n}</span></div>${cards.map(([addr, price], i) => `<div class="card" style="padding:12px"><div class="img" style="height:${ci === 0 && i === 0 ? 120 : 90}px;filter:hue-rotate(${i * 25}deg)"></div><div style="font-weight:600;margin-top:10px;font-size:14px">${addr}</div><div class="row" style="margin-top:6px"><span class="muted grow">${price}</span><div class="av" style="width:26px;height:26px;font-size:10px">${['JB', 'EK', 'TS', 'MW'][(ci + i) % 4]}</div></div></div>`).join('')}</div>`).join('')}</div>`;
    return shell(p, 'Pipeline', body, ['Pipeline', 'Applicants', 'Properties', 'Viewings', 'Offers', 'Reports', 'Settings']);
  },
  store(p) {
    const products = [['Wildflower honey', '£8.50'], ['Aged farmhouse cheddar', '£6.20'], ['Sourdough flour 1.5kg', '£4.75'], ['Cold-pressed rapeseed oil', '£7.90'], ['Smoked sea salt', '£5.40'], ['Seville orange marmalade', '£4.95'], ['Oat & fig biscuits', '£3.80'], ['Single-estate tea', '£9.25']];
    return `<div style="width:1440px;height:900px;background:#fbfaf6;overflow:hidden">
    <div style="display:flex;align-items:center;gap:36px;padding:22px 56px;border-bottom:1px solid #ece9df;font-size:14px"><b style="font-size:22px;letter-spacing:-.02em;color:var(--a)">oakbasket</b><span>Shop</span><span>Hampers</span><span>Recipes</span><span>Visit the shop</span><span class="grow"></span><span>Search</span><span class="btn">Basket (2)</span></div>
    <div style="display:grid;grid-template-columns:1.1fr 1fr;margin:28px 56px;border-radius:18px;overflow:hidden;height:300px"><div style="background:var(--a);color:#fff;padding:44px;display:flex;flex-direction:column;justify-content:center;gap:16px"><div style="font-size:13px;opacity:.8;letter-spacing:.08em">AUTUMN HAMPERS</div><div style="font-size:40px;font-weight:600;letter-spacing:-.03em;line-height:1.05">Good food from small producers, packed by hand.</div><span class="btn" style="background:#fff;color:var(--a);align-self:flex-start">Shop hampers</span></div><div style="background:radial-gradient(circle at 30% 40%,#e9c46a 0 18%,transparent 19%),radial-gradient(circle at 62% 58%,#c8553d 0 22%,transparent 23%),radial-gradient(circle at 78% 28%,#8ab17d 0 14%,transparent 15%),#f2ead8"></div></div>
    <div style="display:flex;gap:10px;margin:0 56px 20px"><span class="pill p-a">All</span><span class="pill p-grey">Pantry</span><span class="pill p-grey">Cheese</span><span class="pill p-grey">Baking</span><span class="pill p-grey">Drinks</span><span class="grow"></span><span class="muted">In stock in the shop and online</span></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin:0 56px">${products.map(([n, pr], i) => `<div><div style="height:150px;border-radius:14px;background:radial-gradient(circle at 50% 55%,${['#e9c46a', '#f4d58d', '#d9c7a7', '#c9d27a', '#b9b3a9', '#f08a4b', '#caa472', '#7a9e7e'][i]} 0 30%,transparent 31%),#f2efe6"></div><div style="font-weight:600;margin-top:10px;font-size:14px">${n}</div><div class="row"><span class="muted grow">${pr}</span><span class="pill p-ok">${i % 3 === 2 ? '3 left' : 'In stock'}</span></div></div>`).join('')}</div></div>`;
  },
  finance(p) {
    const body = `<div class="top"><div><h1>Review queue</h1><div class="sub">New client onboarding · 6 documents need review</div></div><span class="btn">Request missing documents</span></div>
    <div style="display:grid;grid-template-columns:300px 1fr 360px;gap:20px;flex:1">
      <div class="card" style="display:flex;flex-direction:column;gap:4px"><b style="margin-bottom:10px">Documents</b>${[['Bank statement · Sep', 'Extracted', 'a'], ['Proof of address', 'Approved', 'ok'], ['Photo ID', 'Approved', 'ok'], ['VAT registration', 'Extracted', 'a'], ['Payroll summary', 'Low confidence', 'wait'], ['Engagement letter', 'Missing', 'grey']].map(([d, s, c], i) => `<div class="row" style="padding:11px 10px;border-radius:10px;${i === 0 ? 'background:#f3f1f7' : ''}"><div style="width:28px;height:34px;border-radius:5px;border:1px solid #dcd9e4;background:#fff"></div><div class="grow" style="font-size:13px;font-weight:600">${d}</div><span class="pill p-${c}">${s}</span></div>`).join('')}</div>
      <div class="card" style="background:#eceaf1;display:grid;place-items:center"><div style="width:78%;height:92%;background:#fff;border-radius:6px;box-shadow:0 10px 30px -12px rgba(0,0,0,.2);padding:34px;display:flex;flex-direction:column;gap:10px"><div class="row"><b class="grow">Statement of account</b><span class="muted">Page 1 of 3</span></div>${Array.from({ length: 14 }, (_, i) => `<div style="height:9px;border-radius:4px;background:${i === 3 || i === 7 ? 'color-mix(in srgb,var(--a) 30%,#fff)' : '#efedf3'};width:${[90, 70, 85, 60, 95, 75, 80, 55, 88, 66, 92, 72, 84, 50][i]}%"></div>`).join('')}</div></div>
      <div class="card" style="display:flex;flex-direction:column;gap:12px"><div class="row"><b class="grow">Extracted fields</b><span class="pill p-a">AI assisted</span></div>${[['Account holder', 'Northfield Studio Ltd', 98], ['Sort code', '••-••-41', 97], ['Statement period', '1 to 30 Sep', 95], ['Closing balance', '£18,204.11', 91], ['Business type', 'Limited company', 72]].map(([k, v, c]) => `<div style="padding:10px 0;border-bottom:1px solid #f0eef4"><div class="muted">${k}</div><div class="row"><b class="grow" style="font-size:14px">${v}</b><span class="pill ${c > 90 ? 'p-ok' : 'p-wait'}">${c}%</span></div></div>`).join('')}<div class="row" style="margin-top:auto"><span class="btn ghost grow" style="text-align:center">Edit</span><span class="btn grow" style="text-align:center">Approve</span></div></div>
    </div>`;
    return shell(p, 'Review queue', body, ['Clients', 'Review queue', 'Documents', 'Requests', 'Exports', 'Audit log', 'Settings']);
  },
};

const phoneScreens = {
  clinic: [['Your appointment', [['Tue 14 Oct · 09:40', 'Room 3 · Consultation'], ['Directions', 'Level 1, follow signs'], ['Reminder', 'Sent yesterday']], 'Check in'], ['Next patients', [['09:40 · S. T.', 'Consultation'], ['10:20 · L. P.', 'Follow-up'], ['11:00 · H. W.', 'New patient']], 'Open schedule']],
  garage: [['BD19 TFE', [['Brakes + MOT', 'Awaiting your approval'], ['Front brake pads', '£164.00 · photo attached'], ['Ready by', 'Today, 16:00']], 'Approve work'], ['Book a service', [['Full service', 'From £189'], ['Thu 16 Oct', '08:30 · 11:30 · 14:00'], ['Courtesy car', 'Available']], 'Confirm booking']],
  learning: [['Continue learning', [['Handling objections calmly', 'Lesson 3 · 7 min'], ['Your progress', '2 of 8 lessons'], ['Due', 'Friday']], 'Resume lesson'], ['Quiz · Lesson 2', [['Which question opens a conversation?', ''], ['○  What is your budget?', ''], ['●  How do you handle this today?', '']], 'Submit answer']],
  crm: [['Today', [['10:00 · Viewing', '22 Orchard Way'], ['12:30 · Valuation', 'The Granary'], ['15:00 · Viewing', '14 Alder Road']], 'Start route'], ['New enquiry', [['Flat 3, Mill Court', 'From listing portal'], ['Applicant', 'Looking to move in Nov'], ['Assigned to', 'You']], 'Call applicant']],
  store: [['Your basket', [['Wildflower honey', '£8.50 × 1'], ['Aged farmhouse cheddar', '£6.20 × 2'], ['Delivery', 'Saturday, 9 to 12']], 'Checkout · £20.90'], ['Hampers', [['The Larder', '£45'], ['Breakfast box', '£32'], ['Cheese board', '£38']], 'View all']],
  finance: [['Welcome to onboarding', [['Upload documents', '4 of 6 done'], ['Engagement letter', 'Ready to sign'], ['Adviser', 'Reviewing your files']], 'Upload next'], ['Upload', [['Photo ID', 'Approved'], ['Bank statement', 'Checking'], ['Payroll summary', 'Needs a clearer copy']], 'Take photo']],
};

const phone = (p, [title, rows, cta], i) => `<div class="phone"><div class="screen"><div class="notch"></div><div class="ph">
<div class="row"><div class="av" style="background:var(--a);color:#fff">${p.name[0]}</div><div class="grow muted">${p.name}</div></div>
<h2>${title}</h2>
${i === 0 ? '<div class="img" style="height:150px"></div>' : ''}
${rows.map(([a, b]) => `<div class="card" style="padding:14px"><div style="font-weight:600;font-size:15px">${a}</div>${b ? `<div class="muted" style="margin-top:3px">${b}</div>` : ''}</div>`).join('')}
<div class="btn" style="text-align:center;margin-top:auto;padding:15px">${cta}</div></div>
<div class="tabbar"><b>Home</b><span>Activity</span><span>Messages</span><span>Profile</span></div></div></div>`;

const page = (accent, body, w, h, bg = 'transparent') => `<!doctype html><html><head><meta charset="utf-8"><style>${css(accent)} html,body{width:${w}px;height:${h}px;background:${bg};overflow:hidden}</style></head><body>${body}</body></html>`;

const tint = (a) => `linear-gradient(140deg, color-mix(in srgb, ${a} 16%, #f4f2ee) 0%, color-mix(in srgb, ${a} 6%, #f4f2ee) 60%, #f4f2ee 100%)`;

const compositions = {
  screen: (p) => page(p.accent, screens[p.ui](p), 1440, 900),
  mobile: (p) => page(p.accent, `<div style="width:1600px;height:1000px;background:${tint(p.accent)};display:flex;align-items:center;justify-content:center;gap:56px">
    <div style="transform:translateY(-30px)">${phone(p, phoneScreens[p.ui][0], 0)}</div><div style="transform:translateY(40px)">${phone(p, phoneScreens[p.ui][1], 1)}</div></div>`, 1600, 1000),
  cover: (p) => page(p.accent, `<div style="width:1600px;height:1000px;background:${tint(p.accent)};position:relative;overflow:hidden">
    <div style="position:absolute;left:90px;top:96px;width:1440px;height:948px;border-radius:18px;overflow:hidden;box-shadow:0 50px 100px -40px rgba(20,18,28,.5);transform:scale(.86);transform-origin:top left;background:#fff">
      <div style="height:48px;background:#f0eef4;display:flex;align-items:center;gap:8px;padding:0 18px"><i style="width:12px;height:12px;border-radius:50%;background:#e2dfe8"></i><i style="width:12px;height:12px;border-radius:50%;background:#e2dfe8"></i><i style="width:12px;height:12px;border-radius:50%;background:#e2dfe8"></i><div style="margin-left:18px;width:360px;height:26px;border-radius:8px;background:#fff"></div></div>
      ${screens[p.ui](p)}</div>
    <div style="position:absolute;right:70px;bottom:-150px;transform:scale(.82);transform-origin:bottom right">${phone(p, phoneScreens[p.ui][0], 0)}</div></div>`, 1600, 1000),
};

// --------------------------------------------------------------- run
const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 1 });
const pg = await ctx.newPage();
const tmp = join(tmpdir(), 'adelogix-demo');
await rm(tmp, { recursive: true, force: true });
await mkdir(tmp, { recursive: true });

async function shot(html, w, h, file) {
  await pg.setViewportSize({ width: w, height: h });
  await pg.setContent(html);
  await pg.screenshot({ path: file });
}
function toWebp(png, webp, width, quality = 80) {
  execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB')
w = int(sys.argv[3])
if im.width != w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
im.save(sys.argv[2], 'WEBP', quality=int(sys.argv[4]), method=6)`, png, webp, String(width), String(quality)]);
}

for (const p of projects.filter((x) => x.ui)) {
  const dir = join(out, 'work', p.slug);
  await mkdir(dir, { recursive: true });
  for (const [name, comp] of Object.entries(compositions)) {
    const [w, h] = name === 'screen' ? [1440, 900] : [1600, 1000];
    const png = join(tmp, `${p.slug}-${name}.png`);
    await shot(comp(p), w, h, png);
    toWebp(png, join(dir, `${name}.webp`), 1600);
  }
  console.log('mockups:', p.slug);
}

// Placeholder logo marks: generic shapes, clearly not real companies.
const shapes = [
  '<circle cx="14" cy="14" r="11"/>', '<rect x="3" y="3" width="22" height="22" rx="6"/>', '<path d="M14 2 26 24H2Z"/>',
  '<path d="M3 14a11 11 0 0 1 22 0Z"/><rect x="3" y="16" width="22" height="9" rx="3"/>', '<circle cx="9" cy="14" r="7"/><circle cx="19" cy="14" r="7" opacity=".55"/>',
  '<path d="M14 2 26 14 14 26 2 14Z"/>', '<rect x="2" y="6" width="10" height="16" rx="3"/><rect x="16" y="2" width="10" height="24" rx="3"/>',
];
await mkdir(join(out, 'clients'), { recursive: true });
for (const [i, s] of shapes.entries()) {
  await writeFile(join(out, 'clients', `placeholder-${i + 1}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="28" viewBox="0 0 150 28" fill="#15121F"><title>Placeholder logo ${i + 1}</title>${s}<text x="36" y="20" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="600" letter-spacing=".3">Placeholder</text></svg>`);
}
console.log('placeholder logos: 7');

// ------------------------------------------------------- hero reel
if (!noVideo) {
  const W = 1280, H = 800, FPS = 24, DUR = 15;
  const covers = await Promise.all(projects.filter((x) => x.ui).map(async (p) => ({ p, b64: (await readFile(join(out, 'work', p.slug, 'cover.webp'))).toString('base64'), m: (await readFile(join(out, 'work', p.slug, 'mobile.webp'))).toString('base64') })));
  const mark = (await readFile(join(root, 'src/assets/brand/adelogix-mark-white.png'))).toString('base64');
  const scenes = [
    ['Web applications', covers[0].b64], ['Mobile apps', covers[1].m], ['SaaS platforms', covers[2].b64], ['CRM and business systems', covers[3].b64], ['E-commerce', covers[4].b64], ['AI and automation', covers[5].b64],
  ];
  const seg = DUR / (scenes.length + 1);
  const reel = `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;box-sizing:border-box}html,body{width:${W}px;height:${H}px;background:#0e0b18;overflow:hidden;font-family:Inter,sans-serif}
  .s{position:absolute;inset:0;opacity:0;animation:fade ${DUR}s linear infinite}
  .s img{position:absolute;inset:-4%;width:108%;height:108%;object-fit:cover;animation:pan ${DUR}s linear infinite}
  .s::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,11,24,0) 50%,rgba(14,11,24,.78))}
  .cap{position:absolute;left:56px;bottom:52px;z-index:2;color:#fff;font-size:44px;font-weight:500;letter-spacing:-.03em}
  .cap small{display:block;font:500 15px 'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.65);margin-bottom:10px}
  .end{position:absolute;inset:0;display:grid;place-items:center;opacity:0;background:radial-gradient(60% 70% at 50% 110%,rgba(123,73,158,.55),transparent),#0e0b18}
  .end img{width:120px}
  @keyframes pan{from{transform:scale(1.02) translateX(-1%)}to{transform:scale(1.1) translateX(1%)}}
  </style></head><body>
  ${scenes.map(([cap, b64], i) => `<div class="s" style="animation-name:f${i}"><img src="data:image/webp;base64,${b64}"><div class="cap"><small>${String(i + 1).padStart(2, '0')} / What we build</small>${cap}</div></div>`).join('')}
  <div class="end" style="animation:fend ${DUR}s linear infinite"><img src="data:image/png;base64,${mark}"></div>
  <style>${scenes.map((_, i) => { const a = (i * seg / DUR) * 100, b = ((i + 1) * seg / DUR) * 100, f = (0.5 / DUR) * 100; return `@keyframes f${i}{0%{opacity:0}${Math.max(0, a - f).toFixed(3)}%{opacity:${i === 0 ? 1 : 0}}${(a + (i === 0 ? 0 : f)).toFixed(3)}%{opacity:1}${b.toFixed(3)}%{opacity:1}${(b + f).toFixed(3)}%{opacity:0}100%{opacity:0}}`; }).join('')}
  @keyframes fend{0%{opacity:0}${((scenes.length * seg / DUR) * 100).toFixed(3)}%{opacity:0}${(((scenes.length * seg + 0.5) / DUR) * 100).toFixed(3)}%{opacity:1}97%{opacity:1}100%{opacity:0}}</style>
  </body></html>`;
  await pg.setViewportSize({ width: W, height: H });
  await pg.setContent(reel);
  await pg.waitForTimeout(500);
  const framesDir = join(tmp, 'frames');
  await mkdir(framesDir, { recursive: true });
  const total = DUR * FPS;
  for (let f = 0; f < total; f++) {
    const t = (f / FPS) * 1000;
    await pg.evaluate((ms) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms; }), t);
    await pg.screenshot({ path: join(framesDir, `f${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 90 });
    if (f === Math.round(seg * FPS * 0.5)) await pg.screenshot({ path: join(tmp, 'poster.png') });
  }
  await mkdir(join(out, 'hero'), { recursive: true });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(framesDir, 'f%04d.jpg'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '27', '-preset', 'slow', '-movflags', '+faststart', '-an', join(out, 'hero', 'reel.mp4')]);
  toWebp(join(tmp, 'poster.png'), join(out, 'hero', 'poster.webp'), 1280, 78);
  console.log('hero reel: reel.mp4 + poster.webp');
}
await browser.close();
