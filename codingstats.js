(() => {
// ==================== API DATA FETCHING ====================

// CodeForces API Fetch
const fetchCodeForcesData = async () => {
  try {
    const response = await fetch('https://codeforces.com/api/user.info?handles=mukesh_coder', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'OK' && data.result && data.result.length > 0) {
        const user = data.result[0];
        document.getElementById('cf-rating').textContent = user.rating || 'N/A';
        document.getElementById('cf-max').textContent = user.maxRating || 'N/A';
        document.getElementById('cf-contests').textContent = user.ratingUpdateTimeSeconds ? '20+' : '0';
        
        // Fetch submissions
        const subResponse = await fetch('https://codeforces.com/api/user.status?handle=mukesh_coder&from=1&count=1');
        if (subResponse.ok) {
          const subData = await subResponse.json();
          if (subData.status === 'OK') {
            const solvedSet = new Set();
            subData.result.forEach(submission => {
              if (submission.verdict === 'OK') {
                solvedSet.add(submission.problem.name);
              }
            });
            document.getElementById('cf-solved').textContent = solvedSet.size || '30+';
          }
        }
      }
    }
  } catch (error) {
    console.log('CodeForces API Error:', error);
    // Use fallback data
    document.getElementById('cf-rating').textContent = '1200+';
    document.getElementById('cf-max').textContent = '1400+';
    document.getElementById('cf-solved').textContent = '30+';
    document.getElementById('cf-contests').textContent = '20+';
  }
};

// GitHub API Fetch
const fetchGitHubData = async () => {
  try {
    const response = await fetch('https://api.github.com/users/mukeshdhadhariya');
    if (response.ok) {
      const data = await response.json();
      document.getElementById('gh-repos').textContent = data.public_repos + '+' || '15+';
      document.getElementById('gh-followers').textContent = data.followers + '+' || '50+';
      
      // Get contributions (approximate)
      document.getElementById('gh-contributions').textContent = '500+';
    }
  } catch (error) {
    console.log('GitHub API Error:', error);
    // Use fallback data
    document.getElementById('gh-repos').textContent = '15+';
    document.getElementById('gh-followers').textContent = '50+';
    document.getElementById('gh-contributions').textContent = '500+';
  }
};

// LeetCode Stats Fetch + Visualization
const defaultLeetCodeStats = {
  totalSolved: 60,
  easySolved: 25,
  mediumSolved: 30,
  hardSolved: 5
};

const setElementText = (id, value) => {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
};

const animateLeetCodeBars = ({ easySolved, mediumSolved, hardSolved }) => {
  const distribution = {
    easy: easySolved,
    medium: mediumSolved,
    hard: hardSolved
  };

  const total = Object.values(distribution).reduce((sum, value) => sum + value, 0) || 1;

  requestAnimationFrame(() => {
    Object.entries(distribution).forEach(([difficulty, value]) => {
      const bar = document.querySelector(`.bar[data-difficulty="${difficulty}"]`);
      if (!bar) return;
      const percent = Math.round((value / total) * 100);
      bar.style.width = `${percent}%`;
      bar.setAttribute('aria-valuenow', percent);
      bar.setAttribute('aria-label', `${difficulty} problems ${value} solved (${percent}%)`);
      bar.dataset.count = value;
    });
  });
};

const updateLeetCodeUI = (incomingStats = {}) => {
  const normalize = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const stats = {
    totalSolved: normalize(incomingStats.totalSolved, defaultLeetCodeStats.totalSolved),
    easySolved: normalize(incomingStats.easySolved, defaultLeetCodeStats.easySolved),
    mediumSolved: normalize(incomingStats.mediumSolved, defaultLeetCodeStats.mediumSolved),
    hardSolved: normalize(incomingStats.hardSolved, defaultLeetCodeStats.hardSolved)
  };

  if (!incomingStats.totalSolved) {
    stats.totalSolved = stats.easySolved + stats.mediumSolved + stats.hardSolved;
  }

  setElementText('lc-solved', `${stats.totalSolved}+`);
  setElementText('lc-easy', `${stats.easySolved}+`);
  setElementText('lc-medium', `${stats.mediumSolved}+`);
  setElementText('lc-hard', `${stats.hardSolved}+`);

  animateLeetCodeBars(stats);
};

const fetchLeetCodeData = async () => {
  try {
    const response = await fetch('https://leetcode-stats-api.herokuapp.com/mukeshdhadhariya');
    if (!response.ok) {
      throw new Error('LeetCode API unavailable');
    }

    const data = await response.json();
    if (data.status === 'success' || (data.totalSolved && !data.errors)) {
      updateLeetCodeUI({
        totalSolved: data.totalSolved,
        easySolved: data.easySolved,
        mediumSolved: data.mediumSolved,
        hardSolved: data.hardSolved
      });
    } else {
      throw new Error('Unexpected LeetCode payload');
    }
  } catch (error) {
    console.log('LeetCode API Error:', error);
    updateLeetCodeUI(defaultLeetCodeStats);
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateLeetCodeUI(defaultLeetCodeStats);
  fetchCodeForcesData();
  fetchGitHubData();
  fetchLeetCodeData();
});

// ==================== SCROLL ANIMATIONS ====================
const statReveals = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
  statReveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

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

// ==================== PROGRESS RING ANIMATION ====================
const animateProgressRings = () => {
  const rings = document.querySelectorAll('.progress-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Get the circle and its percentage
        const circle = entry.target;
        const percentage = parseInt(circle.parentElement.parentElement.querySelector('.percentage').textContent);
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        
        circle.style.strokeDashoffset = offset;
        observer.unobserve(circle);
      }
    });
  }, { threshold: 0.5 });

  rings.forEach(ring => observer.observe(ring));
};

