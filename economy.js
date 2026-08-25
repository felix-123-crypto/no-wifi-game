(() => {
  'use strict';
  const BALANCE_KEY = 'recess-local-points-v1';
  const RETRO_OWNED_KEY = 'recess-shop-retro-owned-v1';
  const THEME_KEY = 'recess-theme-local-v1';
  const RETRO_COST = 500;
  const SHOP_ITEMS = {
    doublePoints:{cost:750,type:'powerup',label:'2X POINTS CHARM'},
    staminaBoost:{cost:600,type:'powerup',label:'STAMINA BOOST'},
    speedster:{cost:900,type:'player',label:'SPEEDSTER PLAYER'},
    playmaker:{cost:900,type:'player',label:'PLAYMAKER PLAYER'},
    footballCoins:{cost:400,type:'currency',label:'1,000 CLUB COINS',repeatable:true,grant:{coins:1000}},
    upgradeTokens:{cost:650,type:'currency',label:'5 SPECIAL UPGRADE TOKENS',repeatable:true,grant:{upgradeTokens:5}}
  };
  const itemKey = key => `recess-shop-item-${key}`;
  const itemCount = key => Math.max(0, Math.floor(Number(localStorage.getItem(itemKey(key))) || 0));
  const ownsItem = key => itemCount(key) > 0;
  const readNumber = key => Math.max(0, Math.floor(Number(localStorage.getItem(key)) || 0));
  const balance = () => readNumber(BALANCE_KEY);
  const updateUI = () => {
    document.querySelectorAll('[data-arcade-points]').forEach(el => el.textContent = balance().toLocaleString());
    dispatchEvent(new CustomEvent('recess-points-changed', {detail:{balance:balance()}}));
  };
  let toastTimer = 0;
  let toastBatchAt = 0;
  let toastBatchTotal = 0;
  let toastBatchReasons = [];
  const toast = (amount, reason) => {
    if (!document.body) return;
    let el = document.querySelector('.points-toast');
    if (!el) { el = document.createElement('div'); el.className = 'points-toast'; el.setAttribute('role','status'); el.setAttribute('aria-live','polite'); document.body.append(el); }
    const now = Date.now();
    if (now - toastBatchAt > 450) { toastBatchTotal = 0; toastBatchReasons = []; }
    toastBatchAt = now;
    toastBatchTotal += amount;
    const label = String(reason || 'ARCADE REWARD').toUpperCase();
    if (label && !toastBatchReasons.includes(label)) toastBatchReasons.push(label);
    const reasonLabel = toastBatchReasons.length > 1 ? 'MULTIPLE ARCADE REWARDS' : (toastBatchReasons[0] || 'ARCADE REWARD');
    el.innerHTML = `<strong>+${toastBatchTotal} PTS</strong><span>${reasonLabel}</span>`;
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.classList.remove('show'); toastBatchTotal = 0; toastBatchReasons = []; }, 1500);
  };
  const award = (amount, reason = 'Arcade reward') => {
    let value = Math.max(0, Math.floor(Number(amount) || 0));
    if (!value) return balance();
    if (ownsItem('doublePoints')) value *= 2;
    const next = balance() + value;
    localStorage.setItem(BALANCE_KEY, String(next));
    updateUI(); toast(value, reason);
    return next;
  };
  const spend = amount => {
    const value = Math.max(0, Math.floor(Number(amount) || 0));
    if (!value || balance() < value) return false;
    localStorage.setItem(BALANCE_KEY, String(balance() - value)); updateUI(); return true;
  };
  const ownsRetro = () => localStorage.getItem(RETRO_OWNED_KEY) === '1';
  const buyRetro = () => {
    if (ownsRetro()) return true;
    if (!spend(RETRO_COST)) return false;
    localStorage.setItem(RETRO_OWNED_KEY, '1');
    dispatchEvent(new CustomEvent('recess-shop-changed'));
    return true;
  };
  const buyItem = key => {
    const item = SHOP_ITEMS[key];
    if (!item) return false;
    if (!item.repeatable && ownsItem(key)) return true;
    if (!spend(item.cost)) return false;
    if (item.grant?.coins) {
      try {
        const football = JSON.parse(localStorage.getItem('recess-football-career-v1') || '{}');
        football.version = 1;
        football.coins = Math.max(0, Math.floor(Number(football.coins) || 0)) + item.grant.coins;
        localStorage.setItem('recess-football-career-v1', JSON.stringify(football));
      } catch (error) { /* Football will migrate the wallet on its next boot. */ }
    }
    if (item.grant?.upgradeTokens) {
      try {
        const football = JSON.parse(localStorage.getItem('recess-football-career-v1') || '{}');
        football.version = 1;
        const current = Math.max(0, Math.floor(Number(football.upgradeTokens ?? football.tokens) || 0));
        football.upgradeTokens = current + item.grant.upgradeTokens;
        football.tokens = football.upgradeTokens;
        localStorage.setItem('recess-football-career-v1', JSON.stringify(football));
      } catch (error) { /* Football will migrate the wallet on its next boot. */ }
    }
    localStorage.setItem(itemKey(key), String(item.repeatable ? itemCount(key) + 1 : 1));
    dispatchEvent(new CustomEvent('recess-shop-changed', {detail:{item:key}}));
    return true;
  };
  const retroActive = () => ownsRetro() && localStorage.getItem(THEME_KEY) === 'retro';
  const setRetro = active => {
    if (active && !ownsRetro()) return false;
    localStorage.setItem(THEME_KEY, active ? 'retro' : 'default');
    document.body?.classList.toggle('retro-theme', Boolean(active));
    dispatchEvent(new CustomEvent('recess-theme-changed', {detail:{theme:active?'retro':'default'}}));
    return true;
  };
  const addThemeStyles = () => {
    if (document.querySelector('link[data-retro-styles]')) return;
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'theme.css'; link.dataset.retroStyles = 'true'; document.head.append(link);
  };
  const addWallet = () => {
    if (document.querySelector('[data-points-wallet]')) return;
    const host = document.querySelector('.top-actions') || document.querySelector('.fz-wallet') || document.querySelector('.topbar');
    if (!host) return;
    const wallet = document.createElement('a'); wallet.href = '/shop'; wallet.className = 'points-wallet'; wallet.dataset.pointsWallet = 'true'; wallet.setAttribute('aria-label','Open arcade points shop');
    wallet.innerHTML = `<span aria-hidden="true">★</span><b data-arcade-points>${balance().toLocaleString()}</b><em>PTS · SHOP</em>`;
    host.append(wallet);
  };
  const registerOfflineWorker = () => {
    if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;
    navigator.serviceWorker.register('/sw.js', {updateViaCache:'none'})
      .then(registration => registration.update())
      .catch(() => {});
  };
  const boot = () => { addThemeStyles(); document.body.classList.toggle('retro-theme', retroActive()); addWallet(); updateUI(); };
  window.RecessPoints = { balance, award, spend, ownsRetro, buyRetro, buyItem, ownsItem, itemCount, retroActive, setRetro, retroCost:RETRO_COST, shopItems:SHOP_ITEMS, keys:{BALANCE_KEY,RETRO_OWNED_KEY,THEME_KEY} };
  addEventListener('storage', event => { if ([BALANCE_KEY,RETRO_OWNED_KEY,THEME_KEY].includes(event.key)) boot(); });
  addEventListener('recess-sync-applied', boot);
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', boot, {once:true}) : boot();
  registerOfflineWorker();
})();

