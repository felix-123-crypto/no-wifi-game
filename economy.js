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
    const wallet = document.createElement('a'); wallet.href = 'shop.html'; wallet.className = 'points-wallet'; wallet.dataset.pointsWallet = 'true'; wallet.setAttribute('aria-label','Open arcade points shop');
    wallet.innerHTML = `<span aria-hidden="true">★</span><b data-arcade-points>${balance().toLocaleString()}</b><em>PTS · SHOP</em>`;
    host.append(wallet);
  };
  const registerOfflineWorker = () => {
    if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;
    navigator.serviceWorker.register('sw.js', {scope:'./',updateViaCache:'none'})
      .then(registration => registration.update())
      .catch(() => {});
  };
  const boot = () => { addThemeStyles(); document.body.classList.toggle('retro-theme', retroActive()); addWallet(); updateUI(); };
  window.RecessPoints = { balance, award, spend, ownsRetro, buyRetro, buyItem, ownsItem, itemCount, retroActive, setRetro, retroCost:RETRO_COST, shopItems:SHOP_ITEMS, keys:{BALANCE_KEY,RETRO_OWNED_KEY,THEME_KEY} };
  addEventListener('storage', event => { if ([BALANCE_KEY,RETRO_OWNED_KEY,THEME_KEY].includes(event.key)) boot(); });
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', boot, {once:true}) : boot();
  registerOfflineWorker();
})();
