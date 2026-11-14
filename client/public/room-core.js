/**
 * Room Core Controller (room-core.js)
 * Shared controller for all portfolio room pages:
 * - Parent iframe lifecycle communication (enter, exit, reset, mode, close, fullscreen)
 * - Sticky navigation bar (#rn) and mobile drawer menu (#rnPanel) with focus trap
 * - Dynamic "Back to the doors" pill injection
 * - Shimmering placeholder (.skel) watcher for progressive media loading
 * - Adaptive footer corner color and contrast luminance detection
 * - Floating Back-to-Top button with SVG circular progress ring
 */

(function () {
  'use strict';

  const root = document.documentElement;
  const isEmbed = root.classList.contains('embed');
  const homeUrl = '../#works'.replace(/#works$/, '');
  const roomSlugs = [
    'web-developer',
    'app-developer',
    'ui-ux-designer',
    'graphic-designer',
    'photographer',
  ];

  // ==========================================================================
  // 1. IFRAME POSTMESSAGE PARENT BRIDGE & LIFECYCLE
  // ==========================================================================
  function initIframeBridge() {
    // Intercept back-to-doors links when embedded
    if (isEmbed) {
      const backLinks = document.querySelectorAll('a[href="../#works"], a[href="./#works"]');
      backLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetOrigin = window.location.origin === 'null' ? '*' : window.location.origin;
          parent.postMessage({ wall: 'close' }, targetOrigin);
        });
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('rnPanel')?.getAttribute('aria-modal') !== 'true') {
          const targetOrigin = window.location.origin === 'null' ? '*' : window.location.origin;
          parent.postMessage({ wall: 'close' }, targetOrigin);
        }
      });
    }

    // Handle incoming messages from portfolio parent frame
    window.addEventListener('message', (e) => {
      if (e.source !== parent) return;
      const data = e.data || {};

      if (data.wall === 'enter') {
        root.classList.remove('out');
        window.scrollTo(0, 0);
        if (typeof window.__restartAll === 'function') {
          window.__restartAll();
        }
        requestAnimationFrame(() => root.classList.add('in'));
        clearTimeout(window.__liveT);
        window.__liveT = setTimeout(() => {
          window.__live = true;
          window.dispatchEvent(new Event('scroll'));
        }, 650);
      }

      if (data.wall === 'exit') {
        clearTimeout(window.__liveT);
        window.__live = false;
        root.classList.add('out');
        root.classList.remove('in');
        document.querySelectorAll('video').forEach((v) => v.pause());
      }

      if (data.wall === 'reset') {
        root.classList.remove('out', 'in');
      }

      if (data.wall === 'mode') {
        if (data.mode === 'dark') {
          root.dataset.mode = 'dark';
        } else {
          delete root.dataset.mode;
        }
      }
    });
  }

  // ==========================================================================
  // 2. FULLSCREEN SHORTCUT ('F' / 'Esc')
  // ==========================================================================
  function initFullscreen() {
    const isTyping = (e) => {
      const target = e.target;
      return target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    };

    const toggle = () => {
      const d = document;
      const el = d.documentElement;
      if (d.fullscreenElement || d.webkitFullscreenElement) {
        (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      } else {
        (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)?.catch?.(() => {});
      }
    };

    window.addEventListener('keydown', (e) => {
      if ((e.key !== 'f' && e.key !== 'F') || e.metaKey || e.ctrlKey || e.altKey || isTyping(e)) return;
      e.preventDefault();
      if (window.top !== window) {
        try {
          const targetOrigin = window.location.origin === 'null' ? '*' : window.location.origin;
          parent.postMessage({ wall: 'fullscreen' }, targetOrigin);
        } catch {}
        return;
      }
      toggle();
    });

    if (window.top === window) {
      window.addEventListener('message', (e) => {
        if (
          !e.data ||
          e.data.wall !== 'fullscreen' ||
          ![...document.querySelectorAll('iframe')].some((f) => f.contentWindow === e.source)
        ) {
          return;
        }
        toggle();
      });
    }
  }

  // ==========================================================================
  // 3. PROGRESSIVE MEDIA SHIMMER PLACEHOLDERS (.skel)
  // ==========================================================================
  function initMediaPlaceholders() {
    const markDone = (el) => el.parentElement && el.parentElement.classList.remove('skel');

    const watchMedia = (el) => {
      const box = el.parentElement;
      if (!box || box.dataset.sk || el.closest('.app')) return;
      box.dataset.sk = '1';

      if (el.tagName === 'IMG') {
        if (el.complete && el.naturalWidth) return;
        box.classList.add('skel');
        el.addEventListener('load', () => markDone(el), { once: true });
        el.addEventListener('error', () => markDone(el), { once: true });
      } else {
        el.addEventListener('waiting', () => box.classList.add('skel-buf'));
        ['playing', 'canplay', 'pause', 'error'].forEach((ev) =>
          el.addEventListener(ev, () => box.classList.remove('skel-buf'))
        );
        if (el.readyState >= 2) return;
        box.classList.add('skel');
        el.addEventListener('loadeddata', () => markDone(el), { once: true });
        if (el.poster) {
          const im = new Image();
          im.onload = () => markDone(el);
          im.src = el.poster;
        }
      }
    };

    const scan = () => document.querySelectorAll('main img, main video, .ph img').forEach(watchMedia);
    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  }

  // ==========================================================================
  // 4. INJECT STICKY "BACK TO DOORS" PILL
  // ==========================================================================
  function initBackToDoors() {
    const topChip = document.querySelector('.top .chip');
    const navBar = document.querySelector('.rn__in');
    if (!topChip || !navBar) return;

    const backBtn = document.createElement('a');
    backBtn.className = 'backd';
    backBtn.href = topChip.getAttribute('href') || '../#works';
    backBtn.setAttribute('aria-label', 'Back to the doors');
    backBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M19 12H5M11 6l-6 6 6 6"/>
      </svg>
      <span>Back to the doors</span>
    `;

    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      topChip.click();
    });

    navBar.insertBefore(backBtn, navBar.firstChild);
    topChip.style.visibility = 'hidden';
    topChip.tabIndex = -1;
    requestAnimationFrame(() => backBtn.classList.add('show'));
  }

  // ==========================================================================
  // 5. INTER-ROOM NAVIGATION & STICKY NAVBAR
  // ==========================================================================
  function navigateTo(target) {
    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (isEmbed) {
      const targetOrigin = window.location.origin === 'null' ? '*' : window.location.origin;
      parent.postMessage({ wall: 'go', to: target }, targetOrigin);
      return;
    }

    if (target === 'home') {
      window.location.href = homeUrl;
    } else if (target === 'about') {
      window.location.href = `${homeUrl}#about`;
    } else if (target === 'contact') {
      window.location.href = `${homeUrl}#contact`;
    } else if (target.startsWith('door:')) {
      const doorIndex = parseInt(target.slice(5), 10);
      window.location.href = `${homeUrl}#${roomSlugs[doorIndex] || ''}`;
    }
  }

  function initRoomNavigation() {
    const rn = document.getElementById('rn');
    const menuBtn = document.getElementById('rnMenu');
    const panel = document.getElementById('rnPanel');
    const closeBtn = document.getElementById('rnClose');

    // Handle delegated navigation clicks
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-nav]');
      if (!btn) return;

      if (btn.tagName === 'A' && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button)) {
        return;
      }

      e.preventDefault();
      if (rn) rn.classList.remove('open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');

      const target = btn.dataset.nav;
      if (btn.hasAttribute('aria-current')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      navigateTo(target);
    });

    if (!panel || !menuBtn || !closeBtn || !rn) return;

    // Stagger navigation items in mobile drawer
    panel.querySelectorAll('.rn__plist button').forEach((btn, i) => {
      btn.style.setProperty('--i', i);
    });

    const setDrawerOpen = (open) => {
      rn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      root.classList.toggle('rn-lock', open);
      if (open) {
        setTimeout(() => closeBtn.focus(), 60);
      } else {
        menuBtn.focus();
      }
    };

    menuBtn.addEventListener('click', () => setDrawerOpen(!rn.classList.contains('open')));
    closeBtn.addEventListener('click', () => setDrawerOpen(false));

    // Keyboard trap for drawer
    window.addEventListener('keydown', (e) => {
      if (!rn.classList.contains('open')) return;
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const buttons = [...panel.querySelectorAll('button')].filter((b) => b.offsetWidth || b.offsetHeight);
      if (!buttons.length) return;

      const first = buttons[0];
      const last = buttons[buttons.length - 1];

      if (!panel.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    panel.addEventListener('click', (e) => {
      if (e.target.closest('button[data-nav]')) setDrawerOpen(false);
    });

    window.matchMedia('(min-width: 1200px)').addEventListener('change', (e) => {
      if (e.matches) setDrawerOpen(false);
    });

    // Sticky navbar listener
    const updateStuck = () => rn.classList.toggle('stuck', window.scrollY > 10);
    window.addEventListener('scroll', updateStuck, { passive: true });
    updateStuck();

    // Adjust card stack offset dynamically to match navbar height
    const syncNavHeight = () => {
      root.style.setProperty('--nav-h', `${rn.offsetHeight}px`);
      root.style.setProperty('--rn-h', `${rn.offsetHeight}px`);
    };
    syncNavHeight();
    window.addEventListener('resize', syncNavHeight);
    new ResizeObserver(syncNavHeight).observe(rn);

    // Format header and footer date labels
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const now = new Date();
    const isMobile = window.matchMedia('(max-width: 767.98px)').matches;
    const formattedDate = isMobile
      ? `${now.getDate()} ${months[now.getMonth()].slice(0, 3)}`
      : `${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`;

    document.querySelectorAll('[data-fdate]').forEach((el) => {
      el.textContent = formattedDate;
    });
  }

  // ==========================================================================
  // 6. ADAPTIVE FOOTER CORNER & BACK-TO-TOP BUTTON
  // ==========================================================================
  function initFooterAndBackToTop() {
    // Clock tick for footer time & year
    const updateTime = () => {
      const d = new Date();
      const h = d.getHours();
      document.querySelectorAll('[data-ftime]').forEach((el) => {
        el.textContent = `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`;
      });
      document.querySelectorAll('[data-fyear]').forEach((el) => {
        el.textContent = String(d.getFullYear());
      });
    };
    updateTime();
    setInterval(updateTime, 20000);

    // Dynamic fluid typography sizing for `.sf__word`
    const fitFooterWord = () => {
      document.querySelectorAll('.sf').forEach((f) => {
        const w = f.querySelector('.sf__word');
        if (!w) return;
        const span = [...w.children].find((s) => getComputedStyle(s).display !== 'none');
        if (!span) return;
        w.style.setProperty('--wf', '100px');
        const k = (f.clientWidth * 0.955) / span.getBoundingClientRect().width;
        f.style.setProperty('--wf', `${(100 * k).toFixed(2)}px`);
        w.style.removeProperty('--wf');
      });
    };
    fitFooterWord();
    window.addEventListener('resize', fitFooterWord);
    document.fonts?.ready?.then(fitFooterWord);

    // Corner background sampling
    const sfw = document.querySelector('.sfw');
    const updateAboveColor = () => {
      if (!sfw) return;
      const getSolidColor = (el) => {
        const c = getComputedStyle(el).backgroundColor;
        const m = c.match(/[\d.]+/g);
        return m && !(m.length > 3 && +m[3] < 0.05) ? c : '';
      };

      let col = '';
      let el = sfw.previousElementSibling;
      while (el) {
        if (el.getBoundingClientRect().width >= window.innerWidth * 0.9) {
          const c = getSolidColor(el);
          if (c) col = c;
        }
        el = el.lastElementChild;
      }

      const bg = col || getSolidColor(document.body) || getComputedStyle(root).backgroundColor;
      sfw.style.setProperty('--above', bg);

      const m = (bg.match(/[\d.]+/g) || [255, 255, 255]).map(Number);
      sfw.classList.toggle('sfw--dark', (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 < 0.25);
    };

    updateAboveColor();
    window.addEventListener('load', updateAboveColor);
    window.addEventListener('resize', updateAboveColor);
    new MutationObserver(updateAboveColor).observe(root, {
      attributes: true,
      attributeFilter: ['data-mode'],
    });

    // Floating Back-to-Top button
    const tt = document.querySelector('.totop');
    if (tt) {
      tt.style.setProperty('--len', (2 * Math.PI * 24).toFixed(2));

      const getLuminance = (targetEl) => {
        for (let e = targetEl; e && e !== root; e = e.parentElement) {
          const m = getComputedStyle(e).backgroundColor.match(/[\d.]+/g);
          if (!m) continue;
          if (m.length > 3 && +m[3] < 0.5) continue;
          return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255;
        }
        const m = getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g) || [255, 255, 255];
        return m.length > 3 && +m[3] < 0.5
          ? root.dataset.mode === 'dark' ? 0 : 1
          : (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255;
      };

      let raf = 0;
      const updateButton = () => {
        raf = 0;
        const max = root.scrollHeight - window.innerHeight;
        const y = window.scrollY;
        const bot = document.querySelector('.sf__bot');

        tt.classList.toggle(
          'show',
          y > window.innerHeight * 0.9 && !(bot && bot.getBoundingClientRect().top < window.innerHeight - 8)
        );
        tt.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : '0');

        const r = tt.getBoundingClientRect();
        tt.style.pointerEvents = 'none';
        const under = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        tt.style.pointerEvents = '';
        if (under) {
          tt.dataset.on = getLuminance(under) < 0.45 ? 'dark' : 'light';
        }
      };

      const queueUpdate = () => {
        if (!raf) raf = requestAnimationFrame(updateButton);
      };

      window.addEventListener('scroll', queueUpdate, { passive: true });
      window.addEventListener('resize', queueUpdate);
      new MutationObserver(queueUpdate).observe(root, {
        attributes: true,
        attributeFilter: ['data-mode', 'class'],
      });
      updateButton();
    }
  }

  // Initialize all controllers once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initIframeBridge();
      initFullscreen();
      initMediaPlaceholders();
      initBackToDoors();
      initRoomNavigation();
      initFooterAndBackToTop();
    });
  } else {
    initIframeBridge();
    initFullscreen();
    initMediaPlaceholders();
    initBackToDoors();
    initRoomNavigation();
    initFooterAndBackToTop();
  }
})();
