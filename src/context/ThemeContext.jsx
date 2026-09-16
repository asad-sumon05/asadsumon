import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const THEMES = {
  PORTFOLIO1: "portfolio1",
  CLASSIC: "classic",
  SPIDERMAN: "spiderman",
};

const THEME_ORDER = [THEMES.PORTFOLIO1, THEMES.CLASSIC, THEMES.SPIDERMAN];

const THEME_META = {
  [THEMES.PORTFOLIO1]: {
    label: "Portfolio 1",
    description: "Modern Glassmorphism",
    color: "#8b5cf6",
    bg: "from-purple-600 to-indigo-600",
    preview: ["#0a0a0a", "#8b5cf6", "#38bdf8"],
  },
  [THEMES.CLASSIC]: {
    label: "Classic",
    description: "Minimal & Elegant",
    color: "#1a1a1a",
    bg: "from-gray-800 to-gray-600",
    preview: ["#fafafa", "#1a1a1a", "#71717A"],
  },
  [THEMES.SPIDERMAN]: {
    label: "Spider-Man",
    description: "Bold Comic Style",
    color: "#a31515",
    bg: "from-red-800 to-red-600",
    preview: ["#ffffff", "#a31515", "#111111"],
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("portfolio-theme");
      if (stored && THEME_ORDER.includes(stored)) return stored;
    } catch {}
    return THEMES.PORTFOLIO1;
  });

  useEffect(() => {
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {}
    // Set data attribute on html for theme-specific CSS
    document.documentElement.setAttribute("data-portfolio-theme", theme);
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => {
      const idx = THEME_ORDER.indexOf(prev);
      return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    });
  };

  const selectTheme = (t) => {
    if (THEME_ORDER.includes(t)) setTheme(t);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: selectTheme, cycleTheme, THEMES, THEME_META }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