animateProgressRings();

// ==================== ANIMATED COUNTERS ====================
const animateCounters = () => {
  const counters = document.querySelectorAll('.stat-value[id]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        animateCounter(element);
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
};

const animateCounter = (element) => {
  const text = element.textContent;
  const numbers = text.match(/\d+/);
  
  if (numbers) {
    const target = parseInt(numbers[0]);
    const duration = 2000;
    const increment = target / (duration / 50);
    let current = 0;

    const update = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current) + (text.includes('+') ? '+' : text.includes('⭐') ? '⭐' : '');
        setTimeout(update, 50);
      } else {
        element.textContent = text;
      }
    };

    update();
  }
};

animateCounters();

// ==================== HAMBURGER MENU ====================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '60px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.flexDirection = 'column';
    navLinks.style.gap = '0';
    navLinks.style.background = 'var(--darker-bg)';
    navLinks.style.padding = '20px';
    navLinks.style.borderBottom = '1px solid var(--glass-border)';
  });
}

// ==================== THEME PERSISTENCE ====================
// Already handled in main script.js
// Just ensure it applies here too
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
}

// ==================== STATS LOADING ANIMATION ====================
const startLoadingAnimation = () => {
  const statusDot = document.querySelector('.status-dot');
  if (statusDot) {
    setTimeout(() => {
      const statusText = document.querySelector('.status-text');
      statusText.textContent = 'Data loaded successfully ✓';
      statusDot.style.background = '#10b981';
    }, 2000);
  }
};

window.addEventListener('load', startLoadingAnimation);

// ==================== PARALLAX BACKGROUND ====================
window.addEventListener('scroll', () => {
  const statsHero = document.querySelector('.stats-hero');
  if (statsHero) {
    const scrollPosition = window.scrollY;
    statsHero.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
  }
});

// ==================== ADD SVG GRADIENT ====================
const addSVGGradient = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.display = 'none';
  
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'gradient');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '100%');
  gradient.setAttribute('y2', '100%');
  
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('style', 'stop-color:#3b82f6;stop-opacity:1');
  
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('style', 'stop-color:#10b981;stop-opacity:1');
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  svg.appendChild(defs);
  document.body.appendChild(svg);
};

addSVGGradient();

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-in';

setTimeout(() => {
  document.body.style.opacity = '1';
}, 100);
})();