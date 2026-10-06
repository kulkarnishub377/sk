/* Yadnyesh Dhangar — Enterprise Java Full Stack & AI Systems Portfolio */
(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // ── Theme Management ──
  const themeBtn = $('#themeToggle');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = () => root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    });
  }

  // ── Navigation, Scroll & Mobile Menu ──
  const nav = $('#nav');
  const burger = $('#burger');
  const links = $('#navLinks');
  const setMenu = open => {
    if (!links || !burger) return;
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  if (burger) {
    burger.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  }
  if (links) {
    $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const progress = $('#progress');
  const btt = $('#btt');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (nav) nav.classList.toggle('scrolled', y > 8);
    if (btt) btt.classList.toggle('show', y > 800);
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (btt) {
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  // ── Active Section Spy ──
  if (links) {
    const navMap = new Map($$('a', links).map(a => [a.getAttribute('href').slice(1), a]));
    const secObs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        $$('a', links).forEach(a => a.classList.remove('active'));
        const a = navMap.get(en.target.id);
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => secObs.observe(s));
  }

  // ── Scroll Reveal ──
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revObs.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  $$('.rv').forEach(el => revObs.observe(el));

  // ── Stat Counters ──
  const fmt = (n, big) => big ? n.toLocaleString('en-IN') : String(n);
  const runCounter = el => {
    const target = +el.dataset.target;
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const big = target >= 1000;
    if (reduceMotion) { el.textContent = prefix + fmt(target, big) + suffix; return; }
    const t0 = performance.now(), dur = 1600;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const val = Math.round((1 - Math.pow(1 - p, 4)) * target);
      el.textContent = prefix + fmt(val, big) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      $$('.counter', en.target).forEach(runCounter);
      cntObs.unobserve(en.target);
    });
  }, { threshold: 0.35 });
  $$('.metrics').forEach(el => cntObs.observe(el));

  // ── Typewriter Console ──
  const tw = $('#typewriter');
  const roles = [
    'Full-Stack Developer',
    'Python (FastAPI, Flask & Django) · React',
    'Google Cloud Vertex AI · Gemini · Multi-Agent',
    'Vanilla JavaScript · ES Modules · No Bundler',
    'PostgreSQL · In-Memory Caching · Cloudflare',
    'OIDC / OAuth2 · SimpleJWT Auth',
    'pytest · Jest · Test-Driven Discipline',
    'Docker · CI/CD Pipelines · Production Cloud',
    'AIR 1 National Champion · SIH 2023'
  ];
  if (tw && !reduceMotion) {
    let ri = 0, ci = roles[0].length, deleting = true;
    const step = () => {
      const r = roles[ri];
      ci += deleting ? -1 : 1;
      tw.textContent = r.slice(0, ci);
      if (!deleting && ci === r.length) { deleting = true; return setTimeout(step, 2400); }
      if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; return setTimeout(step, 320); }
      setTimeout(step, deleting ? 24 : 52);
    };
    setTimeout(step, 2400);
  }

  // ── Project Filters ──
  const filters = $$('.filter');
  const projects = $$('#projGrid .proj');
  filters.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    const grid = $('#projGrid');
    if (grid) grid.dataset.f = f;
    filters.forEach(b => {
      const on = b === btn;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    projects.forEach(p => {
      const categories = (p.dataset.cat || '').split(' ');
      const show = f === 'all' || categories.includes(f);
      p.hidden = !show;
      if (show) p.classList.add('in');
    });
  }));

  // ── Project Modals Interactivity ──
  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
    document.body.style.overflow = '';
  };

  $$('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.dataset.modal;
      if (modalId) openModal(modalId);
    });
  });

  $$('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = btn.closest('dialog');
      closeModal(modal);
    });
  });

  $$('dialog.proj-modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(modal);
    });
    modal.addEventListener('cancel', () => {
      document.body.style.overflow = '';
    });
  });

  // ── Contact Form (Pre-filled Mailto) ──
  const form = $('#contactForm');
  const note = $('#formNote');
  const defaultNote = note ? note.textContent : '';
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = ['fname', 'femail', 'fsub', 'fmsg'].map(id => $('#' + id));
      let firstBad = null;
      fields.forEach(f => {
        if (!f) return;
        const val = f.value.trim();
        const bad = !val || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
        const parent = f.closest('.field');
        if (parent) parent.classList.toggle('invalid', bad);
        if (bad && !firstBad) firstBad = f;
      });
      if (firstBad) {
        if (note) {
          note.textContent = 'Please fill in every field with a valid email address.';
          note.classList.add('err');
        }
        firstBad.focus();
        return;
      }
      const [name, email, subject, message] = fields.map(f => f.value.trim());
      const body = `${message}\n\n— Sent by: ${name} (${email})\nVia portfolio inquiry`;
      window.location.href = `mailto:yadnyeshdhangar@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (note) {
        note.classList.remove('err');
        note.textContent = 'Opening your email client with the message ready — just click send!';
        setTimeout(() => { note.textContent = defaultNote; }, 8000);
      }
    });
    form.addEventListener('input', e => {
      const field = e.target.closest('.field');
      if (field) field.classList.remove('invalid');
    });
  }

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // ── Hero Interactive Canvas: Distributed Microservices Telemetry Engine ──
  initGatewayFeed();

  function initGatewayFeed() {
    const cv = $('#gatewayCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const logEl = $('#feedLog');
    const tpsEl = $('#hudTps');
    const p99El = $('#hudP99');
    const clockEl = $('#hudClock');

    let W = 0, H = 0;
    const clock = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

    // Node topology layout in normalized coordinates (0..1)
    const nodes = [
      { id: 'client', name: 'Browser UI', sub: 'ES Modules', x: 0.13, y: 0.50, color: '#38BDF8', icon: '💻' },
      { id: 'auth', name: 'OIDC Provider', sub: 'Login · Tokens', x: 0.35, y: 0.22, color: '#7FA8FF', icon: '🔐' },
      { id: 'gateway', name: 'nginx Routing', sub: 'Ingress · 5 repos', x: 0.35, y: 0.66, color: '#FF7C4A', icon: '⚡' },
      { id: 'bcps', name: 'Django BFF', sub: 'Templates · DRF', x: 0.60, y: 0.46, color: '#34D3A0', icon: '🐍' },
      { id: 't2eorem', name: 'Order Mgmt API', sub: 'API-key auth', x: 0.84, y: 0.20, color: '#FF5A1F', icon: '📦' },
      { id: 'davita', name: 'BSS · Inventory', sub: 'REST integrations', x: 0.84, y: 0.50, color: '#00D2D3', icon: '📡' },
      { id: 'kafka', name: 'Camunda BPMN', sub: 'bpmn-js viewer', x: 0.60, y: 0.80, color: '#FF9F43', icon: '🔀' },
      { id: 'db', name: 'PostgreSQL', sub: 'Django ORM', x: 0.60, y: 0.16, color: '#A78BFA', icon: '🗄️' },
      { id: 'ai', name: 'Team Mgmt API', sub: 'Permission views', x: 0.84, y: 0.80, color: '#E056FD', icon: '👥' }
    ];

    function updateNodeGeometry() {
      if (!W || !H) return;
      nodes.forEach(n => {
        ctx.font = '600 11px "Geist", -apple-system, BlinkMacSystemFont, sans-serif';
        const wName = ctx.measureText(n.name).width;
        ctx.font = '500 8.5px "Geist Mono", monospace';
        const wSub = ctx.measureText(n.sub).width;

        const padX = 14;
        n.w = Math.max(106, Math.ceil(Math.max(wName, wSub) + padX * 2));
        n.h = 46;

        const halfW = n.w / 2;
        const halfH = n.h / 2;

        const minX = halfW + 12;
        const maxX = Math.max(minX, W - halfW - 12);
        const minY = halfH + 34; // leave headroom for top HUD badge
        const maxY = Math.max(minY, H - halfH - 34); // leave space for bottom HUD badge

        n.cx = Math.max(minX, Math.min(maxX, n.x * W));
        n.cy = Math.max(minY, Math.min(maxY, n.y * H));
      });
    }

    function resize() {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateNodeGeometry();
    }
    window.addEventListener('resize', resize);
    resize();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateNodeGeometry);
    }

    const edges = [
      { from: 'client', to: 'gateway' },
      { from: 'gateway', to: 'auth' },
      { from: 'gateway', to: 'bcps' },
      { from: 'bcps', to: 'auth' },
      { from: 'bcps', to: 'db' },
      { from: 'bcps', to: 't2eorem' },
      { from: 'bcps', to: 'davita' },
      { from: 'bcps', to: 'ai' },
      { from: 'bcps', to: 'kafka' },
      { from: 't2eorem', to: 'kafka' }
    ];

    const packets = [];
    const rnd = (a, b) => a + Math.random() * (b - a);
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    const eventsList = [
      { type: 'OIDC', cls: 'ev-auth', text: 'Login callback OK · permission-gated view unlocked' },
      { type: 'DJANGO-BFF', cls: 'ev-bcps', text: 'json_script hydrated order-detail context · 14ms' },
      { type: 'ORDER-API', cls: 'ev-t2eorem', text: 'GET /orders/ORD-4821 · X-API-Key accepted · 200' },
      { type: 'BSS', cls: 'ev-davita', text: 'Suborder form POST relayed to BSS · 201 Created' },
      { type: 'BPMN', cls: 'ev-kafka', text: 'Camunda process instance rendered via bpmn-js' },
      { type: 'JEST', cls: 'ev-ai', text: '312 module tests passed · pytest 148 passed' },
      { type: 'NGINX', cls: 'ev-auth', text: 'Route /admin → team-management service (prod)' },
      { type: 'HELM', cls: 'ev-kafka', text: 'Release ngsd-fe rolled out to staging · 0 errors' }
    ];

    function logEvent(item) {
      if (!logEl) return;
      const li = document.createElement('li');
      li.innerHTML = `<time>${clock()}</time><b class="${item.cls}">${item.type}</b><span>${item.text}</span>`;
      logEl.prepend(li);
      while (logEl.children.length > 5) {
        logEl.lastChild.remove();
      }
    }

    let spawnTimer = 0;
    let logTimer = 0;
    let lastTime = performance.now();

    function spawnPacket() {
      const edge = pick(edges);
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        packets.push({
          from: fromNode,
          to: toNode,
          p: 0,
          speed: rnd(0.5, 0.9),
          color: fromNode.color
        });
      }
    }

    function render(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update HUD
      if (clockEl) clockEl.textContent = clock();
      if (tpsEl && Math.random() < 0.05) {
        tpsEl.textContent = (120 + Math.floor(Math.sin(now * 0.002) * 18 + rnd(-4, 6))).toLocaleString();
      }
      if (p99El && Math.random() < 0.04) {
        p99El.textContent = (86 + Math.floor(rnd(-8, 9)));
      }

      // Spawning
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawnPacket();
        spawnPacket();
        spawnTimer = rnd(0.2, 0.45);
      }

      // Log rotation
      logTimer -= dt;
      if (logTimer <= 0) {
        logEvent(pick(eventsList));
        logTimer = rnd(2.5, 4.2);
      }

      if (!nodes[0].cx) updateNodeGeometry();

      ctx.clearRect(0, 0, W, H);

      // Draw Edges (Circuits)
      ctx.lineWidth = 1.5;
      edges.forEach(e => {
        const n1 = nodes.find(n => n.id === e.from);
        const n2 = nodes.find(n => n.id === e.to);
        if (!n1 || !n2 || n1.cx === undefined || n2.cx === undefined) return;
        const x1 = n1.cx, y1 = n1.cy;
        const x2 = n2.cx, y2 = n2.cy;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Update & Draw Packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.p += p.speed * dt;
        if (p.p >= 1) {
          packets.splice(i, 1);
          continue;
        }
        if (!p.from || !p.to || p.from.cx === undefined || p.to.cx === undefined) continue;
        const x1 = p.from.cx, y1 = p.from.cy;
        const x2 = p.to.cx, y2 = p.to.cy;
        const px = x1 + (x2 - x1) * p.p;
        const py = y1 + (y2 - y1) * p.p;

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Nodes
      nodes.forEach(n => {
        const x = n.cx, y = n.cy;
        const halfW = n.w / 2, halfH = n.h / 2;

        // Card background
        ctx.fillStyle = 'rgba(12, 15, 20, 0.95)';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x - halfW, y - halfH, n.w, n.h, 8);
        } else {
          ctx.rect(x - halfW, y - halfH, n.w, n.h);
        }
        ctx.fill();

        // Card border with glow
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 1.35;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Node Title (Centered)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '600 11px "Geist", -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(n.name, x, y - 7);

        // Subtitle (Centered)
        ctx.font = '500 8.5px "Geist Mono", monospace';
        ctx.fillStyle = n.color;
        ctx.fillText(n.sub, x, y + 9);
      });

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }
})();
