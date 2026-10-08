// Generates the Gojo-inspired SVG assets for the profile README.
// usage: node build.js <avatar.jpg> <outDir>
const fs = require('fs');
const path = require('path');
const [avatarPath, outDir] = process.argv.slice(2);
const avatar = fs.readFileSync(avatarPath).toString('base64');
fs.mkdirSync(outDir, { recursive: true });

const SANS = "'Segoe UI','Helvetica Neue',Arial,sans-serif";
const MONO = "'Cascadia Code','JetBrains Mono',Consolas,'Courier New',monospace";

// deterministic pseudo-random so rebuilds are stable
let seed = 1995;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

function stars(n, w, h) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = (rnd() * w).toFixed(1), y = (rnd() * h).toFixed(1);
    const r = (0.4 + rnd() * 1.1).toFixed(2);
    const d = (2 + rnd() * 4).toFixed(1), b = (rnd() * 5).toFixed(1);
    const c = rnd() > 0.7 ? '#c4b5fd' : rnd() > 0.5 ? '#7dd3fc' : '#e0f2fe';
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" class="tw" style="animation-duration:${d}s;animation-delay:-${b}s"/>`;
  }
  return s;
}

function shards(list) {
  return list.map(([pts, fill, op, dur]) =>
    `<polygon points="${pts}" fill="${fill}" opacity="${op}" class="fl" style="animation-duration:${dur}s"/>`).join('');
}

/* ───────────────────────── header ───────────────────────── */
const EX = 664, EY = 158; // eye centre
const header = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="840" height="320" viewBox="0 0 840 320" role="img" aria-label="Mars — Fullstack Web Developer">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#02040f"/><stop offset=".55" stop-color="#050b24"/><stop offset="1" stop-color="#0a0524"/>
  </linearGradient>
  <radialGradient id="nebA" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#2563eb" stop-opacity=".55"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></radialGradient>
  <radialGradient id="nebB" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7c3aed" stop-opacity=".5"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></radialGradient>
  <radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#38bdf8" stop-opacity=".5"/><stop offset=".6" stop-color="#2563eb" stop-opacity=".12"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></radialGradient>
  <radialGradient id="iris" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#bae6fd"/><stop offset=".58" stop-color="#38bdf8"/><stop offset=".85" stop-color="#1d4ed8"/><stop offset="1" stop-color="#0b1c4d"/>
  </radialGradient>
  <linearGradient id="name" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#bae6fd"/><stop offset="1" stop-color="#a78bfa"/>
  </linearGradient>
  <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#38bdf8"/><stop offset=".5" stop-color="#1e3a8a"/><stop offset="1" stop-color="#a855f7"/>
  </linearGradient>
  <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#6366f1"/></linearGradient>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>
  <clipPath id="frame"><path d="M18 0H822L840 18V302L822 320H18L0 302V18Z"/></clipPath>
  <clipPath id="av"><circle cx="104" cy="150" r="56"/></clipPath>
  <clipPath id="lid"><path d="M${EX - 122} ${EY}Q${EX} ${EY - 96} ${EX + 122} ${EY}Q${EX} ${EY + 96} ${EX - 122} ${EY}Z"/></clipPath>
  <clipPath id="typeclip"><rect x="40" y="262" width="520" height="24" class="type"/></clipPath>
