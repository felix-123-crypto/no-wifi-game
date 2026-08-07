export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const routes = {'/':'/index.html','/game':'/game.html','/voxel':'/voxel.html','/football':'/football.html','/classics':'/classics.html','/shop':'/shop.html'};
    if (routes[url.pathname]) url.pathname = routes[url.pathname];
    const response = await env.ASSETS.fetch(new Request(url, request));
    if (response.status !== 404) return response;
    return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
  }
};
