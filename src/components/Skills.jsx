import { motion } from "framer-motion"
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaPython, FaDatabase, FaJava, FaGitAlt, FaBootstrap, FaMicrosoft } from "react-icons/fa"
import { RiTailwindCssFill } from "react-icons/ri"
import { SiC, SiCplusplus, SiMongodb, SiExpress, SiAdobephotoshop, SiAdobeillustrator } from "react-icons/si"

const skills = [
  { name: "HTML", icon: <FaHtml5 size={40} /> },
  { name: "CSS", icon: <FaCss3Alt size={40} /> },
  { name: "JavaScript", icon: <FaJs size={40} /> },
  { name: "Python", icon: <FaPython size={40} /> },
  { name: "Java", icon: <FaJava size={40} /> },
  { name: "C", icon: <SiC size={40} /> },
  { name: "C++", icon: <SiCplusplus size={40} /> },
  { name: "SQL", icon: <FaDatabase size={40} /> },
  { name: "MongoDB", icon: <SiMongodb size={40} /> },
  { name: "Express.js", icon: <SiExpress size={40} /> },
  { name: "React", icon: <FaReact size={40} /> },
  { name: "Node.js", icon: <FaNodeJs size={40} /> },
  { name: "Tailwind", icon: <RiTailwindCssFill size={40} /> },
  { name: "Bootstrap", icon: <FaBootstrap size={40} /> },
  { name: "Git", icon: <FaGitAlt size={40} /> },
  { name: "Photoshop", icon: <SiAdobephotoshop size={40} /> },
  { name: "Illustrator", icon: <SiAdobeillustrator size={40} /> },
  { name: "MS Office", icon: <FaMicrosoft size={40} /> },
]

export default function Skills() {
  return (
    <section className="mt-3 lg:mt-16 pb-10 lg:pb-16 px-5 lg:px-16 mx-auto max-w-[1400px]" id="skills" aria-label="Technical skills">
      <motion.h2
        className="text-2xl lg:text-3xl text-center font-light text-black dark:text-white transition-colors duration-300"
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        My <span className="font-medium">Skills</span>
      </motion.h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-6 text-sm lg:text-base font-normal mt-7 lg:mt-16 justify-center place-items-center">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            className="border border-black dark:border-white text-black dark:text-white bg-transparent rounded p-3 h-28 w-28 lg:h-36 lg:w-36 flex flex-col items-center justify-center gap-3 lg:gap-4 cursor-pointer transition-all duration-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:shadow-lg hover:-translate-y-1"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
            viewport={{ once: true, margin: "-30px" }}
          >
            {skill.icon}
            <p>{skill.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
