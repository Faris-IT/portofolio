/* ============================================================
   MUHAMMAD FARIS — PORTFOLIO
   script.js
   ============================================================ */

'use strict';

/* ============================================================
   UTILITIES
============================================================ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ============================================================
   1. LOADER
============================================================ */
(function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
      // Trigger hero reveal after loader
      setTimeout(() => {
        $$('.hero .reveal-up, .hero .reveal-right').forEach(el => el.classList.add('in'));
      }, 120);
    }, 1600);
  });
})();

/* ============================================================
   2. CUSTOM CURSOR
============================================================ */
(function initCursor() {
  if (isTouchDevice) return;

  const cursor = $('#cursor');
  const cursorDot = $('#cursorDot');
  if (!cursor || !cursorDot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  // Track mouse
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
  });

  // Smooth follow for main cursor
  function animate() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.transform = `translate(${cursorX - 18}px, ${cursorY - 18}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  // Hover effect on interactive elements
  const hoverables = 'a, button, .social, .info-card, .contact-card, .project-card, .skill-card, input, textarea, .filter-btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) cursor.classList.add('hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) cursor.classList.remove('hover');
  });

  // Click effect
  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('click'));

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
  });
})();

/* ============================================================
   3. PARTICLE BACKGROUND
============================================================ */
(function initParticles() {
  if (prefersReducedMotion) return;

  const canvas = $('#particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let w, h;
  let mouse = { x: null, y: null, radius: 150 };

  const PARTICLE_COUNT = window.innerWidth < 768 ? 35 : 70;
  const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#3b82f6'];

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.8 + 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      // Wrap around edges
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const alpha = p.alpha + Math.sin(p.pulse) * 0.15;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.05, Math.min(0.9, alpha));
      ctx.fill();

      // Glow
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;
    });

    // Draw connections
    ctx.shadowBlur = 0;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = '#8b5cf6';
          ctx.globalAlpha = (1 - dist / 130) * 0.12;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Mouse connections
    if (mouse.x !== null) {
      particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          ctx.beginPath();
          ctx.strokeStyle = '#06b6d4';
          ctx.globalAlpha = (1 - dist / mouse.radius) * 0.35;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  // Track mouse for particle interaction
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  init();
  draw();
})();

/* ============================================================
   4. SCROLL PROGRESS BAR
============================================================ */
(function initScrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ============================================================
   5. NAVBAR — SCROLLED STATE, ACTIVE LINK, MOBILE TOGGLE
============================================================ */
(function initNavbar() {
  const nav       = $('#nav');
  const toggle    = $('#navToggle');
  const menu      = $('#navMenu');
  const links     = $$('.nav__link');
  const sections  = $$('section[id]');

  // --- Scrolled state ---
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile menu toggle ---
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
    });

    // Close on link click
    links.forEach(l => l.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }));

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Active link via IntersectionObserver ---
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-45% 0px -55% 0px', threshold: 0 });

    sections.forEach(sec => observer.observe(sec));
  }
})();

/* ============================================================
   6. TYPING EFFECT — HERO ROLE
============================================================ */
(function initTyping() {
  const el = $('#typedRole');
  if (!el || prefersReducedMotion) return;

  const roles = [
    'Web Developer',
    'Frontend Developer',
    'UI/UX Enthusiast',
    'Flutter Developer',
    'Pelajar Seumur Hidup',
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = roles[roleIndex];
    const speed = isDeleting ? 40 : 90;

    if (!isDeleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        return setTimeout(tick, 1600);
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        return setTimeout(tick, 400);
      }
    }
    setTimeout(tick, speed);
  }
  setTimeout(tick, 1800);
})();

/* ============================================================
   7. SCROLL REVEAL ANIMATIONS
============================================================ */
(function initScrollReveal() {
  const items = $$('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => {
    if (!el.closest('.hero')) observer.observe(el);
  });
})();

/* ============================================================
   8. SKILL BARS ANIMATION
============================================================ */
(function initSkillBars() {
  const bars = $$('.skill-bar__fill');
  if (!bars.length) return;

  if (!('IntersectionObserver' in window)) {
    bars.forEach(b => b.style.width = `${b.dataset.level}%`);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target.dataset.level || '0';
        setTimeout(() => {
          entry.target.style.width = `${level}%`;
        }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ============================================================
   9. COUNTER ANIMATION — STATS
============================================================ */
(function initCounters() {
  const counters = $$('.stat__number');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ============================================================
   10. PROJECT FILTER
============================================================ */
(function initProjectFilter() {
  const buttons = $$('.filter-btn');
  const cards = $$('.project-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Active state
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Animate cards
      cards.forEach((card, i) => {
        const match = filter === 'all' || card.dataset.category === filter;

        if (match) {
          card.classList.remove('hide');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(.96)';
          setTimeout(() => {
            card.style.transition = 'opacity .5s ease, transform .5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
            setTimeout(() => {
              card.style.transition = '';
              card.style.opacity = '';
              card.style.transform = '';
            }, 520);
          }, i * 60);
        } else {
          card.style.transition = 'opacity .3s ease, transform .3s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(.94)';
          setTimeout(() => {
            card.classList.add('hide');
            card.style.transition = '';
            card.style.opacity = '';
            card.style.transform = '';
          }, 300);
        }
      });
    });
  });
})();

/* ============================================================
   11. 3D TILT EFFECT
============================================================ */
(function initTilt() {
  if (isTouchDevice || prefersReducedMotion) return;

  const tiltEls = $$('[data-tilt], .tilt');
  if (!tiltEls.length) return;

  const MAX_TILT = 10;

  tiltEls.forEach(el => {
    let rafId = null;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width  - 0.5) * 2;
      const py = (y / rect.height - 0.5) * 2;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${-py * MAX_TILT}deg) rotateY(${px * MAX_TILT}deg) translateZ(0)`;
      });
    }

    function onEnter() {
      el.style.transition = 'transform .15s ease';
    }

    function onLeave() {
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transition = 'transform .6s cubic-bezier(.22, 1, .36, 1)';
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
})();

