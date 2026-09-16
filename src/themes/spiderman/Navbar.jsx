import { useState, useEffect } from "react";
import { personalInfo } from "../../data/portfolioData";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["About", "Skills", "Experience", "Projects", "Contact"];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-red-900/50 py-3 shadow-[0_4px_30px_rgba(220,38,38,0.15)]"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a
          href="#hero"
          className="text-white text-2xl font-black tracking-tighter italic uppercase group flex items-center select-none"
        >
          <span className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
            A
          </span>
          <span className="group-hover:text-red-500 transition-colors duration-300">
            SADUZZAMAN.
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="relative text-xs md:text-sm font-bold text-gray-400 uppercase tracking-[0.15em] transition-colors duration-300 hover:text-white group"
            >
              {link}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 ease-out group-hover:w-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-gray-300 hover:text-red-500 uppercase tracking-wider transition-colors px-3 py-1.5 border border-gray-700 hover:border-red-600 rounded-lg"
          >
            GitHub
          </a>
          <a
            href="#contact"
            className="text-xs font-bold text-white bg-[#a31515] hover:bg-[#7a0f0f] uppercase tracking-wider transition-all px-4 py-1.5 rounded-lg shadow-[0_0_15px_rgba(163,21,21,0.5)]"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-400 hover:text-red-600 transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-red-900/50 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors"
            >
              {link}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-800">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-gray-300 hover:text-red-500 uppercase tracking-wider"
            >
              GitHub: {personalInfo.githubHandle}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
