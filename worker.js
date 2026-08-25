export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/sync') return handleSync(request, env);
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== 'GET') return response;
    const acceptsHtml = (request.headers.get('accept') || '').includes('text/html');
    if (!acceptsHtml) return response;
    return env.ASSETS.fetch(new Request(new URL('/', request.url), request));
  }
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
});

async function codeHash(code) {
  const bytes = new TextEncoder().encode(code);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
}

async function handleSync(request, env) {
  if (!env.DB) return json({error:'Sync storage is unavailable.'}, 503);
  const code = (request.headers.get('x-sync-code') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length < 10 || code.length > 24) return json({error:'Invalid sync code.'}, 400);
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS sync_profiles (
    code_hash TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    revision INTEGER NOT NULL DEFAULT 1,
    updated_at INTEGER NOT NULL
  )`).run();
  const hash = await codeHash(code);
  if (request.method === 'GET') {
    const row = await env.DB.prepare('SELECT payload, revision, updated_at FROM sync_profiles WHERE code_hash = ?').bind(hash).first();
    return row ? json({payload:JSON.parse(row.payload), revision:row.revision, updatedAt:row.updated_at}) : json({missing:true}, 404);
  }
  if (request.method !== 'PUT') return json({error:'Method not allowed.'}, 405);
  let body;
  try { body = await request.json(); } catch { return json({error:'Invalid data.'}, 400); }
  const encoded = JSON.stringify(body.payload || {});
  if (encoded.length > 200000) return json({error:'Save data is too large.'}, 413);
  const current = await env.DB.prepare('SELECT payload, revision, updated_at FROM sync_profiles WHERE code_hash = ?').bind(hash).first();
  const baseRevision = Math.max(0, Number(body.baseRevision) || 0);
  if (current && current.revision !== baseRevision) {
    return json({conflict:true,payload:JSON.parse(current.payload),revision:current.revision,updatedAt:current.updated_at}, 409);
  }
  const revision = current ? current.revision + 1 : 1;
  const now = Date.now();
  await env.DB.prepare(`INSERT INTO sync_profiles (code_hash, payload, revision, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(code_hash) DO UPDATE SET payload=excluded.payload, revision=excluded.revision, updated_at=excluded.updated_at`)
    .bind(hash, encoded, revision, now).run();
  return json({ok:true, revision, updatedAt:now});
}
