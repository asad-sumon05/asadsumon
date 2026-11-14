import React, { useEffect, useRef } from 'react';
import { createSpring } from '../utils/spring';
import { useSmoothScroll } from '../context/SmoothScrollContext';

// ============================================================================
// 1. CONFIGURATION & DOOR DEFINITIONS
// ============================================================================

const DOORS_CONFIG = [
  {
    id: 0,
    slug: 'web-developer',
    title: 'Web Development',
    route: '/web-developer/',
    label: 'Web Developer',
    doorCol: '#22304a',
    doorDk: '#1c2840',
    info: [
      'Web Development',
      'End to end, from sketch to live site',
      [
        'Discovery & planning',
        'UX & visual design',
        'Front-end & back-end development',
        'Technical SEO & performance',
        'Analytics, launch & ongoing support',
      ],
    ],
  },
  {
    id: 1,
    slug: 'app-developer',
    title: 'App Development',
    route: '/app-developer/',
    label: 'App Developer',
    doorCol: '#4a3540',
    doorDk: '#3f2d37',
    info: [
      'App Development',
      'From the first idea to the app store',
      [
        'Product scoping & user flows',
        'Interface design',
        'Cross-platform development',
        'Device testing & store launch',
        'Analytics, monitoring & updates',
      ],
    ],
  },
  {
    id: 2,
    slug: 'ui-ux-designer',
    title: 'UI/UX Design',
    route: '/ui-ux-designer/',
    label: 'UI/UX Designer',
    doorCol: '#7a8670',
    doorDk: '#66705d',
    info: [
      'UI/UX Design',
      'Research first, pixels second',
      [
        'Brand & business needs analysis',
        'User & competitor research',
        'Information architecture & flows',
        'Wireframes & high-fidelity UI',
        'Interactive prototypes & testing',
      ],
    ],
  },
  {
    id: 3,
    slug: 'graphic-designer',
    title: 'Graphic Design',
    route: '/graphic-designer/',
    label: 'Graphic Designer',
    doorCol: '#a4552c',
    doorDk: '#8c4826',
    info: [
      'Graphic Design',
      'Visual content true to the brand',
      [
        'Brand, audience & tone analysis',
        'Built around brand guidelines',
        'Posters & social media creatives',
        'Strong type & clear hierarchy',
        'Every format each platform needs',
      ],
    ],
  },
  {
    id: 4,
    slug: 'photographer',
    title: 'Photography',
    route: '/photographer/',
    label: 'Photographer',
    doorCol: '#262523',
    doorDk: '#201f1d',
    isSecret: true,
    info: [
      'Photography',
      'The eye behind every layout',
      [
        'Architecture, concerts & sport',
        'Nature & product',
        'Light & composition first',
      ],
    ],
  },
];

const ROUTES = DOORS_CONFIG.map((d) => d.route);
const SLUGS = DOORS_CONFIG.map((d) => d.slug);
const TITLES = DOORS_CONFIG.map((d) => d.title);
const INFO = DOORS_CONFIG.map((d) => d.info);

/**
 * DoorsNavigation - Interactive 3D Doors wall with Euler spring physics,
 * perspective tilt, crack hover open, zoom walk-through, mobile pinned-swipe,
 * and seamless iframe room transitions.
 */
