export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/') url.pathname = '/index.html';
    const response = await env.ASSETS.fetch(new Request(url, request));
    if (response.status !== 404) return response;
    return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
  }
};
