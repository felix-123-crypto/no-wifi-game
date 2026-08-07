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
  function renderItems() {
    document.querySelectorAll('.shop-item-buy').forEach(itemButton => {
      const key = itemButton.dataset.shopItem, item = api.shopItems?.[key], ownedItem = api.ownsItem?.(key);
      if (!item) return;
      itemButton.disabled = (!item.repeatable && Boolean(ownedItem)) || api.balance() < item.cost;
      itemButton.classList.toggle('owned', Boolean(ownedItem));
      if (item.repeatable) queueMicrotask(() => { itemButton.textContent = `${ownedItem ? 'BUY AGAIN' : 'BUY'} FOR ${item.cost} POINTS`; });
      itemButton.textContent = ownedItem ? 'OWNED · ACTIVE' : `BUY FOR ${item.cost} POINTS`;
    });
  }
  document.querySelectorAll('.shop-item-buy').forEach(itemButton => itemButton.addEventListener('click', () => {
    const key = itemButton.dataset.shopItem, item = api.shopItems?.[key];
    if (!item) return;
    message.className = 'shop-message';
    if (api.buyItem?.(key)) {
      message.textContent = `${item.label} added to your club wallet!`; message.classList.add('success');
    } else {
      message.textContent = `You need ${(item.cost-api.balance()).toLocaleString()} more points.`; message.classList.add('error');
    }
    renderItems();
  }));
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
  addEventListener('recess-points-changed', () => { render(); renderItems(); }); addEventListener('recess-shop-changed', () => { render(); renderItems(); }); addEventListener('recess-theme-changed', render); render(); renderItems();
})();
