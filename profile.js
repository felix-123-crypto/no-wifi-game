(() => {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js');
  const button = document.querySelector('#account-button');
  if (!button || location.protocol === 'file:') return;
  const prefixes = ['recess-', 'recess_', 'football-', 'fd-', 'arcade-'];
  let signedIn = false;
  let timer;
  const collect = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (prefixes.some(prefix => key.startsWith(prefix)) && key !== 'recess-cloud-cache') data[key] = localStorage.getItem(key);
    }
    return data;
  };
  const save = async () => {
    if (!signedIn || !navigator.onLine) return;
    button.classList.add('is-saving');
    try {
      await fetch('/api/progress', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({data:collect()})});
      button.title = 'Progress synced just now';
    } catch {} finally { button.classList.remove('is-saving'); }
  };
  const start = async () => {
    try {
      const me = await fetch('/api/me', {headers:{accept:'application/json'}});
      if (!me.ok) return;
      const profile = await me.json();
      signedIn = true;
      button.classList.add('is-signed-in');
      button.textContent = `SYNC ON · ${String(profile.email || 'PLAYER').split('@')[0].slice(0,14).toUpperCase()}`;
      button.href = `/signout-with-chatgpt?return_to=${encodeURIComponent(location.pathname + location.search)}`;
      button.title = 'Signed in—click to sign out';
      const progress = await fetch('/api/progress', {headers:{accept:'application/json'}});
      if (progress.ok) {
        const remote = await progress.json();
        if (remote.data && Object.keys(remote.data).length) {
          let changed = false;
          Object.entries(remote.data).forEach(([key,value]) => { if (localStorage.getItem(key) !== value) changed = true; localStorage.setItem(key, value); });
          dispatchEvent(new CustomEvent('recess-cloud-loaded'));
          if (changed && !sessionStorage.getItem('recess-cloud-applied')) { sessionStorage.setItem('recess-cloud-applied','1'); location.reload(); }
        } else await save();
      }
      timer = setInterval(save, 8000);
    } catch {}
  };
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
  addEventListener('online', save);
  addEventListener('beforeunload', () => { clearInterval(timer); save(); });
  window.RecessCloud = { save, collect };
  start();
})();
