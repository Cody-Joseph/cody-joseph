async function loadHalf(url, contentId, sectionId){
  const target = document.getElementById(contentId);
  const section = document.getElementById(sectionId);
  try{
    const res = await fetch(url, { cache: 'no-store' });
    if(!res.ok) throw new Error(res.status);
    target.innerHTML = await res.text();
    applyBackgroundPhoto(target, section);
  }catch(err){
    target.innerHTML = `
      <p class="eyebrow">couldn't load ${url}</p>
      <h2>Fragment not found</h2>
      <p>Make sure <code>${url}</code> sits next to <code>index.html</code>.
      If you're opening this file directly from disk (file://), most browsers block
      fetch() for local files — serve the folder instead, e.g.
      <code>python3 -m http.server</code>, or just push it to GitHub Pages, which serves
      everything over https and works fine.</p>
    `;
  }
}

// Optional background photo: a fragment can include, anywhere in its markup,
// <img class="bg-photo" src="your-image.jpg" alt="">
// This pulls that image's src, applies it as the half's background, and
// removes the <img> itself so it doesn't also render inline as content.
function applyBackgroundPhoto(content, section){
  const bg = content.querySelector('.bg-photo');
  if(!bg) return;
  const src = bg.getAttribute('src');
  if(src){
    section.style.setProperty('--bg-photo', `url("${src}")`);
    section.classList.add('has-bg');
  }
  bg.remove();
}

Promise.all([
  loadHalf('cody.html', 'cody-content', 'cody-half'),
  loadHalf('joseph.html', 'joseph-content', 'joseph-half')
]).then(initBattle);

/* =====================================================================
   BATTLE GENERATOR
   Pulls whatever's actually in cody.html / joseph.html right now — name,
   stats, special moves — and mashes it into a short, ridiculous, randomized
   battle report. No two runs read quite the same.
===================================================================== */

function readFighter(contentId, fallbackName){
  const root = document.getElementById(contentId);
  const name = root.querySelector('.fighter-name')?.textContent.trim() || fallbackName;
  const tag = root.querySelector('.fighter-tag')?.textContent.trim() || '';
  const moves = Array.from(root.querySelectorAll('.move-list li')).map(li => ({
    name: li.querySelector('.name')?.textContent.trim(),
    desc: li.querySelector('.tag')?.textContent.trim()
  })).filter(m => m.name);
  const stats = Array.from(root.querySelectorAll('.stat-bar')).map(row => ({
    label: row.querySelector('.stat-bar-label span')?.textContent.trim(),
    value: parseInt(row.querySelector('.stat-bar-label b')?.textContent.trim() || '0', 10) || 0
  })).filter(s => s.label);
  if(moves.length === 0) moves.push({ name: 'Improvised Nonsense', desc: 'nobody, least of all them, knows what this does' });
  if(stats.length === 0) stats.push({ label: 'Vibes', value: 50 });
  const power = stats.reduce((sum, s) => sum + s.value, 0);
  return { name, tag, moves, stats, power };
}

function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
function chance(p){ return Math.random() < p; }

const BATTLE_INTROS = [
  f => `The seam itself seems to hum as ${f.p1} and ${f.p2} step up on opposite sides of the page.`,
  f => `Somewhere, an announcer nobody hired clears their throat. "${f.p1}. ${f.p2}. Let's go."`,
  f => `No referee. No rules. Just ${f.p1} and ${f.p2}, and whatever's about to happen.`,
  f => `The VS mark between them flickers once, like it already regrets this.`,
  f => `${f.p1} and ${f.p2} lock eyes across the seam. This was inevitable.`
];

const MOVE_LINES = [
  f => `${f.name} unleashes <b>${f.move.name}</b>${f.desc}`,
  f => `Without warning, ${f.name} activates <b>${f.move.name}</b>${f.desc}`,
  f => `${f.name} winds up and lands <b>${f.move.name}</b>${f.desc}`,
  f => `In one motion, ${f.name} pulls off <b>${f.move.name}</b>${f.desc}`,
  f => `${f.name} calls their shot — <b>${f.move.name}</b>${f.desc}`
];

