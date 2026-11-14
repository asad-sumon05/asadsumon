import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({
  mode: 'light',
  isDark: false,
  setMode: () => {},
  toggleMode: () => {},
});

const MODE_KEY_SUMON = 'sumon-mode';
const MODE_KEY_RISHI = 'rishi-mode';

/**
 * Read initial color mode preference from document attribute or localStorage.
 */
function getInitialMode() {
  if (typeof document !== 'undefined') {
    if (document.documentElement.dataset.mode === 'dark') return 'dark';
    try {
      const stored = localStorage.getItem(MODE_KEY_SUMON) || localStorage.getItem(MODE_KEY_RISHI);
      if (stored === 'dark') return 'dark';
    } catch {}
  }
  return 'light';
}

/**
 * Updates DOM attributes, meta theme-color tags, and localStorage keys.
 */
function syncDOMWithMode(targetMode) {
  const root = document.documentElement;
  if (targetMode === 'dark') {
    root.dataset.mode = 'dark';
  } else {
    delete root.dataset.mode;
  }

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute('content', targetMode === 'dark' ? '#1A1818' : '#EEEAE6');
  }

  const cordHit = document.getElementById('cordHit');
  if (cordHit) {
    cordHit.setAttribute('aria-checked', String(targetMode === 'dark'));
  }

  try {
    localStorage.setItem(MODE_KEY_SUMON, targetMode);
    localStorage.setItem(MODE_KEY_RISHI, targetMode);
  } catch {}
}

/**
 * ThemeProvider - Manages light/dark color theme across the portfolio.
 * Provides Document View Transitions cross-fading and adaptive grid scaling above 1920px.
 */
export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(getInitialMode);

  // ==========================================================================
  // 1. THEME SWITCHERS WITH OPTIONAL VIEW TRANSITIONS
  // ==========================================================================
  const applyMode = useCallback((targetMode) => {
    syncDOMWithMode(targetMode);
    setModeState(targetMode);
  }, []);

  const setMode = useCallback((targetMode, animate = true) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (animate && !reduced && document.startViewTransition) {
      document.startViewTransition(() => {
        applyMode(targetMode);
      });
      return;
    }

    applyMode(targetMode);
  }, [applyMode]);

  const toggleMode = useCallback((animate = true) => {
    setMode(mode === 'dark' ? 'light' : 'dark', animate);
  }, [mode, setMode]);

  // ==========================================================================
  // 2. DOM SYNCHRONIZATION & ADAPTIVE ULTRA-WIDE GRID SCALING
  // ==========================================================================
  useEffect(() => {
    const root = document.documentElement;
    syncDOMWithMode(mode);

    // Adaptive grid scale-up for screens wider than 1920px
    function applyAdaptiveGrid() {
      const FONT_BASE = 16;
      const baseWidth = 1920;
      const coef = 0.6666;
      const w = window.innerWidth;
      const widthReduction = ((baseWidth - w) / baseWidth) * 100;
      const size = FONT_BASE - (FONT_BASE * (widthReduction * coef)) / 100;
      if (size > FONT_BASE) {
        root.style.fontSize = size + 'px';
      } else {
        root.style.removeProperty('font-size');
      }
    }

    applyAdaptiveGrid();
    window.addEventListener('resize', applyAdaptiveGrid);

    return () => {
      window.removeEventListener('resize', applyAdaptiveGrid);
    };
  }, [mode]);

  const value = {
    mode,
    isDark: mode === 'dark',
    setMode,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
