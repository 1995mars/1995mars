// Generates the Gojo-inspired SVG assets for the profile README.
// usage: node assets/build.js
// Reads avatar.jpg and gojo-banner.jpg from this folder and embeds them,
// because GitHub does not load external images inside an SVG.
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const b64 = (f) => fs.readFileSync(path.join(dir, f)).toString('base64');
const avatar = b64('avatar.jpg');
const gojo = b64('gojo-banner.jpg');

const SANS = "'Segoe UI','Helvetica Neue',Arial,sans-serif";
const MONO = "'Cascadia Code','JetBrains Mono',Consolas,'Courier New',monospace";

// deterministic pseudo-random so rebuilds are stable
let seed = 1995;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

function stars(n, w, h) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = (rnd() * w).toFixed(1), y = (rnd() * h).toFixed(1);
    const r = (0.4 + rnd() * 1.0).toFixed(2);
    const d = (2 + rnd() * 4).toFixed(1), b = (rnd() * 5).toFixed(1);
    const c = rnd() > 0.7 ? '#c4b5fd' : rnd() > 0.5 ? '#7dd3fc' : '#e0f2fe';
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" class="tw" style="animation-duration:${d}s;animation-delay:-${b}s"/>`;
  }
  return s;
}

/* ───────────────────────── header ───────────────────────── */
const W = 840, H = 230;
const IX = 224, IW = 616; // art slot: 670x250 source scaled to the banner height
const FX = 655, FY = 52;  // fingertip, where the Infinity rings sit
const header = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mars — Fullstack Web Developer">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#02040f"/><stop offset=".55" stop-color="#050b24"/><stop offset="1" stop-color="#0a0524"/>
  </linearGradient>
  <radialGradient id="nebB" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7c3aed" stop-opacity=".45"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></radialGradient>
  <radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#38bdf8" stop-opacity=".5"/><stop offset=".6" stop-color="#2563eb" stop-opacity=".12"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></radialGradient>
  <radialGradient id="orb" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#bae6fd"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></radialGradient>
  <linearGradient id="name" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#bae6fd"/><stop offset="1" stop-color="#a78bfa"/>
  </linearGradient>
  <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#38bdf8"/><stop offset=".5" stop-color="#1e3a8a"/><stop offset="1" stop-color="#a855f7"/>
  </linearGradient>
  <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#000"/><stop offset=".3" stop-color="#fff"/><stop offset="1" stop-color="#fff"/>
  </linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
    <stop offset=".55" stop-color="#02040f" stop-opacity="0"/><stop offset="1" stop-color="#02040f" stop-opacity=".85"/>
  </linearGradient>
  <mask id="artmask"><rect x="${IX}" y="0" width="${IW}" height="${H}" fill="url(#fade)"/></mask>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="frame"><path d="M14 0H${W - 14}L${W} 14V${H - 14}L${W - 14} ${H}H14L0 ${H - 14}V14Z"/></clipPath>
  <clipPath id="av"><circle cx="72" cy="104" r="42"/></clipPath>
  <clipPath id="typeclip"><rect x="30" y="190" width="420" height="22" class="type"/></clipPath>
