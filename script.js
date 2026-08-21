/* ═══════════════════════════════════════════════════════════
   Mukesh Dhadhariya — Portfolio Script
   Premium interactions: theme, nav, animations, counters,
   cursor glow, scroll progress, contact form
═══════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ── DOM ──────────────────────────────────────────────────── */
  const html          = document.documentElement;
  const navbar        = document.getElementById('navbar');
  const themeToggle   = document.getElementById('themeToggle');
  const menuToggle    = document.getElementById('menuToggle');
  const navLinks      = document.getElementById('navLinks');
  const navLinkEls    = Array.from(document.querySelectorAll('.nav-link[data-section]'));
  const sections      = Array.from(document.querySelectorAll('section[id]'));
  const scrollProg    = document.getElementById('scrollProgress');
  const cursorGlow    = document.getElementById('cursorGlow');
  const contactForm   = document.getElementById('contactForm');
  const formStatus    = document.getElementById('formStatus');
  const submitBtn     = document.getElementById('submitBtn');

  /* ─────────────────────────────────────────────────────────
     THEME — apply early to avoid FOUC
  ───────────────────────────────────────────────────────── */
  const getTheme    = () => localStorage.getItem('theme') || 'dark';
  const applyTheme  = (t) => {
    html.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
    }
  };

  // Apply stored theme immediately (script runs at end of body)
  applyTheme(getTheme());

  // Theme toggle
  themeToggle?.addEventListener('click', () => {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });

  /* ─────────────────────────────────────────────────────────
     MOBILE MENU
  ───────────────────────────────────────────────────────── */
  const closeMenu = () => {
    navLinks?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) closeMenu();
  });

  /* ─────────────────────────────────────────────────────────
     SMOOTH ANCHOR SCROLL (with offset for fixed navbar)
  ───────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─────────────────────────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────────────────────────── */
  const updateProgress = () => {
    if (!scrollProg) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
    scrollProg.style.width = pct.toFixed(2) + '%';
  };

  /* ─────────────────────────────────────────────────────────
     NAVBAR — scrolled state + active links
  ───────────────────────────────────────────────────────── */
  const updateNav = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20);

    let current = '';
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom > 100) current = sec.id;
    });

    navLinkEls.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  };

  /* ─────────────────────────────────────────────────────────
     SCROLL REVEAL ANIMATIONS
  ───────────────────────────────────────────────────────── */
  const animateEls = Array.from(document.querySelectorAll('[data-animate]'));

  const revealObs = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('animated');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -4%' })
    : null;

  if (revealObs) {
    animateEls.forEach((el) => revealObs.observe(el));
  } else {
    animateEls.forEach((el) => el.classList.add('animated'));
  }

  /* ─────────────────────────────────────────────────────────
     ANIMATED STAT COUNTERS (with easing)
  ───────────────────────────────────────────────────────── */
  const statCards = Array.from(document.querySelectorAll('.stat-card[data-count]'));

  const animateCounter = (card) => {
    const target   = Number(card.dataset.count) || 0;
    const suffix   = card.dataset.suffix || '';
    const valEl    = card.querySelector('.count-val');
    const sfxEl    = card.querySelector('.count-sfx');
    if (!valEl) return;
    sfxEl && (sfxEl.textContent = '');

    const duration = target > 500 ? 1600 : 1000;
    const startTs  = performance.now();

    const easeOut  = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed = now - startTs;
      const t       = Math.min(1, elapsed / duration);
      const val     = Math.floor(easeOut(t) * target);
      valEl.textContent = val.toLocaleString();
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        valEl.textContent = target.toLocaleString();
        sfxEl && (sfxEl.textContent = suffix);
      }
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && statCards.length) {
    const counterObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    statCards.forEach((c) => counterObs.observe(c));
  } else {
    statCards.forEach((c) => {
      const val = c.querySelector('.count-val');
      const sfx = c.querySelector('.count-sfx');
      if (val) val.textContent = Number(c.dataset.count).toLocaleString();
      if (sfx) sfx.textContent = c.dataset.suffix || '';
    });
  }

  /* ─────────────────────────────────────────────────────────
     CURSOR GLOW (desktop only with smooth follow)
  ───────────────────────────────────────────────────────── */
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let glowX  = 0, glowY  = 0;
    let rafId  = null;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });

    const smoothGlow = () => {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top  = glowY + 'px';
      rafId = requestAnimationFrame(smoothGlow);
    };
    smoothGlow();
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  /* ─────────────────────────────────────────────────────────
     SCROLL EVENT AGGREGATION (single listener)
  ───────────────────────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    updateProgress();
    updateNav();
  }, { passive: true });

  // Initial calls
  updateProgress();
  updateNav();

  /* ─────────────────────────────────────────────────────────
     CONTACT FORM — opens mail client with pre-filled fields
  ───────────────────────────────────────────────────────── */
  if (contactForm && formStatus && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = contactForm.querySelector('[name="name"]')?.value?.trim() || '';
      const email   = contactForm.querySelector('[name="email"]')?.value?.trim() || '';
      const message = contactForm.querySelector('[name="message"]')?.value?.trim() || '';

      // Validation
      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill in all fields.';
        formStatus.className   = 'form-status error';
        return;
      }

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className   = 'form-status error';
        return;
      }

      const subject  = encodeURIComponent(`Portfolio Inquiry — ${name}`);
      const body     = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      const mailto   = `mailto:mukeshdhadhariya1@gmail.com?subject=${subject}&body=${body}`;

      submitBtn.textContent  = 'Opening email client…';
      submitBtn.disabled     = true;

      window.location.href = mailto;

      // Give user feedback and reset after a moment
      setTimeout(() => {
        formStatus.textContent = '✓ Email client opened! Your message is ready to send.';
        formStatus.className   = 'form-status success';
        submitBtn.textContent  = 'Send Message';
        submitBtn.disabled     = false;
        contactForm.reset();
      }, 1000);
    });
  }

  /* ─────────────────────────────────────────────────────────
     CARD TILT EFFECT (stat cards only for fun)
  ───────────────────────────────────────────────────────── */
  const tiltCards = Array.from(document.querySelectorAll('.stat-card'));

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = -(dy * 2).toFixed(2);
      const tiltY =  (dx * 2).toFixed(2);
      card.style.transform = `translateY(-2px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────────────────────
     KEYBOARD NAV ACCESSIBILITY
  ───────────────────────────────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();