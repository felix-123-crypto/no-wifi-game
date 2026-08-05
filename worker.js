export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return handleApi(request, env, url);
    if (url.pathname === '/') url.pathname = '/index.html';
    const response = await env.ASSETS.fetch(new Request(url, request));
    if (response.status !== 404) return response;
    return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
  }
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const identity = request => ({
  id: request.headers.get('oai-authenticated-user-id'),
  email: request.headers.get('oai-authenticated-user-email') || ''
});
async function ensureSchema(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS game_progress (
    user_id TEXT PRIMARY KEY NOT NULL,
    user_email TEXT,
    progress_json TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
}
async function handleApi(request, env, url) {
  const user = identity(request);
  if (!user.id) return json({error:'Sign in is optional, but required for cloud sync.'}, 401);
  if (url.pathname === '/api/me' && request.method === 'GET') return json({signedIn:true,email:user.email});
  if (url.pathname !== '/api/progress') return json({error:'Not found'}, 404);
  if (!env.DB) return json({error:'Cloud saves are temporarily unavailable.'}, 503);
  await ensureSchema(env.DB);
  if (request.method === 'GET') {
    const row = await env.DB.prepare('SELECT progress_json, updated_at FROM game_progress WHERE user_id = ?').bind(user.id).first();
    let data = {}; try { data = row ? JSON.parse(row.progress_json) : {}; } catch {}
    return json({data,updatedAt:row?.updated_at || null});
  }
  if (request.method === 'POST') {
    const length = Number(request.headers.get('content-length') || 0);
    if (length > 150000) return json({error:'Save data is too large.'}, 413);
    let body; try { body = await request.json(); } catch { return json({error:'Invalid JSON.'}, 400); }
    if (!body?.data || typeof body.data !== 'object' || Array.isArray(body.data)) return json({error:'Invalid progress data.'}, 400);
    const clean = {};
    for (const [key,value] of Object.entries(body.data)) {
      if (!/^(recess[-_]|football-|fd-|arcade-)[a-z0-9_-]{1,80}$/i.test(key) || typeof value !== 'string' || value.length > 100000) continue;
      clean[key] = value;
    }
    const payload = JSON.stringify(clean);
    if (payload.length > 140000) return json({error:'Save data is too large.'}, 413);
    await env.DB.prepare(`INSERT INTO game_progress (user_id,user_email,progress_json,updated_at)
      VALUES (?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET user_email=excluded.user_email,progress_json=excluded.progress_json,updated_at=CURRENT_TIMESTAMP`)
      .bind(user.id,user.email,payload).run();
    return json({saved:true});
  }
  return json({error:'Method not allowed'}, 405);
}
