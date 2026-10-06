(() => {
  if (window.__recessLeaderboardLoaded || document.querySelector('.leaderboard-launch')) return;
  window.__recessLeaderboardLoaded = true;
  const params = new URLSearchParams(location.search);
  let game = null;
  if (location.pathname.includes('classics')) game = params.get('game') || '2048';
  else if (location.pathname.includes('football')) game = 'football';
  else if (location.pathname.includes('parkour')) game = 'parkour';
  else if (location.pathname.includes('voxel')) game = 'voxel';
  else if (location.pathname.includes('/game')) game = params.get('game') || 'pacman';
  if (!game) return;
  const nicknameKey = 'recess-leaderboard-nickname';
  const idKey = 'recess-leaderboard-player-id';
  const bestKey = `recess-leaderboard-best-${game}`;
  const pendingKey = `recess-leaderboard-pending-${game}`;
  const get = key => { try { return localStorage.getItem(key) || ''; } catch { return ''; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let playerId = get(idKey);
  if (!playerId) { playerId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`; save(idKey, playerId); }
  let pending = Number(get(bestKey) || 0), timer, refreshTimer = 0, autoScrollNext = true, uploadInFlight = false;
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
  const open = () => { backdrop.hidden = false; input.value = get(nicknameKey); autoScrollNext = true; flushPending(); load(); clearInterval(refreshTimer); refreshTimer = setInterval(() => { if (!backdrop.hidden) { flushPending(); load(); } }, 5000); setTimeout(() => input.focus(), 0); };
  const close = () => { backdrop.hidden = true; clearInterval(refreshTimer); refreshTimer = 0; };
  root.querySelector('.leaderboard-launch').addEventListener('click', open);
  root.querySelector('.leaderboard-close').addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });
  const row = (item, index, own) => `<li class="leaderboard-row${own ? ' leaderboard-me' : ''}" data-player="${own ? 'me' : ''}"><span>${index + 1}</span><strong>${escapeHtml(item.nickname)}</strong><b>${Number(item.score || 0).toLocaleString()}</b></li>`;
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function render(data) {
    const previousScroll = scroll.scrollTop;
    const rows = Array.isArray(data?.rows) ? data.rows.slice() : [];
    const localBest = Math.max(Number(get(bestKey) || 0), pending);
    const own = data?.own || (localBest > 0 ? {nickname: get(nicknameKey) || 'YOU', score: localBest} : null);
    if (own && !rows.some(r => r.nickname === own.nickname && Number(r.score) === Number(own.score))) rows.push(own);
    rows.sort((a,b) => Number(b.score) - Number(a.score));
    list.innerHTML = rows.length ? rows.map((r,i) => row(r, i, own && r.nickname === own.nickname && Number(r.score) === Number(own.score))).join('') : '<li class="leaderboard-empty">No scores yet. Be the first!</li>';
    rankEl.textContent = data?.rank ? `YOUR RANK #${data.rank} · BEST ${Number(own?.score || 0).toLocaleString()}` : own ? `YOUR BEST ${Number(own.score || 0).toLocaleString()}` : 'Play a game, then submit your score.';
    const me = list.querySelector('[data-player="me"]');
    if (me && autoScrollNext) { scroll.scrollTop = 0; autoScrollNext = false; setTimeout(() => { if (!backdrop.hidden) scroll.scrollTo({top: Math.max(0, me.offsetTop - 20), behavior: 'smooth'}); }, 120); }
    else if (!autoScrollNext) scroll.scrollTop = previousScroll;
  }
  async function load() {
    status.textContent = 'Loading public scores…';
    try { const r = await fetch(`/api/leaderboard?game=${encodeURIComponent(game)}&player_id=${encodeURIComponent(playerId)}`); if (!r.ok) throw new Error(); render(await r.json()); status.textContent = ''; }
    catch { render(null); status.textContent = 'Public board unavailable right now. Your best score is still saved on this device.'; }
  }
  function readPending() { try { return JSON.parse(get(pendingKey) || 'null'); } catch { return null; } }
  function savePending(score, nickname) {
    const old = readPending();
    const best = old && Number(old.score) > score ? old : {score, nickname};
    save(pendingKey, JSON.stringify(best));
  }
  function flushPending() {
    const queued = readPending();
    if (queued && navigator.onLine && !uploadInFlight) submit(Number(queued.score), queued.nickname);
  }
  async function submit(score, nicknameOverride) {
    score = Math.floor(Number(score) || 0); if (score <= 0) return;
    pending = Math.max(pending, score); save(bestKey, String(Math.max(Number(get(bestKey) || 0), score)));
    const nickname = cleanNickname(nicknameOverride || get(nicknameKey) || input.value || 'PLAYER');
    save(nicknameKey, nickname);
    savePending(score, nickname);
    if (!navigator.onLine) { if (!backdrop.hidden) status.textContent = 'Saved on this device. It will upload when Wi‑Fi returns.'; return; }
    if (uploadInFlight) return;
    uploadInFlight = true;
    try {
      const r = await fetch('/api/leaderboard', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({game, player_id:playerId, nickname, score})});
      if (!r.ok) throw new Error();
      const queued = readPending();
      if (queued && Number(queued.score) === score && queued.nickname === nickname) { try { localStorage.removeItem(pendingKey); } catch {} }
      if (!backdrop.hidden) load();
    }
    catch { if (!backdrop.hidden) status.textContent = 'Saved on this device. Public board will retry when connected.'; }
    finally {
      uploadInFlight = false;
      const queued = readPending();
      if (queued && navigator.onLine && (Number(queued.score) !== score || queued.nickname !== nickname)) setTimeout(flushPending, 250);
    }
  }
  window.addEventListener('online', flushPending);
  window.addEventListener('pageshow', flushPending);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') flushPending(); });
  // `online` can be optimistic on captive portals or flaky Wi-Fi. Keep retrying
  // the locally queued best score so it syncs as soon as the API is reachable.
  setInterval(flushPending, 15000);
  flushPending();
  function cleanNickname(value) { return String(value || 'PLAYER').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0,16) || 'PLAYER'; }
  form.addEventListener('submit', e => { e.preventDefault(); save(nicknameKey, cleanNickname(input.value)); if (pending || get(bestKey)) submit(Math.max(pending, Number(get(bestKey) || 0))); else { status.textContent = 'Finish a game to submit a score.'; load(); } });
  window.RecessLeaderboard = { gameId: game, queueScore(score) { if (Number(score) > pending) { pending = Number(score); clearTimeout(timer); timer = setTimeout(() => submit(pending), 1600); } }, submit, open };
})();
