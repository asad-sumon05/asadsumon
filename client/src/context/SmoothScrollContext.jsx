import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

const SmoothScrollContext = createContext({
  lenis: null,
  stopScroll: () => {},
  startScroll: () => {},
  forceUnlock: () => {},
  scrollToId: () => {},
  snapTo: () => {},
  scrollTo: () => {},
});

/**
 * SmoothScrollProvider - Wraps Lenis smooth scrolling with robust, set-based scroll locking,
 * anchor target navigation, and touch tracking for pinned interactive sections.
 */
export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const locksSetRef = useRef(new Set());
  const scrollEnabledRef = useRef(true);

  // ==========================================================================
  // 1. ROBUST SET-BASED SCROLL LOCK & UNLOCK
  // ==========================================================================
  const stopScroll = useCallback((key = 'default') => {
    const root = document.documentElement;
    locksSetRef.current.add(key);
    scrollEnabledRef.current = false;
    lenisRef.current?.stop();
    Object.assign(root.style, {
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
    });
  }, []);

  const startScroll = useCallback((key = 'default') => {
    const root = document.documentElement;
    locksSetRef.current.delete(key);
    if (locksSetRef.current.size > 0) return;

    scrollEnabledRef.current = true;
    lenisRef.current?.start();
    root.style.removeProperty('position');
    root.style.removeProperty('overflow');
    root.style.removeProperty('height');
    document.body.style.removeProperty('overflow');
  }, []);

  const forceUnlock = useCallback(() => {
    const root = document.documentElement;
    locksSetRef.current.clear();
    scrollEnabledRef.current = true;
    lenisRef.current?.start();
    root.style.removeProperty('position');
    root.style.removeProperty('overflow');
    root.style.removeProperty('height');
    document.body.style.removeProperty('overflow');
  }, []);

  // Guarantee unlock when intro completes or if body is already marked ready
  useEffect(() => {
    if (document.body.classList.contains('ready')) {
      forceUnlock();
    }

    const onIntroReady = () => forceUnlock();
    window.addEventListener('intro:ready', onIntroReady);
    return () => window.removeEventListener('intro:ready', onIntroReady);
  }, [forceUnlock]);

  // ==========================================================================
  // 2. SMOOTH SCROLL & ANCHOR NAVIGATION DELEGATES
  // ==========================================================================
  const scrollToId = useCallback((id) => {
    // Immediate smooth return to top for 'home'
    if (id === 'home') {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, {
          duration: 1.0,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, {
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const snapTo = useCallback((top) => {
    const COARSE = window.matchMedia('(pointer: coarse)').matches;
    if (!COARSE && lenisRef.current) {
      lenisRef.current.scrollTo(top, {
        duration: 0.6,
        easing: (x) => 1 - Math.pow(1 - x, 3),
      });
    } else {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top,
        behavior: reduced ? 'auto' : 'smooth',
      });
    }
  }, []);

  const scrollTo = useCallback((target, options) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  }, []);

  // ==========================================================================
  // 3. LENIS LIFECYCLE & RAF LOOP
  // ==========================================================================
  useEffect(() => {
    // Reset scroll on initial page load if at origin
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    // Track touch interactions for pinned carousel sections
    window.__touching = false;
    const handleTouchStart = () => { window.__touching = true; };
    const handleTouchEnd = () => { window.__touching = false; };
    const handleTouchCancel = () => { window.__touching = false; };

    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true, capture: true });

    // Expose helpers globally for compatibility with physics handlers
    window.__snapTo = snapTo;
    window.__forceUnlock = forceUnlock;

    let rafId = null;
    let instance = null;

    const isCoarseOrTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const isLite = document.documentElement.classList.contains('lite');

    if (!isCoarseOrTouch && !isLite) {
      try {
        instance = new Lenis({ smoothWheel: true });
        lenisRef.current = instance;
        window.__lenis = instance;

        // If locks are active, pause; otherwise ensure running
        if (locksSetRef.current.size > 0) {
          instance.stop();
        } else {
          instance.start();
        }

        const raf = (time) => {
          instance.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch {}
    }

    return () => {
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchend', handleTouchEnd, { capture: true });
      window.removeEventListener('touchcancel', handleTouchCancel, { capture: true });

      if (rafId) cancelAnimationFrame(rafId);
      if (instance) {
        instance.destroy();
        lenisRef.current = null;
        window.__lenis = null;
      }
      delete window.__touching;
      delete window.__snapTo;
      delete window.__forceUnlock;
    };
  }, [snapTo, forceUnlock]);

  const value = {
    get lenis() {
      return lenisRef.current;
    },
    stopScroll,
    startScroll,
    forceUnlock,
    scrollToId,
    snapTo,
    scrollTo,
  };

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider');
  }
  return context;
}

export default SmoothScrollContext;
