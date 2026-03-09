/**
 * nav.js — Longguo Banquet shared navigation & utilities
 * Handles: mobile menu, scroll effects, reveal animations,
 *          hero slider, video section, cookie banner,
 *          product detail tabs & gallery, lazy image loading
 */

(function () {
  'use strict';

  /* ── Header scroll effect ── */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', (e) => {
      if (header && !header.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Reveal / fade-in animations ── */
  const revealEls = document.querySelectorAll('.reveal, .fade-in');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Lazy image fade-in ── */
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  if (lazyImgs.length) {
    const imgObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          img.onload = () => img.classList.add('loaded');
          if (img.complete) img.classList.add('loaded');
          imgObs.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(img => imgObs.observe(img));
  }

  /* ── Hero image slider ── */
  function initHeroSlider(slideSelector, dotSelector, containerSelector) {
    const slides = document.querySelectorAll(slideSelector);
    const dots   = document.querySelectorAll(dotSelector);
    if (!slides.length) return;

    let current = 0;
    function goToSlide(n) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    let timer = setInterval(() => goToSlide(current + 1), 5000);
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(timer);
        goToSlide(i);
        timer = setInterval(() => goToSlide(current + 1), 5000);
      });
    });

    const container = document.querySelector(containerSelector);
    if (container) {
      container.addEventListener('mouseenter', () => clearInterval(timer));
      container.addEventListener('mouseleave', () => {
        timer = setInterval(() => goToSlide(current + 1), 5000);
      });
    }
  }

  // Legacy hero slider (if any)
  initHeroSlider('.hero-slide', '.slider-dot', '.hero');
  // New clean hero slider
  initHeroSlider('.hc-slide', '.hc-dot', '.hero-clean');

  /* ── Video play button ── */
  const playBtn   = document.getElementById('playBtn');
  const poster    = document.getElementById('videoPoster');
  const brandVid  = document.getElementById('brandVideo');
  if (playBtn && poster && brandVid) {
    playBtn.addEventListener('click', () => {
      poster.style.display   = 'none';
      brandVid.style.display = 'block';
      brandVid.play();
    });
  }

  /* ── Product detail: thumbnail gallery ── */
  const thumbs    = document.querySelectorAll('.pd-thumb');
  const mainImg   = document.getElementById('mainProductImg');
  if (thumbs.length && mainImg) {
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImg.src = thumb.dataset.src;
      });
    });
  }

  /* ── Product detail: tabs ── */
  const tabBtns   = document.querySelectorAll('.pd-tab-btn');
  const tabPanels = document.querySelectorAll('.pd-tab-panel');
  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        tabPanels.forEach(p => { p.classList.remove('active'); p.hidden = true; });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel) { panel.classList.add('active'); panel.hidden = false; }
      });
    });
  }

  /* ── Cookie consent banner ── */
  const cookieBanner  = document.getElementById('cookieBanner');
  const acceptBtn     = document.getElementById('cookieAccept');
  const declineBtn    = document.getElementById('cookieDecline');

  function getCookie(name) {
    return document.cookie.split('; ').find(r => r.startsWith(name + '='));
  }
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  if (cookieBanner && !getCookie('lgy_cookie_consent')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1200);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      setCookie('lgy_cookie_consent', 'accepted', 365);
      cookieBanner.classList.remove('show');
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      setCookie('lgy_cookie_consent', 'declined', 30);
      cookieBanner.classList.remove('show');
    });
  }

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

})();
