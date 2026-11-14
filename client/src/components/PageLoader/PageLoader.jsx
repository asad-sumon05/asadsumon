import React, { useEffect, useRef, useState } from 'react';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import styles from './PageLoader.module.css';

const SKIP_INTRO_HASHES = [
  '#works',
  '#about',
  '#contact',
  '#home',
  '#web-developer',
  '#app-developer',
  '#ui-ux-designer',
  '#graphic-designer',
  '#photographer',
];

const LOADER_PILLS = [
  { label: 'Asaduzzaman Sumon', c: '#1F1C1C', t: '#E8E4E0', dir: 1 },
  { label: 'Web development', c: '#22304a', t: '#E8E4E0', dir: -1 },
  { label: 'App development', c: '#4a3540', t: '#E8E4E0', dir: 1 },
  { label: 'UI/UX design', c: '#7a8670', t: '#F3EEEC', dir: -1 },
  { label: 'Graphic design', c: '#a4552c', t: '#F3EEEC', dir: 1 },
  { label: 'Photography', c: '#C4B0B0', t: '#1A1818', dir: -1 },
];

/**
 * PageLoader - Brand intro and asset loading screen with animated counter
 * and staggered sliding color pills.
 */
export default function PageLoader() {
  // If landing on a specific section hash or already marked ready, skip immediately
  const [isMounted, setIsMounted] = useState(() => {
    if (typeof window !== 'undefined') {
      if (document.body.classList.contains('ready') || SKIP_INTRO_HASHES.includes(window.location.hash)) {
        document.body.classList.add('ready');
        window.dispatchEvent(new Event('intro:ready'));
        return false;
      }
    }
    return true;
  });

  const { stopScroll, startScroll, forceUnlock } = useSmoothScroll();

  const loaderRef = useRef(null);
  const numRef = useRef(null);
  const pillsRef = useRef([]);

  // ==========================================================================
  // 1. PROGRESS TICKER & TRANSITION ENGINE
  // ==========================================================================
  useEffect(() => {
    if (!isMounted) return;

    stopScroll('loader');

    let introDone = false;
    const bailOut = () => {
      if (introDone) return;
      introDone = true;
      document.body.classList.add('ready');
      forceUnlock();
      window.dispatchEvent(new Event('intro:ready'));
      setIsMounted(false);
    };

    window.__introBail = bailOut;
    const bailTimer = setTimeout(bailOut, 3500);

    const loader = loaderRef.current;
    const num = numRef.current;
    const pills = pillsRef.current;

    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    let ready = 0.85;
    const loaded = () => {
      ready = 1;
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      loaded();
    } else {
      window.addEventListener('DOMContentLoaded', loaded, { once: true });
      window.addEventListener('load', loaded, { once: true });
    }
    const loadTimeout = setTimeout(loaded, 400);

    const paint = (p) => {
      if (!loader) return;
      loader.style.setProperty('--p', p.toFixed(3));
      pills.forEach((el, k) => {
        if (el) el.classList.toggle('on', p >= k / 6 + 0.02 || p >= 1);
      });
    };

    const FILL = 1000;
    let t0 = null;
    let shown = 0;
    let rafId = null;

    function finish() {
      if (!loader) {
        bailOut();
        return;
      }
      loader.classList.add('out');
      setTimeout(() => {
        document.body.classList.add('ready');
      }, 150);
      setTimeout(bailOut, 350);
    }

    function loadTick(now) {
      if (t0 === null) t0 = now;
      const want = Math.min(ease(Math.min(1, (now - t0) / FILL)), ready);
      shown += (want - shown) * 0.22;
      if (want - shown < 0.002) shown = want;
      paint(shown);
      if (num) num.textContent = String(Math.round(shown * 100)).padStart(3, '0');

      if (shown < 1) {
        rafId = requestAnimationFrame(loadTick);
      } else {
        setTimeout(finish, 200);
      }
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      if (num) num.textContent = '100';
      paint(1);
      setTimeout(finish, 200);
    } else {
      rafId = requestAnimationFrame(loadTick);
    }

    return () => {
      startScroll('loader');
      clearTimeout(bailTimer);
      clearTimeout(loadTimeout);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('load', loaded);
      window.removeEventListener('DOMContentLoaded', loaded);
      delete window.__introBail;
    };
  }, [isMounted, stopScroll, startScroll, forceUnlock]);

  if (!isMounted) return null;

  // ==========================================================================
  // 2. RENDER LOADER OVERLAY
  // ==========================================================================
  return (
    <div className={styles.loader} id="loader" ref={loaderRef} aria-hidden="true">
      <div className={styles.ldBg}></div>

      {/* Staggered skill pills stack */}
      <div className={styles.ldStack}>
        {LOADER_PILLS.map((pill, idx) => (
          <div
            key={pill.label}
            className={styles.ldPill}
            ref={(el) => (pillsRef.current[idx] = el)}
            style={{
              '--k': idx,
              '--c': pill.c,
              '--t': pill.t,
              '--dir': pill.dir,
            }}
          >
            <span>{pill.label}</span>
          </div>
        ))}
      </div>

      {/* Heads-up display with percentage counter */}
      <div className={styles.ldHud}>
        <div className={styles.ldTop}>
          <span><b>Asaduzzaman Sumon</b> · Portfolio</span>
          <span>Web Developer · CSE Engineer · Graphic Designer</span>
        </div>
        <div className={styles.ldBot}>
          <p className={styles.ldNum}>
            <small>Opening up the work</small>
            <span id="ldCount" ref={numRef}>000</span>
          </p>
          <div className={styles.ldBar}>
            <i></i>
          </div>
        </div>
      </div>
    </div>
  );
}
