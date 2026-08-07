(() => {
  'use strict';
  const BALANCE_KEY = 'recess-local-points-v1';
  const RETRO_OWNED_KEY = 'recess-shop-retro-owned-v1';
  const THEME_KEY = 'recess-theme-local-v1';
  const RETRO_COST = 500;
  const readNumber = key => Math.max(0, Math.floor(Number(localStorage.getItem(key)) || 0));
  const balance = () => readNumber(BALANCE_KEY);
  const updateUI = () => {
    document.querySelectorAll('[data-arcade-points]').forEach(el => el.textContent = balance().toLocaleString());
    dispatchEvent(new CustomEvent('recess-points-changed', {detail:{balance:balance()}}));
  };
  let toastTimer = 0;
  const toast = (amount, reason) => {
    if (!document.body) return;
    let el = document.querySelector('.points-toast');
    if (!el) { el = document.createElement('div'); el.className = 'points-toast'; el.setAttribute('role','status'); el.setAttribute('aria-live','polite'); document.body.append(el); }
    el.innerHTML = `<strong>+${amount} PTS</strong><span>${String(reason || 'ARCADE REWARD').toUpperCase()}</span>`;
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 1500);
  };
  const award = (amount, reason = 'Arcade reward') => {
    const value = Math.max(0, Math.floor(Number(amount) || 0));
    if (!value) return balance();
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
  window.RecessPoints = { balance, award, spend, ownsRetro, buyRetro, retroActive, setRetro, retroCost:RETRO_COST, keys:{BALANCE_KEY,RETRO_OWNED_KEY,THEME_KEY} };
  addEventListener('storage', event => { if ([BALANCE_KEY,RETRO_OWNED_KEY,THEME_KEY].includes(event.key)) boot(); });
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', boot, {once:true}) : boot();
  registerOfflineWorker();
})();
