import { motion } from "framer-motion";

const experiences = [
  {
    role: "Intern Web Developer",
    company: "OnDevs",
    duration: "03/2025 – Present",
    location: "Dhaka, Bangladesh",
    points: [
      "Managed frontend development and custom theme creation.",
      "Built and maintained responsive web interfaces using HTML, CSS, JavaScript, and React.",
      "Collaborated with a team to increase productivity by 20%."
    ]
  },
  {
    role: "Junior Graphic Designer",
    company: "Gentle Graphix",
    duration: "03/2022 – 06/2025",
    location: "Faridpur, Bangladesh",
    points: [
      "Designed modern, responsive web templates and print collateral (brochures, flyers).",
      "Ensured high-quality outputs using Adobe Creative Suite and Canva."
    ]
  }
];

export default function Experience() {
  return (
    <section className="px-5 lg:px-28 py-10 lg:py-20" id="experience" aria-label="Experience">
      <motion.div 
        className="text-center mb-16 lg:mb-24"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl lg:text-4xl font-light text-black dark:text-white mb-4 transition-colors duration-300">
          My <span className="font-semibold">Experience</span>
        </h2>
        <p className="text-[#71717A] dark:text-gray-400 text-lg font-light transition-colors duration-300">
          An evolving track record of technical excellence
        </p>
      </motion.div>
      
      <div className="max-w-4xl mx-auto relative">
        {/* Animated Line */}
        <motion.div 
          className="absolute left-[9px] md:left-[13px] top-8 md:top-10 bottom-0 w-[2px] bg-black/20 dark:bg-white/20 rounded-full origin-top"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
        />

        <div className="flex flex-col gap-8 md:gap-12">
          {experiences.map((exp, index) => {
            return (
              <div key={index} className="relative pl-8 md:pl-16">
                {/* Animated Dot */}
                <motion.div 
                  className="absolute left-0 md:left-[2px] top-8 md:top-10 w-5 h-5 md:w-6 md:h-6 rounded-full border-[3px] border-[#fafafa] dark:border-[#111] z-10 transition-colors duration-300 bg-black dark:bg-white shadow-sm dark:shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.4, duration: 0.4, type: "spring" }}
                  viewport={{ once: true }}
                />
                
                {/* Experience Card */}
                <motion.div 
                  className="border border-black/10 dark:border-white/10 bg-white dark:bg-[#13131a] rounded-2xl p-6 lg:p-8 hover:shadow-xl hover:border-black/30 dark:hover:border-white/30 transition-all duration-300 relative overflow-hidden group"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.2 }}
                  viewport={{ once: true, margin: "-30px" }}
                >
                  {/* Subtle Background Glow on Hover */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 blur-[60px] opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-10 transition-opacity duration-500 rounded-full bg-black dark:bg-white" />

                  <div className="flex flex-col mb-4 relative z-10">
                    <span className="text-[11px] md:text-xs font-bold tracking-[0.15em] text-[#71717A] dark:text-gray-400 uppercase mb-3">
                      {exp.duration}
                    </span>
                    <h3 className="text-xl md:text-2xl font-semibold text-black dark:text-white transition-colors duration-300 mb-1">
                      {exp.role}
                    </h3>
                    <div className="text-base md:text-lg text-black/70 dark:text-white/70 transition-colors duration-300 font-medium">
                      {exp.company}
                    </div>
                  </div>
                  
                  <ul className="list-disc list-inside space-y-2 mt-6 relative z-10">
                    {exp.points.map((point, i) => (
                      <li key={i} className="text-[#71717A] dark:text-gray-300 text-sm md:text-base font-light transition-colors duration-300 leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
