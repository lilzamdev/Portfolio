/* Limuel Brasona — Portfolio interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';

  const root = document.documentElement;

  // ---------- Theme toggle (paper / ink) ----------
  const themeBtn = document.getElementById('themeToggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  function syncMeta() {
    if (metaTheme) metaTheme.setAttribute('content', root.getAttribute('data-theme') === 'ink' ? '#0F0F11' : '#F6F3EB');
  }
  syncMeta();
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'ink' ? 'paper' : 'ink';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('curious_dev_theme', next); } catch (e) { /* storage blocked */ }
      syncMeta();
    });
  }

  // ---------- Mobile menu ----------
  const menuBtn = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  function setMenu(open) {
    if (!menuBtn || !mainNav) return;
    mainNav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => setMenu(!mainNav.classList.contains('open')));
    mainNav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('click', e => {
      if (!mainNav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
    window.matchMedia('(min-width: 821px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  }

  // ---------- Nav: border on scroll + active link ----------
  const nav = document.getElementById('masthead');
  const links = Array.from(document.querySelectorAll('.nav-list a'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
    const y = window.scrollY + 120;
    let current = null;
    sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // ---------- Hide broken tech icons (if the CDN is unreachable) ----------
  document.querySelectorAll('.tool-chip img').forEach(img => {
    img.addEventListener('error', () => img.remove(), { once: true });
  });

  // ---------- Case study modal ----------
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  document.querySelectorAll('[data-details]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tpl = document.getElementById(btn.dataset.details);
      const title = btn.closest('.project').querySelector('.project-title');
      if (!tpl || !modal) return;
      modalTitle.textContent = title ? title.textContent : '';
      modalBody.replaceChildren(tpl.content.cloneNode(true));
      if (typeof modal.showModal === 'function') {
        modal.showModal();
        modalBody.scrollTop = 0;
      }
    });
  });
  if (modalClose) modalClose.addEventListener('click', () => modal.close());
  if (modal) {
    // click on backdrop closes
    modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  }

  // ---------- Copy email ----------
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  const copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email copied ✓');
      } catch (e) {
        showToast(email);
      }
    });
  }
})();
