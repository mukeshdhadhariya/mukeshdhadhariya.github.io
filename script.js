// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById('theme-toggle');
const bodyElement = document.body;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  bodyElement.classList.add('light-mode');
  if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    bodyElement.classList.toggle('light-mode');
    const isLightMode = bodyElement.classList.contains('light-mode');
    
    if (isLightMode) {
      localStorage.setItem('theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      localStorage.setItem('theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  });
}

// ==================== SCROLL ANIMATIONS ====================
const reveals = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
  reveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Check on page load

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ==================== CONTACT FORM ====================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Create email link
    const mailtoLink = `mailto:mukeshdhadhariya1@gmail.com?subject=${encodeURIComponent(`New Message from ${name} - ${subject}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    // Show success message
    const formButton = contactForm.querySelector('button');
    const originalText = formButton.innerHTML;
    
    formButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    formButton.style.background = '#10b981';
    
    // Reset form
    contactForm.reset();
    
    // Restore button
    setTimeout(() => {
      formButton.innerHTML = originalText;
      formButton.style.background = '';
    }, 3000);

    // You can also open the default email client:
    // window.location.href = mailtoLink;
  });
}

// ==================== NAVBAR ACTIVE STATE ====================
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ==================== TYPING ANIMATION ====================
const typeWriter = () => {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;

  const text = subtitle.textContent;
  subtitle.textContent = '';
  let index = 0;

  const type = () => {
    if (index < text.length) {
      subtitle.textContent += text.charAt(index);
      index++;
      setTimeout(type, 50);
    }
  };

  type();
};

window.addEventListener('load', typeWriter);

// ==================== FLOATING ANIMATION ====================
const createFloatingElements = () => {
  const starsContainer = document.querySelector('.stars');
  if (!starsContainer) return;

  for (let i = 0; i < 50; i++) {
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.width = Math.random() * 3 + 'px';
    star.style.height = star.style.width;
    star.style.background = 'white';
    star.style.borderRadius = '50%';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.opacity = Math.random() * 0.5 + 0.2;
    star.style.animation = `twinkle ${Math.random() * 3 + 3}s infinite`;
    starsContainer.appendChild(star);
  }
};

// Add animation keyframes
const style = document.createElement('style');
style.innerHTML = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 1; }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scroll-reveal {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .nav-link.active::after {
    width: 100% !important;
  }

  .project-card, .skill-category, .about-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
`;
document.head.appendChild(style);

createFloatingElements();

// ==================== HAMBURGER MENU ====================
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinksContainer.style.display = navLinksContainer.style.display === 'flex' ? 'none' : 'flex';
    navLinksContainer.style.position = 'absolute';
    navLinksContainer.style.top = '60px';
    navLinksContainer.style.left = '0';
    navLinksContainer.style.right = '0';
    navLinksContainer.style.flexDirection = 'column';
    navLinksContainer.style.gap = '0';
    navLinksContainer.style.background = 'var(--darker-bg)';
    navLinksContainer.style.padding = '20px';
    navLinksContainer.style.borderBottom = '1px solid var(--glass-border)';
    navLinksContainer.style.zIndex = '99';
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.style.display = 'none';
    });
  });
}

// ==================== PARALLAX EFFECT ====================
const parallaxElements = () => {
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const hero = document.querySelector('.hero');
    
    if (hero) {
      hero.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
    }
  });
};

parallaxElements();

// ==================== ENHANCED HOVER EFFECTS ====================
const enhanceHoverEffects = () => {
  const hoverable = document.querySelectorAll('.project-card, .about-card, .achievement-item, .btn:not(.nav-link)');
  
  hoverable.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transform = this.style.transform ? this.style.transform + ' scale(1.02)' : 'scale(1.02)';
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
};

enhanceHoverEffects();

// ==================== SCROLL PROGRESS BAR ====================
const createScrollProgressBar = () => {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #10b981, #f59e0b);
    width: 0%;
    z-index: 1000;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
};

createScrollProgressBar();

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

// ==================== PREVENT LAYOUT SHIFT ON LOAD ====================
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-in';

setTimeout(() => {
  document.body.style.opacity = '1';
}, 100);

// ==================== CURSOR GLOW EFFECT ====================
const createCursorGlow = () => {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 30px;
    height: 30px;
    pointer-events: none;
    z-index: 9999;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.5), transparent);
    border-radius: 50%;
    display: none;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = (e.clientX - 15) + 'px';
    glow.style.top = (e.clientY - 15) + 'px';
    glow.style.display = 'block';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.display = 'none';
  });
};

createCursorGlow();

// ==================== SMOOTH PAGE TRANSITIONS ====================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a').forEach(link => {
    if (link.href && !link.href.includes('#') && !link.target) {
      link.addEventListener('click', (e) => {
        const href = link.href;
        if (!href.includes('http') || href.includes(window.location.host)) {
          e.preventDefault();
          document.body.style.opacity = '0';
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      });
    }
  });
});
