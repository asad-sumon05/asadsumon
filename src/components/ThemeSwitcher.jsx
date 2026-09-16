import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const THEME_ICONS = {
  portfolio1: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  classic: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" fill="none" strokeWidth="2"/>
      <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  spiderman: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="2"/>
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export default function ThemeSwitcher() {
  const { theme, setTheme, THEMES, THEME_META } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentMeta = THEME_META[theme];

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />
            {/* Theme Panel */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.92 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-16 right-0 w-64 rounded-2xl border border-white/20 shadow-2xl overflow-hidden z-[9999]"
              style={{
                background: "rgba(10, 10, 10, 0.92)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  Choose Theme
                </p>
              </div>

              {/* Theme Options */}
              <div className="p-2 flex flex-col gap-1">
                {Object.entries(THEME_META).map(([key, meta]) => (
                  <motion.button
                    key={key}
                    onClick={() => {
                      setTheme(key);
                      setIsOpen(false);
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                      theme === key
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {/* Color swatches */}
                    <div className="flex gap-0.5 shrink-0">
                      {meta.preview.map((c, i) => (
                        <div
                          key={i}
                          className="w-3 h-6 rounded-sm first:rounded-l-md last:rounded-r-md"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm leading-none mb-0.5">
                        {meta.label}
                      </p>
                      <p className="text-[11px] text-white/40 truncate">
                        {meta.description}
                      </p>
                    </div>

                    {/* Active indicator */}
                    {theme === key && (
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Footer note */}
              <div className="px-4 py-2 border-t border-white/10">
                <p className="text-[9px] text-white/25 text-center tracking-widest uppercase">
                  Asaduzzaman Sumon
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full shadow-2xl text-white font-bold text-xs tracking-wide select-none cursor-pointer"
        style={{
          background: currentMeta.color,
          boxShadow: `0 4px 20px ${currentMeta.color}60`,
        }}
        aria-label="Switch portfolio theme"
      >
        <span className="w-4 h-4">{THEME_ICONS[theme]}</span>
        <span>Theme</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-0.5"
        >
          ▲
        </motion.span>
      </motion.button>
    </div>
  );
}