/* ============================================================
   12. MAGNETIC BUTTONS
============================================================ */
(function initMagnetic() {
  if (isTouchDevice || prefersReducedMotion) return;

  const magnets = $$('.magnetic');
  if (!magnets.length) return;

  const STRENGTH = 0.35;

  magnets.forEach(el => {
    let rafId = null;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width  / 2);
      const y = e.clientY - (rect.top  + rect.height / 2);

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
      });
    }

    function onLeave() {
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transition = 'transform .5s cubic-bezier(.22, 1, .36, 1)';
      el.style.transform = 'translate(0, 0)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
})();

/* ============================================================
   13. BACK TO TOP
============================================================ */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   14. CONTACT FORM
============================================================ */
(function initContactForm() {
  const form = $('#contactForm');
  const note = $('#formNote');
  if (!form || !note) return;

  function showNote(msg, type) {
    note.textContent = msg;
    note.className = `form-note ${type}`;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Reset
    $$('input, textarea', form).forEach(el => el.classList.remove('error'));
    note.textContent = '';

    // Validate
    if (!name || name.length < 2) {
      form.name.classList.add('error');
      form.name.focus();
      return showNote('Mohon masukkan nama yang valid.', 'error');
    }
    if (!isValidEmail(email)) {
      form.email.classList.add('error');
      form.email.focus();
      return showNote('Mohon masukkan email yang valid.', 'error');
    }
    if (!message || message.length < 5) {
      form.message.classList.add('error');
      form.message.focus();
      return showNote('Pesan minimal 5 karakter.', 'error');
    }

    // Success — kirim ke WhatsApp
    showNote('Mengarahkan ke WhatsApp... 📲', 'success');

    const waNumber = '62895333658151';
    const waText = encodeURIComponent(
      `Halo Muhammad Faris! 👋\n\n` +
      `Nama: ${name}\n` +
      `Email: ${email}\n\n` +
      `Pesan:\n${message}`
    );
    const waURL = `https://wa.me/${waNumber}?text=${waText}`;

    setTimeout(() => {
      window.open(waURL, '_blank', 'noopener');
      showNote('Terima kasih! Pesan Anda sedang dibuka di WhatsApp. ✨', 'success');
      form.reset();
    }, 700);
  });

  // Live: hapus error saat user mengetik
  $$('input, textarea', form).forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      if (note.textContent && note.classList.contains('error')) {
        note.textContent = '';
        note.className = 'form-note';
      }
    });
  });
})();

