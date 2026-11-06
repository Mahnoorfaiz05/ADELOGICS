// Shared template helpers: escaping, URL resolution, icons, illustrative visuals.

export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const attr = esc;

export const html = (strings, ...values) =>
  strings.reduce((out, s, i) => out + s + (i < values.length ? flat(values[i]) : ''), '');
const flat = (v) => (v == null || v === false ? '' : Array.isArray(v) ? v.map(flat).join('') : String(v));

export const pad = (n) => String(n).padStart(2, '0');

// ---------------------------------------------------------------- URLs
// In "portable" builds every link is relative and points at index.html, so
// the output works from any folder or file:// without a server.
const state = { current: '/', portable: false };
export function setUrlContext(current, portable) { state.current = current; state.portable = portable; }

export function u(target) {
  if (/^(https?:|mailto:|tel:|#)/.test(target)) return target;
  if (!state.portable) return target;
  const [pathPart, hash = ''] = target.split('#');
  const fromDir = state.current.endsWith('/') ? state.current : state.current.replace(/[^/]*$/, '');
  const fromParts = fromDir.split('/').filter(Boolean);
  let to = pathPart.endsWith('/') ? pathPart + 'index.html' : pathPart;
  const toParts = to.split('/').filter(Boolean);
  let i = 0;
  while (i < fromParts.length && i < toParts.length - 1 && fromParts[i] === toParts[i]) i++;
  const rel = '../'.repeat(fromParts.length - i) + toParts.slice(i).join('/');
  return (rel || 'index.html') + (hash ? '#' + hash : '');
}

// --------------------------------------------------------------- Icons
export const icon = {
  arrow: '<svg class="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowUpRight: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowRight: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  calendar: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="2.5" y="3.5" width="13" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 7.5h13M6 2v3M12 2v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  quote: '<svg viewBox="0 0 56 44" fill="none" aria-hidden="true"><defs><linearGradient id="qg" x1="0" x2="1"><stop offset="0" stop-color="#3F3282"/><stop offset="1" stop-color="#7B499E"/></linearGradient></defs><path fill="url(#qg)" d="M0 44V27.6C0 12.4 7.3 3.2 21.9 0l2.4 5.6C16.6 8 12.6 12.6 12 19.4h10.4V44H0Zm31.6 0V27.6C31.6 12.4 38.9 3.2 53.5 0L56 5.6c-7.7 2.4-11.7 7-12.3 13.8H54V44H31.6Z"/></svg>',
  person: '<svg viewBox="0 0 120 130" fill="currentColor" aria-hidden="true"><circle cx="60" cy="42" r="26"/><path d="M8 130c0-30 23-52 52-52s52 22 52 52Z"/></svg>',
};


// ----------------------------------------------------- Hero system map
// Three nodes arranged like the Adelogix mark, joined by connectors, with a
// signal travelling between them. Purely illustrative, hidden from AT.
export function systemMap() {
  const T = [280, 112], L = [96, 428], R = [464, 428], C = [280, 322];
  const pull = (a, b, k = 0.22) => {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    return [mx + (C[0] - mx) * k, my + (C[1] - my) * k];
  };
  const curve = (a, b) => { const c = pull(a, b); return `M${a[0]},${a[1]} Q${c[0]},${c[1]} ${b[0]},${b[1]}`; };
  const p1 = curve(T, L), p2 = curve(L, R), p3 = curve(R, T);
  const node = ([x, y], iconPath) => `
    <circle class="ring-2" cx="${x}" cy="${y}" r="70"/>
    <circle class="ring" cx="${x}" cy="${y}" r="52"/>
    <circle class="node-halo" cx="${x}" cy="${y}" r="40"/>
    <circle class="node-core" cx="${x}" cy="${y}" r="30"/>
    <g class="node-icon" transform="translate(${x - 10} ${y - 10})">${iconPath}</g>`;
  const pulse = (path, dur, begin) =>
    `<circle class="pulse" r="3.2" opacity="0"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${path}" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`;
  return `<svg class="system-map" viewBox="0 0 560 560" role="img" aria-labelledby="sm-title" data-animated>
  <title id="sm-title">Diagram: interfaces, business logic and data connected around your business process</title>
  <defs>
    <linearGradient id="sm-grad" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#3F3282"/><stop offset="1" stop-color="#8A55B0"/></linearGradient>
  </defs>
  <path class="conn" d="${p1}"/><path class="conn" d="${p2}"/><path class="conn" d="${p3}"/>
  <path class="conn-dash" d="M${C[0]},${C[1]} L${T[0]},${T[1] + 52}"/>
  <path class="conn-dash" d="M${C[0]},${C[1]} L${L[0] + 45},${L[1] - 26}"/>
  <path class="conn-dash" d="M${C[0]},${C[1]} L${R[0] - 45},${R[1] - 26}"/>
  <circle class="ring" cx="${C[0]}" cy="${C[1]}" r="34" stroke-dasharray="3 5"/>
  <circle cx="${C[0]}" cy="${C[1]}" r="5" fill="#fff"/>
  <text class="center-label" x="${C[0]}" y="${C[1] + 58}" text-anchor="middle">Your process</text>
  ${pulse(p1, 4.8, 0)}${pulse(p2, 4.8, 1.6)}${pulse(p3, 4.8, 3.2)}
  ${node(T, '<rect x="1" y="3" width="18" height="14" rx="2.5"/><path d="M1 7.5h18"/>')}
  ${node(L, '<path d="M6 5 1 10l5 5M14 5l5 5-5 5"/>')}
  ${node(R, '<ellipse cx="10" cy="4.5" rx="8" ry="3"/><path d="M2 4.5v11c0 1.7 3.6 3 8 3s8-1.3 8-3v-11M2 10c0 1.7 3.6 3 8 3s8-1.3 8-3"/>')}
  <text class="label" x="${T[0] + 88}" y="${T[1] - 8}">Interfaces</text>
  <text class="sub" x="${T[0] + 88}" y="${T[1] + 14}">Web · Mobile · Admin</text>
  <text class="label" x="${L[0]}" y="${L[1] + 100}" text-anchor="middle">Logic</text>
  <text class="sub" x="${L[0]}" y="${L[1] + 122}" text-anchor="middle">APIs · Workflows</text>
  <text class="label" x="${R[0]}" y="${R[1] + 100}" text-anchor="middle">Data &amp; AI</text>
  <text class="sub" x="${R[0]}" y="${R[1] + 122}" text-anchor="middle">Databases · Automation</text>
</svg>`;
}

// ------------------------------------------------- Illustrative visuals
// Abstract product compositions used for service cards and as stand-ins for
// project screenshots in review builds. Always aria-hidden: they are not work.
const C = { ink: '#15121F', ink2: '#2B263C', line: '#DCD8E4', soft: '#EFECF5', card: '#FFFFFF', b1: '#3F3282', b2: '#7B499E', b3: '#A792D8', b4: '#ECE7F7' };
let gid = 0;
const grad = () => {
  const id = `vg${++gid}`;
  return { id, def: `<linearGradient id="${id}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="${C.b1}"/><stop offset="1" stop-color="${C.b2}"/></linearGradient>` };
};
const bar = (x, y, w, h = 6, fill = C.line, r = 3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
const wrap = (inner, defs) =>
  `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><defs>${defs}</defs>${inner}</svg>`;

function browserVisual(variant = 'web') {
  const g = grad();
  const isWp = variant === 'wordpress';
  return wrap(`
    <rect x="44" y="38" width="312" height="236" rx="12" fill="${C.card}" stroke="${C.line}"/>
    <circle cx="62" cy="54" r="3.5" fill="${C.line}"/><circle cx="74" cy="54" r="3.5" fill="${C.line}"/><circle cx="86" cy="54" r="3.5" fill="${C.line}"/>
    ${bar(110, 50, 150, 8, C.soft, 4)}
    <path d="M44 68h312" stroke="${C.line}"/>
    ${bar(62, 82, 30, 6, C.ink)}${bar(230, 82, 22)}${bar(258, 82, 22)}${bar(286, 82, 22)}<rect x="316" y="78" width="26" height="12" rx="6" fill="url(#${g.id})"/>
    ${bar(62, 112, 120, 11, C.ink, 4)}${bar(62, 128, 96, 11, C.ink, 4)}${bar(62, 150, 110, 5)}${bar(62, 160, 90, 5)}
    <rect x="62" y="176" width="54" height="16" rx="8" fill="${C.ink}"/><rect x="122" y="176" width="44" height="16" rx="8" fill="none" stroke="${C.line}"/>
    <rect x="200" y="104" width="142" height="92" rx="8" fill="${isWp ? C.soft : `url(#${g.id})`}"/>
    ${isWp
      ? `${bar(214, 118, 60, 6, C.b3)}${bar(214, 132, 110, 4)}${bar(214, 142, 96, 4)}${bar(214, 152, 104, 4)}<rect x="214" y="166" width="40" height="14" rx="4" fill="${C.b1}"/>`
      : `<circle cx="271" cy="128" r="9" fill="#fff" opacity=".9"/><circle cx="246" cy="170" r="9" fill="#fff" opacity=".9"/><circle cx="296" cy="170" r="9" fill="#fff" opacity=".9"/><path d="M271 128 246 170h50Z" fill="none" stroke="#fff" stroke-opacity=".6"/>`}
    ${[0, 1, 2].map((i) => `<rect x="${62 + i * 96}" y="210" width="88" height="48" rx="6" fill="${C.soft}"/>${bar(70 + i * 96, 220, 40, 5, C.ink2)}${bar(70 + i * 96, 232, 64, 4)}${bar(70 + i * 96, 241, 52, 4)}`).join('')}
  `, g.def);
}

function phonesVisual() {
  const g = grad();
  const rows = (x, y) => [0, 1, 2, 3].map((i) => `<rect x="${x}" y="${y + i * 30}" width="92" height="24" rx="6" fill="${C.soft}"/><circle cx="${x + 12}" cy="${y + 12 + i * 30}" r="6" fill="${i === 0 ? `url(#${g.id})` : C.line}"/>${bar(x + 24, y + 7 + i * 30, 44, 4, C.ink2)}${bar(x + 24, y + 15 + i * 30, 30, 3)}`).join('');
  return wrap(`
    <rect x="96" y="28" width="116" height="244" rx="20" fill="${C.ink}"/>
    <rect x="102" y="34" width="104" height="232" rx="15" fill="${C.card}"/>
    <rect x="136" y="40" width="36" height="8" rx="4" fill="${C.ink}"/>
    ${bar(114, 62, 50, 9, C.ink, 4)}${bar(114, 76, 70, 4)}
    <rect x="114" y="90" width="80" height="54" rx="8" fill="url(#${g.id})"/>
    ${bar(122, 100, 30, 5, '#fff')}${bar(122, 124, 46, 9, '#fff', 4)}
    ${rows(108, 154)}
    <rect x="198" y="58" width="116" height="226" rx="20" fill="${C.card}" stroke="${C.line}"/>
    <rect x="232" y="64" width="40" height="7" rx="3.5" fill="${C.line}"/>
    ${bar(212, 86, 52, 8, C.ink, 4)}
    <rect x="212" y="104" width="88" height="70" rx="8" fill="${C.soft}"/>
    <path d="M220 160c12-6 18-28 30-22s16 10 24-6 14-12 18-14" fill="none" stroke="url(#${g.id})" stroke-width="2.4" stroke-linecap="round"/>
    ${bar(212, 186, 88, 5)}${bar(212, 196, 70, 5)}
    <rect x="212" y="214" width="88" height="22" rx="11" fill="${C.ink}"/>${bar(238, 222, 36, 5, '#fff')}
    <rect x="212" y="244" width="88" height="22" rx="11" fill="none" stroke="${C.line}"/>
  `, g.def);
}

function dashboardVisual(variant = 'systems') {
  const g = grad();
  let main = '';
  if (variant === 'crm') {
    main = [0, 1, 2].map((c) => {
      const x = 132 + c * 72;
      const n = [3, 2, 2][c];
      return `${bar(x, 106, 34, 5, C.ink2)}${Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${118 + i * 46}" width="64" height="40" rx="6" fill="${c === 1 && i === 0 ? `url(#${g.id})` : C.card}" stroke="${C.line}"/>${bar(x + 8, 128 + i * 46, 34, 4, c === 1 && i === 0 ? '#fff' : C.ink2)}${bar(x + 8, 138 + i * 46, 44, 3, c === 1 && i === 0 ? C.b3 : C.line)}`).join('')}`;
    }).join('');
  } else if (variant === 'erp') {
    main = `<rect x="132" y="106" width="212" height="148" rx="6" fill="${C.card}" stroke="${C.line}"/>` +
      Array.from({ length: 7 }, (_, i) => `${i ? `<path d="M132 ${106 + i * 21}h212" stroke="${C.soft}"/>` : ''}${bar(142, 113 + i * 21, 40, 4, i ? C.line : C.ink2)}${bar(196, 113 + i * 21, 50, 4, i ? C.line : C.ink2)}${bar(262, 113 + i * 21, 30, 4, i ? C.line : C.ink2)}${i ? `<rect x="306" y="${110 + i * 21}" width="28" height="10" rx="5" fill="${i % 3 === 1 ? C.b4 : C.soft}"/>` : ''}`).join('');
  } else if (variant === 'saas') {
    main = [0, 1, 2].map((i) => `<rect x="${132 + i * 72}" y="106" width="64" height="148" rx="8" fill="${i === 1 ? C.ink : C.card}" stroke="${i === 1 ? C.ink : C.line}"/>${bar(142 + i * 72, 120, 26, 5, i === 1 ? C.b3 : C.ink2)}${bar(142 + i * 72, 134, 36, 10, i === 1 ? '#fff' : C.ink, 4)}${[0, 1, 2, 3].map((k) => bar(142 + i * 72, 160 + k * 14, 40, 4, i === 1 ? C.ink2 : C.line)).join('')}<rect x="${142 + i * 72}" y="226" width="44" height="16" rx="8" fill="${i === 1 ? `url(#${g.id})` : C.soft}"/>`).join('');
  } else {
    main = `${[0, 1, 2].map((i) => `<rect x="${132 + i * 72}" y="106" width="64" height="44" rx="6" fill="${C.card}" stroke="${C.line}"/>${bar(140 + i * 72, 116, 26, 4)}${bar(140 + i * 72, 128, 38, 10, i === 0 ? C.b1 : C.ink, 4)}`).join('')}
      <rect x="132" y="160" width="136" height="94" rx="6" fill="${C.card}" stroke="${C.line}"/>
      ${[38, 56, 44, 68, 52, 74, 60].map((h, i) => `<rect x="${144 + i * 17}" y="${244 - h}" width="10" height="${h}" rx="2" fill="${i === 5 ? `url(#${g.id})` : C.b4}"/>`).join('')}
      <rect x="276" y="160" width="68" height="94" rx="6" fill="${C.card}" stroke="${C.line}"/>
      <circle cx="310" cy="198" r="20" fill="none" stroke="${C.soft}" stroke-width="8"/><path d="M310 178a20 20 0 0 1 19 26" fill="none" stroke="url(#${g.id})" stroke-width="8"/>
      ${bar(288, 230, 44, 4)}${bar(288, 240, 32, 4)}`;
  }
  return wrap(`
    <rect x="40" y="40" width="320" height="230" rx="12" fill="#F7F6F9" stroke="${C.line}"/>
    <path d="M40 52a12 12 0 0 1 12-12h64v230H52a12 12 0 0 1-12-12Z" fill="${C.ink}"/>
    <circle cx="60" cy="62" r="7" fill="url(#${g.id})"/>${bar(72, 59, 30, 5, C.ink2)}
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="52" y="${90 + i * 22}" width="52" height="14" rx="4" fill="${i === 1 ? C.ink2 : 'none'}"/>${bar(58, 95 + i * 22, i === 1 ? 34 : 28, 4, i === 1 ? '#fff' : '#4A445E')}`).join('')}
    ${bar(132, 60, 80, 9, C.ink, 4)}${bar(132, 76, 120, 4)}
    <rect x="300" y="58" width="44" height="18" rx="9" fill="${C.ink}"/>
    ${main}
  `, g.def);
}

function designVisual() {
  const g = grad();
  return wrap(`
    <rect x="30" y="30" width="340" height="240" rx="12" fill="#F7F6F9" stroke="${C.line}"/>
    ${Array.from({ length: 15 }, (_, i) => Array.from({ length: 10 }, (_, k) => `<circle cx="${46 + i * 22}" cy="${48 + k * 22}" r="1" fill="${C.line}"/>`).join('')).join('')}
    <rect x="56" y="62" width="136" height="174" rx="8" fill="${C.card}" stroke="${C.line}"/>
    ${bar(68, 76, 40, 5, C.ink2)}<rect x="68" y="90" width="112" height="60" rx="6" fill="url(#${g.id})"/>
    ${bar(68, 162, 90, 8, C.ink, 4)}${bar(68, 176, 104, 4)}${bar(68, 186, 80, 4)}
    <rect x="68" y="204" width="52" height="18" rx="9" fill="${C.ink}"/>
    <rect x="52" y="58" width="144" height="182" rx="10" fill="none" stroke="${C.b2}" stroke-width="1.2"/>
    ${[[52, 58], [196, 58], [52, 240], [196, 240]].map(([x, y]) => `<rect x="${x - 3}" y="${y - 3}" width="6" height="6" fill="#fff" stroke="${C.b2}"/>`).join('')}
    <rect x="214" y="62" width="140" height="80" rx="8" fill="${C.card}" stroke="${C.line}"/>
    ${bar(226, 74, 50, 5, C.ink2)}
    ${[C.b1, C.b2, C.b3, C.b4, C.ink].map((c, i) => `<rect x="${226 + i * 24}" y="90" width="18" height="18" rx="9" fill="${c}"/>`).join('')}
    ${bar(226, 120, 80, 4)}
    <rect x="214" y="152" width="140" height="84" rx="8" fill="${C.card}" stroke="${C.line}"/>
    ${bar(226, 164, 60, 5, C.ink2)}
    <rect x="226" y="180" width="54" height="18" rx="9" fill="${C.ink}"/><rect x="286" y="180" width="54" height="18" rx="9" fill="none" stroke="${C.line}"/>
    <rect x="226" y="206" width="116" height="18" rx="5" fill="none" stroke="${C.line}"/>
    <path d="M250 214l10 24 4-10 10-4Z" fill="${C.ink}" stroke="#fff" stroke-width="1.2" transform="translate(-6 -50)"/>
    <rect x="262" y="188" width="44" height="14" rx="4" fill="${C.b2}" transform="translate(-6 -50)"/>${bar(266, 192, 30, 5, '#fff')}
  `, g.def);
}

function aiVisual() {
  const g = grad();
  return wrap(`
    <rect x="40" y="70" width="96" height="124" rx="8" fill="${C.card}" stroke="${C.line}"/>
    <path d="M114 70v18h22" fill="${C.soft}" stroke="${C.line}"/>
    ${bar(52, 92, 50, 6, C.ink2)}${[0, 1, 2, 3, 4, 5].map((i) => bar(52, 108 + i * 12, [72, 60, 68, 50, 66, 40][i], 4)).join('')}
    <rect x="50" y="118" width="62" height="10" rx="2" fill="${C.b4}" opacity=".9"/>
    <path d="M136 132h44" stroke="${C.ink2}" stroke-dasharray="3 4"/>
    <circle cx="212" cy="132" r="40" fill="${C.soft}"/>
    <circle cx="212" cy="132" r="28" fill="url(#${g.id})"/>
    <path d="M212 118l3.4 9.2 9.6 4.8-9.6 4.8L212 146l-3.4-9.2-9.6-4.8 9.6-4.8Z" fill="#fff"/>
    <path d="M244 112c18 0 18-30 40-30M244 132h40M244 152c18 0 18 30 40 30" fill="none" stroke="${C.ink2}" stroke-dasharray="3 4"/>
    ${[82, 132, 182].map((y, i) => `<rect x="284" y="${y - 16}" width="84" height="32" rx="8" fill="${C.card}" stroke="${C.line}"/><circle cx="300" cy="${y}" r="7" fill="${i === 2 ? C.b4 : C.ink}"/>${i === 2 ? `<path d="M297 ${y}h6" stroke="${C.b1}" stroke-width="1.6"/>` : `<path d="m296.5 ${y} 2.5 2.5 4.5-5" fill="none" stroke="#fff" stroke-width="1.5"/>`}${bar(314, y - 6, 40, 4, C.ink2)}${bar(314, y + 2, 30, 3)}`).join('')}
    ${bar(40, 222, 96, 4)}${bar(40, 232, 64, 4)}
    <text x="212" y="206" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#6E6980" letter-spacing=".5">REVIEW STEP</text>
  `, g.def);
}

const visualMap = {
  web: () => browserVisual('web'),
  wordpress: () => browserVisual('wordpress'),
  mobile: () => phonesVisual(),
  dashboard: () => dashboardVisual('systems'),
  systems: () => dashboardVisual('systems'),
  crm: () => dashboardVisual('crm'),
  erp: () => dashboardVisual('erp'),
  saas: () => dashboardVisual('saas'),
  design: () => designVisual(),
  ai: () => aiVisual(),
};
export const visual = (kind) => (visualMap[kind] || visualMap.web)();

export const serviceVisualKind = {
  'web-development': 'web',
  'mobile-app-development': 'mobile',
  'custom-software-development': 'systems',
  'ui-ux-design': 'design',
  'saas-development': 'saas',
  'ai-development-automation': 'ai',
  'crm-development': 'crm',
  'erp-cms-development': 'erp',
  'wordpress-development': 'wordpress',
  'it-services': 'dashboard',
  'product-development': 'saas',
  'devops-cloud': 'dashboard',
};

// ---------------------------------------------------------- Line icons
// 24px, 1.6 stroke, currentColor. One consistent family for services,
// industries, process stages and reasons.
const ICONS = {
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.8 3.5 5.8 3.5 9s-1 6.2-3.5 9c-2.5-2.8-3.5-5.8-3.5-9s1-6.2 3.5-9Z"/>',
  mobile: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  blocks: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><path d="M17 13.5v7M13.5 17h7"/>',
  pen: '<path d="M12 19.5 4.5 21l1.5-7.5L15.5 4a2.1 2.1 0 0 1 3 0l1.5 1.5a2.1 2.1 0 0 1 0 3Z"/><path d="m13.5 6 4.5 4.5"/>',
  terminal: '<rect x="2.5" y="4" width="19" height="16" rx="2.5"/><path d="m6.5 9 3 3-3 3M12 15h5"/>',
  cloud: '<path d="M7 18.5a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9a4.75 4.75 0 0 1-.25 9.5Z"/><path d="M12 12v4M10 14h4"/>',
  sparkle: '<path d="M12 3.5 13.8 9a2 2 0 0 0 1.2 1.2l5.5 1.8-5.5 1.8a2 2 0 0 0-1.2 1.2L12 20.5 10.2 15a2 2 0 0 0-1.2-1.2L3.5 12 9 10.2A2 2 0 0 0 10.2 9Z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-6 6.5-6s5.9 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.4c1.9.8 3.1 2.7 3.5 5.6"/>',
  boxes: '<path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7Z"/><path d="m3.5 7 8.5 4.5L20.5 7M12 11.5v10"/>',
  health: '<path d="M12 20s-8-4.6-8-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.8C20 15.4 12 20 12 20Z"/><path d="M7.5 12.5h2.5l1.5-2.5 2 5 1.5-2.5h1.5"/>',
  education: '<path d="m2.5 9 9.5-4.5L21.5 9 12 13.5Z"/><path d="M6.5 11v5c1.5 1.5 3.5 2.2 5.5 2.2s4-.7 5.5-2.2v-5M21.5 9v5"/>',
  cart: '<circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/><path d="M2.5 3.5h2.8l2.4 11.5h11l2-8H6.3"/>',
  finance: '<path d="M3.5 20.5h17M6 17v-6M10.5 17V7M15 17v-4M19.5 17V4.5"/>',
  building: '<path d="M4 21V5.5L12 3v18M12 8.5l8 2.5v10M2.5 21h19M7 8h2M7 12h2M7 16h2M15 13.5h2M15 17h2"/>',
  plane: '<path d="M21 4.5 3 10.5l7 2.8 2.7 7 3.5-5.3Z"/><path d="M10 13.3 21 4.5"/>',
  car: '<path d="M5 15.5 6.8 8.5h10.4l1.8 7"/><rect x="3" y="11.5" width="18" height="5.5" rx="1.5"/><path d="M6 17v2.5M18 17v2.5"/><circle cx="7.5" cy="14.2" r=".8"/><circle cx="16.5" cy="14.2" r=".8"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  map: '<path d="m3.5 6 5.5-2 6 2 5.5-2v14l-5.5 2-6-2-5.5 2Z"/><path d="M9 4v14M15 6v14"/>',
  code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15"/>',
  rocket: '<path d="M14.5 4.5c2.5-1.2 5-1.3 6-1-.3 1-.2 3.5-1 6L13 16l-5-5Z"/><path d="M8 11 4.5 10l3-4h5M13 16l1 3.5 4-3v-5M8.5 15.5 5 19"/><circle cx="15.8" cy="8.2" r="1.4"/>',
  chat: '<path d="M4 5h16v10.5H9.5L4 19.5Z"/><path d="M8 9.5h8M8 12.5h5"/>',
  puzzle: '<path d="M10 3.5h4V6a1.75 1.75 0 1 0 3.5 0V3.5h3v7H18a1.75 1.75 0 1 0 0 3.5h2.5v6.5H14V18a1.75 1.75 0 1 0-3.5 0v2.5h-7V14H6a1.75 1.75 0 1 0 0-3.5H3.5v-7Z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 12.5 9 5 9-5M3 16.5l9 5 9-5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M8.5 14.5l2.5 2.5 4.5-4.5"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6Z"/><path d="m8.5 12 2.5 2.5 4.5-4.5"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/>',
  tick: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  doc: '<path d="M6 2.5h8l4.5 4.5v14.5H6Z"/><path d="M14 2.5V7h4.5M9 12h6M9 16h6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  phone: '<path d="M5 3.5h3.5l1.5 4.5-2.2 1.5a11 11 0 0 0 6.7 6.7L16 14l4.5 1.5V19a1.5 1.5 0 0 1-1.6 1.5C10.8 20 4 13.2 3.5 5.1A1.5 1.5 0 0 1 5 3.5Z"/>',
  pin: '<path d="M12 21s-6.5-6.2-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/>',
  chevronLeft: '<path d="m14.5 6-6 6 6 6"/>',
  chevronRight: '<path d="m9.5 6 6 6-6 6"/>',
  chevronDown: '<path d="m6 9.5 6 6 6-6"/>',
  play: '<path d="M8 5.5v13l10.5-6.5Z" fill="currentColor"/>',
  pause: '<path d="M8.5 5.5v13M15.5 5.5v13" stroke-width="2.6"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  quote: '<path d="M4 18v-5.5C4 8.5 6.2 6 10 5l.8 1.8C8.7 7.6 7.6 9 7.4 11H10v7Zm10 0v-5.5c0-4 2.2-6.5 6-7.5l.8 1.8c-2.1.8-3.2 2.2-3.4 4.2H20v7Z" fill="currentColor" stroke="none"/>',
};
export const svgIcon = (name, size = 24, cls = 'icon') =>
  `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.check}</svg>`;

export const serviceIcon = {
  'web-development': 'globe',
  'mobile-app-development': 'mobile',
  'custom-software-development': 'terminal',
  'ui-ux-design': 'pen',
  'saas-development': 'cloud',
  'ai-development-automation': 'sparkle',
  'crm-development': 'users',
  'erp-cms-development': 'boxes',
  'wordpress-development': 'blocks',
  'it-services': 'cloud',
  'product-development': 'blocks',
  'devops-cloud': 'terminal',
};
