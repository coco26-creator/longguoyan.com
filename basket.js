(function () {
  const STORAGE_KEY = 'longguoyan_basket';
  const CONTACT_URL = 'contact.html';

  function readBasket() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch (error) {
      return [];
    }
  }

  function saveBasket(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function totalItems(items) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[char]));
  }

  function getProductFromButton(button) {
    const card = button.closest('.product-card');
    return {
      id: button.dataset.productId || card?.dataset.productId || window.LongGuoYanCurrentProduct?.id || 'product',
      name: button.dataset.productName || card?.dataset.productName || window.LongGuoYanCurrentProduct?.name || 'LongGuoYan Product',
      series: button.dataset.productSeries || card?.dataset.productSeries || window.LongGuoYanCurrentProduct?.series || '',
      image: button.dataset.productImage || card?.dataset.productImage || window.LongGuoYanCurrentProduct?.image || ''
    };
  }

  function createBasketShell() {
    if (document.querySelector('[data-basket-shell]')) return;

    const shell = document.createElement('div');
    shell.setAttribute('data-basket-shell', '');
    shell.innerHTML = `
      <button class="basket-fab" type="button" data-basket-open aria-label="Open enquiry basket">
        <span class="basket-fab-icon" aria-hidden="true">🧺</span>
        <span class="basket-count" data-basket-count>0</span>
      </button>
      <div class="basket-overlay" data-basket-overlay hidden></div>
      <aside class="basket-drawer" data-basket-drawer aria-hidden="true" aria-labelledby="basket-title">
        <div class="basket-head">
          <div>
            <p class="basket-eyebrow">LongGuoYan</p>
            <h2 id="basket-title">Enquiry Basket</h2>
          </div>
          <button class="basket-close" type="button" data-basket-close aria-label="Close basket">×</button>
        </div>
        <div class="basket-items" data-basket-items></div>
        <div class="basket-footer">
          <p class="basket-note">Add products here, then send your enquiry for pricing, availability, wholesale, or partnership support.</p>
          <a class="btn-primary basket-enquire" data-basket-enquire href="contact.html">Send Basket Enquiry</a>
          <button class="btn-secondary basket-clear" type="button" data-basket-clear>Clear Basket</button>
        </div>
      </aside>
    `;
    document.body.appendChild(shell);
  }

  function setDrawer(open) {
    const drawer = document.querySelector('[data-basket-drawer]');
    const overlay = document.querySelector('[data-basket-overlay]');
    if (!drawer || !overlay) return;

    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    overlay.hidden = !open;
    document.body.classList.toggle('basket-lock', open);
  }

  function buildContactHref(items) {
    if (!items.length) return CONTACT_URL;
    const lines = items.map((item) => `${item.quantity} × ${item.name}${item.series ? ` (${item.series})` : ''}`);
    return `${CONTACT_URL}?basket=${encodeURIComponent(lines.join('\n'))}`;
  }

  function renderBasket() {
    const items = readBasket();
    const count = totalItems(items);
    document.querySelectorAll('[data-basket-count]').forEach((el) => {
      el.textContent = count;
      el.classList.toggle('has-items', count > 0);
    });

    const itemBox = document.querySelector('[data-basket-items]');
    const enquire = document.querySelector('[data-basket-enquire]');
    const clear = document.querySelector('[data-basket-clear]');
    if (!itemBox) return;

    if (!items.length) {
      itemBox.innerHTML = `
        <div class="basket-empty">
          <div class="basket-empty-icon" aria-hidden="true">🧺</div>
          <h3>Your basket is empty</h3>
          <p>Add LongGuoYan products from the collection to prepare an enquiry.</p>
        </div>
      `;
    } else {
      itemBox.innerHTML = items.map((item) => `
        <article class="basket-item" data-basket-item="${escapeHtml(item.id)}">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" />
          <div class="basket-item-body">
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.series)}</p>
            <div class="basket-qty" aria-label="Quantity controls for ${escapeHtml(item.name)}">
              <button type="button" data-basket-decrease="${escapeHtml(item.id)}" aria-label="Decrease quantity">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-basket-increase="${escapeHtml(item.id)}" aria-label="Increase quantity">+</button>
              <button type="button" class="basket-remove" data-basket-remove="${escapeHtml(item.id)}">Remove</button>
            </div>
          </div>
        </article>
      `).join('');
    }

    if (enquire) enquire.href = buildContactHref(items);
    if (clear) clear.disabled = !items.length;
  }

  function addToBasket(product) {
    const items = readBasket();
    const existing = items.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }
    saveBasket(items);
    renderBasket();
    setDrawer(true);
  }

  function updateQuantity(id, delta) {
    const items = readBasket().map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0);
    saveBasket(items);
    renderBasket();
  }

  function removeItem(id) {
    saveBasket(readBasket().filter((item) => item.id !== id));
    renderBasket();
  }

  function prefillContactForm() {
    const params = new URLSearchParams(window.location.search);
    const basketText = params.get('basket');
    const message = document.getElementById('message');
    if (!basketText || !message || message.value.trim()) return;

    message.value = `Hello LongGuoYan, I would like to enquire about the following products:

${basketText}

Please share pricing, availability, and next steps.`;
    const type = document.getElementById('type');
    if (type && !type.value) type.value = 'product';
  }

  document.addEventListener('DOMContentLoaded', () => {
    createBasketShell();
    renderBasket();
    prefillContactForm();
  });

  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-basket-add]');
    if (addButton) {
      event.preventDefault();
      event.stopPropagation();
      addToBasket(getProductFromButton(addButton));
      return;
    }

    if (event.target.closest('[data-basket-open]')) {
      setDrawer(true);
      return;
    }
    if (event.target.closest('[data-basket-close]') || event.target.closest('[data-basket-overlay]')) {
      setDrawer(false);
      return;
    }

    const increase = event.target.closest('[data-basket-increase]');
    if (increase) updateQuantity(increase.dataset.basketIncrease, 1);

    const decrease = event.target.closest('[data-basket-decrease]');
    if (decrease) updateQuantity(decrease.dataset.basketDecrease, -1);

    const remove = event.target.closest('[data-basket-remove]');
    if (remove) removeItem(remove.dataset.basketRemove);

    if (event.target.closest('[data-basket-clear]')) {
      saveBasket([]);
      renderBasket();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setDrawer(false);
  });

  window.LongGuoYanBasket = { addToBasket, renderBasket };
}());