/* ============================================================
   15. SMOOTH SCROLL FOR ANCHOR LINKS (fallback)
============================================================ */
(function initSmoothScroll() {
  const links = $$('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   16. FOOTER — AUTO YEAR
============================================================ */
(function initYear() {
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ============================================================
   17. PARALLAX — HERO GLOW
============================================================ */
(function initParallax() {
  if (prefersReducedMotion || isTouchDevice) return;

  const glows = $$('.hero__glow');
  if (!glows.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      glows.forEach((glow, i) => {
        const speed = i === 0 ? 0.15 : -0.1;
        glow.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    });
  }, { passive: true });
})();

/* ============================================================
   18. TEXT SCRAMBLE — SECTION LABELS (bonus effect)
============================================================ */
(function initScramble() {
  if (prefersReducedMotion) return;

  const labels = $$('.section__label');
  if (!labels.length) return;

  const chars = '!<>-_\\/[]{}—=+*^?#________';

  function scramble(el) {
    const original = el.textContent;
    const length = original.length;
    let frame = 0;
    const queue = [];

    for (let i = 0; i < length; i++) {
      queue.push({
        from: original[i],
        to: original[i],
        start: Math.floor(Math.random() * 30),
        end: Math.floor(Math.random() * 30) + 30,
        char: null,
      });
    }

    function update() {
      let output = '';
      let done = 0;

      queue.forEach(item => {
        if (frame >= item.end) {
          done++;
          output += item.to;
        } else if (frame >= item.start) {
          if (!item.char || Math.random() < 0.28) {
            item.char = chars[Math.floor(Math.random() * chars.length)];
          }
          output += `<span style="color:#06b6d4">${item.char}</span>`;
        } else {
          output += item.from;
        }
      });

      el.innerHTML = output;
      if (done < length) {
        frame++;
        requestAnimationFrame(update);
      } else {
        el.textContent = original;
      }
    }
    update();
  }

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scramble(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  labels.forEach(l => observer.observe(l));
})();

/* ============================================================
   19. LOG — konsol sapa developer 👋
============================================================ */
console.log(
  '%c👋 Halo, sesama developer!\n%cPortofolio ini dibuat oleh Muhammad Faris.\n%cGitHub: https://github.com/Faris-IT',
  'font-size:18px; font-weight:bold; color:#8b5cf6;',
  'font-size:13px; color:#06b6d4;',
  'font-size:12px; color:#ec4899;'
);

/* ============================================================
   20. INFINITE SCROLL — Clone & Silent Teleport
   
   Cara kerja:
   1. Saat user mendekati dasar, kita CLONE seluruh konten <main>
      dan tambahkan ke #loopContainer di bawah.
   2. User terus scroll ke bawah → masuk ke area clone.
   3. Begitu user masuk area hero-clone (yang identik dengan hero asli),
      kita TELEPORT scroll DIAM-DIAM ke hero asli. Karena visual sama,
      user tidak sadar sudah di-reset.
   4. Ulangi.
============================================================ */
(function initInfiniteScroll() {
  if (prefersReducedMotion) return;

  const main = document.querySelector('main');
  const loopContainer = document.getElementById('loopContainer');
  const hero = document.getElementById('home');
  if (!main || !loopContainer || !hero) return;

  document.body.classList.add('infinite-loop');

  const CLONE_THRESHOLD = 800; // px dari bawah untuk mulai clone
  const TELEPORT_THRESHOLD = 100; // px dari atas hero-clone untuk teleport

  let isCloning = false;
  let isTeleporting = false;
  let heroHeight = 0;
  let mainHeight = 0;
  let cycleHeight = 0; // tinggi 1 siklus konten (main + 1 clone)

  // Ukur tinggi konten
  function measure() {
    heroHeight = hero.offsetHeight;
    mainHeight = main.offsetHeight;
    // 1 cycle = main + 1 clone
    const firstClone = loopContainer.querySelector('.loop-clone');
    if (firstClone) {
      cycleHeight = mainHeight + firstClone.offsetHeight;
    } else {
      cycleHeight = mainHeight * 2;
    }
  }

  // Clone konten main dan tambahkan ke loopContainer
  function cloneContent() {
    if (isCloning) return;
    isCloning = true;

    const clone = main.cloneNode(true);
    clone.classList.add('loop-clone');
    
    // Hapus ID duplikat agar valid HTML & tidak konflik
    clone.querySelectorAll('[id]').forEach(el => {
      el.removeAttribute('id');
    });

    // Reset animasi reveal di clone (langsung tampil)
    clone.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      el.classList.add('in');
    });

    // Reset skill bar di clone
    clone.querySelectorAll('.skill-bar__fill').forEach(el => {
      el.style.width = `${el.dataset.level || 0}%`;
    });

    loopContainer.appendChild(clone);
    isCloning = false;

    // Update ukuran
    setTimeout(measure, 50);
  }

  // Cek apakah clone perlu ditambah
  function checkClone() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;

    // Kalau user dekat dasar → clone konten lagi
    if (scrollY + winHeight >= docHeight - CLONE_THRESHOLD) {
      cloneContent();
    }
  }

  // Cek apakah user sudah masuk area hero-clone → teleport ke hero asli
  function checkTeleport() {
    if (isTeleporting || !cycleHeight) return;

    const scrollY = window.scrollY;

    // Posisi scroll relatif ke siklus
    const relativePos = scrollY % cycleHeight;

    // Kalau sudah masuk area hero-clone (dalam TELEPORT_THRESHOLD px dari awal siklus berikutnya)
    // Kita berada di "siklus ke-N", dan posisi kita sangat dekat dengan titik reset
    if (relativePos < TELEPORT_THRESHOLD && scrollY >= cycleHeight) {
      // Teleport DIAM-DIAM ke posisi yang setara di siklus pertama
      const newScrollY = relativePos;
      
      isTeleporting = true;
      
      // Matikan smooth scroll sementara
      document.documentElement.classList.add('teleporting');
      
      // Teleport instan
      window.scrollTo(0, newScrollY);

      // Kembalikan smooth scroll
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.documentElement.classList.remove('teleporting');
          isTeleporting = false;
        });
      });
    }
  }

  // Handler scroll utama
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      if (!isTeleporting) {
        checkTeleport();
        checkClone();
      }
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => setTimeout(measure, 200));

  // Ukur setelah load
  window.addEventListener('load', () => {
    setTimeout(() => {
      measure();
      // Langsung clone 1x di awal supaya konten di bawah sudah siap
      cloneContent();
    }, 500);
  });

  // Blokir scroll ke atas saat sudah di paling atas (mentok)
  window.addEventListener('wheel', (e) => {
    if (isTeleporting) return;
    if (window.scrollY <= 0 && e.deltaY < 0) {
      e.preventDefault();
      // Efek bounce kecil
      document.body.style.transform = 'translateY(6px)';
      setTimeout(() => {
        document.body.style.transform = '';
      }, 150);
    }
  }, { passive: false });

  // Touch device — bounce saat scroll ke atas di paling atas
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isTeleporting) return;
    if (window.scrollY <= 0) {
      const deltaY = e.touches[0].clientY - touchStartY;
      if (deltaY > 0) {
        // Swipe ke bawah (mau scroll ke atas) saat di posisi atas → blok
        e.preventDefault();
        document.body.style.transform = `translateY(${Math.min(deltaY * 0.3, 8)}px)`;
      }
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    if (window.scrollY <= 0) {
      document.body.style.transition = 'transform .3s ease';
      document.body.style.transform = '';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 300);
    }
  });

})();