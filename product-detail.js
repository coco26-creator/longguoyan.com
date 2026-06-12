document.addEventListener('DOMContentLoaded', () => {
  // 1. Get product ID from URL or default
  const params = new URLSearchParams(window.location.search);
  let productId = params.get('id');
  
  if (!productId || !productsData[productId]) {
    productId = 'cellar-supreme-30';
  }
  
  const product = productsData[productId];
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

  // 2. Update Page Meta
  document.title = `${product.nameEn} | LongGuoYan Distillery`;

  // 3. Update Hero Section
  document.querySelector('.pd-series').textContent = product.series;
  document.querySelector('.pd-name').innerHTML = product.nameHTML;
  document.querySelector('.pd-name-en').textContent = product.nameEn;
  document.querySelector('.pd-tagline').textContent = product.tagline;
  document.querySelector('.pd-badge').textContent = product.badge;

  // 4. Update Images
  const mainImgElem = document.getElementById('mainProductImg');
  if (product.images.length > 0) {
    mainImgElem.src = product.images[0];
    mainImgElem.alt = product.nameEn;

    const thumbsContainer = document.querySelector('.pd-thumbs');
    if (!thumbsContainer) return;

    thumbsContainer.innerHTML = product.images.map((imgSrc, idx) => `
      <button class="pd-thumb ${idx === 0 ? 'active' : ''}" aria-label="View image ${idx + 1}" data-src="${escapeHtml(imgSrc)}">
        <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(product.nameEn)} view ${idx + 1}" loading="lazy" />
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

    const relatedKeys = productIds.filter(k => k !== product.id).slice(0, 3);
    relatedGrid.innerHTML = relatedKeys.map((key, index) => {
      const rel = normalizeProduct(key);
      const delayClass = index === 1 ? 'rd1' : (index === 2 ? 'rd2' : '');
      return `
        <article onclick="location.href='product-detail.html?id=${escapeHtml(rel.id)}'" class="product-card reveal ${delayClass} cursor-pointer">
          <div class="product-img">
            <img src="${escapeHtml(rel.images[0] || '')}" alt="${escapeHtml(rel.nameEn)}" loading="lazy" />
            <div class="product-tag">${escapeHtml(rel.badge)}</div>
          </div>
          <div class="product-info">
            <div class="product-series">${rel.series}</div>
            <h3 class="product-name">${rel.nameHTML.replace('<br/>', ' ')}</h3>
            <p class="product-desc" style="-webkit-line-clamp: 2; line-clamp: 2">${rel.tagline.replace(/"/g, '')}</p>
            <div class="product-card-actions">
              <a href="product-detail.html?id=${rel.id}" class="product-link">Discover →</a>
              <button type="button" class="product-basket-btn" data-basket-add data-product-id="${rel.id}" data-product-name="${rel.nameEn}" data-product-series="${rel.series}" data-product-image="${rel.images[0]}">Add to Basket</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
    observeRevealElements(relatedGrid);
  }

  function loadProduct(productId, updateUrl = false) {
    const id = safeProductId(productId);
    const product = normalizeProduct(id);

    syncBasketProduct(product);
    document.title = `${product.nameEn} | LongGuoYan Distillery`;

    document.querySelector('.pd-series').textContent = product.displaySeries;
    document.querySelector('.pd-name').innerHTML = product.nameHTML;
    document.querySelector('.pd-name-en').textContent = product.nameEn;
    document.querySelector('.pd-tagline').textContent = product.tagline ? `"${product.tagline}"` : '';
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
