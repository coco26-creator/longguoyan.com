/**
 * nav.js — Longguo Banquet shared navigation & utilities
 * Handles: mobile menu, scroll effects, reveal animations, hero slider
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

  /* ── Hero image slider ── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.slider-dot');
  if (slides.length > 1) {
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
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', () => clearInterval(timer));
      heroEl.addEventListener('mouseleave', () => {
        timer = setInterval(() => goToSlide(current + 1), 5000);
      });
    }
  }

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

})();
