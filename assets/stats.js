// Draws the Languages and Streak cards in the same frame as the spotlight cards.
// usage: GITHUB_TOKEN=... node assets/stats.js   (the GraphQL API needs a token)
const fs = require('fs');
const path = require('path');

const OWNER = '1995mars';
const TOP = 5; // languages listed before the rest collapses into "Other"

const SANS = "'Segoe UI','Helvetica Neue',Arial,sans-serif";
const MONO = "'Cascadia Code','JetBrains Mono',Consolas,'Courier New',monospace";
const W = 420, H = 216;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => n.toLocaleString('en-US');
const days = (n) => `${num(n)} day${n === 1 ? '' : 's'}`;

function frame(label, title, right, body, css = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
<style>
  .br{animation:br 3.2s ease-in-out infinite}
  @keyframes br{0%,100%{opacity:.45}50%{opacity:1}}
  ${css}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<path d="M18 4H${W - 4}V${H - 18}L${W - 18} ${H - 4}H4V18Z" fill="#06121f"/>
<path d="M18.4 4.8H${W - 4.7}V${H - 18.4}L${W - 18.4} ${H - 4.7}H4.8V18.4Z" fill="none" stroke="#5a6b7d" stroke-width="1.5"/>
<path class="br" d="M${W - 15} 1H${W - 1}V15M1 ${H - 15}V${H - 1}H15" fill="none" stroke="#00b4d8" stroke-width="2"/>
<text x="22" y="36" font-family="${MONO}" font-size="16" font-weight="700" letter-spacing="2" fill="#00b4d8">[ ${title} ]</text>
<text x="398" y="36" text-anchor="end" font-family="${MONO}" font-size="14" fill="#8ea6bf">${esc(right)}</text>
${body}
</svg>
`;
}

function languagesCard(langs, repoCount) {
  const total = langs.reduce((sum, l) => sum + l.size, 0);
  const rows = langs.slice(0, TOP);
  const rest = langs.slice(TOP).reduce((sum, l) => sum + l.size, 0);
  if (rest > 0) rows.push({ name: 'Other', color: '#8ea6bf', size: rest });
  const max = Math.max(...rows.map((l) => l.size));
  const BX = 152, BW = 186;
  const body = rows.map((l, i) => {
    const y = 68 + i * 26;
    const pct = (l.size / total) * 100;
    const w = Math.max(3, (l.size / max) * BW).toFixed(1);
    return `<circle cx="28" cy="${y - 5}" r="5" fill="${l.color}"/>
<text x="42" y="${y}" font-family="${SANS}" font-size="15.5" font-weight="600" fill="#c2d1e0">${esc(l.name)}</text>
<rect x="${BX}" y="${y - 9}" width="${BW}" height="7" rx="3.5" fill="#12263a"/>
<rect class="bar" style="animation-delay:${(i * 0.12).toFixed(2)}s" x="${BX}" y="${y - 9}" width="${w}" height="7" rx="3.5" fill="${l.color}"/>
<text x="398" y="${y}" text-anchor="end" font-family="${MONO}" font-size="14" fill="#e2ecf6">${pct.toFixed(1)}%</text>`;
  }).join('\n');
  const css = `.bar{animation:grow 1.4s ease-out both;transform-box:fill-box;transform-origin:left center}
  @keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}`;
  const label = `Languages: ${rows.map((l) => `${l.name} ${((l.size / total) * 100).toFixed(1)}%`).join(', ')}`;
  return frame(label, 'LANGUAGES', `across ${repoCount} repos`, body, css);
}

function streakCard(s) {
  const CX = 78, CY = 122, R = 46;
  const size = s.current >= 1000 ? 26 : s.current >= 100 ? 32 : 38;
  const row = (y, label, value, note) => `<text x="158" y="${y}" font-family="${MONO}" font-size="12" letter-spacing="1.5" fill="#8ea6bf">${label}</text>
