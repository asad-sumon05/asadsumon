import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { BsGithub } from "react-icons/bs"
import { IoLogoLinkedin, IoLogoInstagram } from "react-icons/io5"
import { BiLogoGmail } from "react-icons/bi"

const socials = [
  { Icon: BiLogoGmail, href: "mailto:asad.sumon05@gmail.com", label: "Email" },
  { Icon: IoLogoLinkedin, href: "https://linkedin.com/in/asad-sumon05", label: "LinkedIn" },
  { Icon: IoLogoInstagram, href: "https://instagram.com/asad.sumon05", label: "Instagram" },
  { Icon: BsGithub, href: "https://github.com/asad-sumon05", label: "GitHub" },
]

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Skills", path: "/skills" },
  { label: "Experience", path: "/experience" },
  { label: "Projects", path: "/projects" },
  { label: "Contact", path: "/contact" },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 dark:border-white/10 px-5 lg:px-28 transition-colors duration-300" role="contentinfo">
      <div className="py-10 lg:py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div>
          <Link to="/" aria-label="Go to homepage">
            <h3 className="text-2xl font-medium text-black dark:text-white transition-colors duration-300">Asaduzzaman <span className="text-[#71717A] dark:text-gray-400 transition-colors duration-300">Sumon</span></h3>
          </Link>
          <p className="mt-2 text-[#71717A] dark:text-gray-400 text-sm font-light transition-colors duration-300">Full Stack Web Developer</p>
          <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation">
            {navLinks.map(({ label, path }) => (
              <Link key={path} to={path} className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors duration-300 font-light">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {socials.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded border border-black/80 dark:border-white/80 text-black dark:text-white transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black dark:hover:border-white"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
          <p className="text-xs font-light text-[#71717A] dark:text-gray-400 transition-colors duration-300">© {new Date().getFullYear()} Asaduzzaman Sumon</p>
        </div>
      </div>
    </footer>
  )
}
