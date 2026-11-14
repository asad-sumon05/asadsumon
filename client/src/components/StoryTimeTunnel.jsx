import React, { useEffect, useRef } from 'react';

// ============================================================================
// 1. HISTORICAL CHAPTER TIMELINE DATA
// ============================================================================
const CHAPTERS = [
  {
    year: '2025',
    when: 'Oct 2025 — Present',
    title: 'Graphic Designer',
    org: 'Gentle Graphix · Faridpur, Bangladesh',
    isNow: true,
    bullets: [
      'Specialized in print and digital design solutions.',
      'Developed clean, responsive website templates for multiple platforms that reinforced cohesive brand standards.',
      'Proficient in Adobe Creative Suite (Photoshop, Illustrator) and Canva, ensuring high-quality outputs for print and digital.',
    ],
  },
  {
    year: '2025',
    when: 'Jun 2025 — Oct 2025',
    title: 'Intern in Web Developer',
    org: 'OnDevs · Dhaka, Bangladesh',
    bullets: [
      'Managed frontend development and custom theme creation.',
      'Built and maintained responsive web interfaces using HTML, CSS, JavaScript, and modern frameworks like React.',
      'Collaborated with a team of developers, contributing to a 20% increase in team productivity.',
    ],
  },
  {
    year: '2022',
    when: 'Mar 2022 — May 2025',
    title: 'Junior Graphic Designer',
    org: 'Gentle Graphix · Faridpur, Bangladesh',
    bullets: [
      'Design in both print and digital media.',
      'Designed modern, responsive web templates for many platforms, supporting consistent brand identity.',
      'Created visually engaging print templates, brochures, flyers, and business collateral for various clients across industries.',
    ],
  },
  {
    year: '2022',
    when: 'Sep 2022 — Sep 2025',
    title: 'B.Sc. in Computer Science & Engineering',
    org: 'Northern University Bangladesh · Dhaka',
    bullets: [
      'Graduated with CGPA 3.33 / 4.0 (Level in EQF: 6).',
      'Specialized in web development, system analysis, algorithms, and database management.',
    ],
  },
  {
    year: '2017',
    when: 'Oct 2017 — Dec 2021',
    title: 'Diploma in Computer Science & Engineering',
    org: 'Grassroots College of Technology · Faridpur',
    bullets: [
      'Earned Diploma with CGPA 3.59 / 4.0 (Level in EQF: 5).',
      'Core foundations in programming (Python, Java, C++), database systems, and software engineering.',
    ],
  },
  {
    year: '2015',
    when: 'Jan 2015 — Dec 2016',
    title: 'Dakhil Exam of Bangladesh (SSC)',
    org: 'Goalundo Dakhil Madrasha · Goalanda, Bangladesh',
    bullets: ['Achieved GPA 4.0 / 5.0.'],
  },
];

/**
 * StoryTimeTunnel - "#about" section with 3D perspective projection clock tunnel,
 * historical year odometer drum, travel dot pinned along the scroll line, and chapter list.
 */