<text x="158" y="${y + 22}" font-family="${SANS}" font-size="18" font-weight="700" fill="#e2ecf6">${esc(value)}${note ? `<tspan dx="8" font-family="${MONO}" font-size="12" font-weight="400" fill="#8ea6bf">${esc(note)}</tspan>` : ''}</text>`;
  const body = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#12263a" stroke-width="6"/>
<circle class="ring" cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#00b4d8" stroke-width="6" stroke-linecap="round" stroke-dasharray="150 139"/>
<text x="${CX}" y="${CY + 8}" text-anchor="middle" font-family="${SANS}" font-size="${size}" font-weight="800" fill="#e2ecf6">${num(s.current)}</text>
<text x="${CX}" y="${CY + 27}" text-anchor="middle" font-family="${MONO}" font-size="11" letter-spacing="2" fill="#00b4d8">DAY${s.current === 1 ? '' : 'S'}</text>
<text x="${CX}" y="${CY + R + 26}" text-anchor="middle" font-family="${MONO}" font-size="12" letter-spacing="1.5" fill="#ffc53d">CURRENT</text>
${row(72, 'LONGEST STREAK', days(s.longest), s.longestEnd ? `→ ${s.longestEnd}` : '')}
${row(118, 'LAST CONTRIBUTION', s.last || '—', '')}
${row(164, 'THIS YEAR', num(s.thisYear), 'contributions')}`;
  const css = `.ring{animation:ring 9s linear infinite;transform-origin:${CX}px ${CY}px}
  @keyframes ring{to{transform:rotate(360deg)}}`;
  const label = `Streak: current ${days(s.current)}, longest ${days(s.longest)}, ${num(s.total)} contributions in total`;
  return frame(label, 'STREAK', `${num(s.total)} total`, body, css);
}

async function graphql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { 'user-agent': 'profile-stats', authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GraphQL: ${json.errors ? json.errors.map((e) => e.message).join('; ') : `HTTP ${res.status}`}`);
  return json.data;
}

function streak(calendar, now) {
  const all = calendar.sort((a, b) => a.date.localeCompare(b.date));
  let longest = 0, longestEnd = '', run = 0, last = '';
  for (const d of all) {
    run = d.contributionCount > 0 ? run + 1 : 0;
    if (d.contributionCount > 0) last = d.date;
    if (run > longest) { longest = run; longestEnd = d.date; }
  }
  // a day without contributions only breaks the streak once it is over
  let i = all.length - 1;
  if (i >= 0 && all[i].contributionCount === 0) i--;
  let current = 0;
  for (; i >= 0 && all[i].contributionCount > 0; i--) current++;
  const year = String(now.getUTCFullYear());
  const sum = (list) => list.reduce((n, d) => n + d.contributionCount, 0);
  return { current, longest, longestEnd, last, total: sum(all), thisYear: sum(all.filter((d) => d.date.startsWith(year))) };
}

async function main() {
  if (!process.env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is required');
  const now = new Date();

  const { user } = await graphql(`query($login:String!){user(login:$login){createdAt
    repositories(first:100,ownerAffiliations:OWNER,isFork:false,privacy:PUBLIC){nodes{
      languages(first:10,orderBy:{field:SIZE,direction:DESC}){edges{size node{name color}}}}}}}`, { login: OWNER });
  // each repo counts once, split by its own byte share, so one repo full of
  // vendored CSS cannot outweigh everything else
  const bytes = new Map();
  const repos = user.repositories.nodes.filter((repo) => repo.languages.edges.length);
  for (const repo of repos) {
    const repoSize = repo.languages.edges.reduce((sum, e) => sum + e.size, 0);
    for (const { size, node } of repo.languages.edges) {
      const entry = bytes.get(node.name) || { name: node.name, color: node.color || '#00b4d8', size: 0 };
      entry.size += size / repoSize;
      bytes.set(node.name, entry);
    }
  }
  const langs = [...bytes.values()].sort((a, b) => b.size - a.size);

  // the calendar is capped at one year per request, so ask for every year at once
  const years = [];
  for (let y = new Date(user.createdAt).getUTCFullYear(); y <= now.getUTCFullYear(); y++) years.push(y);
  const fields = years.map((y) => {
    const to = y === now.getUTCFullYear() ? now.toISOString() : `${y}-12-31T23:59:59Z`;
    return `y${y}:contributionsCollection(from:"${y}-01-01T00:00:00Z",to:"${to}"){contributionCalendar{weeks{contributionDays{date contributionCount}}}}`;
  }).join('\n');
  const data = await graphql(`query($login:String!){user(login:$login){${fields}}}`, { login: OWNER });
  const calendar = Object.values(data.user).flatMap((c) => c.contributionCalendar.weeks.flatMap((w) => w.contributionDays));

  fs.writeFileSync(path.join(__dirname, 'languages.svg'), languagesCard(langs, repos.length));
  fs.writeFileSync(path.join(__dirname, 'streak.svg'), streakCard(streak(calendar, now)));
  console.log('Wrote languages.svg and streak.svg.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
