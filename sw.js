const VERSION='recess-v21';
const PRECACHE=[
  ['/', '/index.html'],
  ['/styles.css', '/styles.css'],
  ['/audiowide.ttf', '/audiowide.ttf'],
  ['/theme.css', '/theme.css'],
  ['/app.js', '/app.js'],
  ['/economy.js', '/economy.js'],
  ['/shop', '/shop.html'],
  ['/shop.js', '/shop.js'],
  ['/game', '/game.html'],
  ['/games.js', '/games.js'],
  ['/voxel', '/voxel.html'],
  ['/voxel.js', '/voxel.js'],
  ['/football', '/football.html'],
  ['/football.js', '/football.js'],
  ['/classics', '/classics.html'],
  ['/classics.js', '/classics.js'],
  ['/manifest.webmanifest', '/manifest.webmanifest'],
  ['/og.png', '/og.png']
];
const ROUTES={
  '/':'/', '/index.html':'/',
  '/game':'/game', '/game.html':'/game',
  '/voxel':'/voxel', '/voxel.html':'/voxel',
  '/football':'/football', '/football.html':'/football',
  '/classics':'/classics', '/classics.html':'/classics',
  '/shop':'/shop', '/shop.html':'/shop'
};
const scoped=path=>new URL(path.replace(/^\//,''),self.registration.scope).href;
const localPath=pathname=>{
  const scopePath=new URL(self.registration.scope).pathname.replace(/\/$/,'');
  const local=pathname.startsWith(scopePath)?pathname.slice(scopePath.length):pathname;
  return local||'/';
};

const safeCopy=async response=>{
  if(!response.redirected)return response;
  const headers=new Headers();
  const contentType=response.headers.get('content-type');
  if(contentType)headers.set('content-type',contentType);
  return new Response(await response.blob(),{status:200,statusText:'OK',headers});
};

self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(VERSION);
  await Promise.all(PRECACHE.map(async([key,source])=>{
    const response=await fetch(scoped(source),{cache:'reload'});
    if(!response.ok)throw new Error(`Unable to cache ${source}`);
    await cache.put(scoped(key),await safeCopy(response));
  }));
  await self.skipWaiting();
})()));

self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key!==VERSION).map(key=>caches.delete(key)));
  await self.clients.claim();
})()));

const offlineDocument=async pathname=>{
  const key=ROUTES[pathname]||'/';
  return await caches.match(scoped(key))||await caches.match(scoped('/'))||new Response(
    '<!doctype html><meta charset="utf-8"><title>Recess Arcade offline</title><h1>Recess Arcade is offline</h1><p>Reconnect once so this game can be saved for offline play.</p>',
    {status:503,headers:{'content-type':'text/html; charset=utf-8'}}
  );
};

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(event.request);
        if(response.ok){
          const key=ROUTES[localPath(url.pathname)];
          if(key){
            const cache=await caches.open(VERSION);
            await cache.put(scoped(key),await safeCopy(response.clone()));
          }
        }
        return response;
      }catch(error){
        return offlineDocument(localPath(url.pathname));
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const cached=await caches.match(event.request);
    if(cached)return cached;
    try{
      const response=await fetch(event.request);
      if(response.ok&&response.type==='basic'){
        const cache=await caches.open(VERSION);
        await cache.put(event.request,response.clone());
      }
      return response;
    }catch(error){
      return new Response('',{status:503,statusText:'Offline'});
    }
  })());
});
