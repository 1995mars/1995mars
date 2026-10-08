// Draws the "Special Grade" repository cards with larger type than the
// git-profile-awaken spotlight widget allows.
// usage: node assets/spotlight.js   (GITHUB_TOKEN is optional)
const fs = require('fs');
const path = require('path');

const OWNER = '1995mars';
const REPOS = ['Books', 'Spring-Framework', 'OCP-Java-SE-11', 'Kafka-Course', 'Microservices', 'Spring-security-6'];

const SANS = "'Segoe UI','Helvetica Neue',Arial,sans-serif";
const MONO = "'Cascadia Code','JetBrains Mono',Consolas,'Courier New',monospace";
const LANG = { Java: '#b07219', HTML: '#e34c26', CSS: '#563d7c', JavaScript: '#f1e05a', TypeScript: '#3178c6', Shell: '#89e051', Python: '#3572a5', Kotlin: '#a97bff', Go: '#00add8' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

function card(repo) {
  const name = repo.name;
  const nameSize = Math.min(30, Math.floor(372 / (name.length * 0.56)));
  const desc = repo.description ? clip(repo.description, 44) : '';
  const lang = repo.language;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="184" viewBox="0 0 420 184" role="img" aria-label="${esc(OWNER + '/' + name)}">
<style>
  .br{animation:br 3.2s ease-in-out infinite}
  @keyframes br{0%,100%{opacity:.45}50%{opacity:1}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<path d="M18 4H416V166L402 180H4V18Z" fill="#06121f"/>
<path d="M18.4 4.8H415.3V165.6L401.6 179.3H4.8V18.4Z" fill="none" stroke="#5a6b7d" stroke-width="1.5"/>
<path class="br" d="M405 1H419V15M1 169V183H15" fill="none" stroke="#00b4d8" stroke-width="2"/>
<text x="22" y="36" font-family="${MONO}" font-size="16" font-weight="700" letter-spacing="2" fill="#00b4d8">[ SPOTLIGHT ]</text>
<text x="398" y="37" text-anchor="end" font-family="${MONO}" font-size="20" font-weight="700" fill="#ffc53d">★ ${repo.stargazers_count}</text>
<text x="22" y="84" font-family="${SANS}" font-size="${nameSize}" font-weight="700" fill="#e2ecf6">${esc(name)}</text>
${desc ? `<text x="22" y="112" font-family="${SANS}" font-size="16" fill="#8ea6bf">${esc(desc)}</text>` : ''}
${lang ? `<circle cx="28" cy="153" r="5.5" fill="${LANG[lang] || '#00b4d8'}"/><text x="42" y="159" font-family="${SANS}" font-size="17" font-weight="600" fill="#c2d1e0">${esc(lang)}</text>` : ''}
<text x="398" y="159" text-anchor="end" font-family="${MONO}" font-size="15" fill="#8ea6bf">${repo.forks_count} forks · ${repo.pushed_at.slice(0, 10)}</text>
</svg>
`;
}

async function main() {
  const headers = { 'user-agent': 'profile-spotlight', accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  for (const [i, name] of REPOS.entries()) {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${name}`, { headers });
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    fs.writeFileSync(path.join(__dirname, `spot-${i + 1}.svg`), card(await res.json()));
  }
  console.log(`Wrote ${REPOS.length} spotlight cards.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
