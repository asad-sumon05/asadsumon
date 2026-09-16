import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Moon, Sun, Menu, X } from "lucide-react";
import { personalInfo } from "../../data/portfolioData";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ isDark, onToggleDark }) {
  const [hasShadow, setHasShadow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 10);
      const sections = navLinks.map((l) => l.href.substring(1));
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const ResumeBtn = ({ className = "" }) => (
    <motion.a
      href={personalInfo.resume}
      download="Asaduzzaman_Sumon_Resume.pdf"
      className={`relative inline-block px-4 py-2 font-medium group cursor-pointer ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out transform translate-x-1 translate-y-1 bg-black dark:bg-white group-hover:-translate-x-0 group-hover:-translate-y-0" />
      <span className="absolute inset-0 w-full h-full bg-white dark:bg-black border-2 border-black dark:border-white transition-colors duration-300 group-hover:bg-black dark:group-hover:bg-white" />
      <span className="relative text-black dark:text-white group-hover:text-white dark:group-hover:text-black flex items-center gap-x-2 transition-colors duration-300 text-xs font-bold uppercase tracking-wider">
        Resume <Download size={14} />
      </span>
    </motion.a>
  );

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed lg:px-28 px-5 top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
        hasShadow
          ? "bg-white/80 dark:bg-[#111]/80 backdrop-blur-md shadow-sm border-b border-black/5 dark:border-white/10 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-2xl font-bold cursor-pointer tracking-wider text-black dark:text-white select-none"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Asad<span className="text-[#71717A] dark:text-gray-400">Sumon</span>
          </a>
        </motion.div>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-x-8 font-normal">
          {navLinks.map(({ label, href }) => {
            const isActive = activeSection === href.substring(1);
            return (
              <motion.li
                key={href}
                className="relative"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(href);
                  }}
                  className={`text-sm tracking-wide transition-colors duration-300 ${
                    isActive
                      ? "text-black dark:text-white font-semibold"
                      : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {label}
                </a>
                {isActive && (
                  <motion.div
                    layoutId="activeNavClassic"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black dark:bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.li>
            );
          })}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <motion.button
            onClick={onToggleDark}
            className="p-2 rounded-full border border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          <ResumeBtn />
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-3">
          <motion.button
            onClick={onToggleDark}
            className="p-2 rounded-full border border-black/20 dark:border-white/20 text-black dark:text-white"
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          <motion.button
            className="text-2xl p-1 text-black dark:text-white cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden absolute top-full left-0 w-full bg-white/95 dark:bg-[#111]/95 backdrop-blur-md shadow-md border-b border-black/5 dark:border-white/10"
          >
            <ul className="flex flex-col items-center gap-y-5 font-normal py-6 px-5">
              {navLinks.map(({ label, href }) => (
                <li key={href} className="w-full text-center">
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(href);
                    }}
                    className="text-lg text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white font-medium transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li className="mt-2">
                <ResumeBtn />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
