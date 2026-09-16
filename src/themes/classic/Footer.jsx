import { motion } from "framer-motion";
import { SocialIcon } from "../../components/SocialIcon";
import { personalInfo, socialLinks } from "../../data/portfolioData";

export default function Footer() {
  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="mt-16 border-t border-black/10 dark:border-white/10 px-5 lg:px-28 py-10 lg:py-12 transition-colors duration-300 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div>
          <a href="#hero" className="text-2xl font-medium text-black dark:text-white">
            Asaduzzaman <span className="text-[#71717A] dark:text-gray-400">Sumon</span>
          </a>
          <p className="mt-1 text-[#71717A] dark:text-gray-400 text-sm font-light">
            Full Stack Web Developer
          </p>
          <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors duration-300 font-light"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-3">
          <div className="flex items-center gap-2">
            {socialLinks.map((item, i) => (
              <motion.a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                title={item.label}
                className="w-8 h-8 rounded-lg border border-black/20 dark:border-white/20 flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SocialIcon name={item.label} size={15} />
              </motion.a>
            ))}
          </div>
          <p className="text-xs font-light text-[#71717A] dark:text-gray-400">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
