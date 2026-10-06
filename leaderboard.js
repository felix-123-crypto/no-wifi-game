(() => {
  if (window.__recessLeaderboardLoaded || document.querySelector('.leaderboard-launch')) return;
  window.__recessLeaderboardLoaded = true;
  const params = new URLSearchParams(location.search);
  let game = null;
  if (location.pathname.includes('classics')) game = params.get('game') || '2048';
  else if (location.pathname.includes('football')) game = 'football';
  else if (location.pathname.includes('voxel')) game = 'voxel';
  else if (location.pathname.includes('/game')) game = params.get('game') || 'pacman';
  if (!game) return;
  const nicknameKey = 'recess-leaderboard-nickname';
  const idKey = 'recess-leaderboard-player-id';
  const bestKey = `recess-leaderboard-best-${game}`;
  const get = key => { try { return localStorage.getItem(key) || ''; } catch { return ''; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let playerId = get(idKey);
  if (!playerId) { playerId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`; save(idKey, playerId); }
  let pending = 0, timer;
  const root = document.createElement('div');
  root.innerHTML = `<button class="leaderboard-launch" type="button">LEADERBOARD</button>
    <div class="leaderboard-backdrop" hidden><section class="leaderboard-dialog" role="dialog" aria-modal="true" aria-labelledby="leaderboard-title">
      <button class="leaderboard-close" type="button" aria-label="Close leaderboard">×</button><p class="eyebrow">PUBLIC SCORES</p><h2 id="leaderboard-title">${game.toUpperCase()} LEADERBOARD</h2>
      <p class="leaderboard-copy">Only your best score is kept. Your nickname is saved in this browser.</p>
      <form class="leaderboard-form"><input name="nickname" maxlength="16" autocomplete="nickname" placeholder="Nickname" required><button type="submit">SUBMIT SCORE</button></form>
      <div class="leaderboard-rank"></div><div class="leaderboard-scroll" tabindex="0"><ol class="leaderboard-list"></ol></div><p class="leaderboard-status" role="status"></p>
    </section></div>`;
  document.body.append(root);
  const backdrop = root.querySelector('.leaderboard-backdrop'), list = root.querySelector('.leaderboard-list'), rankEl = root.querySelector('.leaderboard-rank'), status = root.querySelector('.leaderboard-status'), form = root.querySelector('.leaderboard-form'), input = form.elements.nickname, scroll = root.querySelector('.leaderboard-scroll');
  input.value = get(nicknameKey);
  const open = () => { backdrop.hidden = false; input.value = get(nicknameKey); load(); setTimeout(() => input.focus(), 0); };
  const close = () => { backdrop.hidden = true; };
  root.querySelector('.leaderboard-launch').addEventListener('click', open);
  root.querySelector('.leaderboard-close').addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });
  const row = (item, index, own) => `<li class="leaderboard-row${own ? ' leaderboard-me' : ''}" data-player="${own ? 'me' : ''}"><span>${index + 1}</span><strong>${escapeHtml(item.nickname)}</strong><b>${Number(item.score || 0).toLocaleString()}</b></li>`;
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function render(data) {
    const rows = Array.isArray(data?.rows) ? data.rows.slice() : [];
    const own = data?.own || (pending ? {nickname: get(nicknameKey) || 'YOU', score: Math.max(Number(get(bestKey) || 0), pending)} : null);
    if (own && !rows.some(r => r.nickname === own.nickname && Number(r.score) === Number(own.score))) rows.push(own);
    rows.sort((a,b) => Number(b.score) - Number(a.score));
    list.innerHTML = rows.length ? rows.map((r,i) => row(r, i, own && r.nickname === own.nickname && Number(r.score) === Number(own.score))).join('') : '<li class="leaderboard-empty">No scores yet. Be the first!</li>';
    rankEl.textContent = data?.rank ? `YOUR RANK #${data.rank} · BEST ${Number(own?.score || 0).toLocaleString()}` : own ? `YOUR BEST ${Number(own.score || 0).toLocaleString()}` : 'Play a game, then submit your score.';
    const me = list.querySelector('[data-player="me"]');
    if (me) { scroll.scrollTop = 0; setTimeout(() => scroll.scrollTo({top: Math.max(0, me.offsetTop - 20), behavior: 'smooth'}), 120); }
  }
  async function load() {
    status.textContent = 'Loading public scores…';
    try { const r = await fetch(`/api/leaderboard?game=${encodeURIComponent(game)}&player_id=${encodeURIComponent(playerId)}`); if (!r.ok) throw new Error(); render(await r.json()); status.textContent = ''; }
    catch { render(null); status.textContent = 'Public board unavailable right now. Your best score is still saved on this device.'; }
  }
  async function submit(score) {
    score = Math.floor(Number(score) || 0); if (score <= 0) return;
    pending = Math.max(pending, score); save(bestKey, String(Math.max(Number(get(bestKey) || 0), score)));
    const nickname = cleanNickname(get(nicknameKey) || input.value || 'PLAYER');
    save(nicknameKey, nickname);
    try { const r = await fetch('/api/leaderboard', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({game, player_id:playerId, nickname, score})}); if (!r.ok) throw new Error(); if (!backdrop.hidden) load(); }
    catch { if (!backdrop.hidden) status.textContent = 'Saved locally. Public board will retry when available.'; }
  }
  function cleanNickname(value) { return String(value || 'PLAYER').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0,16) || 'PLAYER'; }
  form.addEventListener('submit', e => { e.preventDefault(); save(nicknameKey, cleanNickname(input.value)); if (pending || get(bestKey)) submit(Math.max(pending, Number(get(bestKey) || 0))); else { status.textContent = 'Finish a game to submit a score.'; load(); } });
  window.RecessLeaderboard = { gameId: game, queueScore(score) { if (Number(score) > pending) { pending = Number(score); clearTimeout(timer); timer = setTimeout(() => submit(pending), 1600); } }, submit, open };
})();
