const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://nowifi-game.com/</loc><lastmod>2026-09-21</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://nowifi-game.com/football</loc><lastmod>2026-09-21</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nowifi-game.com/voxel</loc><lastmod>2026-09-21</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nowifi-game.com/shop</loc><lastmod>2026-09-21</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://nowifi-game.com/classics?game=2048</loc><lastmod>2026-09-21</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://nowifi-game.com/classics?game=tetris</loc><lastmod>2026-09-21</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://nowifi-game.com/classics?game=snake</loc><lastmod>2026-09-21</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://nowifi-game.com/game?game=pacman</loc><lastmod>2026-09-21</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://nowifi-game.com/game?game=dino</loc><lastmod>2026-09-21</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://nowifi-game.com/game?game=gd</loc><lastmod>2026-09-21</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>`;
const ROBOTS_TXT = `User-agent: *\nAllow: /\n\nSitemap: https://nowifi-game.com/sitemap.xml\n`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname.endsWith('/sitemap.xml')) {
      return new Response(SITEMAP_XML, { headers: { 'content-type': 'application/xml; charset=UTF-8', 'cache-control': 'public, max-age=3600' } });
    }
    if (request.method === 'GET' && url.pathname.endsWith('/robots.txt')) {
      return new Response(ROBOTS_TXT, { headers: { 'content-type': 'text/plain; charset=UTF-8', 'cache-control': 'public, max-age=3600' } });
    }
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== 'GET') return response;
    const acceptsHtml = (request.headers.get('accept') || '').includes('text/html');
    if (!acceptsHtml) return response;
    return env.ASSETS.fetch(new Request(new URL('/', request.url), request));
  }
};
