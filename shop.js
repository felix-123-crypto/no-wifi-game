(() => {
  const button = document.querySelector('#retro-buy');
  const message = document.querySelector('#shop-message');
  const api = window.RecessPoints;
  function render() {
    const owned = api.ownsRetro(), active = api.retroActive();
    button.disabled = !owned && api.balance() < api.retroCost;
    button.classList.toggle('equipped', active);
    button.textContent = active ? 'EQUIPPED · SWITCH TO ORIGINAL' : owned ? 'OWNED · EQUIP THEME' : `BUY FOR ${api.retroCost} POINTS`;
  }
  button.addEventListener('click', () => {
    message.className = 'shop-message';
    if (!api.ownsRetro()) {
      if (!api.buyRetro()) { message.textContent = `You need ${(api.retroCost-api.balance()).toLocaleString()} more points.`; message.classList.add('error'); return; }
      api.setRetro(true); message.textContent = 'Super Retro unlocked and equipped!'; message.classList.add('success');
    } else {
      api.setRetro(!api.retroActive()); message.textContent = api.retroActive() ? 'Super Retro equipped.' : 'Original style restored.'; message.classList.add('success');
    }
    render();
  });
  addEventListener('recess-points-changed', render); addEventListener('recess-shop-changed', render); addEventListener('recess-theme-changed', render); render();
})();
