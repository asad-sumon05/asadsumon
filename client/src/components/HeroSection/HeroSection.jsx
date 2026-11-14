import React, { useEffect, useRef } from 'react';
import FlipCalendar from './FlipCalendar';
import { FIG_BASE_SRC, COLOUR_SRC } from '../../constants/heroAssets';
import { bindHovers } from '../../utils/spring';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import styles from './HeroSection.module.css';

/**
 * HeroSection - The hero stage featuring the LiquidReveal dual-canvas interaction,
 * the 3D mechanical flip calendar, and spring-hover CTA buttons.
 */
export default function HeroSection() {
  // DOM element references
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollToId } = useSmoothScroll();

  // ==========================================================================
  // 1. DUAL-CANVAS LIQUID REVEAL BLENDING ENGINE
  // ==========================================================================
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const isTouchOrCoarse = window.matchMedia('(max-width: 1023.98px), (hover: none)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchOrCoarse || reduced) {
      canvas.style.display = 'none';
      return;
    }

    const base = stage.querySelector('img');
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mk = () => {
      const c = document.createElement('canvas');
      return [c, c.getContext('2d')];
    };

    const [bwC, bwX] = mk();
    const [colC, colX] = mk();
    const [mask, mX] = mk();
    const [tmp, tX] = mk();

    const bwImg = new Image();
    const colImg = new Image();
    bwImg.src = base?.currentSrc || base?.src || FIG_BASE_SRC;
    colImg.src = COLOUR_SRC;

    let W = 1;
    let H = 1;
    let radius = 143 * dpr;
    const decay = 0.016;
    const points = [];
    let last = null;
    let idle = 999;
    let running = false;
    let showing = false;
    let rafId = null;

    function fitDraw(x, img) {
      x.clearRect(0, 0, W, H);
      if (!img.naturalWidth) return;
      const s = Math.min(W / img.naturalWidth, H / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      x.drawImage(img, (W - dw) / 2, H - dh, dw, dh);
    }

    function hide() {
      showing = false;
      if (base) base.style.visibility = '';
      ctx.clearRect(0, 0, W, H);
      mX.clearRect(0, 0, W, H);
    }

    function measure() {
      const r = stage.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width * dpr));
      H = Math.max(1, Math.round(r.height * dpr));
      for (const c of [canvas, bwC, colC, mask, tmp]) {
        c.width = W;
        c.height = H;
      }
      radius = 143 * dpr;
      fitDraw(bwX, bwImg);
      fitDraw(colX, colImg);
      hide();
    }

    bwImg.onload = () => fitDraw(bwX, bwImg);
    colImg.onload = () => fitDraw(colX, colImg);

    function stamp(x, y) {
      const g = mX.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.55, 'rgba(255,255,255,.82)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      mX.globalCompositeOperation = 'source-over';
      mX.fillStyle = g;
      mX.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    function render() {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(bwC, 0, 0);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(mask, 0, 0); // bw * (1 - mask)

      tX.globalCompositeOperation = 'source-over';
      tX.clearRect(0, 0, W, H);
      tX.drawImage(colC, 0, 0);
      tX.globalCompositeOperation = 'destination-in';
      tX.drawImage(mask, 0, 0); // col * mask

      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(tmp, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
    }

    function show() {
      if (!showing) {
        showing = true;
        render();
        if (base) base.style.visibility = 'hidden';
      }
    }

    function frame() {
      const drawing = points.length > 0;
      if (drawing) idle = 0;
      else idle++;

      if (idle >= 120) {
        hide();
        running = false;
        return;
      }

      const fade = drawing ? decay : Math.min(decay + idle * 0.004, 0.5);
      mX.globalCompositeOperation = 'destination-out';
      mX.fillStyle = `rgba(0,0,0,${fade})`;
      mX.fillRect(0, 0, W, H);

      if (drawing) {
        for (const p of points) stamp(p.x, p.y);
        points.length = 0;
      }

      render();
      show();
      rafId = requestAnimationFrame(frame);
    }

    const onPointerMove = (e) => {
      if (!colImg.naturalWidth || !bwImg.naturalWidth) return;
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) * dpr;
      const y = (e.clientY - r.top) * dpr;

      if (x < -radius || y < -radius || x > W + radius || y > H + radius) {
        last = null;
        return;
      }

      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        const step = Math.max(radius * 0.3, 1);
        const n = Math.min(Math.ceil(dist / step), 60);
        for (let i = 1; i <= n; i++) {
          points.push({ x: last.x + (dx * i) / n, y: last.y + (dy * i) / n });
        }
      } else {
        points.push({ x, y });
      }

      last = { x, y };
      if (!running) {
        running = true;
        idle = 0;
        rafId = requestAnimationFrame(frame);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    measure();

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      hide();
    };
  }, []);

  // ==========================================================================
  // 2. EULER SPRING HOVER MICRO-INTERACTIONS
  // ==========================================================================
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const unbind = bindHovers(hero);
    return () => unbind();
  }, []);

  // ==========================================================================
  // 3. CTA ACTION HANDLERS
  // ==========================================================================
  const handleOpenHolo = () => {
    if (typeof window.openHolo === 'function') {
      window.openHolo();
    } else {
      const holoModal = document.getElementById('holo');
      if (holoModal) holoModal.hidden = false;
    }
  };

  const handleContact = (e) => {
    e?.stopPropagation?.();
    if (typeof window.openModal === 'function') {
      window.openModal();
    } else {
      const contactModal = document.getElementById('modal');
      if (contactModal) contactModal.hidden = false;
    }
  };

  const handleSeeWork = (e) => {
    e?.stopPropagation?.();
    scrollToId('works');
  };

  // ==========================================================================
  // 4. RENDER HERO SECTION
  // ==========================================================================
  return (
    <section id="home" className={`${styles.hero} hero`} ref={heroRef} aria-label="Introduction">
      <div className={`${styles.heroVig} hero__vig`} aria-hidden="true"></div>

      <div className={`${styles.heroStage} hero__stage`}>
        <div
          className={`${styles.fig} fig`}
          id="fig"
          ref={stageRef}
          onClick={(e) => {
            if (!e.target.closest('.fig__card') && !e.target.closest(`.${styles.figCard}`)) handleOpenHolo();
          }}
        >
          <img
            id="figBase"
            src={FIG_BASE_SRC}
            alt="Portrait of Asaduzzaman Sumon"
            width="1024"
            height="1024"
            decoding="async"
            fetchPriority="high"
            aria-hidden="true"
          />
          <canvas id="figCanvas" ref={canvasRef} aria-hidden="true"></canvas>
          <button
            type="button"
            className={`${styles.figCard} fig__card`}
            id="holoOpen"
            aria-haspopup="dialog"
            aria-controls="holo"
            onClick={handleOpenHolo}
          >
            My ability card
          </button>
        </div>
      </div>

      <div className={`shell ${styles.heroContent} hero__content`}>
        <div className={`${styles.heroLeft} hero__left`}>
          <p className={`${styles.eyebrow} eyebrow rv`} style={{ '--d': '200ms' }}>
            CSE Engineer &amp; Web Developer
          </p>
          <h1 className={`${styles.h1} h1`}>
            <span className="sr-only">
              Hi, I'm Asaduzzaman Sumon. I am a CSE engineer, web developer and graphic designer.
            </span>
            <span aria-hidden="true">
              <span className="line">
                <span style={{ '--d': '250ms' }}>Hi, I'm Sumon.</span>
              </span>
              <span className="line">
                <span className={`${styles.soft} soft`} style={{ '--d': '370ms' }}>
                  I am a
                </span>
              </span>
              <span className={`${styles.calLine} cal-line`}>
                <FlipCalendar />
              </span>
            </span>
          </h1>

          <div className={`${styles.ctas} ctas rv`} style={{ '--d': '750ms' }}>
            <button
              type="button"
              className={`${styles.pill} ${styles.pillDark} ${styles.pillArrow} pill pill--dark pill--arrow`}
              data-contact
              onClick={handleContact}
            >
              <span className={`${styles.pillIn} pill__in`} data-h="s 1 1.04" data-hs="320 18" data-ht=".pill">
                Start a project
                <span className={`${styles.pillBadge} pill__badge`}>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-h="x 0 3"
                    data-hs="320 18"
                    data-ht=".pill"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </span>
            </button>
            <button
              type="button"
              className={`${styles.pill} ${styles.pillOutline} pill pill--outline`}
              data-go="works"
              onClick={handleSeeWork}
            >
              <span className={`${styles.pillIn} pill__in`} data-h="s 1 1.04" data-hs="320 18" data-ht=".pill">
                See my work
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className={`shell ${styles.heroBar} hero__bar rv`}>
        <span>Available for work</span>
        <span className="mid">Remote-first, worldwide</span>
        <span className="scroll">
          Scroll to explore <i aria-hidden="true">↓</i>
        </span>
      </div>
    </section>
  );
}
