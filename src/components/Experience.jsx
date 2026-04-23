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
    <section className="px-5 lg:px-28 py-10 lg:py-16" id="experience" aria-label="Experience">
      <motion.h2 
        className="text-2xl lg:text-3xl text-center font-light mb-10 lg:mb-16 text-black dark:text-white transition-colors duration-300"
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        My <span className="font-medium">Experience</span>
      </motion.h2>
      
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {experiences.map((exp, index) => (
          <motion.div 
            key={index}
            className="border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 lg:p-8 hover:shadow-xl hover:border-black/15 dark:hover:border-white/15 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
            viewport={{ once: true, margin: "-30px" }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="text-xl font-medium text-black dark:text-white transition-colors duration-300">{exp.role}</h3>
                <p className="text-lg text-[#71717A] dark:text-gray-400 transition-colors duration-300">{exp.company} <span className="text-sm font-light">| {exp.location}</span></p>
              </div>
              <div className="text-sm text-black/50 dark:text-white/50 font-medium bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full w-fit transition-colors duration-300">
                {exp.duration}
              </div>
            </div>
            
            <ul className="list-disc list-inside space-y-2 mt-4">
              {exp.points.map((point, i) => (
                <li key={i} className="text-[#71717A] dark:text-gray-400 text-sm/6 lg:text-base font-light transition-colors duration-300">
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
