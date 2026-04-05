(() => {
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
  const navMenu = document.getElementById('main-nav') || document.querySelector('.nav-links');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
  const contactForm = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');
  const targetEmail = 'mukeshdhadhariya1@gmail.com';

  const applyTheme = (mode) => {
    if (mode === 'light') {
      body.classList.add('light-mode');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      body.classList.remove('light-mode');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  };

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = body.classList.toggle('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      applyTheme(isLight ? 'light' : 'dark');
    });
  }

  if (hamburger && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('.nav-container')) return;
      closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if ('IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('active'));
  }

  const updateActiveNav = () => {
    let currentSection = '';

    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        currentSection = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const isAnchor = href.startsWith('#');
      if (!isAnchor) {
        link.classList.remove('active');
        return;
      }
      link.classList.toggle('active', href === `#${currentSection}`);
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  if (contactForm) {
    const renderEmailOptions = (subjectText, bodyText) => {
      if (!formNote) return;

      const encodedSubject = encodeURIComponent(subjectText);
      const encodedBody = encodeURIComponent(bodyText);
      const encodedTo = encodeURIComponent(targetEmail);

      const links = {
        mailApp: `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`,
        gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`,
        outlook: `https://outlook.office.com/mail/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`,
        yahoo: `https://compose.mail.yahoo.com/?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`
      };

      formNote.innerHTML = `
        <div class="email-options" role="group" aria-label="Choose email sender">
          <p class="email-options-title">Choose where to send:</p>
          <div class="email-options-grid">
            <a class="email-action" href="${links.mailApp}"><i class="fas fa-paper-plane"></i> Mail App</a>
            <a class="email-action" href="${links.gmail}" target="_blank" rel="noopener noreferrer"><i class="fab fa-google"></i> Gmail</a>
            <a class="email-action" href="${links.outlook}" target="_blank" rel="noopener noreferrer"><i class="fab fa-microsoft"></i> Outlook</a>
            <a class="email-action" href="${links.yahoo}" target="_blank" rel="noopener noreferrer"><i class="fas fa-envelope-open-text"></i> Yahoo</a>
            <button class="email-action" type="button" id="copy-email-btn"><i class="fas fa-copy"></i> Copy Email</button>
          </div>
        </div>
      `;

      const copyBtn = document.getElementById('copy-email-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(targetEmail);
            copyBtn.textContent = 'Email Copied';
          } catch (error) {
            console.error('Copy failed:', error);
            copyBtn.textContent = 'Copy Failed';
          }
        });
      }
    };

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('name')?.value?.trim() || '';
      const email = document.getElementById('email')?.value?.trim() || '';
      const subject = document.getElementById('subject')?.value?.trim() || '';
      const message = document.getElementById('message')?.value?.trim() || '';

      const fullSubject = `${subject || 'Portfolio Inquiry'} - ${name}`;
      const fullBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      renderEmailOptions(fullSubject, fullBody);
    });
  }
})();
