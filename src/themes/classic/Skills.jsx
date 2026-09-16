import { motion } from "framer-motion";
import { skills } from "../../data/portfolioData";

export default function Skills() {
  return (
    <section className="py-16 lg:py-24 px-5 lg:px-28 mx-auto max-w-7xl" id="skills" aria-label="Technical skills">
      <motion.div
        className="text-center mb-12 lg:mb-16"
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl lg:text-4xl font-light text-black dark:text-white transition-colors duration-300">
          My <span className="font-semibold">Skills</span>
        </h2>
        <p className="text-[#71717A] dark:text-gray-400 text-sm lg:text-base mt-2 font-light">
          A comprehensive overview of my technical abilities and tools
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-5 justify-center place-items-center">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            className="border border-black/80 dark:border-white/80 text-black dark:text-white bg-transparent rounded-xl p-4 h-28 w-full flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:shadow-lg hover:-translate-y-1 group select-none"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.03 }}
            viewport={{ once: true, margin: "-30px" }}
          >
            <span className="text-xs uppercase font-bold tracking-widest text-[#71717A] dark:text-gray-400 group-hover:text-white/70 dark:group-hover:text-black/70">
              {skill.category}
            </span>
            <p className="font-semibold text-sm lg:text-base text-center leading-tight">
              {skill.name}
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded border border-black/20 dark:border-white/20 group-hover:border-white/40 dark:group-hover:border-black/40 text-[9px] font-medium uppercase">
              {skill.level}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
