import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme, THEMES } from "./context/ThemeContext";
import Portfolio1App from "./themes/portfolio1/Portfolio1App";
import ClassicApp from "./themes/classic/ClassicApp";
import SpidermanApp from "./themes/spiderman/SpidermanApp";
import ThemeSwitcher from "./components/ThemeSwitcher";
import "./App.css";

function ThemedPortfolio() {
  const { theme } = useTheme();

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {theme === THEMES.PORTFOLIO1 && (
          <motion.div
            key="portfolio1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full"
          >
            <Portfolio1App />
          </motion.div>
        )}

        {theme === THEMES.CLASSIC && (
          <motion.div
            key="classic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full"
          >
            <ClassicApp />
          </motion.div>
        )}

        {theme === THEMES.SPIDERMAN && (
          <motion.div
            key="spiderman"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full"
          >
            <SpidermanApp />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global floating Theme Switcher */}
      <ThemeSwitcher />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedPortfolio />
    </ThemeProvider>
  );
}
