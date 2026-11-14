import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSmoothScroll } from '../context/SmoothScrollContext';

const NAV_ITEMS = [
  { label: 'Home', target: 'home' },
  { label: 'Web Development', target: 0 },
  { label: 'App Development', target: 1 },
  { label: 'UI/UX Design', target: 2 },
  { label: 'Graphic Design', target: 3 },
  { label: 'My story', target: 'about' },
  { label: 'Contact', target: null },
];

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * NavMenuModal - Full-screen spring-staggered navigation overlay.
 */
export default function NavMenuModal({ isOpen, onClose, onOpenContact }) {
  // DOM element references
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const [navTime, setNavTime] = useState('');
  const { scrollToId } = useSmoothScroll();

  // ==========================================================================
  // 1. CLOCK TICKER FOR BOTTOM STATUS BAR
  // ==========================================================================
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = d.getHours();
      setNavTime(` — ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // ==========================================================================
  // 2. MODAL CLOSE HANDLER WITH AFTER-TRANSITION CALLBACK
  // ==========================================================================
  const handleClose = useCallback((afterCallback) => {
    const el = modalRef.current;
    if (!el || el.hidden) return;

    el.classList.remove('open');
    el.classList.add('closing');
    setClosing(true);

    setTimeout(() => {
      el.hidden = true;
      el.classList.remove('closing');
      setClosing(false);
      onClose();
      if (typeof afterCallback === 'function') {
        afterCallback();
      }
    }, 460);
  }, [onClose]);

  // ==========================================================================
  // 3. LIFECYCLE, ANIMATION & FOCUS TRAP
  // ==========================================================================
  useEffect(() => {
    const el = modalRef.current;
    if (!el || !isOpen) return;

    el.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('open');
        closeBtnRef.current?.focus();
      });
    });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusables = [...el.querySelectorAll(FOCUSABLE)].filter(
        (n) => n.offsetWidth || n.offsetHeight || n.getClientRects().length
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (!el.contains(document.activeElement)) {
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

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  // ==========================================================================
  // 4. NAVIGATION CLICK ACTIONS
  // ==========================================================================
  const handleNavClick = (target) => {
    handleClose(() => {
      if (typeof target === 'number') {
        if (typeof window.openDoor === 'function') {
          window.openDoor(target);
        }
      } else if (typeof target === 'string') {
        scrollToId(target);
      } else {
        if (typeof onOpenContact === 'function') {
          onOpenContact();
        }
      }
    });
  };

  const handleStartProject = () => {
    handleClose(() => {
      if (typeof onOpenContact === 'function') {
        onOpenContact();
      }
    });
  };

  // ==========================================================================
  // 5. RENDER MENU OVERLAY
  // ==========================================================================
  return (
    <div
      className={`navm${isOpen && !closing ? ' open' : ''}${closing ? ' closing' : ''}`}
      id="navm"
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      hidden={!isOpen}
    >
      <div className="shell navm__top">
        <span className="brand">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 48 48" fill="currentColor">
            <path d="M24 2c2.2 13.8 7.9 19.6 22 22-14.1 2.4-19.8 8.2-22 22-2.2-13.8-7.9-19.6-22-22 14.1-2.4 19.8-8.2 22-22Z" />
          </svg>
          Sumon
        </span>
        <button
          type="button"
          className="close-btn"
          id="navClose"
          ref={closeBtnRef}
          onClick={() => handleClose()}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 4l16 16M20 4 4 20" />
          </svg>
          Close
        </button>
      </div>

      <nav className="shell navm__nav" aria-label="Menu">
        <ul id="navList">
          {NAV_ITEMS.map((item, idx) => (
            <li key={item.label}>
              <button
                type="button"
                className="navm__item"
                style={{ '--d': `${idx * 45 + 80}ms` }}
                data-i={idx}
                onClick={() => handleNavClick(item.target)}
              >
                <small>0{idx + 1}</small>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shell navm__bot">
        <span>
          Local time<span data-navtime>{navTime}</span>
        </span>
        <button
          type="button"
          id="navStart"
          style={{ minHeight: '44px' }}
          onClick={handleStartProject}
        >
          Start a project →
        </button>
      </div>
    </div>
  );
}
