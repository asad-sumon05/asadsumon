import React, { useEffect, useRef } from 'react';
import Clock from './Clock';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { bindHovers } from '../../utils/spring';
import styles from './Header.module.css';

const HEADER_NAV = [
  { label: 'Home', go: 'home', isCurrent: true },
  { label: 'Web Development', door: 0 },
  { label: 'App Development', door: 1 },
  { label: 'UI/UX Design', door: 2 },
  { label: 'Graphic Design', door: 3 },
  { label: 'My story', go: 'about' },
  { label: 'Contact', contact: true },
];

/**
 * Header - Primary desktop navigation bar, live clock chip, and mobile menu trigger.
 * Features scroll-dependent stuck background transitions and spring micro-interactions.
 */
export default function Header() {
  const headerRef = useRef(null);
  const { scrollToId } = useSmoothScroll();

  // ==========================================================================
  // 1. STICKY BACKGROUND SCROLL LISTENER & SPRING HOVERS
  // ==========================================================================
  useEffect(() => {
    const hdr = headerRef.current;
    if (!hdr) return;

    // Toggle backdrop blur/background when user scrolls past 24px
    const handleScroll = () => {
      hdr.classList.toggle('stuck', window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Bind Euler spring physics to all [data-h] elements inside header
    const unbindHovers = bindHovers(hdr);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unbindHovers();
    };
  }, []);

  // ==========================================================================
  // 2. NAVIGATION CLICK EVENT DELEGATOR
  // ==========================================================================
  const handleNavClick = (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    if (btn.hasAttribute('data-contact')) {
      if (typeof window.openModal === 'function') {
        window.openModal();
      } else {
        const contactModal = document.getElementById('modal');
        if (contactModal) contactModal.hidden = false;
      }
      return;
    }

    if (btn.dataset.door !== undefined) {
      const doorIndex = parseInt(btn.dataset.door, 10);
      if (typeof window.openDoor === 'function') {
        window.openDoor(doorIndex);
      }
      return;
    }

    if (btn.dataset.go) {
      scrollToId(btn.dataset.go);
    }
  };

  // ==========================================================================
  // 3. FULLSCREEN MENU TRIGGER
  // ==========================================================================
  const handleOpenMenu = () => {
    if (typeof window.openNav === 'function') {
      window.openNav();
    } else {
      const navm = document.getElementById('navm');
      if (navm) {
        navm.hidden = false;
        navm.classList.add('open');
      }
    }
  };

  // ==========================================================================
  // 4. RENDER HEADER BAR
  // ==========================================================================
  return (
    <header className={`${styles.hdr} hdr rv`} ref={headerRef}>
      <div className={`shell ${styles.hdrIn} hdr__in`}>
        <nav aria-label="Primary" onClick={handleNavClick}>
          <ul className={`${styles.nav} nav`}>
            {HEADER_NAV.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  {...(item.go ? { 'data-go': item.go } : {})}
                  {...(item.door !== undefined ? { 'data-door': item.door } : {})}
                  {...(item.contact ? { 'data-contact': '' } : {})}
                  {...(item.isCurrent ? { 'aria-current': 'page' } : {})}
                >
                  <span data-h="y 0 -2|o .8 1" data-hs="320 22" data-ht="button">
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`${styles.hdrRight} hdr__right`}>
          <Clock />
          <button
            type="button"
            className={`${styles.chip} ${styles.menuBtn} chip menu-btn`}
            id="menuBtn"
            style={{ minHeight: '44px', minWidth: '44px' }}
            aria-haspopup="dialog"
            aria-controls="navm"
            aria-label="Menu"
            onClick={handleOpenMenu}
          >
            <span data-h="s 1 1.05" data-hs="320 18" data-ht=".menu-btn">
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className={`${styles.word} word`}>Menu</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