</defs>
<style>
  .tw{animation:tw 4s ease-in-out infinite}
  @keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}
  .fl{animation:fl 7s ease-in-out infinite}
  @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  .cw{animation:spin 48s linear infinite;transform-origin:${EX}px ${EY}px}
  .ccw{animation:spin 30s linear infinite reverse;transform-origin:${EX}px ${EY}px}
  .fib{animation:spin 90s linear infinite;transform-origin:${EX}px ${EY}px}
  @keyframes spin{to{transform:rotate(360deg)}}
  .pulse{animation:pulse 4.5s ease-in-out infinite;transform-origin:${EX}px ${EY}px}
  @keyframes pulse{0%,100%{opacity:.55;transform:scale(.94)}50%{opacity:1;transform:scale(1.06)}}
  .avr{animation:spin 14s linear infinite;transform-origin:104px 150px}
  .type{animation:type 9s steps(54,end) infinite;transform-box:fill-box;transform-origin:left center}
  @keyframes type{0%{transform:scaleX(0)}38%,92%{transform:scaleX(1)}100%{transform:scaleX(0)}}
  .cur{animation:cur 1s steps(1) infinite}
  @keyframes cur{50%{opacity:0}}
  .drift{animation:drift 16s ease-in-out infinite alternate}
  @keyframes drift{to{transform:translate(26px,-10px)}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>

<g clip-path="url(#frame)">
  <rect width="840" height="320" fill="url(#bg)"/>
  <ellipse class="drift" cx="640" cy="130" rx="330" ry="210" fill="url(#nebA)"/>
  <ellipse class="drift" cx="250" cy="330" rx="300" ry="170" fill="url(#nebB)" style="animation-duration:22s"/>
  <ellipse cx="820" cy="300" rx="220" ry="150" fill="url(#nebB)" opacity=".7"/>
  ${stars(110, 840, 320)}
  ${shards([
    ['470,22 498,10 486,44', '#38bdf8', .5, 6], ['520,268 548,252 540,292', '#6366f1', .45, 8],
    ['792,236 818,222 806,262', '#38bdf8', .4, 7], ['300,34 318,26 312,52', '#a78bfa', .4, 9],
    ['556,60 566,54 564,74', '#e0f2fe', .6, 5], ['440,232 452,226 448,246', '#7dd3fc', .5, 6.5],
    ['24,60 46,48 38,82', '#2563eb', .4, 8.5], ['770,54 780,48 778,66', '#c4b5fd', .55, 5.5],
  ])}

  <!-- six eyes -->
  <circle class="pulse" cx="${EX}" cy="${EY}" r="170" fill="url(#halo)"/>
  <circle class="cw" cx="${EX}" cy="${EY}" r="132" fill="none" stroke="#38bdf8" stroke-opacity=".55" stroke-width="1" stroke-dasharray="2 9"/>
  <circle class="ccw" cx="${EX}" cy="${EY}" r="118" fill="none" stroke="url(#ring)" stroke-opacity=".7" stroke-width="1.4" stroke-dasharray="64 18 6 18"/>
  <circle class="cw" cx="${EX}" cy="${EY}" r="106" fill="none" stroke="#a78bfa" stroke-opacity=".45" stroke-width=".8" stroke-dasharray="1 5"/>
  <path d="M${EX - 122} ${EY}Q${EX} ${EY - 96} ${EX + 122} ${EY}Q${EX} ${EY + 96} ${EX - 122} ${EY}Z" fill="#020617" fill-opacity=".72" stroke="#7dd3fc" stroke-width="1.6" filter="url(#glow)"/>
  <g clip-path="url(#lid)">
    <circle cx="${EX}" cy="${EY}" r="58" fill="url(#iris)"/>
    <circle class="fib" cx="${EX}" cy="${EY}" r="40" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="30" stroke-dasharray="1.2 5.1"/>
    <circle class="ccw" cx="${EX}" cy="${EY}" r="46" fill="none" stroke="#0b1c4d" stroke-opacity=".55" stroke-width="1.2" stroke-dasharray="14 6"/>
    <circle cx="${EX}" cy="${EY}" r="58" fill="none" stroke="#e0f2fe" stroke-width="1.5" filter="url(#glow)"/>
    <circle cx="${EX}" cy="${EY}" r="17" fill="#020617"/>
    <circle cx="${EX}" cy="${EY}" r="17" fill="none" stroke="#7dd3fc" stroke-width="1"/>
    <circle cx="${EX - 15}" cy="${EY - 19}" r="6" fill="#ffffff" opacity=".9"/>
    <circle cx="${EX + 13}" cy="${EY + 16}" r="2.4" fill="#ffffff" opacity=".7"/>
  </g>
  <path d="M${EX - 140} ${EY}H${EX - 126}M${EX + 126} ${EY}H${EX + 140}M${EX} ${EY - 146}V${EY - 136}M${EX} ${EY + 136}V${EY + 146}" stroke="#7dd3fc" stroke-width="1.4" stroke-linecap="round"/>

  <!-- identity -->
  <circle cx="104" cy="150" r="70" fill="url(#halo)"/>
  <image href="data:image/jpeg;base64,${avatar}" x="48" y="94" width="112" height="112" clip-path="url(#av)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="104" cy="150" r="56" fill="none" stroke="#1d4ed8" stroke-width="3"/>
  <circle class="avr" cx="104" cy="150" r="61" fill="none" stroke="#7dd3fc" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="120 60 30 173.3" filter="url(#glow)"/>

  <text x="188" y="72" font-family="${MONO}" font-size="11" letter-spacing="3" fill="#38bdf8">[ SPECIAL GRADE SORCERER ]</text>
  <text x="186" y="130" font-family="${SANS}" font-size="52" font-weight="800" fill="url(#name)" letter-spacing="1">Mars</text>
  <text x="338" y="130" font-family="${MONO}" font-size="14" fill="#64748b">@1995mars</text>
  <text x="188" y="160" font-family="${SANS}" font-size="19" font-weight="600" fill="#7dd3fc">Fullstack Web Developer</text>
  <text x="188" y="186" font-family="${SANS}" font-size="14" fill="#cbd5e1">Code<tspan fill="#6366f1" dx="8">•</tspan><tspan dx="8">Build</tspan><tspan fill="#6366f1" dx="8">•</tspan><tspan dx="8">Improve</tspan><tspan fill="#6366f1" dx="8">•</tspan><tspan dx="8">Repeat</tspan></text>
  <g font-family="${MONO}" font-size="11" fill="#94a3b8">
    <rect x="188" y="202" width="62" height="20" rx="3" fill="#0b1c4d" fill-opacity=".7" stroke="#1d4ed8" stroke-opacity=".8"/><text x="219" y="216" text-anchor="middle" fill="#bae6fd">Java</text>
    <rect x="256" y="202" width="98" height="20" rx="3" fill="#0b1c4d" fill-opacity=".7" stroke="#1d4ed8" stroke-opacity=".8"/><text x="305" y="216" text-anchor="middle" fill="#bae6fd">Spring Boot</text>
    <rect x="360" y="202" width="110" height="20" rx="3" fill="#0b1c4d" fill-opacity=".7" stroke="#1d4ed8" stroke-opacity=".8"/><text x="415" y="216" text-anchor="middle" fill="#bae6fd">Microservices</text>
    <rect x="476" y="202" width="56" height="20" rx="3" fill="#0b1c4d" fill-opacity=".7" stroke="#1d4ed8" stroke-opacity=".8"/><text x="504" y="216" text-anchor="middle" fill="#bae6fd">Kafka</text>
  </g>

  <text x="812" y="34" text-anchor="end" font-family="${SANS}" font-size="15" font-style="italic" font-weight="700" letter-spacing="3" fill="#7dd3fc" opacity=".9">THE STRONGEST</text>
  <text x="812" y="296" text-anchor="end" font-family="${SANS}" font-size="13" letter-spacing="4" fill="#a78bfa" opacity=".85">LIMITLESS · INFINITY ∞</text>

  <!-- terminal line -->
  <path d="M40 250H560" stroke="#1e3a8a" stroke-width="1"/>
  <text x="40" y="279" font-family="${MONO}" font-size="13" fill="#38bdf8">&gt;</text>
  <g clip-path="url(#typeclip)"><text x="58" y="279" font-family="${MONO}" font-size="13" fill="#e0f2fe">Throughout prod and staging, I alone push to main.</text></g>
  <rect class="cur" x="452" y="268" width="7" height="14" fill="#38bdf8"/>
</g>
<path d="M18 .75H822L839.25 18V302L822 319.25H18L.75 302V18Z" fill="none" stroke="url(#edge)" stroke-width="1.5"/>
<path d="M0 46V18L18 0H46M794 320H822L840 302V274" fill="none" stroke="#7dd3fc" stroke-width="3"/>
</svg>
`;
fs.writeFileSync(path.join(outDir, 'header.svg'), header);

/* ───────────────────────── section titles ───────────────────────── */
function section(file, no, title, sub) {
  const kw = 58;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="60" viewBox="0 0 840 60" role="img" aria-label="${title}">
<defs>
  <linearGradient id="l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38bdf8"/><stop offset=".6" stop-color="#6366f1"/><stop offset="1" stop-color="#a855f7" stop-opacity="0"/></linearGradient>
  <linearGradient id="k" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1c4d"/><stop offset="1" stop-color="#1e1b4b"/></linearGradient>
  <linearGradient id="s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#e0f2fe"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <filter id="g" x="-20%" y="-80%" width="140%" height="260%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<style>
  .sw{animation:sw 4.5s ease-in-out infinite}
  @keyframes sw{0%{transform:translateX(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(700px);opacity:0}}
  .bl{animation:bl 3s ease-in-out infinite}
  @keyframes bl{0%,100%{opacity:.35}50%{opacity:1}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<path d="M8 8H${kw - 4}L${kw + 4} 16V44H16L8 36Z" fill="url(#k)" stroke="#38bdf8" stroke-width="1.2" filter="url(#g)"/>
<text x="${(kw + 12) / 2}" y="34" text-anchor="middle" font-family="${MONO}" font-size="18" font-weight="700" fill="#7dd3fc">${no}</text>
<text x="${kw + 20}" y="27" font-family="${SANS}" font-size="20" font-weight="800" letter-spacing="3" fill="#e0f2fe">${title}</text>
<text x="${kw + 20}" y="44" font-family="${MONO}" font-size="11" letter-spacing="1.5" fill="#64748b">${sub}</text>
<rect x="8" y="54" width="824" height="1.5" fill="url(#l)"/>
<rect class="sw" x="8" y="53" width="120" height="3.5" fill="url(#s)"/>
<g class="bl"><path d="M804 20l8 8-8 8-8-8Z" fill="none" stroke="#7dd3fc" stroke-width="1.4"/><circle cx="804" cy="28" r="2" fill="#7dd3fc"/></g>
<path d="M776 28H790M818 28H832" stroke="#1e3a8a" stroke-width="1.4"/>
</svg>
`;
  fs.writeFileSync(path.join(outDir, file), svg);
}
section('sec-about.svg', '01', 'SIX EYES', '// about me — seeing the whole system at once');
section('sec-stack.svg', '02', 'CURSED TECHNIQUES', '// the tech stack I fight with');
section('sec-status.svg', '03', 'LIMITLESS', '// hunter license &amp; status window');
section('sec-missions.svg', '04', 'MISSIONS', '// active quest, daily clears &amp; combat record');
section('sec-spotlight.svg', '05', 'SPECIAL GRADE', '// featured repositories');
section('sec-domain.svg', '06', 'DOMAIN EXPANSION', '// a year of contributions inside the void');

