document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_PRODUCT_ID = 'cellar-supreme-30';

  function safeProductId(id) {
    return id && productsData[id] ? id : DEFAULT_PRODUCT_ID;
  }

  function currentProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return safeProductId(params.get('id'));
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

  function textName(product) {
    return product.nameHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '');
  }

  function syncBasketProduct(product) {
    window.LongGuoYanCurrentProduct = {
      id: product.id,
      name: product.nameEn,
      series: product.series,
      image: product.images[0] || ''
    };

    const basketButton = document.querySelector('.pd-btn-basket');
    if (basketButton) {
      basketButton.dataset.productId = product.id;
      basketButton.dataset.productName = product.nameEn;
      basketButton.dataset.productSeries = product.series;
      basketButton.dataset.productImage = product.images[0] || '';
    }
  }

  function observeRevealElements(scope = document) {
    if (window.revealObserver) {
      scope.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));
    }
  }

  function renderProductSwitcher(activeId) {
    const section = document.querySelector('.pd-section .container');
    const top = document.querySelector('.pd-top');
    if (!section || !top) return;

    let switcher = document.querySelector('.pd-product-switcher');
    if (!switcher) {
      switcher = document.createElement('section');
      switcher.className = 'pd-product-switcher reveal';
      switcher.setAttribute('aria-labelledby', 'pd-product-switcher-title');
      top.insertAdjacentElement('afterend', switcher);
    }

    switcher.innerHTML = `
      <div class="pd-switcher-head">
        <span class="section-en">Choose a Bottle</span>
        <h2 id="pd-product-switcher-title">Explore Every LongGuoYan Expression</h2>
        <p>Click a bottle below to update the full detail page, gallery, tasting notes, craftsmanship, and basket item.</p>
      </div>
      <div class="pd-switcher-grid" role="list">
        ${Object.keys(productsData).map((key) => {
          const item = productsData[key];
          const active = item.id === activeId;
          return `
            <button class="pd-switcher-card ${active ? 'active' : ''}" type="button" data-product-switch="${escapeHtml(item.id)}" role="listitem" aria-pressed="${active}">
              <img src="${escapeHtml(item.images[0])}" alt="${escapeHtml(item.nameEn)}" loading="lazy" />
              <span class="pd-switcher-series">${escapeHtml(item.series)}</span>
              <strong>${escapeHtml(textName(item))}</strong>
            </button>
          `;
        }).join('')}
      </div>
    `;
    observeRevealElements(switcher);
  }

  function renderGallery(product) {
    const mainImgElem = document.getElementById('mainProductImg');
    if (!mainImgElem || !product.images.length) return;

    mainImgElem.src = product.images[0];
    mainImgElem.alt = product.nameEn;

    const thumbsContainer = document.querySelector('.pd-thumbs');
    if (!thumbsContainer) return;

    thumbsContainer.innerHTML = product.images.map((imgSrc, idx) => `
      <button class="pd-thumb ${idx === 0 ? 'active' : ''}" aria-label="View image ${idx + 1}" data-src="${escapeHtml(imgSrc)}">
        <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(product.badge)} view ${idx + 1}" loading="lazy" />
      </button>
    `).join('');

    thumbsContainer.querySelectorAll('.pd-thumb').forEach(btn => {
      btn.addEventListener('click', function() {
        thumbsContainer.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const newSrc = this.getAttribute('data-src');
        if (newSrc) {
          mainImgElem.style.opacity = '0';
          setTimeout(() => {
            mainImgElem.src = newSrc;
            mainImgElem.style.opacity = '1';
          }, 300);
        }
      });
    });
  }

  function renderSpecs(product) {
    const specsContainer = document.querySelector('.pd-specs');
    if (!specsContainer) return;

    specsContainer.innerHTML = `
      <div class="pd-spec"><span class="pd-spec-label">Aroma Type</span><span class="pd-spec-value">${escapeHtml(product.specs.aroma)}</span></div>
      <div class="pd-spec"><span class="pd-spec-label">Ageing</span><span class="pd-spec-value">${escapeHtml(product.specs.ageing)}</span></div>
      <div class="pd-spec"><span class="pd-spec-label">Alcohol</span><span class="pd-spec-value">${escapeHtml(product.specs.alcohol)}</span></div>
      <div class="pd-spec"><span class="pd-spec-label">Origin</span><span class="pd-spec-value">${escapeHtml(product.specs.origin)}</span></div>
      <div class="pd-spec"><span class="pd-spec-label">Volume</span><span class="pd-spec-value">${escapeHtml(product.specs.volume)}</span></div>
      <div class="pd-spec"><span class="pd-spec-label">Series</span><span class="pd-spec-value">${escapeHtml(product.specs.collection)}</span></div>
    `;
  }

  function renderTabs(product) {
    const descTab = document.querySelector('#tab-desc .pd-tab-content');
    if (descTab) {
      descTab.innerHTML = `
        ${product.descHTML}
        <div class="pd-highlights">
          ${product.highlights.map(h => `
            <div class="pd-highlight">
              <div class="pd-hl-num">${escapeHtml(h.num)}</div>
              <div class="pd-hl-label">${escapeHtml(h.label)}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    const tastingTab = document.querySelector('#tab-tasting .pd-tab-content');
    if (tastingTab) {
      tastingTab.innerHTML = `
        <h4>Tasting Profile</h4>
        <div class="tasting-notes">
          ${product.tastingNotes.map(n => `
            <div class="tasting-row">
              <span class="tasting-label">${escapeHtml(n.label)}</span>
              <span class="tasting-value">${escapeHtml(n.value)}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    const craftTab = document.querySelector('#tab-craft .pd-tab-content');
    if (craftTab) {
      craftTab.innerHTML = `
        <h4>The Craft Behind the Spirit</h4>
        <div class="craft-steps">
          ${product.craftSteps.map(c => `
            <div class="craft-step">
              <div class="craft-num">${escapeHtml(c.num)}</div>
              <div class="craft-body">
                <strong>${escapeHtml(c.title)}</strong>
                <p>${escapeHtml(c.desc)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    const pairingTab = document.querySelector('#tab-pairing .pd-tab-content');
    if (pairingTab) {
      pairingTab.innerHTML = `
        <h4>Food Pairing Guide</h4>
        ${product.pairingHTML}
      `;
    }
  }

  function renderRelatedProducts(product) {
    const relatedGrid = document.querySelector('.pd-related .products-grid');
    if (!relatedGrid) return;

    const relatedKeys = Object.keys(productsData).filter(k => k !== product.id).slice(0, 3);
    relatedGrid.innerHTML = relatedKeys.map((key, index) => {
      const rel = productsData[key];
      const delayClass = index === 1 ? 'rd1' : (index === 2 ? 'rd2' : '');
      return `
        <article onclick="location.href='product-detail.html?id=${escapeHtml(rel.id)}'" class="product-card reveal ${delayClass} cursor-pointer">
          <div class="product-img">
            <img src="${escapeHtml(rel.images[0])}" alt="${escapeHtml(rel.nameEn)}" loading="lazy" />
            <div class="product-tag">${escapeHtml(rel.badge)}</div>
          </div>
          <div class="product-info">
            <div class="product-series">${escapeHtml(rel.series)}</div>
            <h3 class="product-name">${escapeHtml(textName(rel))}</h3>
            <p class="product-desc" style="-webkit-line-clamp: 2; line-clamp: 2">${escapeHtml(rel.tagline.replace(/"/g, ''))}</p>
            <div class="product-card-actions">
              <a href="product-detail.html?id=${escapeHtml(rel.id)}" class="product-link">Discover →</a>
              <button type="button" class="product-basket-btn" data-basket-add data-product-id="${escapeHtml(rel.id)}" data-product-name="${escapeHtml(rel.nameEn)}" data-product-series="${escapeHtml(rel.series)}" data-product-image="${escapeHtml(rel.images[0])}">Add to Basket</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
    observeRevealElements(relatedGrid);
  }

  function loadProduct(productId, updateUrl = false) {
    const id = safeProductId(productId);
    const product = productsData[id];

    syncBasketProduct(product);
    document.title = `${product.nameEn} | LongGuoYan Distillery`;

    document.querySelector('.pd-series').textContent = product.series;
    document.querySelector('.pd-name').innerHTML = product.nameHTML;
    document.querySelector('.pd-name-en').textContent = product.nameEn;
    document.querySelector('.pd-tagline').textContent = product.tagline;
    document.querySelector('.pd-badge').textContent = product.badge;

    renderGallery(product);
    renderSpecs(product);
    renderTabs(product);
    renderProductSwitcher(product.id);
    renderRelatedProducts(product);

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('id', product.id);
      window.history.pushState({ productId: product.id }, '', url);
    }
  }

  document.addEventListener('click', (event) => {
    const switchButton = event.target.closest('[data-product-switch]');
    if (!switchButton) return;

    loadProduct(switchButton.dataset.productSwitch, true);
    document.querySelector('.pd-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  window.addEventListener('popstate', () => loadProduct(currentProductIdFromUrl(), false));

  loadProduct(currentProductIdFromUrl(), false);
});