export default function StoryTimeTunnel() {
  // DOM element references
  const secRef = useRef(null);
  const canvasRef = useRef(null);
  const lineRef = useRef(null);
  const listRef = useRef(null);
  const railRef = useRef(null);
  const dtrackRef = useRef(null);
  const ttrackRef = useRef(null);
  const whenRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    const sec = secRef.current;
    const cv = canvasRef.current;
    const line = lineRef.current;
    const list = listRef.current;
    const rail = railRef.current;
    const dtrack = dtrackRef.current;
    const ttrack = ttrackRef.current;
    const when = whenRef.current;
    const count = countRef.current;

    if (!sec || !cv || !line || !list || !rail || !dtrack || !ttrack || !when || !count) return;

    const ctx = cv.getContext('2d');
    const chs = [...list.querySelectorAll('.ch')];
    const N = chs.length;
    const cols = [...sec.querySelectorAll('.dg__c')];
    const root = document.documentElement;

    let shownYear = '';
    let shown = -1;

    const setYear = (y) => {
      if (y === shownYear) return;
      shownYear = y;
      String(y)
        .split('')
        .forEach((d, k) => {
          if (cols[k]) cols[k].style.setProperty('--d', d);
        });
    };

    const show = (i) => {
      if (i === shown) return;
      shown = i;
      chs.forEach((c, k) => c.classList.toggle('on', k === i));
      if (chs[i]) {
        setYear(chs[i].dataset.y);
        when.textContent = chs[i].dataset.when;
        count.textContent = String(i + 1).padStart(2, '0');
      }
      sec.classList.toggle('is-now', i === 0);
      sec.dataset.ch = i; // Backdrop light matches active chapter theme
    };

    // ========================================================================
    // 2. 3D CANVAS PERSPECTIVE TUNNEL ENGINE
    // ========================================================================
    let W = 0;
    let H = 0;
    let dpr = 1;
    let rgb = '26,24,24';

    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
    };

    const readRgb = () => {
      rgb = (getComputedStyle(root).getPropertyValue('--fg-rgb') || '26,24,24').trim();
    };

    const RINGS = 16;
    const GAP = 340;
    const FOCAL = 520;
    const R = 620;
    const TICKS = 60;
    const dust = Array.from({ length: 70 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 120 + Math.random() * 760,
      z: Math.random() * RINGS * GAP,
      s: 0.6 + Math.random() * 1.4,
    }));

    function tunnel(p, t = 0) {
      if (!ctx || W <= 0 || H <= 0) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const mob = W < 768;
      const cx = W * 0.5;
      const cy = H * 0.55;
      const k = Math.min(W, H) / 900;
      const camZ = p * (N - 1) * GAP * 1.6 + t * 18; // Scrolling travels deeper into the timeline
      const spin = -p * Math.PI * 1.5 - t * 0.02; // Dials rotate backwards
      const len = RINGS * GAP;
      ctx.lineCap = 'round';

      // Draw perspective clock dials
      for (let i = 0; i < RINGS; i++) {
        const z = (((i * GAP - camZ) % len) + len) % len + 60;
        const s = (FOCAL / z) * k;
        const fog = Math.min(1, Math.max(0, (z - 260) / 1100)) * Math.max(0, 1 - z / len);
        if (fog <= 0.01) continue;
        const rr = R * s;
        const rot = spin + i * 0.21;

        // Dial outer rim
        ctx.strokeStyle = `rgba(${rgb},${(fog * 0.12).toFixed(3)})`;
        ctx.lineWidth = Math.max(0.5, 1.2 * s);
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.stroke();

        // Clock tick marks (major hour marks and minor minute marks)
        const T = mob ? 36 : TICKS;
        const every = T / 12;
        for (const hour of [false, true]) {
          const l = (hour ? 46 : 18) * s;
          ctx.beginPath();
          for (let j = 0; j < T; j++) {
            if ((j % every === 0) !== hour) continue;
            const a = rot + (j / T) * Math.PI * 2;
            const c = Math.cos(a);
            const d = Math.sin(a);
            ctx.moveTo(cx + c * (rr - l), cy + d * (rr - l));
            ctx.lineTo(cx + c * rr, cy + d * rr);
          }
          ctx.strokeStyle = `rgba(${rgb},${(fog * (hour ? 0.3 : 0.14)).toFixed(3)})`;
          ctx.lineWidth = Math.max(0.5, (hour ? 3 : 1.4) * s);
          ctx.stroke();
        }

        // Clock hand per dial
        const ha = rot * 3 + i;
        ctx.strokeStyle = `rgba(${rgb},${(fog * 0.16).toFixed(3)})`;
        ctx.lineWidth = Math.max(0.5, 2 * s);
        if (rr < Math.min(W, H) * 0.45) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(ha) * rr * 0.55, cy + Math.sin(ha) * rr * 0.55);
          ctx.stroke();
        }
      }

      // Floating dust particles
      for (const q of dust) {
        const z = (((q.z - camZ * 1.1) % len) + len) % len + 40;
        const s = (FOCAL / z) * k;
        const fog = Math.min(1, Math.max(0, (z - 300) / 900)) * Math.max(0, 1 - z / len);
        const a = q.a + spin * 0.3;
        ctx.fillStyle = `rgba(${rgb},${(fog * 0.35).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * q.r * s, cy + Math.sin(a) * q.r * s, Math.max(0.4, q.s * s * 2.2), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ========================================================================
    // 3. VERTICAL RAIL MEASUREMENT & SCROLL PROGRESS SYNCHRONIZER
    // ========================================================================
    let firstY = 0;
    let lastY = 0;
    let endY = 0;

    const measure = () => {
      if (!chs.length || !chs[0].firstElementChild) return;
      const mark = (c) => list.offsetTop + c.offsetTop + c.firstElementChild.offsetTop + 8;
      firstY = mark(chs[0]);
      lastY = mark(chs[N - 1]);
      const last = chs[N - 1];
      endY = list.offsetTop + last.offsetTop + last.offsetHeight - parseFloat(getComputedStyle(last).paddingBottom);
      for (const el of [rail, dtrack, ttrack]) {
        if (el) {
          el.style.setProperty('--r0', firstY + 'px');
          el.style.setProperty('--rh', endY - firstY + 'px');
        }
      }
      if (window.innerWidth >= 768) size();
    };

    let raf = 0;
    let p = 0;
    const reducedM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function update() {
      raf = 0;
      const lr = line.getBoundingClientRect();
      const mid = window.innerHeight * 0.5;
      const y = Math.min(lastY, Math.max(firstY, mid - lr.top));
      p = (y - firstY) / Math.max(1, lastY - firstY);

      sec.style.setProperty('--p', p.toFixed(4));
      sec.style.setProperty('--warm', p.toFixed(3));
      sec.classList.toggle('at-start', p < 0.002);

      let curI = 0;
      for (let k = 0; k < N; k++) {
        if (lr.top + list.offsetTop + chs[k].offsetTop < mid + 40) curI = k;
      }
      show(curI);

      if (window.innerWidth >= 768 && !reducedM && !root.classList.contains('lite')) {
        tunnel(p, 0);
      }
    }

    const q = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', q, { passive: true });
    window.addEventListener('resize', () => {
      measure();
      q();
    });

    const themeObserver = new MutationObserver(() => {
      readRgb();
      q();
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ['data-mode'] });

    readRgb();
    measure();
    show(0);
    update();

    document.fonts?.ready?.then(() => {
      measure();
      q();
    });

    // ========================================================================
    // 4. CLEANUP & TEARDOWN
    // ========================================================================
    return () => {
      window.removeEventListener('scroll', q);
      window.removeEventListener('resize', () => {
        measure();
        q();
      });
      themeObserver.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ==========================================================================
  // 5. RENDER STAGE & CHAPTER LIST
  // ==========================================================================
  return (
    <section id="about" className="story" ref={secRef} aria-labelledby="storyTitle" style={{ '--n': 6 }}>
      <div className="story__amb" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>

      <div className="story__track">
        <div className="story__pin">
          <div className="shell story__stage">
            <div className="story__clock">
              <canvas className="story__bg" ref={canvasRef} aria-hidden="true"></canvas>
              <p className="eyebrow">My story</p>
              <h2 className="story__h" id="storyTitle">
                Let's go back in time.
              </h2>

              {/* 4-digit odometer reel for historical years */}
              <div className="story__yr" aria-hidden="true">
                {[0, 1, 2, 3].map((idx) => (
                  <span className="dg" key={idx}>
                    <span className="dg__c">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                        <i key={digit}>{digit}</i>
                      ))}
                    </span>
                  </span>
                ))}
              </div>

              <p className="story__when" ref={whenRef} aria-hidden="true">
                Aug 2025 — Now
              </p>

              <div className="story__meter" aria-hidden="true">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="story__rw"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 3-6.7" />
                  <path d="M3 4v5h5" />
                  <path d="M12 7v5l3 2" />
                </svg>
                <span className="story__count" ref={countRef}>
                  01
                </span>
                <span className="story__of">/ 05</span>
                <i className="story__bar">
                  <b></b>
                </i>
              </div>
            </div>

            {/* Vertical timeline rail and chapter entries */}
            <div className="story__line" ref={lineRef}>
              <span className="story__rail" ref={railRef} aria-hidden="true"></span>
              <span className="story__ttrack" ref={ttrackRef} aria-hidden="true">
                <span className="story__tail"></span>
              </span>
              <span className="story__dtrack" ref={dtrackRef} aria-hidden="true">
                <span className="story__dot"></span>
              </span>

              <ol className="story__list" ref={listRef}>
                {CHAPTERS.map((ch) => (
                  <li
                    key={ch.title + ch.year}
                    className={`ch${ch.isNow ? ' ch--now' : ''}`}
                    data-y={ch.year}
                    data-when={ch.when}
                  >
                    <p className="ch__date">{ch.when}</p>
                    <h3 className="ch__t">{ch.title}</h3>
                    <p className="ch__org">{ch.org}</p>
                    <ul className="ch__b">
                      {ch.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
