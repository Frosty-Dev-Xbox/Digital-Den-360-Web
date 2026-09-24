/* ═══════════════════════════════════════════════════════════
   DIGITAL DEN 360 — script.js
   Made with ❤️ by Frosty-Dev-Xbox
   ═══════════════════════════════════════════════════════════ */

const CONFIG = {
  github: {
    user: 'Frosty-Dev-Xbox',
    repo: 'Digital-Den-360',
  },
  typing: {
    phrases: [
      'The homebrew den for jailbroken 360s...',
      'Games. Emulators. Utilities. Themes.',
      'RGH | JTAG | BadUpdate ready.',
      'Premium Beta soon → Free after.',
      'Your den. Your games.',
      'Made by Frosty-Dev-Xbox.',
    ],
    typeSpeed: 55,
    deleteSpeed: 30,
    pauseTime: 1600,
  },
};

/* 1. NAVBAR */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }
})();

/* 2. TYPING EFFECT */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const { phrases, typeSpeed, deleteSpeed, pauseTime } = CONFIG.typing;
  let phraseIndex = 0, charIndex = 0, deleting = false;
  function tick() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, pauseTime);
      }
      return setTimeout(tick, typeSpeed);
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        return setTimeout(tick, 400);
      }
      return setTimeout(tick, deleteSpeed);
    }
  }
  setTimeout(tick, 600);
})();

/* 3. SCROLL REVEAL */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  items.forEach((item, i) => {
    item.style.transitionDelay = `${Math.min(i * 60, 400)}ms`;
    observer.observe(item);
  });
})();

/* 4. GITHUB STATS */
(async function initGitHubStats() {
  const { user, repo } = CONFIG.github;
  const els = {
    stars: document.getElementById('statStars'),
    forks: document.getElementById('statForks'),
    watchers: document.getElementById('statWatchers'),
    issues: document.getElementById('statIssues'),
  };
  if (!els.stars && !els.forks && !els.watchers && !els.issues) return;

  function animateNumber(el, target) {
    if (!el) return;
    const duration = 1200;
    const start = performance.now();
    const from = 0;
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(from + (target - from) * eased);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${user}/${repo}`);
    if (!res.ok) throw new Error('GitHub API failed');
    const data = await res.json();
    animateNumber(els.stars, data.stargazers_count || 0);
    animateNumber(els.forks, data.forks_count || 0);
    animateNumber(els.watchers, data.subscribers_count || data.watchers_count || 0);
    animateNumber(els.issues, data.open_issues_count || 0);
  } catch (err) {
    console.warn('GitHub stats unavailable:', err.message);
    Object.values(els).forEach((el) => { if (el) el.textContent = '—'; });
  }
})();

/* 5. FAQ ACCORDION */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;
  items.forEach((item) => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach((i) => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* 6. SMOOTH SCROLL */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* 7. PARALLAX GLOWS */
(function initParallax() {
  const glow1 = document.querySelector('.bg-glow-1');
  const glow2 = document.querySelector('.bg-glow-2');
  if (!glow1 && !glow2) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (glow1) glow1.style.transform = `translate3d(0, ${y * 0.15}px, 0)`;
      if (glow2) glow2.style.transform = `translate3d(0, ${y * -0.1}px, 0)`;
      ticking = false;
    });
  });
})();

/* 8. HERO LOGO TILT */
(function initLogoTilt() {
  const logo = document.querySelector('.hero-logo');
  if (!logo) return;
  if (window.matchMedia('(hover: none)').matches) return;
  const wrap = logo.parentElement;
  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotX = y * -12;
    const rotY = x * 12;
    logo.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
  });
  wrap.addEventListener('mouseleave', () => {
    logo.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
  });
})();

/* 9. ACTIVE NAV LINK */
(function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('/').pop();
    if (linkFile === path) link.classList.add('active');
    else link.classList.remove('active');
  });
})();

/* 10. EASTER EGG */
(function easterEgg() {
  const style = 'color:#FF1493;font-weight:800;font-size:14px;';
  const pink = 'color:#FF69B4;font-weight:800;font-size:14px;';
  console.log('%c💗 DIGITAL DEN 360', style);
  console.log('%cYour den. Your games.', pink);
  console.log('%cMade with ❤️ by Frosty-Dev-Xbox', style);
  console.log('%chttps://github.com/Frosty-Dev-Xbox/Digital-Den-360', pink);
})();
