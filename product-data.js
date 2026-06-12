// Product database for the product detail page.
// This lightweight data shape is merged with the richer content in products.js
// by product-detail.js so the page can show each bottle's core information,
// gallery, tasting notes, craftsmanship, and enquiry basket metadata.
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
      main: 'images/Cellar Supreme 30 1.jpg',
      thumbs: [
        'images/Cellar Supreme 30 1.jpg',
        'images/Cellar Supreme 30 2.jpg',
        'images/Cellar Supreme 30 3.jpg'
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
      main: 'images/Dragon Vein 30 1.jpg',
      thumbs: [
        'images/Dragon Vein 30 1.jpg',
        'images/Dragon Vein 30 2.jpg',
        'images/Dragon Vein 30 3.jpg'
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
      main: 'images/Limited Edition 1.jpg',
      thumbs: [
        'images/Limited Edition 1.jpg',
        'images/Limited Edition 2.jpg',
        'images/Limited Edition 3.jpg'
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
      main: 'images/Dragon-Vein-15 主图-1.jpg',
      thumbs: [
        'images/Dragon-Vein-15 主图-1.jpg',
        'images/Dragon Vein 15 2.jpg',
        'images/Dragon Vein 15 3.jpg'
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
      main: 'images/Premium Edition 1.jpg',
      thumbs: [
        'images/Premium Edition 1.jpg',
        'images/Premium Edition 2.jpg',
        'images/Premium Edition 3.jpg'
      ]
    }
  }
};

window.products = products;