</defs>
<style>
  .tw{animation:tw 4s ease-in-out infinite}
  @keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}
  .cw{animation:spin 22s linear infinite;transform-origin:${FX}px ${FY}px}
  .ccw{animation:spin 14s linear infinite reverse;transform-origin:${FX}px ${FY}px}
  @keyframes spin{to{transform:rotate(360deg)}}
  .pulse{animation:pulse 3.5s ease-in-out infinite;transform-origin:${FX}px ${FY}px}
  @keyframes pulse{0%,100%{opacity:.5;transform:scale(.8)}50%{opacity:1;transform:scale(1.15)}}
  .avr{animation:avr 14s linear infinite;transform-origin:72px 104px}
  @keyframes avr{to{transform:rotate(360deg)}}
  .type{animation:type 9s steps(50,end) infinite;transform-box:fill-box;transform-origin:left center}
  @keyframes type{0%{transform:scaleX(0)}38%,92%{transform:scaleX(1)}100%{transform:scaleX(0)}}
  .breathe{animation:breathe 9s ease-in-out infinite alternate;transform-origin:${IX + IW / 2}px ${H / 2}px}
  @keyframes breathe{to{transform:scale(1.035)}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>

<g clip-path="url(#frame)">
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <ellipse cx="170" cy="250" rx="280" ry="150" fill="url(#nebB)"/>
  ${stars(45, 300, H)}
  <g mask="url(#artmask)">
    <image class="breathe" href="data:image/jpeg;base64,${gojo}" x="${IX}" y="0" width="${IW}" height="${H}" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <rect x="${IX}" y="0" width="${IW}" height="${H}" fill="url(#floor)"/>

  <!-- infinity at the fingertip -->
  <circle class="pulse" cx="${FX}" cy="${FY}" r="26" fill="url(#orb)"/>
  <circle class="cw" cx="${FX}" cy="${FY}" r="30" fill="none" stroke="#7dd3fc" stroke-opacity=".8" stroke-width="1.2" stroke-dasharray="38 12 4 12"/>
  <circle class="ccw" cx="${FX}" cy="${FY}" r="40" fill="none" stroke="#c4b5fd" stroke-opacity=".6" stroke-width=".8" stroke-dasharray="2 7"/>

  <!-- identity -->
  <circle cx="72" cy="104" r="54" fill="url(#halo)"/>
  <image href="data:image/jpeg;base64,${avatar}" x="30" y="62" width="84" height="84" clip-path="url(#av)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="72" cy="104" r="42" fill="none" stroke="#1d4ed8" stroke-width="2.5"/>
  <circle class="avr" cx="72" cy="104" r="46.5" fill="none" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-dasharray="92 46 22 132.2" filter="url(#glow)"/>

  <text x="134" y="58" font-family="${MONO}" font-size="9.5" letter-spacing="2.5" fill="#38bdf8">[ SPECIAL GRADE SORCERER ]</text>
  <text x="132" y="100" font-family="${SANS}" font-size="40" font-weight="800" fill="url(#name)" letter-spacing="1">Mars</text>
  <text x="250" y="100" font-family="${MONO}" font-size="11.5" fill="#94a3b8">@1995mars</text>
  <text x="134" y="124" font-family="${SANS}" font-size="15.5" font-weight="600" fill="#7dd3fc">Fullstack Web Developer</text>
  <text x="134" y="145" font-family="${SANS}" font-size="12" fill="#cbd5e1">Code<tspan fill="#6366f1" dx="6">•</tspan><tspan dx="6">Build</tspan><tspan fill="#6366f1" dx="6">•</tspan><tspan dx="6">Improve</tspan><tspan fill="#6366f1" dx="6">•</tspan><tspan dx="6">Repeat</tspan></text>

  <text x="${W - 22}" y="28" text-anchor="end" font-family="${SANS}" font-size="12.5" font-style="italic" font-weight="700" letter-spacing="3" fill="#e0f2fe" filter="url(#glow)">THE STRONGEST</text>
  <text x="${W - 22}" y="${H - 18}" text-anchor="end" font-family="${SANS}" font-size="11" letter-spacing="3.5" fill="#c4b5fd">LIMITLESS · INFINITY ∞</text>

  <!-- terminal line -->
  <path d="M30 180H420" stroke="#1e3a8a" stroke-width="1"/>
  <text x="30" y="205" font-family="${MONO}" font-size="11.5" fill="#38bdf8">&gt;</text>
  <g clip-path="url(#typeclip)"><text x="46" y="205" font-family="${MONO}" font-size="11.5" fill="#e0f2fe">Throughout prod and staging, I alone push to main.</text></g>
</g>
<path d="M14 .75H${W - 14}L${W - .75} 14V${H - 14}L${W - 14} ${H - .75}H14L.75 ${H - 14}V14Z" fill="none" stroke="url(#edge)" stroke-width="1.5"/>
<path d="M0 38V14L14 0H38M${W - 38} ${H}H${W - 14}L${W} ${H - 14}V${H - 38}" fill="none" stroke="#7dd3fc" stroke-width="2.5"/>
</svg>
`;
fs.writeFileSync(path.join(dir, 'header.svg'), header);

/* ───────────────────────── section titles ───────────────────────── */
function section(file, no, title, sub) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="44" viewBox="0 0 840 44" role="img" aria-label="${title}">
<defs>
  <linearGradient id="l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38bdf8"/><stop offset=".6" stop-color="#6366f1"/><stop offset="1" stop-color="#a855f7" stop-opacity="0"/></linearGradient>
  <linearGradient id="k" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1c4d"/><stop offset="1" stop-color="#1e1b4b"/></linearGradient>
  <linearGradient id="s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#e0f2fe"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>
<style>
  .sw{animation:sw 4.5s ease-in-out infinite}
  @keyframes sw{0%{transform:translateX(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(700px);opacity:0}}
  .bl{animation:bl 3s ease-in-out infinite}
  @keyframes bl{0%,100%{opacity:.35}50%{opacity:1}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<path d="M6 6H38L45 13V33H13L6 26Z" fill="url(#k)" stroke="#38bdf8" stroke-width="1"/>
<text x="25.5" y="24.5" text-anchor="middle" font-family="${MONO}" font-size="14" font-weight="700" fill="#7dd3fc">${no}</text>
<text x="58" y="25.5" font-family="${SANS}" font-size="17" font-weight="800" letter-spacing="2.5" fill="#e0f2fe">${title}</text>
<text x="798" y="24" text-anchor="end" font-family="${MONO}" font-size="11.5" letter-spacing="1" fill="#7c8aa3">${sub}</text>
<rect x="6" y="39" width="828" height="1.2" fill="url(#l)"/>
<rect class="sw" x="6" y="38" width="120" height="3" fill="url(#s)"/>
<g class="bl"><path d="M822 13l7 7-7 7-7-7Z" fill="none" stroke="#7dd3fc" stroke-width="1.2"/><circle cx="822" cy="20" r="1.6" fill="#7dd3fc"/></g>
</svg>
`;
  fs.writeFileSync(path.join(dir, file), svg);
}
section('sec-about.svg', '01', 'SIX EYES', '// about me &amp; tech stack');
section('sec-status.svg', '02', 'LIMITLESS', '// hunter license');
section('sec-missions.svg', '03', 'MISSIONS', '// quests &amp; combat record');
section('sec-spotlight.svg', '04', 'SPECIAL GRADE', '// featured repositories');
section('sec-domain.svg', '05', 'DOMAIN EXPANSION', '// a year inside the void');
section('sec-coffee.svg', '06', 'REVERSE CURSED TECHNIQUE', '// buy me a coffee');

