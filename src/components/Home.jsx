import { motion } from "framer-motion"
import { IoLogoLinkedin, IoLogoInstagram } from "react-icons/io5"
import { BiLogoGmail } from "react-icons/bi"
import { BsGithub } from "react-icons/bs"
import { TypeAnimation } from "react-type-animation"
import ThreeBackground from "./ThreeBackground"

const socials = [
  { Icon: BiLogoGmail, link: "mailto:asad.sumon05@gmail.com", label: "Email" },
  { Icon: IoLogoLinkedin, link: "https://linkedin.com/in/asad-sumon05", label: "LinkedIn" },
  { Icon: IoLogoInstagram, link: "https://instagram.com/asad.sumon05", label: "Instagram" },
  { Icon: BsGithub, link: "https://github.com/asad-sumon05", label: "GitHub" }
]

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } }
}
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

export default function Home() {
  return (
    <section className="mt-20 relative" id="home" aria-label="Hero section">
      <div className="hidden lg:block"><ThreeBackground /></div>
      <div className="flex justify-between py-10 items-center px-5 lg:px-28 lg:flex-row flex-col-reverse relative z-10">
        <motion.div
          className="lg:w-[45%]"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeUp} className="text-2xl lg:text-4xl flex flex-col mt-8 lg:mt-0 gap-2 lg:gap-5 text-nowrap font-light">
            <h1>Hello, <TypeAnimation sequence={['', 500, 'I am Asaduzzaman Sumon', 2000]} speed={10} deletionSpeed={50} style={{ fontWeight: 400 }} repeat={Infinity} /></h1>
            <h2><span className="font-medium text-black dark:text-white transition-colors duration-300">Full Stack Web</span> <span className="text-white dark:text-[#111] font-medium transition-colors duration-300 [-webkit-text-stroke:1px_black] dark:[-webkit-text-stroke:1px_white]">Developer</span></h2>
            <h2 className="text-black dark:text-white transition-colors duration-300">Based In <span className="font-medium">Bangladesh.</span></h2>
          </motion.div>
          <motion.p variants={fadeUp} className="text-[#71717A] dark:text-gray-400 text-sm lg:text-base mt-5 font-light leading-relaxed transition-colors duration-300">Motivated CSE Engineer with experience in web development, system analysis, and project management. Passionate about innovation and effective at communicating complex technical concepts.</motion.p>
          <motion.div variants={fadeUp} className="flex items-center gap-x-5 mt-10 lg:mt-14 text-black dark:text-white">
            {socials.map(({ Icon, link, label }, i) => (
              <motion.a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 lg:p-3 rounded border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
              >
                <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          className="lg:w-[55%] w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <img className="h-full w-full" src="/assets/hero-vector.svg" alt="Asaduzzaman Sumon - Full Stack Web Developer illustration" loading="eager" />
        </motion.div>
      </div>
    </section>
  )
}