(() => {
  'use strict';
  const CODE_KEY = 'recess-sync-code-v1';
  const META_KEY = 'recess-sync-meta-v1';
  const DEVICE_KEY = 'recess-sync-device-v1';
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let revision = 0, dirty = false, syncing = false, timer = 0, lastValues = {};
  const syncable = key => key.startsWith('recess-') && ![CODE_KEY,META_KEY,DEVICE_KEY].includes(key);
  const code = () => (localStorage.getItem(CODE_KEY) || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const meta = () => { try { return JSON.parse(localStorage.getItem(META_KEY) || '{}'); } catch { return {}; } };
  const values = () => Object.fromEntries(Object.keys(localStorage).filter(syncable).map(key => [key, localStorage.getItem(key)]));
  const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
  const markChanges = () => {
    const current = values();
    if (same(current,lastValues)) return false;
    const times = meta(), now = Date.now();
    new Set([...Object.keys(current),...Object.keys(lastValues)]).forEach(key => {
      if (current[key] !== lastValues[key]) times[key] = now;
    });
    localStorage.setItem(META_KEY, JSON.stringify(times));
    lastValues = current; dirty = true; setStatus('Waiting to sync…'); return true;
  };
  const payload = () => ({values:values(),times:meta()});
  const apply = remote => {
    const incoming = remote?.values || {}, before = values();
    Object.keys(before).filter(key => !(key in incoming)).forEach(key => localStorage.removeItem(key));
    Object.entries(incoming).forEach(([key,value]) => { if (syncable(key)) localStorage.setItem(key,String(value)); });
    localStorage.setItem(META_KEY, JSON.stringify(remote?.times || {}));
    lastValues = values(); dirty = false;
    dispatchEvent(new CustomEvent('recess-sync-applied'));
  };
  const merge = (local,remote) => {
    const out={values:{},times:{}}, keys=new Set([...Object.keys(local.values||{}),...Object.keys(remote.values||{}),...Object.keys(local.times||{}),...Object.keys(remote.times||{})]);
    keys.forEach(key => { const lt=local.times?.[key]||0, rt=remote.times?.[key]||0, useLocal=lt>=rt; const source=useLocal?local:remote; out.times[key]=Math.max(lt,rt); if (key in (source.values||{})) out.values[key]=source.values[key]; });
    return out;
  };
  const request = async (method, body) => fetch('/api/sync',{method,headers:{'content-type':'application/json','x-sync-code':code()},body:body?JSON.stringify(body):undefined,cache:'no-store'});
  async function push(data=payload()) {
    const response=await request('PUT',{payload:data,baseRevision:revision});
    const result=await response.json();
    if(response.status===409){const combined=merge(data,result.payload);revision=result.revision;apply(combined);dirty=true;return push(combined)}
    if(!response.ok)throw new Error(result.error||'Sync failed');
    revision=result.revision;dirty=false;lastValues=values();setStatus('Synced now');
  }
  async function pull(first=false) {
    if(!code()||syncing||!navigator.onLine)return;
    syncing=true;
    try{
      if(!first)markChanges();
      if(dirty){await push();return}
      const response=await request('GET'),result=await response.json();
      if(response.status===404){await push();return}
      if(!response.ok)throw new Error(result.error||'Sync failed');
      if(result.revision!==revision){revision=result.revision;apply(result.payload)}
      setStatus('Synced now');
    }catch(error){setStatus('Offline · will retry',true)}finally{syncing=false}
  }
  async function connect(nextCode) {
    localStorage.setItem(CODE_KEY,nextCode);revision=0;dirty=false;lastValues=values();setStatus('Connecting…');
    try{
      const response=await request('GET'),result=await response.json();
      if(response.status===404){dirty=true;await push()}
      else if(response.ok){revision=result.revision;apply(result.payload);setStatus('Synced now')}
      else throw new Error(result.error||'Could not connect');
      closeDialog();renderButton();
    }catch(error){setStatus(error.message||'Could not connect',true)}
  }
  const generate = () => { const bytes=crypto.getRandomValues(new Uint8Array(12)); return [...bytes].map(value=>alphabet[value%alphabet.length]).join('').replace(/(.{4})(?=.)/g,'$1-'); };
  const setStatus = (message,error=false) => { const el=document.querySelector('#sync-status');if(el){el.textContent=message;el.classList.toggle('error',error)} const badge=document.querySelector('#sync-button small');if(badge)badge.textContent=code()?(error?'RETRY':'ON'):'OFF'; };
  const closeDialog = () => document.querySelector('#sync-dialog')?.classList.remove('open');
  const renderButton = () => { const button=document.querySelector('#sync-button');if(button)button.innerHTML=`☁ SYNC <small>${code()?'ON':'OFF'}</small>`; };
  function addUI(){
    if(document.querySelector('#sync-button'))return;
    const style=document.createElement('style');style.textContent='.sync-button{position:fixed;right:14px;bottom:14px;z-index:9998;border:3px solid #14213d;background:#00c896;color:#14213d;padding:10px 13px;font:900 11px Arial;box-shadow:4px 4px 0 #14213d;cursor:pointer}.sync-button small{margin-left:5px}.sync-dialog{display:none;position:fixed;inset:0;z-index:9999;background:#14213dcc;place-items:center;padding:20px}.sync-dialog.open{display:grid}.sync-card{width:min(430px,100%);background:#f7f2e8;border:4px solid #14213d;box-shadow:10px 10px 0 #ffcf33;padding:24px;color:#14213d}.sync-card h2{margin:0 0 8px;font:900 28px Arial}.sync-card p{font:15px/1.45 Georgia,serif}.sync-card input{box-sizing:border-box;width:100%;border:3px solid #14213d;padding:13px;text-transform:uppercase;font:900 18px monospace;letter-spacing:2px}.sync-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:12px}.sync-actions button{border:2px solid #14213d;background:#ffcf33;padding:10px;font:900 11px Arial;cursor:pointer}.sync-actions .danger{background:#ff6b61}.sync-status{min-height:18px;font:900 11px Arial!important}.sync-status.error{color:#b42318}';document.head.append(style);
    document.body.insertAdjacentHTML('beforeend','<button class="sync-button" id="sync-button" type="button"></button><div class="sync-dialog" id="sync-dialog" role="dialog" aria-modal="true" aria-labelledby="sync-title"><div class="sync-card"><h2 id="sync-title">Browser Sync</h2><p>Use the same private code in every browser. Anyone with this code can access your game progress, so keep it private.</p><input id="sync-code" maxlength="26" autocomplete="off" placeholder="ENTER SYNC CODE"><div class="sync-actions"><button id="sync-connect" type="button">CONNECT</button><button id="sync-create" type="button">CREATE NEW CODE</button><button id="sync-disconnect" class="danger" type="button">DISCONNECT</button><button id="sync-close" type="button">CLOSE</button></div><p class="sync-status" id="sync-status"></p></div></div>');
    renderButton();document.querySelector('#sync-button').onclick=()=>{document.querySelector('#sync-code').value=code().replace(/(.{4})(?=.)/g,'$1-');document.querySelector('#sync-dialog').classList.add('open');setStatus(code()?'Connected. Use this code in your other browsers.':'Not connected yet.')};
    document.querySelector('#sync-close').onclick=closeDialog;
    document.querySelector('#sync-connect').onclick=()=>{const next=document.querySelector('#sync-code').value.toUpperCase().replace(/[^A-Z0-9]/g,'');if(next.length<10){setStatus('Enter at least 10 letters or numbers.',true);return}connect(next)};
    document.querySelector('#sync-create').onclick=()=>{const next=generate();document.querySelector('#sync-code').value=next;connect(next.replace(/-/g,''))};
    document.querySelector('#sync-disconnect').onclick=()=>{localStorage.removeItem(CODE_KEY);revision=0;dirty=false;closeDialog();renderButton()};
  }
  function boot(){addUI();lastValues=values();if(!localStorage.getItem(DEVICE_KEY))localStorage.setItem(DEVICE_KEY,crypto.randomUUID?.()||String(Math.random()));if(code())pull(true);clearInterval(timer);timer=setInterval(()=>pull(false),4000)}
  addEventListener('online',()=>pull(false));addEventListener('focus',()=>pull(false));document.readyState==='loading'?addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();
