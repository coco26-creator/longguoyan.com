// Product database
const products = {
  'cellar-supreme-30': {
    id: 'cellar-supreme-30',
    badge: 'SAUCE AROMA · 30 YEARS AGED',
    nameCn: 'LongGuoYan',
    nameEn: 'Cellar Reserved Emperor\'s Supreme 30',
    fullName: 'LongGuoYan · Cellar Reserved Emperor\'s Supreme 30',
    tagline: 'Imperial grandeur, 30 years in the making — the ultimate expression of Sauce Aroma mastery',
    aromaType: 'Sauce Aroma',
    ageing: '30 Years Cellar-Aged',
    alcohol: '53% Vol.',
    origin: 'Maotai Town, Renhuai, Guizhou',
    volume: '500ml',
    series: 'Pinnacle Collection',
    images: {
      main: 'images/products/cellar-supreme-30-main.jpg',
      thumbs: [
        'images/products/cellar-supreme-30-1.jpg',
        'images/products/cellar-supreme-30-2.jpg',
        'images/products/cellar-supreme-30-3.jpg'
      ]
    }
  },
  'dragon-vein-30': {
    id: 'dragon-vein-30',
    badge: 'SAUCE AROMA · 30 YEARS',
    nameCn: 'LongGuoYan',
    nameEn: 'Long Mai 30',
    fullName: 'LongGuoYan · Long Mai 30',
    tagline: 'Kiln-transformation glazed bottle with Daqu Kunsha technique. Rich sauce aroma, full-bodied, and distinctly layered — the collector\'s 30-year expression.',
    aromaType: 'Sauce Aroma',
    ageing: '30 Years Cellar-Aged',
    alcohol: '53% Vol.',
    origin: 'Maotai Town, Renhuai, Guizhou',
    volume: '500ml',
    series: 'Collector\'s Edition',
    images: {
      main: 'images/products/dragon-vein-30-main.jpg',
      thumbs: [
        'images/products/dragon-vein-30-1.jpg',
        'images/products/dragon-vein-30-2.jpg',
        'images/products/dragon-vein-30-3.jpg'
      ]
    }
  },
  'limited-edition': {
    id: 'limited-edition',
    badge: 'LIMITED EDITION · VINTAGE AGED',
    nameCn: 'LongGuoYan',
    nameEn: 'Limited Edition',
    fullName: 'LongGuoYan · Limited Collector\'s Edition',
    tagline: 'A breathtaking tribute to imperial heritage, adorned in gold and sapphire',
    aromaType: 'Sauce Aroma',
    ageing: '30 Years Cellar-Aged',
    alcohol: '53% Vol.',
    origin: 'Maotai Town, Renhuai, Guizhou',
    volume: '500ml',
    series: 'Pinnacle Collection',
    images: {
      main: 'images/products/limited-edition-main.jpg',
      thumbs: [
        'images/products/limited-edition-1.jpg',
        'images/products/limited-edition-2.jpg',
        'images/products/limited-edition-3.jpg'
      ]
    }
  },
  'dragon-vein-15': {
    id: 'dragon-vein-15',
    badge: 'SAUCE AROMA · 15 YEARS',
    nameCn: 'LongGuoYan',
    nameEn: 'Long Mai 15',
    fullName: 'LongGuoYan · Long Mai 15',
    tagline: '15 years of careful aging, balanced richness with refined layers of sauce aroma complexity',
    aromaType: 'Sauce Aroma',
    ageing: '15 Years Cellar-Aged',
    alcohol: '53% Vol.',
    origin: 'Maotai Town, Renhuai, Guizhou',
    volume: '500ml',
    series: 'Premium Collection',
    images: {
      main: 'images/products/dragon-vein-15-main.jpg',
      thumbs: [
        'images/products/dragon-vein-15-1.jpg',
        'images/products/dragon-vein-15-2.jpg',
        'images/products/dragon-vein-15-3.jpg'
      ]
    }
  },
  'mastercraft-supreme': {
    id: 'mastercraft-supreme',
    badge: 'SAUCE AROMA · MASTERCRAFT',
    nameCn: 'LongGuoYan',
    nameEn: 'Mastercraft Supreme',
    fullName: 'LongGuoYan · Mastercraft Supreme',
    tagline: 'Imperial yellow glaze, rose gold badge, and silk hand strap. Large-capacity gift specification — the finest choice for gifting distinguished guests.',
    aromaType: 'Sauce Aroma',
    ageing: '20 Years Cellar-Aged',
    alcohol: '53% Vol.',
    origin: 'Maotai Town, Renhuai, Guizhou',
    volume: '750ml',
    series: 'Gift Collection',
    images: {
      main: 'images/products/mastercraft-supreme-main.jpg',
      thumbs: [
        'images/products/mastercraft-supreme-1.jpg',
        'images/products/mastercraft-supreme-2.jpg',
        'images/products/mastercraft-supreme-3.jpg'
      ]
    }
  }
};

// Load product data on page load
document.addEventListener('DOMContentLoaded', function() {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'cellar-supreme-30';
  
  // Get product data
  const product = products[productId];
  
  if (!product) {
    console.error('Product not found:', productId);
    return;
  }
  
  // Update page title
  document.title = `${product.fullName} | LongGuoYan Distillery`;
  
  // Update product badge
  const badge = document.querySelector('.pd-badge');
  if (badge) badge.textContent = product.badge;
  
  // Update product name
  const nameCn = document.querySelector('.pd-name');
  if (nameCn) nameCn.innerHTML = `${product.nameCn}<br><em>${product.nameEn}</em>`;
  
  // Update full name
  const fullName = document.querySelector('.pd-name-en');
  if (fullName) fullName.textContent = product.fullName;
  
  // Update tagline
  const tagline = document.querySelector('.pd-tagline');
  if (tagline) tagline.textContent = `"${product.tagline}"`;
  
  // Update specs
  const specs = {
    'Aroma Type': product.aromaType,
    'Ageing': product.ageing,
    'Alcohol': product.alcohol,
    'Origin': product.origin,
    'Volume': product.volume,
    'Series': product.series
  };
  
  document.querySelectorAll('.pd-spec').forEach((spec, index) => {
    const entries = Object.entries(specs);
    if (entries[index]) {
      const label = spec.querySelector('.pd-spec-label');
      const value = spec.querySelector('.pd-spec-value');
      if (label) label.textContent = entries[index][0];
      if (value) value.textContent = entries[index][1];
    }
  });
  
  // Update main image
  const mainImg = document.querySelector('.pd-main-img img');
  if (mainImg) {
    mainImg.src = product.images.main;
    mainImg.alt = product.fullName;
  }
  
  // Update thumbnail images
  const thumbs = document.querySelectorAll('.pd-thumb img');
  thumbs.forEach((thumb, index) => {
    if (product.images.thumbs[index]) {
      thumb.src = product.images.thumbs[index];
      thumb.alt = `${product.fullName} - View ${index + 1}`;
    }
  });
  
  // Add thumbnail click handlers
  document.querySelectorAll('.pd-thumb').forEach((thumb, index) => {
    thumb.addEventListener('click', function() {
      document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const mainImg = document.querySelector('.pd-main-img img');
      if (mainImg && product.images.thumbs[index]) {
        mainImg.src = product.images.thumbs[index];
      }
    });
  });
  
  // Set first thumb as active
  const firstThumb = document.querySelector('.pd-thumb');
  if (firstThumb) firstThumb.classList.add('active');
});