const CHAOS_LINES = [
  f => `Completely unrelated to anything, a delivery truck full of Bell drives through the arena. Everyone pauses out of respect.`,
  f => `${f.p1} gets distracted by something off-screen. ${f.p2} does not capitalize on this, out of solidarity.`,
  f => `The seam glows brighter for a second and then, embarrassingly, does nothing.`,
  f => `A wild third character considers jumping in, thinks better of it, and leaves.`,
  f => `Time briefly stops. Nobody mentions it afterward.`,
  f => `${f.p2} checks their phone mid-battle. It was, in fact, important.`
];

const STAT_LINES = [
  f => `${f.leader}'s ${f.stat.label} (${f.stat.value}) is doing a lot of heavy lifting here.`,
  f => `On paper, ${f.leader} should be winning this on ${f.stat.label} alone.`,
  f => `${f.leader}'s ${f.stat.label} stat flickers menacingly. ${f.stat.value}. That's a big number.`
];

const OUTRO_WIN = [
  f => `${f.w} stands victorious. ${f.l} immediately requests a rematch.`,
  f => `It's over. ${f.w} wins. ${f.l} is already drafting an appeal in the group chat.`,
  f => `${f.w} takes it. Somewhere, ${f.l} is already blaming lag.`,
  f => `${f.w} wins, barely, and will never let ${f.l} forget it.`
];

function esc(s){
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateBattle(cody, joseph){
  const lines = [];
  const p1 = `<span class="b-cody">${esc(cody.name)}</span>`;
  const p2 = `<span class="b-joseph">${esc(joseph.name)}</span>`;

  lines.push(pick(BATTLE_INTROS)({ p1, p2 }));

  if(chance(0.5)){
    const leaderIsCody = cody.power >= joseph.power;
    const leader = leaderIsCody ? cody : joseph;
    const leaderName = leaderIsCody ? p1 : p2;
    const stat = pick(leader.stats);
    lines.push(pick(STAT_LINES)({ leader: leaderName, stat }));
  }

  const rounds = 2 + Math.floor(Math.random() * 4); // 2–5 rounds
  for(let i = 0; i < rounds; i++){
    const codyTurn = chance(0.5);
    const fighter = codyTurn ? cody : joseph;
    const fighterName = codyTurn ? p1 : p2;
    const move = pick(fighter.moves);
    const descText = move.desc ? ` — ${esc(move.desc)}.` : '.';
    lines.push(pick(MOVE_LINES)({ name: fighterName, move: { name: esc(move.name) }, desc: descText }));

    if(chance(0.35)){
      lines.push(pick(CHAOS_LINES)({ p1, p2 }));
    }
  }

  // weighted-random winner: higher combined stat total tilts the odds,
  // but it's never a sure thing
  const total = cody.power + joseph.power || 1;
  const codyWins = Math.random() < (cody.power / total) * 0.7 + 0.15;
  const winner = codyWins ? cody : joseph;
  const loser = codyWins ? joseph : cody;
  const wName = codyWins ? p1 : p2;
  const lName = codyWins ? p2 : p1;
  const finishMove = pick(winner.moves);

  lines.push(`With one last <b>${esc(finishMove.name)}</b>, it's decided.`);
  lines.push(`<span class="b-winner">${pick(OUTRO_WIN)({ w: wName, l: lName })}</span>`);

  return lines;
}

function initBattle(){
  const btn = document.getElementById('battle-btn');
  const overlay = document.getElementById('battle-overlay');
  const log = document.getElementById('battle-log');
  const closeBtn = document.getElementById('battle-close');
  const doneBtn = document.getElementById('battle-done');
  const againBtn = document.getElementById('battle-again');

  btn.disabled = false;

  function runBattle(){
    const cody = readFighter('cody-content', 'Cody');
    const joseph = readFighter('joseph-content', 'Joseph');
    const lines = generateBattle(cody, joseph);

    log.innerHTML = lines.map((line, i) =>
      `<p style="animation-delay:${(i * 0.28).toFixed(2)}s">${line}</p>`
    ).join('');
    log.scrollTop = 0;
  }

  function openBattle(){
    runBattle();
    overlay.hidden = false;
  }
  function closeBattle(){
    overlay.hidden = true;
  }

  btn.addEventListener('click', openBattle);
  closeBtn.addEventListener('click', closeBattle);
  doneBtn.addEventListener('click', closeBattle);
  againBtn.addEventListener('click', runBattle);
  overlay.addEventListener('click', e => { if(e.target === overlay) closeBattle(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !overlay.hidden) closeBattle(); });
}
