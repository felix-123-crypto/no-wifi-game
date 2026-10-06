const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://nowifi-game.com/</loc><priority>1.0</priority></url>
  <url><loc>https://nowifi-game.com/football</loc><priority>0.8</priority></url>
  <url><loc>https://nowifi-game.com/voxel</loc><priority>0.8</priority></url>
  <url><loc>https://nowifi-game.com/shop</loc><priority>0.6</priority></url>
  <url><loc>https://nowifi-game.com/classics</loc><priority>0.7</priority></url>
</urlset>`;
const ROBOTS_TXT = `User-agent: *\nAllow: /\n\nSitemap: https://nowifi-game.com/sitemap.xml\n`;
const GAMES = new Set(['pacman','dino','gd','football','voxel','parkour','2048','tetris','snake','blocks']);
const headers = {'content-type':'application/json; charset=UTF-8','cache-control':'no-store','access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type'};
const json = (data, status=200) => new Response(JSON.stringify(data), {status, headers});
const cleanName = value => String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0,16);
const validGame = game => GAMES.has(String(game || '').toLowerCase());

async function leaderboard(request, env, url) {
  if (request.method === 'OPTIONS') return new Response(null, {status:204, headers});
  if (!env.DB) return json({error:'Leaderboard database binding is unavailable.'},503);
  const game = String(url.searchParams.get('game') || '').toLowerCase();
  if (!validGame(game)) return json({error:'Unknown game.'},400);
  try {
    if (request.method === 'GET') {
      const playerId = String(url.searchParams.get('player_id') || '').slice(0,80);
      const top = await env.DB.prepare('SELECT nickname, score, updated_at FROM leaderboard WHERE game = ? ORDER BY score DESC, updated_at ASC LIMIT 100').bind(game).all();
      const own = playerId ? await env.DB.prepare('SELECT nickname, score, updated_at FROM leaderboard WHERE game = ? AND player_id = ?').bind(game, playerId).first() : null;
      let rank = null;
      if (own) { const r = await env.DB.prepare('SELECT COUNT(*) AS rank FROM leaderboard WHERE game = ? AND (score > ? OR (score = ? AND updated_at < ?))').bind(game, own.score, own.score, own.updated_at).first(); rank = Number(r?.rank || 0) + 1; }
      return json({game, rows: top.results || [], own, rank});
    }
    if (request.method !== 'POST') return json({error:'Method not allowed.'},405);
    const body = await request.json();
    const playerId = String(body.player_id || '').trim().slice(0,80);
    const nickname = cleanName(body.nickname);
    const score = Number(body.score);
    if (playerId.length < 8 || nickname.length < 1 || !Number.isSafeInteger(score) || score < 0 || score > 2147483647) return json({error:'Enter a nickname and a valid score.'},400);
    await env.DB.prepare(`INSERT INTO leaderboard(game, player_id, nickname, score, updated_at) VALUES(?,?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(game, player_id) DO UPDATE SET nickname=excluded.nickname,
      score=CASE WHEN excluded.score > leaderboard.score THEN excluded.score ELSE leaderboard.score END,
      updated_at=CASE WHEN excluded.score > leaderboard.score THEN CURRENT_TIMESTAMP ELSE leaderboard.updated_at END`).bind(game, playerId, nickname, score).run();
    return json({ok:true});
  } catch (error) { console.error('leaderboard', error); return json({error:'Leaderboard temporarily unavailable.'},503); }
}

export default { async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname === '/api/leaderboard') return leaderboard(request, env, url);
  if (request.method === 'GET' && url.pathname.endsWith('/sitemap.xml')) return new Response(SITEMAP_XML, {headers:{'content-type':'application/xml; charset=UTF-8','cache-control':'public, max-age=3600'}});
  if (request.method === 'GET' && url.pathname.endsWith('/robots.txt')) return new Response(ROBOTS_TXT, {headers:{'content-type':'text/plain; charset=UTF-8','cache-control':'public, max-age=3600'}});
  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404 || request.method !== 'GET') return response;
  if (!(request.headers.get('accept') || '').includes('text/html')) return response;
  return env.ASSETS.fetch(new Request(new URL('/', request.url), request));
} };
