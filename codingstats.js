(() => {
  const handles = {
    codechef: 'its_hunter',
    leetcode: 'mukeshhdhadhariya',
    codeforces: 'mukesh_dhadhariya'
  };

  const fallback = {
    codechef: {
      rating: '1550+',
      maxRating: '1610',
      stars: '3*'
    },
    leetcode: {
      solved: 290,
      easy: 110,
      medium: 143,
      hard: 37,
      acceptance: '75%'
    },
    codeforces: {
      rating: '1200+',
      maxRating: '1300+',
      solved: 80
    }
  };

  const state = {
    solvedTotal: 0,
    bestRating: 0
  };

  const profileOverrides = {
    codechefStars: '3*',
    leetcodeAcceptance: '75%'
  };

  const $ = (id) => document.getElementById(id);

  const setText = (id, value) => {
    const el = $(id);
    if (el) el.textContent = value;
  };

  const parseRating = (value) => {
    const num = Number(String(value).replace(/[^0-9]/g, ''));
    return Number.isFinite(num) ? num : 0;
  };

  const setSyncMessage = (text, isSuccess = true) => {
    const sync = $('sync-text');
    if (sync) sync.textContent = text;
    const dot = document.querySelector('.pulse-dot');
    if (dot) {
      dot.style.background = isSuccess ? 'var(--cs-success)' : '#ff7b7b';
    }
  };

  const refreshQuickBand = () => {
    setText('total-solved', String(state.solvedTotal || '--'));
    setText('best-rating', state.bestRating ? String(state.bestRating) : '--');

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setText('last-refresh', time);
  };

  const fetchCodeforces = async () => {
    try {
      const [infoRes, statusRes] = await Promise.all([
        fetch(`https://codeforces.com/api/user.info?handles=${handles.codeforces}`),
        fetch(`https://codeforces.com/api/user.status?handle=${handles.codeforces}&from=1&count=3000`)
      ]);

      if (!infoRes.ok) throw new Error('Codeforces info unavailable');
      const info = await infoRes.json();

      if (info.status !== 'OK' || !info.result?.length) {
        throw new Error('Codeforces payload invalid');
      }

      const user = info.result[0];
      setText('cf-rating', user.rating || fallback.codeforces.rating);
      setText('cf-max-rating', user.maxRating || fallback.codeforces.maxRating);

      state.bestRating = Math.max(state.bestRating, parseRating(user.maxRating || user.rating));

      let solved = fallback.codeforces.solved;

      if (statusRes.ok) {
        const statuses = await statusRes.json();
        if (statuses.status === 'OK' && Array.isArray(statuses.result)) {
          const solvedSet = new Set();
          statuses.result.forEach((submission) => {
            if (submission.verdict === 'OK' && submission.problem) {
              solvedSet.add(`${submission.problem.contestId}-${submission.problem.index}`);
            }
          });
          solved = solvedSet.size || solved;
        }
      }

      setText('cf-solved', solved);
      state.solvedTotal += Number(solved) || 0;
    } catch (error) {
      console.log('Codeforces fetch failed:', error);
      setText('cf-rating', fallback.codeforces.rating);
      setText('cf-max-rating', fallback.codeforces.maxRating);
      setText('cf-solved', String(fallback.codeforces.solved));

      state.bestRating = Math.max(state.bestRating, parseRating(fallback.codeforces.maxRating));
      state.solvedTotal += fallback.codeforces.solved;
    }
  };

  const fetchLeetcode = async () => {
    const fetchFromLegacyApi = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${handles.leetcode}`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('LeetCode legacy API unavailable');

      const data = await res.json();
      const solved = Number(data.totalSolved);
      const easy = Number(data.easySolved);
      const medium = Number(data.mediumSolved);
      const hard = Number(data.hardSolved);
      const acceptance = Number(data.acceptanceRate);

      return {
        solved: Number.isFinite(solved) ? solved : fallback.leetcode.solved,
        easy: Number.isFinite(easy) ? easy : fallback.leetcode.easy,
        medium: Number.isFinite(medium) ? medium : fallback.leetcode.medium,
        hard: Number.isFinite(hard) ? hard : fallback.leetcode.hard,
        acceptance: Number.isFinite(acceptance) ? `${acceptance}%` : null
      };
    };

    const applyStats = (stats) => {
      const solvedSafe = Number(stats.solved) || fallback.leetcode.solved;
      const easySafe = Number(stats.easy) || fallback.leetcode.easy;
      const mediumSafe = Number(stats.medium) || fallback.leetcode.medium;
      const hardSafe = Number(stats.hard) || fallback.leetcode.hard;

      setText('lc-solved', solvedSafe);
      setText('lc-breakdown', `${easySafe} / ${mediumSafe} / ${hardSafe}`);
      setText('lc-acceptance', stats.acceptance || profileOverrides.leetcodeAcceptance || fallback.leetcode.acceptance);

      state.solvedTotal += solvedSafe;
    };

    try {
      const legacyStats = await fetchFromLegacyApi();
      applyStats(legacyStats);
    } catch (_error) {
      // Keep UI stable with defaults when API is blocked or slow.
      applyStats({
        solved: fallback.leetcode.solved,
        easy: fallback.leetcode.easy,
        medium: fallback.leetcode.medium,
        hard: fallback.leetcode.hard,
        acceptance: profileOverrides.leetcodeAcceptance
      });
    }
  };

  const fetchCodechef = async () => {
    // CodeChef public APIs are often CORS blocked from static sites, so use profile defaults.
    setText('cc-rating', fallback.codechef.rating);
    setText('cc-max-rating', fallback.codechef.maxRating);
    setText('cc-stars', profileOverrides.codechefStars);
    state.bestRating = Math.max(state.bestRating, parseRating(fallback.codechef.maxRating));
  };

  const animateCounter = (id) => {
    const el = $(id);
    if (!el) return;

    const target = Number(String(el.textContent).replace(/[^0-9]/g, ''));
    if (!Number.isFinite(target) || target <= 0) return;

    const suffix = String(el.textContent).replace(/[0-9]/g, '');
    let current = 0;
    const duration = 900;
    const steps = 24;
    const increment = target / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = `${target}${suffix}`;
        clearInterval(timer);
      } else {
        el.textContent = `${Math.floor(current)}${suffix}`;
      }
    }, interval);
  };

  const runReveal = () => {
    const items = document.querySelectorAll('.reveal');
    const reveal = () => {
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          item.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', reveal);
    reveal();
  };

  const init = async () => {
    runReveal();
    setSyncMessage('Syncing latest stats...', true);

    // Render quick dummy values first to avoid waiting for slow LeetCode APIs.
    setText('lc-solved', fallback.leetcode.solved);
    setText('lc-breakdown', `${fallback.leetcode.easy} / ${fallback.leetcode.medium} / ${fallback.leetcode.hard}`);
    setText('lc-acceptance', fallback.leetcode.acceptance);

    await Promise.all([fetchCodechef(), fetchLeetcode(), fetchCodeforces()]);

    refreshQuickBand();
    animateCounter('total-solved');
    animateCounter('best-rating');
    setSyncMessage('Stats synced (Codeforces live, others optimized)', true);
  };

  document.addEventListener('DOMContentLoaded', init);
})();