/* ───────────────────────── footer: hollow purple ───────────────────────── */
seed = 410;
const footer = `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="170" viewBox="0 0 840 170" role="img" aria-label="Hollow Purple">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#14030a"/><stop offset=".5" stop-color="#07041c"/><stop offset="1" stop-color="#020a1f"/></linearGradient>
  <radialGradient id="red" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#fca5a5"/><stop offset=".6" stop-color="#ef4444"/><stop offset="1" stop-color="#ef4444" stop-opacity="0"/></radialGradient>
  <radialGradient id="blue" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#bae6fd"/><stop offset=".6" stop-color="#2563eb"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></radialGradient>
  <radialGradient id="pur" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".2" stop-color="#e9d5ff"/><stop offset=".55" stop-color="#a855f7"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></radialGradient>
  <linearGradient id="beamR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ef4444" stop-opacity="0"/><stop offset="1" stop-color="#ef4444"/></linearGradient>
  <linearGradient id="beamB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></linearGradient>
  <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ef4444"/><stop offset=".5" stop-color="#a855f7"/><stop offset="1" stop-color="#38bdf8"/></linearGradient>
  <clipPath id="frame"><path d="M18 0H822L840 18V152L822 170H18L0 152V18Z"/></clipPath>
</defs>
<style>
  .tw{animation:tw 4s ease-in-out infinite}
  @keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}
  .r{animation:r 7s ease-in-out infinite}
  .b{animation:b 7s ease-in-out infinite}
  .p{animation:p 7s ease-in-out infinite;transform-origin:420px 66px}
  .w{animation:w 7s ease-out infinite;transform-origin:420px 66px}
  @keyframes r{0%{transform:translateX(0);opacity:0}8%{opacity:1}45%{transform:translateX(250px);opacity:1}52%,100%{transform:translateX(250px);opacity:0}}
  @keyframes b{0%{transform:translateX(0);opacity:0}8%{opacity:1}45%{transform:translateX(-250px);opacity:1}52%,100%{transform:translateX(-250px);opacity:0}}
  @keyframes p{0%,44%{transform:scale(0);opacity:0}54%{transform:scale(1.25);opacity:1}62%,88%{transform:scale(1);opacity:1}100%{transform:scale(.2);opacity:0}}
  @keyframes w{0%,48%{transform:scale(.2);opacity:0}52%{opacity:.9}80%,100%{transform:scale(7);opacity:0}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}.p{opacity:1}}
</style>
<g clip-path="url(#frame)">
  <rect width="840" height="170" fill="url(#bg)"/>
  ${stars(60, 840, 170)}
  <rect x="60" y="65" width="360" height="2" fill="url(#beamR)" opacity=".5"/>
  <rect x="420" y="65" width="360" height="2" fill="url(#beamB)" opacity=".5"/>
  <circle class="w" cx="420" cy="66" r="20" fill="none" stroke="#c084fc" stroke-width="1"/>
  <circle class="r" cx="170" cy="66" r="30" fill="url(#red)"/>
  <circle class="b" cx="670" cy="66" r="30" fill="url(#blue)"/>
  <circle class="p" cx="420" cy="66" r="46" fill="url(#pur)"/>
  <text x="60" y="34" font-family="${MONO}" font-size="11" letter-spacing="2" fill="#f87171">CURSED TECHNIQUE REVERSAL: RED</text>
  <text x="780" y="34" text-anchor="end" font-family="${MONO}" font-size="11" letter-spacing="2" fill="#7dd3fc">CURSED TECHNIQUE LAPSE: BLUE</text>
  <text x="420" y="132" text-anchor="middle" font-family="${SANS}" font-size="17" font-weight="800" letter-spacing="6" fill="#e9d5ff">HOLLOW PURPLE</text>
  <text x="420" y="152" text-anchor="middle" font-family="${MONO}" font-size="11" letter-spacing="2" fill="#94a3b8">thanks for visiting — stay limitless ∞</text>
</g>
<path d="M18 .75H822L839.25 18V152L822 169.25H18L.75 152V18Z" fill="none" stroke="url(#edge)" stroke-width="1.5"/>
</svg>
`;
fs.writeFileSync(path.join(outDir, 'footer.svg'), footer);
console.log(fs.readdirSync(outDir).map(f => `${f} ${fs.statSync(path.join(outDir, f)).size}`).join('\n'));
