import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSmoothScroll } from '../context/SmoothScrollContext';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * HoloCardModal - Interactive 3D ability card modal.
 * Loads the WebGL 3D card via iframe (with postMessage progress & control),
 * with an automatic fallback to the hardware-accelerated CSS 3D card with gyroscopic & cursor physics.
 */
export default function HoloCardModal({ isOpen, onClose }) {
  // DOM element references
  const layerRef = useRef(null);
  const ldRef = useRef(null);
  const pctRef = useRef(null);
  const liteRef = useRef(null);
  const hcRef = useRef(null);
  const frameRef = useRef(null);
  const frameContainerRef = useRef(null);

  const { stopScroll, startScroll } = useSmoothScroll();

  const [progress, setProgress] = useState(0);
  const [useLite, setUseLite] = useState(false);
  const frameSrc = isOpen && !useLite ? '/ability-card/' : null;

  // ==========================================================================
  // 1. MODAL CLOSE HANDLER WITH TRANSITION & SCROLL UNLOCK
  // ==========================================================================
  const handleClose = useCallback(() => {
    if (layerRef.current) {
      layerRef.current.classList.remove('on');
    }
    const f = frameRef.current || layerRef.current?.querySelector('iframe');
    if (f) f.classList.remove('up');
    startScroll('holo');
    setTimeout(() => {
      setUseLite(false);
      onClose();
    }, 360);
  }, [onClose, startScroll]);

  // ==========================================================================
  // 2. LIFECYCLE, PHYSICS ENGINE & EVENT DISPATCH
  // ==========================================================================
  useEffect(() => {
    const layer = layerRef.current;
    const ld = ldRef.current;
    const lite = liteRef.current;
    const hc = hcRef.current;
    if (!layer || !ld || !lite || !hc) return;

    if (!isOpen) {
      const f = layer.querySelector('iframe');
      if (f) f.classList.remove('up');
      return;
    }

    const back = document.activeElement;
    stopScroll('holo');

    // Check WebGL hardware capability
    const hasGL = (() => {
      try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
      } catch {
        return false;
      }
    })();

    let timer = 0;
    const openT = performance.now();
    let handing = false;
    let loop = 0;
    let t0 = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let held = false;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const clamp = (v) => Math.max(-1, Math.min(1, v));

    const updateProgress = (p) => {
      ld.style.setProperty('--p', p);
      setProgress(Math.round(p * 100));
    };

    const decodeLite = () =>
      Promise.all(
        [...lite.querySelectorAll('img')].map((im) => {
          im.loading = 'eager';
          return im.decode ? im.decode().catch(() => {}) : Promise.resolve();
        })
      );

    // Continuous 3D card tilt physics step
    function step(now) {
      const sway = held || calm.matches ? 0 : 1;
      const t = (now - t0) / 1000;
      cx += (tx + sway * Math.sin(t * 0.62) * 0.34 - cx) * 0.12;
      cy += (ty + sway * Math.sin(t * 0.47 + 1.1) * 0.22 - cy) * 0.12;
      const S = hc.style;
      S.setProperty('--px', cx.toFixed(4));
      S.setProperty('--py', cy.toFixed(4));
      S.setProperty('--ry', (cx * 14).toFixed(2) + 'deg');
      S.setProperty('--rx', (-cy * 11).toFixed(2) + 'deg');
      S.setProperty('--lift', Math.min(1, Math.hypot(cx, cy) * 1.3).toFixed(3));
      loop = requestAnimationFrame(step);
    }

    const spin = (on) => {
      cancelAnimationFrame(loop);
      loop = 0;
      if (on) {
        t0 = performance.now();
        loop = requestAnimationFrame(step);
      }
    };

    // Fallback: Hardware-accelerated CSS 3D card
    function showLite() {
      setUseLite(true);
      clearTimeout(timer);
      const f = frameRef.current || layer.querySelector('iframe');
      if (f) f.classList.remove('up');
      lite.hidden = false;
      lite.classList.remove('in');
      let creep = 0.1;
      const cr = setInterval(() => {
        creep = Math.min(0.92, creep + (1 - creep) * 0.18);
        if (ld && !ld.classList.contains('gone')) updateProgress(creep);
      }, 140);

      decodeLite().then(() => {
        clearInterval(cr);
        updateProgress(1);
        setTimeout(() => {
          lite.classList.add('in');
          ld.classList.add('out');
          hc.classList.remove('flip', 'live');
          spin(true);
          setTimeout(() => hc.focus({ preventScroll: true }), 360);
        }, Math.max(300, 950 - (performance.now() - openT)));
      });
    }

    // Initialize modal display
    layer.hidden = false;
    ld.classList.remove('out', 'gone');
    updateProgress(0);
    lite.hidden = true;
    lite.classList.remove('in');

    requestAnimationFrame(() => layer.classList.add('on'));

    if (!hasGL) {
      showLite();
    } else {
      timer = setTimeout(showLite, 15000);
    }

    // ========================================================================
    // 3. IFRAME POSTMESSAGE INTEGRATION
    // ========================================================================
    const onMessage = (e) => {
      const m = e.data || {};
      if (!m.holo) return;
      if (m.holo === 'close') {
        handleClose();
        return;
      }
      if (m.holo === 'up' || m.holo === 'progress') {
        if (!handing) {
          handing = true;
          const f = frameRef.current || layer.querySelector('iframe');
          setTimeout(() => {
            if (f) f.classList.add('up');
            requestAnimationFrame(() => {
              if (ld && !ld.classList.contains('gone')) {
                ld.classList.add('gone');
              }
            });
          }, Math.max(0, 680 - (performance.now() - openT)));
        }
      }
      if (m.holo === 'progress') {
        updateProgress(Math.max(0.02, m.p || 0));
      }
      if (m.holo === 'ready') {
        clearTimeout(timer);
        setTimeout(() => {
          const f = frameRef.current || layer.querySelector('iframe');
          f?.focus?.();
        }, 400);
      }
      if (m.holo === 'fail') {
        ld.classList.remove('gone');
        ld.classList.add('out');
        showLite();
      }
    };
    window.addEventListener('message', onMessage);

    // ========================================================================
    // 4. POINTER & ORIENTATION INTERACTION FOR LITE CARD
    // ========================================================================
    const onPointerMove = (e) => {
      const r = hc.getBoundingClientRect();
      if (!r.width) return;
      const u = (e.clientX - r.left) / r.width;
      const v = (e.clientY - r.top) / r.height;
      if (u < -0.4 || u > 1.4 || v < -0.35 || v > 1.35) {
        held = false;
        tx = ty = 0;
        return;
      }
      held = true;
      hc.classList.add('live');
      tx = clamp((u - 0.5) * 2);
      ty = clamp((v - 0.5) * 2);
    };

    const onPointerLeave = () => {
      held = false;
      tx = ty = 0;
    };

    lite.addEventListener('pointermove', onPointerMove, { passive: true });
    lite.addEventListener('pointerleave', onPointerLeave);

    // Click/tap to flip card
    let from = null;
    const onPointerDown = (e) => {
      from = [e.clientX, e.clientY];
      try {
        hc.setPointerCapture(e.pointerId);
      } catch {}
    };
    const onPointerUp = (e) => {
      if (from && Math.hypot(e.clientX - from[0], e.clientY - from[1]) < 9) {
        hc.classList.toggle('flip');
      }
      from = null;
    };
    const onKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hc.classList.toggle('flip');
      }
    };

    hc.addEventListener('pointerdown', onPointerDown);
    hc.addEventListener('pointerup', onPointerUp);
    hc.addEventListener('keydown', onKeyDown);

    // Device orientation for mobile tilt
    const onDeviceOrientation = (e) => {
      if (held || e.gamma == null) return;
      tx = clamp(e.gamma / 28);
      ty = clamp(((e.beta == null ? 45 : e.beta) - 45) / 30);
    };
    window.addEventListener('deviceorientation', onDeviceOrientation);

    // ========================================================================
    // 5. ACCESSIBLE KEYBOARD TRAP & ESCAPE KEY LISTENER
    // ========================================================================
    const onGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const f = [...layer.querySelectorAll(FOCUSABLE)].filter(
        (n) => n.offsetWidth || n.offsetHeight || n.getClientRects().length
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];

      if (!layer.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onGlobalKeyDown);

    // Cleanup listeners and stop physics loop
    return () => {
      clearTimeout(timer);
      spin(false);
      window.removeEventListener('message', onMessage);
      lite.removeEventListener('pointermove', onPointerMove);
      lite.removeEventListener('pointerleave', onPointerLeave);
      hc.removeEventListener('pointerdown', onPointerDown);
      hc.removeEventListener('pointerup', onPointerUp);
      hc.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      window.removeEventListener('keydown', onGlobalKeyDown);
      layer.classList.remove('on');
      const f = layer.querySelector('iframe');
      if (f) f.classList.remove('up');
      startScroll('holo');
      back?.focus?.({ preventScroll: true });
    };
  }, [isOpen, handleClose, stopScroll, startScroll]);

  // ==========================================================================
  // 6. RENDER MODAL LAYOUT
  // ==========================================================================
  return (
    <div
      className={`holo${isOpen ? ' on' : ''}`}
      id="holo"
      ref={layerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Sumon's ability card"
      hidden={!isOpen}
    >
      {/* Loading overlay with animated progress */}
      <div className="holo__ld" id="holoLd" ref={ldRef} aria-hidden="true">
        <div className="cl" aria-hidden="true">
          <p className="cl__name">Asaduzzaman Sumon</p>
          <div className="cl__line">
            <i></i>
          </div>
          <p className="cl__row">
            <span>Loading the card</span>
            <b id="holoPct" ref={pctRef}>
              {progress}%
            </b>
          </p>
        </div>
      </div>

      {/* Hardware-accelerated CSS 3D fallback card */}
      <div className="holo__lite" id="holoLite" ref={liteRef} hidden={!useLite}>
        <button
          type="button"
          className="hc"
          id="hc"
          ref={hcRef}
          aria-label="Flip the card"
        >
          <i className="hc__aura"></i>
          <span className="hc__in">
            <span className="hc__face hc__front">
              <span className="hc__win">
                <img
                  className="hc__bg"
                  src="/card/win_bg.webp"
                  loading="lazy"
                  alt=""
                  decoding="async"
                />
                <img
                  className="hc__sub"
                  src="/card/win_sub.webp"
                  loading="lazy"
                  alt=""
                  decoding="async"
                />
                <i className="hc__wsh"></i>
              </span>
              <img
                className="hc__plate"
                src="/card/plate.webp"
                loading="lazy"
                alt="Asaduzzaman Sumon's ability card: web development 90, UI/UX design 85, graphic design 85, app development 75."
                decoding="async"
              />
              <i className="hc__foil"></i>
              <i className="hc__sheen"></i>
              <i className="hc__glare"></i>
              <i className="hc__rim"></i>
            </span>
            <span className="hc__face hc__back">
              <img
                className="hc__backimg"
                src="/card/back.webp"
                loading="lazy"
                alt=""
                decoding="async"
              />
              <i className="hc__foil"></i>
              <i className="hc__glare"></i>
              <i className="hc__rim"></i>
            </span>
          </span>
        </button>
        <p className="hc__hint">
          <span className="hc__hm">Move across the card</span>
          <span className="hc__ht">Tilt or drag it</span> · tap to flip
        </p>
      </div>

      {/* WebGL 3D card iframe container */}
      <div ref={frameContainerRef} style={{ width: '100%', height: '100%' }}>
        {frameSrc && !useLite && (
          <iframe
            ref={frameRef}
            title="Asaduzzaman Sumon's ability card"
            src={frameSrc}
            sandbox="allow-scripts allow-same-origin"
            loading="eager"
            style={{ width: '100%', height: '100%', border: 0 }}
          />
        )}
      </div>

      {/* Modal close button */}
      <button type="button" className="holo__x" id="holoClose" onClick={handleClose}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M5 5l14 14M19 5 5 19" />
        </svg>
        Close
      </button>
    </div>
  );
}
