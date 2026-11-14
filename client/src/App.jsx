import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SmoothScrollProvider, useSmoothScroll } from './context/SmoothScrollContext';
import PageLoader from './components/PageLoader';
import Header from './components/Header';
import PullCord from './components/PullCord';
import HeroSection from './components/HeroSection';
import DoorsNavigation from './components/DoorsNavigation';
import StoryTimeTunnel from './components/StoryTimeTunnel';
import Footer from './components/Footer';
import NavMenuModal from './components/NavMenuModal';
import ContactModal from './components/ContactModal';
import HoloCardModal from './components/HoloCardModal';

/**
 * PortfolioApp - Master layout orchestrator.
 * Assembles all components, exposes window-level modal triggers,
 * delegates anchor clicks, and syncs clean SPA routes.
 */
function PortfolioApp() {
  const { scrollToId } = useSmoothScroll();
  const [navOpen, setNavOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [holoOpen, setHoloOpen] = useState(false);

  // ==========================================================================
  // 1. GLOBAL WINDOW CONTROLS FOR MODAL INTEROP
  // ==========================================================================
  useEffect(() => {
    window.openNav = () => setNavOpen(true);
    window.closeNav = () => setNavOpen(false);
    window.openModal = () => setContactOpen(true);
    window.closeModal = () => setContactOpen(false);
    window.openHolo = () => setHoloOpen(true);
    window.closeHolo = () => setHoloOpen(false);

    return () => {
      delete window.openNav;
      delete window.closeNav;
      delete window.openModal;
      delete window.closeModal;
      delete window.openHolo;
      delete window.closeHolo;
    };
  }, []);

  // ==========================================================================
  // 2. DOCUMENT-LEVEL DELEGATION: ANCHORS, DOORS, AND CONTACT
  // ==========================================================================
  useEffect(() => {
    const handleDocClick = (e) => {
      // Header buttons manage their own events with dedicated stopPropagation
      if (e.target.closest('header')) return;

      const ln = e.target.closest('a[data-door],a[data-go]');
      if (ln) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
        e.preventDefault();
      }

      const contactBtn = e.target.closest('[data-contact]');
      if (contactBtn) {
        setContactOpen(true);
        return;
      }

      const doorBtn = e.target.closest('[data-door]');
      if (doorBtn) {
        window.openDoor?.(+doorBtn.dataset.door);
        return;
      }

      const goBtn = e.target.closest('[data-go]');
      if (goBtn) {
        scrollToId(goBtn.dataset.go);
      }
    };

    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, [scrollToId]);

  // ==========================================================================
  // 3. SPA ROUTE SYNC: UPDATES URL AS SECTIONS INTERSECT
  // ==========================================================================
  useEffect(() => {
    if (window.location.protocol === 'file:') return;
    const dir = window.location.pathname.replace(/[^/]*$/, '');
    const ROUTE_MAP = { home: 'home', works: 'work', about: 'my-story' };
    let currentRoute = '';

    const setRoute = (name) => {
      if (name === currentRoute || window.history.state?.wall) return;
      currentRoute = name;
      try {
        window.history.replaceState(window.history.state, '', dir + ROUTE_MAP[name]);
      } catch {}
    };

    const initialSection =
      window.location.hash === '#about'
        ? 'about'
        : window.location.hash === '#works'
        ? 'works'
        : 'home';

    const onIntroReady = () => {
      setRoute(initialSection);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setRoute(
                entry.target.id === 'works'
                  ? 'works'
                  : entry.target.id === 'about'
                  ? 'about'
                  : 'home'
              );
            }
          });
        },
        { rootMargin: '-45% 0px -45% 0px' }
      );

      ['home', 'works', 'about'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };

    if (document.body.classList.contains('ready')) {
      onIntroReady();
    } else {
      window.addEventListener('intro:ready', onIntroReady, { once: true });
    }
  }, []);

  // ==========================================================================
  // 4. FULLSCREEN TOGGLE: KEYBOARD ('F') & POSTMESSAGE INTEROP
  // ==========================================================================
  useEffect(() => {
    const isTyping = (e) => {
      const target = e.target;
      return target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    };

    const toggleFullscreen = () => {
      const d = document;
      const el = d.documentElement;
      if (d.fullscreenElement || d.webkitFullscreenElement) {
        (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      } else {
        (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)?.catch?.(() => {});
      }
    };

    const onKeyDown = (e) => {
      if ((e.key !== 'f' && e.key !== 'F') || e.metaKey || e.ctrlKey || e.altKey || isTyping(e)) return;
      e.preventDefault();
      if (window.top !== window) {
        try {
          parent.postMessage({ wall: 'fullscreen' }, window.location.origin === 'null' ? '*' : window.location.origin);
        } catch {}
        return;
      }
      toggleFullscreen();
    };

    const onMessage = (e) => {
      if (
        !e.data ||
        e.data.wall !== 'fullscreen' ||
        ![...document.querySelectorAll('iframe')].some((f) => f.contentWindow === e.source)
      ) {
        return;
      }
      toggleFullscreen();
    };

    window.addEventListener('keydown', onKeyDown);
    if (window.top === window) {
      window.addEventListener('message', onMessage);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (window.top === window) {
        window.removeEventListener('message', onMessage);
      }
    };
  }, []);

  // ==========================================================================
  // 5. MASTER LAYOUT RENDERING
  // ==========================================================================
  return (
    <>
      <PageLoader />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <PullCord />

      <main id="main">
        <HeroSection />
        <DoorsNavigation />
        <StoryTimeTunnel />
      </main>

      <Footer onOpenContact={() => setContactOpen(true)} />

      <NavMenuModal
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        onOpenContact={() => setContactOpen(true)}
      />
      <HoloCardModal
        isOpen={holoOpen}
        onClose={() => setHoloOpen(false)}
      />
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <PortfolioApp />
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
