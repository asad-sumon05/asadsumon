import { motion } from "framer-motion";

const fadeIn = (direction = "up", delay = 0) => ({
  initial: {
    opacity: 0,
    x: direction === "left" ? -30 : direction === "right" ? 30 : 0,
    y: direction === "up" ? 25 : direction === "down" ? -25 : 0,
  },
  whileInView: { opacity: 1, x: 0, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
  viewport: { once: true, margin: "-60px" },
});

export default function About() {
  return (
    <section
      className="px-5 lg:px-28 py-10 lg:py-16 flex justify-between gap-8 flex-col lg:flex-row"
      id="about"
      aria-label="About me"
    >
      <motion.div className="lg:w-1/2" {...fadeIn("left")}>
        <img src="/assets/about-me.svg" alt="About Asaduzzaman Sumon - Full Stack Web Developer illustration" loading="lazy" />
      </motion.div>
      <motion.div className="lg:w-1/2" {...fadeIn("right", 0.15)}>
        <h2 className="lg:text-3xl text-2xl mt-4 lg:mt-0 font-light text-black dark:text-white transition-colors duration-300">
          About <span className="font-medium">Me</span>
        </h2>
        <motion.p {...fadeIn("up", 0.2)} className="text-[#71717A] dark:text-gray-400 text-sm/6 lg:text-base mt-5 lg:mt-6 font-light leading-relaxed transition-colors duration-300">
          Motivated CSE Engineer with experience in web development, system analysis, and project management. Proficient in Python, Java, and C++, with expertise in database management. I am passionate about innovation and effective at communicating complex technical concepts.
        </motion.p>
        <motion.p {...fadeIn("up", 0.3)} className="text-[#71717A] dark:text-gray-400 text-sm/6 lg:text-base mt-3 lg:mt-4 font-light leading-relaxed transition-colors duration-300">
          Seeking to contribute to groundbreaking technologies in computer science and engineering. I have hands-on experience as an Intern Web Developer at OnDevs, where I managed frontend development and built responsive web interfaces using HTML, CSS, JavaScript, and React, increasing team productivity by 20%.
        </motion.p>
        <motion.p {...fadeIn("up", 0.4)} className="text-[#71717A] dark:text-gray-400 text-sm/6 lg:text-base mt-3 lg:mt-4 font-light leading-relaxed transition-colors duration-300">
          Previously, as a Junior Graphic Designer at Gentle Graphix, I designed modern, responsive web templates and print collateral ensuring high-quality outputs using Adobe Creative Suite and Canva.
        </motion.p>
        <motion.p {...fadeIn("up", 0.5)} className="text-[#71717A] dark:text-gray-400 text-sm/6 lg:text-base mt-3 lg:mt-4 font-light leading-relaxed transition-colors duration-300">
          My life philosophy: "The Function of good software is to make the complex appear to be simple." – Grady Booch.
        </motion.p>
      </motion.div>
    </section>
  );
}
