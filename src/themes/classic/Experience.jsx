import { motion } from "framer-motion";
import { experiences, education } from "../../data/portfolioData";

export default function Experience() {
  return (
    <section className="px-5 lg:px-28 py-16 lg:py-24 max-w-5xl mx-auto" id="experience" aria-label="Experience">
      <motion.div
        className="text-center mb-16 lg:mb-20"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl lg:text-4xl font-light text-black dark:text-white mb-3 transition-colors duration-300">
          My <span className="font-semibold">Experience & Education</span>
        </h2>
        <p className="text-[#71717A] dark:text-gray-400 text-base font-light">
          An evolving track record of technical development and academic rigor
        </p>
      </motion.div>

      {/* Work Experience */}
      <div className="mb-16">
        <h3 className="text-xl font-medium text-black dark:text-white mb-8 border-b border-black/10 dark:border-white/10 pb-3">
          Work History
        </h3>
        <div className="relative pl-6 md:pl-10 border-l-2 border-black/20 dark:border-white/20 ml-2 space-y-10">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
              viewport={{ once: true, margin: "-30px" }}
            >
              {/* Timeline dot */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#111] bg-black dark:bg-white shadow-sm" />

              <div className="border border-black/10 dark:border-white/10 bg-white dark:bg-[#13131a] rounded-2xl p-6 hover:shadow-xl hover:border-black/30 dark:hover:border-white/30 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <span className="text-xs font-bold tracking-widest text-[#71717A] dark:text-gray-400 uppercase">
                    {exp.period}
                  </span>
                  <span className="text-xs text-[#71717A] dark:text-gray-400 font-light">
                    📍 {exp.location}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-black dark:text-white mb-1">
                  {exp.role}
                </h4>
                <p className="text-sm font-medium text-black/70 dark:text-white/70 mb-3">
                  {exp.company}
                </p>
                <p className="text-sm text-[#71717A] dark:text-gray-300 font-light leading-relaxed mb-4">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="text-[11px] px-2.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.08] text-black/70 dark:text-white/80 font-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-xl font-medium text-black dark:text-white mb-8 border-b border-black/10 dark:border-white/10 pb-3">
          Education
        </h3>
        <div className="relative pl-6 md:pl-10 border-l-2 border-black/20 dark:border-white/20 ml-2 space-y-10">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
              viewport={{ once: true, margin: "-30px" }}
            >
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#111] bg-black dark:bg-white shadow-sm" />

              <div className="border border-black/10 dark:border-white/10 bg-white dark:bg-[#13131a] rounded-2xl p-6 hover:shadow-xl hover:border-black/30 dark:hover:border-white/30 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <span className="text-xs font-bold tracking-widest text-[#71717A] dark:text-gray-400 uppercase">
                    {edu.period}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 w-fit">
                    {edu.score}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-black dark:text-white mb-1">
                  {edu.degree}
                </h4>
                <p className="text-sm font-medium text-black/70 dark:text-white/70 mb-3">
                  {edu.institution} • 📍 {edu.location}
                </p>
                <p className="text-sm text-[#71717A] dark:text-gray-300 font-light leading-relaxed">
                  {edu.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
