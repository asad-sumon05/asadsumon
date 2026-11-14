import React, { useEffect, useRef, useState } from 'react';
import { useSmoothScroll } from '../context/SmoothScrollContext';

const FOOTER_DOORS = [
  { index: 0, route: 'web-developer/', label: 'Web Development' },
  { index: 1, route: 'app-developer/', label: 'App Development' },
  { index: 2, route: 'ui-ux-designer/', label: 'UI/UX Design' },
  { index: 3, route: 'graphic-designer/', label: 'Graphic Design' },
  { index: 4, route: 'photographer/', label: 'Photography' },
];

/**
 * Footer - Site footer (.sfw/.sf) and floating back-to-top button (.totop).
 * Features dynamic corner background sampling, scroll progress indicator, and contrast luminance detection.
 */
export default function Footer({ onOpenContact }) {
  // DOM element references
  const sfwRef = useRef(null);
  const ttRef = useRef(null);
  const { scrollToId } = useSmoothScroll();
  const [fTime, setFTime] = useState('—');
  const [fYear, setFYear] = useState('2026');

  // ==========================================================================
  // 1. CLOCK TICKER FOR FOOTER LOCAL TIME AND YEAR
  // ==========================================================================
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = d.getHours();
      setFTime(`${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`);
      setFYear(String(d.getFullYear()));
    };
    tick();
    const timer = setInterval(tick, 20000);
    return () => clearInterval(timer);
  }, []);

  // ==========================================================================
  // 2. FOOTER ADAPTIVE CORNER BACKGROUND COLOR & LUMINANCE DETECTION
  // ==========================================================================
  useEffect(() => {
    const sfw = sfwRef.current;
    if (!sfw) return;

    const above = () => {
      const solid = (e) => {
        const c = getComputedStyle(e).backgroundColor;
        const m = c.match(/[\d.]+/g);
        return m && !(m.length > 3 && +m[3] < 0.05) ? c : '';
      };
      let col = '';
      let e = sfw.previousElementSibling;
      while (e) {
        if (e.getBoundingClientRect().width >= window.innerWidth * 0.9) {
          const c = solid(e);
          if (c) col = c;
        }
        e = e.lastElementChild;
      }
      const bg = col || solid(document.body) || getComputedStyle(document.documentElement).backgroundColor;
      sfw.style.setProperty('--above', bg);

      const m = (bg.match(/[\d.]+/g) || [255, 255, 255]).map(Number);
      sfw.classList.toggle('sfw--dark', (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 < 0.25);
    };

    above();
    window.addEventListener('resize', above);
    const mo = new MutationObserver(above);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });

    return () => {
      window.removeEventListener('resize', above);
      mo.disconnect();
    };
  }, []);

  // ==========================================================================
  // 3. FLOATING BACK-TO-TOP: PROGRESS RING & LUMINANCE DETECTION
  // ==========================================================================
  useEffect(() => {
    const tt = ttRef.current;
    if (!tt) return;

    const CIRCLE_LEN = (2 * Math.PI * 24).toFixed(2);
    tt.style.setProperty('--len', CIRCLE_LEN);

    const lum = (el) => {
      for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
        const m = getComputedStyle(e).backgroundColor.match(/[\d.]+/g);
        if (!m) continue;
        if (m.length > 3 && +m[3] < 0.5) continue;
        return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255;
      }
      const m = getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g) || [255, 255, 255];
      return m.length > 3 && +m[3] < 0.5
        ? document.documentElement.dataset.mode === 'dark'
          ? 0
          : 1
        : (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255;
    };

    let raf = 0;
    const upd = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const bot = document.querySelector('.sf__bot');

      // Hide floating button once footer's inline 'Back to top' is visible
      tt.classList.toggle(
        'show',
        y > window.innerHeight * 0.9 && !(bot && bot.getBoundingClientRect().top < window.innerHeight - 8)
      );
      tt.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);

      const r = tt.getBoundingClientRect();
      tt.style.pointerEvents = 'none';
      const under = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      tt.style.pointerEvents = '';
      if (under) {
        tt.dataset.on = lum(under) < 0.45 ? 'dark' : 'light';
      }
    };

    const q = () => {
      if (!raf) raf = requestAnimationFrame(upd);
    };

    window.addEventListener('scroll', q, { passive: true });
    window.addEventListener('resize', q);
    const mo = new MutationObserver(q);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode', 'class'] });

    upd();

    return () => {
      window.removeEventListener('scroll', q);
      window.removeEventListener('resize', q);
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ==========================================================================
  // 4. ACTION DELEGATES
  // ==========================================================================
  const handleToTop = () => {
    scrollToId('home');
  };

  const handleOpenDoor = (e, index) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof window.openDoor === 'function') {
      window.openDoor(index);
    }
  };

  const handleGo = (e, targetId) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    e.preventDefault();
    e.stopPropagation();
    scrollToId(targetId);
  };

  // ==========================================================================
  // 5. RENDER FOOTER LAYOUT
  // ==========================================================================
  return (
    <>
      <div className="sfw" ref={sfwRef}>
        <footer className="sf" id="contact-footer" aria-labelledby="sfTitle">
          <div className="sf__in">
            <p className="sf__eye">
              <i></i>Available for new work
            </p>
            <h2 className="sf__h" id="sfTitle">
              Got a project?
              <span>Let's build it together.</span>
            </h2>
            <p className="sf__p">
              I'm open to new engineering and development opportunities: web applications, frontend interfaces, and custom design. Tell me about your project and I'll get back to you within a day.
            </p>
            <div className="sf__cta">
              <button
                type="button"
                className="sf__btn"
                data-contact
                onClick={() => onOpenContact && onOpenContact()}
              >
                Start a project{' '}
                <b>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </b>
              </button>
              <button
                type="button"
                className="sf__ghost"
                data-go="works"
                onClick={(e) => handleGo(e, 'works')}
              >
                See my work
              </button>
            </div>

            <div className="sf__cols">
              <div>
                <h3>Work</h3>
                <ul className="work">
                  {FOOTER_DOORS.map((door) => (
                    <li key={door.route}>
                      <a href={door.route} data-door={door.index} onClick={(e) => handleOpenDoor(e, door.index)}>
                        {door.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>Navigate</h3>
                <ul>
                  <li>
                    <a href="./" data-go="home" onClick={(e) => handleGo(e, 'home')}>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="./#about" data-go="about" onClick={(e) => handleGo(e, 'about')}>
                      My story
                    </a>
                  </li>
                  <li>
                    <button type="button" data-contact onClick={() => onOpenContact && onOpenContact()}>
                      Contact
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3>Status</h3>
                <ul>
                  <li className="st">Available for work</li>
                  <li className="st">Remote-first, worldwide</li>
                  <li className="st">
                    Local time <span data-ftime>{fTime}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="sf__bot">
              <span>
                © <span data-fyear>{fYear}</span> Asaduzzaman Sumon. Designed and built by Sumon.
              </span>
              <span className="sf__legal">
                <a href="legal/" target="_top">
                  Privacy &amp; credits
                </a>
              </span>
              <button type="button" data-go="home" onClick={handleToTop}>
                Back to top ↑
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Back to Top Button with SVG Ring Progress */}
      <button
        type="button"
        className="totop"
        ref={ttRef}
        data-go="home"
        aria-label="Back to top"
        onClick={handleToTop}
      >
        <svg className="ring" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
        </svg>
        <svg
          className="ar"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
        <span className="lbl">Back to top</span>
      </button>
    </>
  );
}