/* ───────────────────────── footer: hollow purple ───────────────────────── */
seed = 410;
const FH = 96, CY = 38;
const footer = `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="${FH}" viewBox="0 0 840 ${FH}" role="img" aria-label="Hollow Purple">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#14030a"/><stop offset=".5" stop-color="#07041c"/><stop offset="1" stop-color="#020a1f"/></linearGradient>
  <radialGradient id="red" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#fca5a5"/><stop offset=".6" stop-color="#ef4444"/><stop offset="1" stop-color="#ef4444" stop-opacity="0"/></radialGradient>
  <radialGradient id="blue" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#bae6fd"/><stop offset=".6" stop-color="#2563eb"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></radialGradient>
  <radialGradient id="pur" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".2" stop-color="#e9d5ff"/><stop offset=".55" stop-color="#a855f7"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></radialGradient>
  <linearGradient id="beamR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ef4444" stop-opacity="0"/><stop offset="1" stop-color="#ef4444"/></linearGradient>
  <linearGradient id="beamB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></linearGradient>
  <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ef4444"/><stop offset=".5" stop-color="#a855f7"/><stop offset="1" stop-color="#38bdf8"/></linearGradient>
  <clipPath id="frame"><path d="M14 0H826L840 14V${FH - 14}L826 ${FH}H14L0 ${FH - 14}V14Z"/></clipPath>
</defs>
<style>
  .tw{animation:tw 4s ease-in-out infinite}
  @keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}
  .r{animation:r 7s ease-in-out infinite}
  .b{animation:b 7s ease-in-out infinite}
  .p{animation:p 7s ease-in-out infinite;transform-origin:420px ${CY}px}
  .w{animation:w 7s ease-out infinite;transform-origin:420px ${CY}px}
  @keyframes r{0%{transform:translateX(0);opacity:0}8%{opacity:1}45%{transform:translateX(250px);opacity:1}52%,100%{transform:translateX(250px);opacity:0}}
  @keyframes b{0%{transform:translateX(0);opacity:0}8%{opacity:1}45%{transform:translateX(-250px);opacity:1}52%,100%{transform:translateX(-250px);opacity:0}}
  @keyframes p{0%,44%{transform:scale(0);opacity:0}54%{transform:scale(1.25);opacity:1}62%,88%{transform:scale(1);opacity:1}100%{transform:scale(.2);opacity:0}}
  @keyframes w{0%,48%{transform:scale(.2);opacity:0}52%{opacity:.9}80%,100%{transform:scale(7);opacity:0}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}.p{opacity:1}}
</style>
<g clip-path="url(#frame)">
  <rect width="840" height="${FH}" fill="url(#bg)"/>
  ${stars(40, 840, FH)}
  <rect x="60" y="${CY - 1}" width="360" height="1.6" fill="url(#beamR)" opacity=".5"/>
  <rect x="420" y="${CY - 1}" width="360" height="1.6" fill="url(#beamB)" opacity=".5"/>
  <circle class="w" cx="420" cy="${CY}" r="16" fill="none" stroke="#c084fc" stroke-width="1"/>
  <circle class="r" cx="170" cy="${CY}" r="20" fill="url(#red)"/>
  <circle class="b" cx="670" cy="${CY}" r="20" fill="url(#blue)"/>
  <circle class="p" cx="420" cy="${CY}" r="30" fill="url(#pur)"/>
  <text x="24" y="22" font-family="${MONO}" font-size="10.5" letter-spacing="1.5" fill="#f87171">REVERSAL: RED</text>
  <text x="816" y="22" text-anchor="end" font-family="${MONO}" font-size="10.5" letter-spacing="1.5" fill="#7dd3fc">LAPSE: BLUE</text>
  <text x="420" y="73" text-anchor="middle" font-family="${SANS}" font-size="14.5" font-weight="800" letter-spacing="5" fill="#e9d5ff">HOLLOW PURPLE</text>
  <text x="420" y="89" text-anchor="middle" font-family="${MONO}" font-size="10.5" letter-spacing="1.5" fill="#94a3b8">thanks for visiting — stay limitless ∞</text>
</g>
<path d="M14 .75H826L839.25 14V${FH - 14}L826 ${FH - .75}H14L.75 ${FH - 14}V14Z" fill="none" stroke="url(#edge)" stroke-width="1.5"/>
</svg>
`;
fs.writeFileSync(path.join(dir, 'footer.svg'), footer);
console.log(fs.readdirSync(dir).filter(f => f.endsWith('.svg')).map(f => `${f} ${fs.statSync(path.join(dir, f)).size}`).join('\n'));
