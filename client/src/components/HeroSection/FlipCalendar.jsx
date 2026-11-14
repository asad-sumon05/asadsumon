import React, { useEffect, useRef } from 'react';
import styles from './FlipCalendar.module.css';

const SKILLS = [
  'Web Developer',
  'App Developer',
  'UI/UX Designer',
  'Graphic Designer',
  'Photographer',
];

const HOLD = 1700;
const FLIP = 1250;

/**
 * FlipCalendar - Mechanical desk calendar with 3D page flip and dynamic hole/ring sizing.
 * Automatically flips through core engineering and design roles with realistic page-turn physics.
 */
export default function FlipCalendar() {
  // DOM element references
  const calRef = useRef(null);
  const bodyRef = useRef(null);
  const leafRef = useRef(null);
  const underRef = useRef(null);
  const faceRef = useRef(null);
  const measureRef = useRef(null);
  const ringsRef = useRef(null);

  useEffect(() => {
    const cal = calRef.current;
    const body = bodyRef.current;
    const leaf = leafRef.current;
    const under = underRef.current;
    const face = faceRef.current;
    const measure = measureRef.current;
    const rings = ringsRef.current;
    if (!cal || !body || !leaf || !under || !face || !measure || !rings) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = SKILLS.length;
    let i = 0;
    let timer = 0;
    let started = false;
    let fitTimer = null;

    // Helper: update typography and counter for a calendar page
    const paint = (page, k) => {
      const word = page.querySelector('.cal__word');
      const no = page.querySelector('.cal__no');
      if (word) word.textContent = SKILLS[k];
      if (no) no.textContent = `${String(k + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    };

    paint(face, 0);
    paint(under, 1);

    // ========================================================================
    // 1. DYNAMIC CALENDAR SIZING & SPIRAL HOLE RECALCULATION
    // ========================================================================
    function fit() {
      if (!cal) return;
      cal.style.fontSize = '';
      const fs = parseFloat(getComputedStyle(cal).fontSize) || 16;
      let max = 0;
      for (const w of SKILLS) {
        measure.textContent = w;
        max = Math.max(max, measure.getBoundingClientRect().width);
      }
      const wEm = max / fs + 0.8 + 0.06; // Word width plus horizontal padding
      body.style.setProperty('--cal-w', wEm.toFixed(3) + 'em');
      cal.style.setProperty('--cal-w', wEm.toFixed(3) + 'em');

      const h1 = cal.closest('.h1') || cal.closest('[class*="h1"]');
      const avail = (h1 ? h1.getBoundingClientRect().width : window.innerWidth) - fs * 0.25;
      const need = wEm * fs;
      if (need > avail && need > 0) {
        cal.style.fontSize = (fs * avail / need).toFixed(2) + 'px';
      }

      // Spiral rings + punched holes spaced every ~0.62em
      const count = Math.max(5, Math.round((wEm - 0.64) / 0.7) + 1);
      rings.innerHTML = '<i></i>'.repeat(count);
      cal.querySelectorAll('.cal__holes').forEach((h) => {
        h.innerHTML = '<i></i>'.repeat(count);
      });
    }

    fit();
    document.fonts?.ready?.then(fit);

    const onResize = () => {
      clearTimeout(fitTimer);
      fitTimer = setTimeout(fit, 120);
    };
    window.addEventListener('resize', onResize);

    // ========================================================================
    // 2. 3D MECHANICAL PAGE FLIP ANIMATION
    // ========================================================================
    function flip() {
      if (document.hidden) {
        timer = setTimeout(flip, 600);
        return;
      }
      const next = (i + 1) % n;
      paint(under, next);

      // Reduced motion bypass
      if (reduced) {
        paint(face, next);
        i = next;
        timer = setTimeout(flip, HOLD);
        return;
      }

      const rear = leaf.querySelector('.cal__rear');
      if (rear) paint(rear, next);

      // 3D rotation with natural gravity easing
      const anim = leaf.animate(
        [
          { transform: 'rotateX(0deg)' },
          { transform: 'rotateX(-60deg)', offset: 0.35, easing: 'cubic-bezier(.4, 0, .7, .4)' },
          { transform: 'rotateX(-120deg)', offset: 0.65, easing: 'cubic-bezier(.3, .6, .6, 1)' },
          { transform: 'rotateX(-180deg)' },
        ],
        { duration: FLIP, easing: 'cubic-bezier(.25, .1, .25, 1)', fill: 'forwards' }
      );

      // Page shadow overlay
      const shade = leaf.querySelector('.cal__shade');
      let shadeAnim = null;
      if (shade) {
        shadeAnim = shade.animate(
          [
            { opacity: 0 },
            { opacity: 0.55, offset: 0.5 },
            { opacity: 0 },
          ],
          { duration: FLIP, fill: 'forwards' }
        );
      }

      anim.onfinish = () => {
        paint(face, next);
        anim.cancel();
        if (shadeAnim) shadeAnim.cancel();
        i = next;
        timer = setTimeout(flip, HOLD);
      };
    }

    // ========================================================================
    // 3. INTRO GATING & CLEANUP
    // ========================================================================
    const startTimer = () => {
      if (started) return;
      started = true;
      timer = setTimeout(flip, 1200);
    };

    if (document.body.classList.contains('ready')) {
      startTimer();
    } else {
      window.addEventListener('intro:ready', startTimer, { once: true });
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(fitTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('intro:ready', startTimer);
    };
  }, []);

  return (
    <span className={`${styles.cal} cal rv`} id="cal" ref={calRef} aria-hidden="true">
      <span className={`${styles.calBody} cal__body`} ref={bodyRef}>
        <span className={`${styles.calStand} cal__stand`}></span>
        <span className={`${styles.calStack} cal__stack`}>
          <span className={`${styles.calPage} cal__page`} ref={underRef}>
            <span className={`${styles.calWord} cal__word`}>Web Developer</span>
            <span className={`${styles.calNo} cal__no`}>01 / 05</span>
            <span className={`${styles.calHoles} cal__holes`}></span>
          </span>
          <span className={`${styles.calLeaf} cal__leaf`} ref={leafRef}>
            <span className={`${styles.calFace} cal__face`} ref={faceRef}>
              <span className={`${styles.calWord} cal__word`}>Web Developer</span>
              <span className={`${styles.calNo} cal__no`}>01 / 05</span>
              <span className={`${styles.calHoles} cal__holes`}></span>
            </span>
            <span className={`${styles.calBack} cal__back`}></span>
            <span className={`${styles.calRear} cal__rear`}>
              <span className={`${styles.calWord} cal__word`}></span>
              <span className={`${styles.calNo} cal__no`}></span>
              <span className={`${styles.calHoles} cal__holes`}></span>
            </span>
            <span className={`${styles.calShade} cal__shade`}></span>
          </span>
        </span>
        <span className={`${styles.calRings} cal__rings`} ref={ringsRef}></span>
      </span>
      <span className={`${styles.calMeasure} cal__measure`} ref={measureRef} aria-hidden="true"></span>
    </span>
  );
}
