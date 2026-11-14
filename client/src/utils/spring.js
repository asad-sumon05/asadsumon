/**
 * Mass 1, Semi-Implicit Euler Spring Solver.
 * Numerically models a damped harmonic oscillator:
 * acceleration = tension * (target - position) - friction * velocity
 *
 * @param {Object} options
 * @param {number} [options.tension=320] - Spring stiffness constant
 * @param {number} [options.friction=18] - Damping coefficient
 * @param {Function} render - Callback receiving current spring value (0 to 1)
 */
export function createSpring({ tension = 320, friction = 18 }, render) {
  let x = 0;
  let v = 0;
  let target = 0;
  let raf = 0;

  const step = () => {
    const dt = 1 / 60;
    const a = tension * (target - x) - friction * v;
    v += a * dt;
    x += v * dt;
    render(x);

    // Settle threshold: stop loop once velocity and displacement are negligible
    if (Math.abs(target - x) < 0.001 && Math.abs(v) < 0.001) {
      x = target;
      v = 0;
      render(x);
      raf = 0;
      return;
    }

    raf = requestAnimationFrame(step);
  };

  render(0);

  return {
    set(t) {
      target = t;
      if (!raf) raf = requestAnimationFrame(step);
    },
    destroy() {
      if (raf) cancelAnimationFrame(raf);
    },
  };
}

/**
 * Binds declarative spring hover effects on a DOM element using data attributes:
 * - data-h: pipe-separated transforms, e.g. "s 1 1.04|y 0 -2|o .8 1"
 *           (s = scale, x = translateX, y = translateY, r = rotate, o = opacity)
 * - data-hs: custom tension and friction, e.g. "320 18"
 * - data-ht: selector for parent trigger element (default: element itself)
 *
 * @param {HTMLElement} el - Target DOM element to animate
 * @returns {Function} Cleanup unbind function
 */
export function bindHoverElement(el) {
  if (el._hSpring) return () => {};

  const canHover = typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const props = (el.dataset.h || '').split('|').map((p) => {
    const [k, a, b] = p.trim().split(/\s+/);
    return { k, a: +a, b: +b };
  });

  const [tension, friction] = (el.dataset.hs || '320 18').split(/\s+/).map(Number);
  const trig = el.dataset.ht ? el.closest(el.dataset.ht) || el : el;

  const render = (progress) => {
    const v = { s: 1, x: 0, y: 0, r: 0 };
    let opacity = null;

    props.forEach(({ k, a, b }) => {
      const val = a + (b - a) * progress;
      if (k === 'o') opacity = val;
      else v[k] = val;
    });

    el.style.transform = `translate(${v.x}px,${v.y}px) rotate(${v.r}deg) scale(${v.s})`;
    if (opacity !== null) el.style.opacity = opacity;
  };

  const springInstance = createSpring({ tension, friction }, render);
  el._hSpring = springInstance;

  if (!canHover) {
    return () => {
      springInstance.destroy();
      delete el._hSpring;
    };
  }

  const onEnter = () => springInstance.set(1);
  const onLeave = () => springInstance.set(0);

  trig.addEventListener('mouseenter', onEnter);
  trig.addEventListener('mouseleave', onLeave);
  trig.addEventListener('focusin', onEnter);
  trig.addEventListener('focusout', onLeave);

  return () => {
    trig.removeEventListener('mouseenter', onEnter);
    trig.removeEventListener('mouseleave', onLeave);
    trig.removeEventListener('focusin', onEnter);
    trig.removeEventListener('focusout', onLeave);
    springInstance.destroy();
    delete el._hSpring;
  };
}

/**
 * Binds all [data-h] elements within a given scope element.
 *
 * @param {HTMLElement|Document} scope
 * @returns {Function} Batch cleanup function
 */
export function bindHovers(scope = document) {
  const cleanups = [];
  scope.querySelectorAll('[data-h]').forEach((el) => {
    cleanups.push(bindHoverElement(el));
  });
  return () => {
    cleanups.forEach((c) => c());
  };
}