export default function DoorsNavigation() {
  // DOM element references
  const secRef = useRef(null);
  const wallRef = useRef(null);
  const dinfoRef = useRef(null);
  const dotsRef = useRef(null);
  const rowRef = useRef(null);
  const pinRef = useRef(null);
  const badgeRef = useRef(null);
  const veilRef = useRef(null);
  const shadeRef = useRef(null);
  const passageRef = useRef(null);
  const wallvRef = useRef(null);
  const unitsRef = useRef([]);

  const { scrollToId } = useSmoothScroll();

  useEffect(() => {
    const sec = secRef.current;
    const wallEl = wallRef.current;
    const dinfo = dinfoRef.current;
    const mDots = dotsRef.current;
    const mRow = rowRef.current;
    const mPin = pinRef.current;
    const badge = badgeRef.current;
    const shade = shadeRef.current;
    const dark = passageRef.current;
    const wallv = wallvRef.current;
    const units = unitsRef.current.filter(Boolean);

    if (!sec || !wallEl || !dinfo || !mRow || units.length < 5) return;

    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const MOB = window.matchMedia('(max-width: 639.98px)');

    const ANG = 70;
    const ANG_WALK = 70;
    let busy = false;
    let inWall = false;
    let pushed = false;
    let cur = 0;
    let walkRaf = 0;
    const DOC_TITLE = document.title;

    // ========================================================================
    // 2. EULER SPRINGS PER DOOR (CRACK HOVER & SWING OPEN)
    // ========================================================================
    const doorsState = units.map((u) => {
      const door = u.querySelector('.door');
      const s = createSpring({ tension: 120, friction: 14 }, (o) => {
        if (door) door.style.transform = `rotateY(${Math.max(0, o) * ANG}deg)`;
        u.style.setProperty('--o', Math.max(0, o).toFixed(4));
      });
      return { u, door, s, way: u.querySelector('.doorway') };
    });

    // Reveal doors with entrance animation once section intersects viewport
    let io = null;
    if ('IntersectionObserver' in window && !reduced) {
      sec.classList.add('pre');
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            sec.classList.add('in');
            requestAnimationFrame(() => sec.classList.remove('pre'));
            if (io) io.disconnect();
          }
        },
        { threshold: 0.18 }
      );
      io.observe(sec);
    }

    // ========================================================================
    // 3. CURSOR BADGE FOR DESKTOP POINTER
    // ========================================================================
    let over = false;
    const placeBadge = (e) => {
      if (badge) {
        badge.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    const showBadge = (on) => {
      over = on;
      if (badge) badge.classList.toggle('on', on);
    };

    const handlePointerMove = (e) => {
      if (over) placeBadge(e);
    };

    if (canHover) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      doorsState.forEach((d) => {
        d.way?.addEventListener('pointerenter', (e) => {
          placeBadge(e);
          if (!busy) showBadge(true);
        });
        d.way?.addEventListener('pointerleave', () => showBadge(false));
      });
    }

    // ========================================================================
    // 4. LAZY IFRAME ROOM PRE-WARMING & POSTMESSAGE COMMUNICATION
    // ========================================================================
    const frames = [];
    const ready = [];
    const warmed = new Set();
    let frame = null;

    function loadRoom(i) {
      if (frames[i] || !wallv) return;
      const f = document.createElement('iframe');
      f.src = ROUTES[i] + '?embed';
      f.title = TITLES[i];
      f.tabIndex = -1;
      f.addEventListener(
        'load',
        () => {
          ready[i] = true;
          try {
            f.contentWindow?.postMessage(
              { wall: 'mode', mode: root.dataset.mode === 'dark' ? 'dark' : 'light' },
              window.location.origin === 'null' ? '*' : window.location.origin
            );
          } catch {}
        },
        { once: true }
      );
      frames[i] = f;
      wallv.appendChild(f);
    }

    const warm = (i) => {
      if (warmed.has(i)) return;
      warmed.add(i);
      loadRoom(i);
    };

    const pick = (i) => {
      cur = i;
      frame = frames[i];
      frames.forEach((f, k) => {
        if (f) f.classList.toggle('cur', k === i);
      });
    };

    const toWall = (msg) => {
      try {
        frame?.contentWindow?.postMessage(
          msg,
          window.location.origin === 'null' ? '*' : window.location.origin
        );
      } catch {}
    };

    // Pre-warm rooms as wall approaches within 200px or when page is idle
    let nearIo = null;
    if ('IntersectionObserver' in window) {
      nearIo = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            if (nearIo) nearIo.disconnect();
            setTimeout(() => {
              warm(4);
              setTimeout(() => [0, 1, 2, 3].forEach(warm), 1200);
            }, 400);
          }
        },
        { rootMargin: '200px' }
      );
      nearIo.observe(sec);
    }

    // Idle background pre-warming of rooms
    const warmIdleTimer = setTimeout(() => {
      [0, 1, 2, 3, 4].forEach(warm);
    }, 1200);

    const lift = () => {
      if (sec.classList.contains('lift')) return;
      sec.classList.add('lift');
    };
    sec.addEventListener('pointerenter', lift);

    doorsState.forEach((d, i) => {
      d.way?.addEventListener('focus', lift);
      d.way?.addEventListener('pointerenter', () => warm(i));
      d.way?.addEventListener('focus', () => warm(i));
      if (canHover) {
        d.way?.addEventListener('mouseenter', () => {
          if (!busy) d.s.set(0.1);
        });
        d.way?.addEventListener('mouseleave', () => {
          if (!busy) d.s.set(0);
        });
      }
      d.way?.addEventListener('click', () => enter(i));
    });

    // Populate accessibility descriptions
    units.forEach((u, i) => {
      const w = u.querySelector('.doorway');
      if (w && INFO[i]) {
        w.setAttribute('aria-description', `${INFO[i][1]}: ${INFO[i][2].join(', ')}`);
      }
    });

    const setInfo = (i) => {
      if (!INFO[i]) return;
      const h = dinfo.querySelector('.dinfo__h');
      const t = dinfo.querySelector('.dinfo__t');
      const p = dinfo.querySelector('.dinfo__p');
      if (h) h.textContent = INFO[i][0];
      if (t) t.textContent = INFO[i][1];
      if (p) p.innerHTML = INFO[i][2].map((s) => `<li>${s}</li>`).join('');
    };

    // ========================================================================
    // 5. DESKTOP HOVER INFO PANEL
    // ========================================================================
    if (canHover) {
      let active = -1;
      let token = 0;
      let px = -1;
      let py = -1;

      const show = (i) => {
        const my = ++token;
        units.forEach((u, k) => u.classList.toggle('on', k === i));
        sec.classList.add('focus');
        const visible = units.filter((u) => getComputedStyle(u).visibility !== 'hidden');
        const vi = visible.indexOf(units[i]);
        if (vi < 0) return;

        const wr = wallEl.getBoundingClientRect();
        const r = units[i].getBoundingClientRect();
        const toRight = vi < 2 && visible[vi + 2];
        const a = toRight
          ? visible[vi + 1].getBoundingClientRect()
          : (visible[vi - 2] || visible[vi - 1]).getBoundingClientRect();
        const b = toRight
          ? visible[vi + 2].getBoundingClientRect()
          : visible[vi - 1].getBoundingClientRect();

        const left = Math.min(a.left, b.left);
        const right = Math.max(a.right, b.right);

        const place = () => {
          if (my !== token || active !== i) return;
          setInfo(i);
          const w = Math.min(right - left, 22 * 16);
          dinfo.style.width = w + 'px';
          dinfo.style.left = left - wr.left + (right - left - w) / 2 + 'px';
          dinfo.style.top = r.top - wr.top + r.height * 0.5 - dinfo.offsetHeight / 2 + 'px';
          dinfo.classList.add('on');
        };

        if (dinfo.classList.contains('on')) {
          dinfo.classList.remove('on');
          setTimeout(place, 130);
        } else {
          place();
        }
      };

      const hide = () => {
        token++;
        sec.classList.remove('focus');
        units.forEach((u) => u.classList.remove('on'));
        dinfo.classList.remove('on');
      };

      const setHover = (i) => {
        if (busy) i = -1;
        if (i === active) return;
        active = i;
        if (i < 0) hide();
        else show(i);
      };

      const under = (el) => {
        const w = el && el.closest ? el.closest('.doorway') : null;
        return w ? units.findIndex((u) => u.contains(w)) : -1;
      };

      const onPointerMoveHover = (e) => {
        px = e.clientX;
        py = e.clientY;
        setHover(under(e.target));
      };

      const onScrollHover = () => {
        if (px >= 0) setHover(under(document.elementFromPoint(px, py)));
      };

      window.addEventListener('pointermove', onPointerMoveHover, { passive: true });
      window.addEventListener('scroll', onScrollHover, { passive: true });
      document.documentElement.addEventListener('pointerleave', () => setHover(-1));
      window.addEventListener('blur', () => setHover(-1));

      window.__doorHover = setHover;
    } else if (!MOB.matches) {
      dinfo.style.display = 'none';
    }

    // ========================================================================
    // 6. MOBILE / TOUCH PINNED SCROLL CAROUSEL
    // ========================================================================
    let mIdx = 0;
    let mForce = -1;
    let mShown = -1;
    let mCur = 0;
    let mRaf = 0;
    let mLast = 0;

    const mSpan = () => Math.max(1, sec.offsetHeight - window.innerHeight);
    const mobY = (i) =>
      sec.getBoundingClientRect().top +
      window.pageYOffset +
      (Math.min(3, Math.max(0, i)) / 3) * mSpan();

    const mDwell = (f) => {
      const i = Math.floor(f);
      const t = f - i;
      const u = Math.min(1, Math.max(0, (t - 0.2) / 0.6));
      return i + u * u * (3 - 2 * u);
    };

    const mProgress = () =>
      Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / mSpan()));
    const mTarget = () => (mForce >= 0 ? mForce : mDwell(mProgress() * 3));

    function mShow(i) {
      if (i === mShown) return;
      mShown = i;
      setInfo(i);
      mDots?.querySelectorAll('i').forEach((d, k) => {
        d.classList.toggle('on', k === Math.min(3, i));
      });
      dinfo.getAnimations().forEach((a) => a.cancel());
      if (!reduced) {
        dinfo.animate(
          [
            { opacity: 0, transform: 'translateY(.4rem)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' }
        );
      }
    }

    function mFrame(now) {
      mRaf = 0;
      if (!MOB.matches) {
        mRow.style.transform = '';
        return;
      }
      const dt = Math.min(64, now - (mLast || now));
      mLast = now;
      const t = mTarget();
      mCur = reduced ? t : mCur + (t - mCur) * Math.min(1, (dt / 1000) * 10);
      mCur = Math.max(t - 1, Math.min(t + 1, mCur));
      if (Math.abs(t - mCur) < 0.001) mCur = t;

      const step = units[1]?.offsetLeft - units[0]?.offsetLeft || 200;
      mRow.style.transform = `translate3d(${(-mCur * step).toFixed(2)}px,0,0)`;
      mIdx = Math.round(t);
      mShow(mForce >= 0 ? mForce : mIdx);

      if (mCur !== t) mRaf = requestAnimationFrame(mFrame);
    }

    function mApply() {
      if (!mRaf) mRaf = requestAnimationFrame(mFrame);
    }

    function mSize() {
      if (!MOB.matches) {
        if (mPin) mPin.style.removeProperty('--uw');
        sec.classList.remove('compact');
        return;
      }
      const fit = () => {
        const pr = mPin ? mPin.getBoundingClientRect() : { bottom: 0 };
        const rr = mRow.getBoundingClientRect();
        const avail =
          pr.bottom - rr.top - parseFloat(getComputedStyle(mRow).paddingTop) - 2;
        return Math.min(window.innerWidth * 0.6, avail / 2.25);
      };
      sec.classList.remove('compact');
      let w = fit();
      if (w < 150) {
        sec.classList.add('compact');
        w = fit();
      }
      if (mPin) mPin.style.setProperty('--uw', Math.max(110, w).toFixed(1) + 'px');
      mApply();
    }

    window.addEventListener('resize', mSize);
    window.addEventListener('scroll', mApply, { passive: true });
    mSize();

    // Sideways swipe gestures on mobile
    let tx0 = 0;
    let ty0 = 0;
    let i0 = 0;

    const onTouchStart = (e) => {
      tx0 = e.touches[0].clientX;
      ty0 = e.touches[0].clientY;
      i0 = Math.round(mProgress() * 3);
    };

    const onTouchEnd = (e) => {
      if (!MOB.matches || busy || mForce >= 0) return;
      const dx = e.changedTouches[0].clientX - tx0;
      const dy = e.changedTouches[0].clientY - ty0;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      const to = Math.min(3, Math.max(0, i0 + (dx < 0 ? 1 : -1)));
      window.scrollTo({ top: mobY(to), behavior: reduced ? 'auto' : 'smooth' });
    };

    sec.addEventListener('touchstart', onTouchStart, { passive: true });
    sec.addEventListener('touchend', onTouchEnd, { passive: true });

    if (MOB.matches) {
      mShown = -1;
      mShow(0);
      dinfo.classList.add('on');
      mCur = mTarget();
      mApply();
    }

    // ========================================================================
    // 7. SECRET 5TH DOOR (PHOTOGRAPHY) REVEAL MECHANIC
    // ========================================================================
    const SECRET = 4;
    const secretUnit = units[SECRET];

    function revealSecret(on) {
      sec.classList.toggle('reveal', on);
      if (secretUnit) {
        if (on) secretUnit.removeAttribute('inert');
        else secretUnit.setAttribute('inert', '');
      }
    }

    // ========================================================================
    // 8. 3D CAMERA WALK-THROUGH ZOOM & IFRAME HANDOFF
    // ========================================================================
    const swallow = (e) => e.preventDefault();
    const keysStop = (e) => {
      if (
        ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(
          e.key
        ) &&
        !inWall
      ) {
        e.preventDefault();
      }
    };

    function holdScroll(on) {
      if (on) {
        window.addEventListener('wheel', swallow, { passive: false });
        window.addEventListener('touchmove', swallow, { passive: false });
        window.addEventListener('keydown', keysStop);
      } else {
        window.removeEventListener('wheel', swallow);
        window.removeEventListener('touchmove', swallow);
        window.removeEventListener('keydown', keysStop);
      }
    }

    function enter(i) {
      if (busy) return;
      busy = true;
      warm(i);
      lift();
      showBadge(false);
      window.__doorHover?.(-1);
      sec.classList.remove('focus');
      units.forEach((u) => u.classList.remove('on'));
      dinfo.classList.remove('on');

      const d = doorsState[i];
      doorsState.forEach((o, k) => {
        if (k !== i) o.s.set(0);
      });
      d.u.classList.add('press');
      setTimeout(() => d.u.classList.remove('press'), 380);
      setTimeout(() => d.s.set(ANG_WALK / ANG), reduced ? 0 : 170);
      setTimeout(() => through(i), reduced ? 0 : 760);
    }

    function through(i) {
      const u = units[i];
      if (!u) {
        busy = false;
        return;
      }
      const r = u.querySelector('.opening')?.getBoundingClientRect();
      const dr = u.querySelector('.door')?.getBoundingClientRect();
      if (!r || !dr) {
        busy = false;
        return;
      }
      const gapL = Math.min(Math.max(dr.right, r.left), r.right - 6);
      const gw = Math.max(r.right - gapL, 10);
      const gh = r.height;
      const cx = (gapL + r.right) / 2;
      const cy = r.top + gh * 0.5;

      holdScroll(true);
      document.getElementById('cord')?.classList.add('away');
      document.querySelector('.hdr')?.classList.add('away');

      const sr = sec.getBoundingClientRect();
      sec.style.transformOrigin = `${cx - sr.left}px ${cy - sr.top}px`;
      sec.classList.add('through');

      const tx = window.innerWidth / 2 - cx;
      const ty = window.innerHeight / 2 - cy;
      const sEnd = Math.max(window.innerWidth / gw, window.innerHeight / gh) * 1.15;
      const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
      const zoomOf = (e) => Math.exp(Math.log(sEnd) * e);
      const t0 = performance.now();
      const D = reduced ? 1 : 1500;
      let handed = false;

      const stepZoom = (now) => {
        const p = Math.min(1, (now - t0) / D);
        const e = ease(p);
        const sc = zoomOf(e);
        const f = Math.min(1, e * 1.6);
        sec.style.transform = `translate(${tx * f}px, ${ty * f}px) scale(${sc})`;

        if (!handed && (sc >= sEnd / 1.15 || p >= 1)) {
          handed = true;
          handoff();
        }
        if (p < 1) walkRaf = requestAnimationFrame(stepZoom);
      };
      walkRaf = requestAnimationFrame(stepZoom);

      function handoff() {
        pick(i);
        if (wallv) {
          wallv.classList.add('on');
          const activate = () => {
            inWall = true;
            wallv.classList.add('live');
            try {
              window.history.pushState({ wall: 1 }, '', ROUTES[i]);
              pushed = true;
            } catch {
              pushed = false;
            }
            document.title = `${TITLES[i]} — Sumon`;
            toWall({ wall: 'enter' });
            try {
              frame?.contentWindow?.focus();
            } catch {}
          };

          if (ready[i]) {
            activate();
          } else {
            frame?.addEventListener('load', activate, { once: true });
            setTimeout(() => {
              if (!inWall) activate();
            }, 600);
          }
        }
      }
    }

    // ========================================================================
    // 9. EXIT TRANSITIONS & RETURN TO WALL
    // ========================================================================
    let afterLeave = null;

    function leaveWall() {
      if (!inWall || !wallv) return;
      inWall = false;
      wallv.classList.remove('live');
      document.title = DOC_TITLE;
      const d = doorsState[cur];
      toWall({ wall: 'exit' });

      setTimeout(
        () => {
          wallv.classList.remove('on');
          setTimeout(
            () => {
              cancelAnimationFrame(walkRaf);
              const from = sec.style.transform;
              const backPromise = new Promise((res) => {
                const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([\d.]+)\)/.exec(
                  from
                ) || [0, 0, 0, 1];
                const X = +m[1];
                const Y = +m[2];
                const S = +m[3];
                const t0 = performance.now();
                const D = reduced ? 1 : 1300;
                const easeOut = (x) => 1 - Math.pow(1 - x, 3);
                const stepBack = (now) => {
                  const p = Math.min(1, (now - t0) / D);
                  const e = easeOut(p);
                  const sc = Math.exp(Math.log(S) * (1 - e));
                  sec.style.transform = `translate(${X * (1 - e)}px, ${Y * (1 - e)}px) scale(${sc})`;
                  if (p < 1) {
                    requestAnimationFrame(stepBack);
                  } else {
                    sec.style.transform = '';
                    res();
                  }
                };
                requestAnimationFrame(stepBack);
              });

              backPromise.then(() => {
                cancelAnimationFrame(walkRaf);
                sec.style.transform = '';
                if (dark) dark.hidden = true;
                if (shade) shade.hidden = true;
                sec.classList.remove('through', 'lift');
                sec.style.transformOrigin = '';
                if (d) d.s.set(0);
                document.getElementById('cord')?.classList.remove('away');
                document.querySelector('.hdr')?.classList.remove('away');
                busy = false;
                holdScroll(false);
                toWall({ wall: 'reset' });

                if (afterLeave) {
                  const f = afterLeave;
                  afterLeave = null;
                  setTimeout(f, 60);
                }

                if (cur === SECRET) {
                  if (MOB.matches) {
                    mForce = -1;
                    mApply();
                    setTimeout(() => revealSecret(false), reduced ? 0 : 580);
                  } else {
                    setTimeout(() => revealSecret(false), reduced ? 0 : 500);
                  }
                  units[SECRET - 1]?.querySelector('.doorway')?.focus({ preventScroll: true });
                } else {
                  d.way?.focus({ preventScroll: true });
                }
              });
            },
            reduced ? 0 : 360
          );
        },
        reduced ? 0 : 520
      );
    }

    // ========================================================================
    // 10. GLOBAL WINDOW DOOR TRIGGER & INTER-ROOM ROUTING
    // ========================================================================
    window.openDoor = (i) => {
      // If already in a room, back out of current room, close the door, and enter the clicked door
      if (inWall) {
        if (i === cur) return;
        afterLeave = () => window.openDoor(i);
        leaveWall();
        return;
      }

      if (busy) return;

      const top = MOB.matches
        ? mobY(Math.min(i, 3))
        : sec.getBoundingClientRect().top + window.pageYOffset;
      const far = Math.abs(window.pageYOffset - top) > 4;

      if (far) {
        if (window.__lenis) {
          window.__lenis.scrollTo(top, {
            duration: 0.9,
            easing: (x) => 1 - Math.pow(1 - x, 3),
          });
        } else {
          window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
        }
      }
      const t0 = performance.now();
      warm(i);

      const settle = () => {
        if (far && Math.abs(window.pageYOffset - top) > 24 && performance.now() - t0 < 1500) {
          return requestAnimationFrame(settle);
        }
        if (!ready[i] && performance.now() - t0 < 4000) {
          return requestAnimationFrame(settle);
        }
        let wait = 0;
        if (MOB.matches) {
          const want = i === SECRET ? SECRET : i;
          const before = mForce >= 0 ? mForce : mIdx;
          if (i === SECRET) {
            revealSecret(true);
            mForce = SECRET;
          } else {
            mIdx = i;
          }
          mApply();
          if (want !== before) wait = reduced ? 0 : 560;
        } else if (i === SECRET && !sec.classList.contains('reveal')) {
          revealSecret(true);
          wait = reduced ? 0 : 850;
        }
        setTimeout(() => enter(i), wait);
      };
      requestAnimationFrame(settle);
    };

    // PostMessage communication with room iframes
    const onMessage = (e) => {
      if (e.source !== frame?.contentWindow || !e.data) return;
      if (e.data.wall === 'go') {
        const to = String(e.data.to || '');
        if (to === 'contact') {
          if (typeof window.openModal === 'function') window.openModal();
          else {
            const m = document.getElementById('modal');
            if (m) m.hidden = false;
          }
          return;
        }

        const n = to.startsWith('door:') ? +to.slice(5) : -1;
        if (n === cur) return;
        afterLeave = () => {
          if (n >= 0) window.openDoor?.(n);
          else scrollToId(to === 'about' ? 'about' : 'home');
        };
      } else if (e.data.wall !== 'close') {
        return;
      }
      leaveWall();
    };

    const onPopState = () => {
      if (inWall && !(window.history.state && window.history.state.wall)) {
        pushed = false;
        leaveWall();
      }
    };

    const onKeyDown = (e) => {
      if (
        e.key === 'Escape' &&
        inWall &&
        document.getElementById('modal')?.hidden &&
        document.getElementById('navm')?.hidden
      ) {
        if (pushed) {
          pushed = false;
          try {
            window.history.back();
          } catch {}
        }
        leaveWall();
      }
    };

    const handleHashChange = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      const idx = SLUGS.indexOf(slug);
      if (idx >= 0) {
        try {
          window.history.replaceState(
            null,
            '',
            window.location.pathname + window.location.search + '#works'
          );
        } catch {}
        warm(idx);
        setTimeout(() => {
          if (typeof window.openDoor === 'function') {
            window.openDoor(idx);
          }
        }, 300);
      }
    };

    window.addEventListener('message', onMessage);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('hashchange', handleHashChange);

    // Initial door hash navigation (e.g. #web-developer, #app-developer)
    const HASH_DOOR = SLUGS.indexOf(
      decodeURIComponent(window.location.hash.slice(1))
    );
    if (HASH_DOOR >= 0) {
      try {
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search + '#works'
        );
      } catch {}
      const onIntro = () => {
        warm(HASH_DOOR);
        setTimeout(() => window.openDoor(HASH_DOOR), 650);
      };
      if (document.body.classList.contains('ready')) onIntro();
      else window.addEventListener('intro:ready', onIntro, { once: true });
    }

    // ========================================================================
    // 11. LIFECYCLE CLEANUP & TEARDOWN
    // ========================================================================
    return () => {
      clearTimeout(warmIdleTimer);
      if (io) io.disconnect();
      if (nearIo) nearIo.disconnect();
      if (walkRaf) cancelAnimationFrame(walkRaf);
      if (mRaf) cancelAnimationFrame(mRaf);
      delete window.openDoor;
      delete window.__doorHover;

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', mSize);
      window.removeEventListener('scroll', mApply);
      window.removeEventListener('message', onMessage);
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
      sec.removeEventListener('touchstart', onTouchStart);
      sec.removeEventListener('touchend', onTouchEnd);
    };
  }, [scrollToId]);

  // ==========================================================================
  // 12. COMPACT & REUSABLE MARKUP
  // ==========================================================================
  return (
    <>
      <div className="door-cursor" id="doorCursor" ref={badgeRef} aria-hidden="true">
        Click to enter
      </div>
      <div className="veil" id="veil" ref={veilRef} aria-hidden="true" hidden></div>
      <div className="shade" id="shade" ref={shadeRef} aria-hidden="true" hidden></div>
      <div className="passage" id="passage" ref={passageRef} aria-hidden="true" hidden></div>
      <div className="wallv" id="wallv" ref={wallvRef}></div>

      <section
        id="works"
        className="doors"
        ref={secRef}
        aria-labelledby="doorsTitle"
      >
        <div className="doors__tex" aria-hidden="true"></div>
        <div className="doors__pin" ref={pinRef}>
          <div className="shell doors__wall" ref={wallRef}>
            <h2 className="sr-only" id="doorsTitle">
              My work, one door per skill
            </h2>
            <p className="paint" aria-hidden="true">
              Magic happens <br className="mbr" />
              behind the doors
            </p>
            <p className="doors__hint" aria-hidden="true">
              Swipe along the wall
            </p>
            <div className="dinfo" id="dinfo" ref={dinfoRef} aria-live="polite">
              <h3 className="dinfo__h"></h3>
              <p className="dinfo__t"></p>
              <ul className="dinfo__p"></ul>
            </div>
            <p className="doors__dots" ref={dotsRef} aria-hidden="true">
              <i className="on"></i>
              <i></i>
              <i></i>
              <i></i>
            </p>

            <ul className="doors__row" ref={rowRef}>
              {DOORS_CONFIG.map((door, idx) => (
                <li
                  key={door.slug}
                  className={`unit${door.isSecret ? ' unit--secret' : ''}`}
                  ref={(el) => (unitsRef.current[idx] = el)}
                  style={{
                    '--i': idx,
                    '--door': door.doorCol,
                    '--door-dk': door.doorDk,
                  }}
                  {...(door.isSecret ? { inert: '' } : {})}
                >
                  <button
                    type="button"
                    className="doorway"
                    aria-label={`Open the ${door.label} door`}
                  >
                    <span className="casing"></span>
                    <span className="opening">
                      <span className="room"></span>
                      <span className="spill"></span>
                      <span className="door">
                        <span className="door__flute"></span>
                        <span className="plate">{door.label}</span>
                        <span className="handle">
                          <span className="handle__lever"></span>
                          <span className="handle__lock"></span>
                        </span>
                        <span className="door__shade"></span>
                        <span className="leak"></span>
                      </span>
                      <span className="sill"></span>
                    </span>
                    <span className="pool"></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="doors__floor" aria-hidden="true"></div>
        </div>
      </section>
    </>
  );
}
