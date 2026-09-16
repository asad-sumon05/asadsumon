import { motion } from "framer-motion";
import { bio, images } from "../../data/portfolioData";

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
      className="px-5 lg:px-28 py-16 lg:py-24 flex justify-between gap-12 flex-col lg:flex-row items-center max-w-7xl mx-auto"
      id="about"
      aria-label="About me"
    >
      <motion.div className="lg:w-1/2 flex justify-center items-center" {...fadeIn("left")}>
        <img
          src={images.about}
          alt="About Asaduzzaman Sumon"
          loading="lazy"
          className="w-full max-w-lg rounded-2xl object-cover shadow-lg border border-black/10 dark:border-white/10"
        />
      </motion.div>

      <motion.div className="lg:w-1/2" {...fadeIn("right", 0.15)}>
        <h2 className="lg:text-3xl text-2xl mt-4 lg:mt-0 font-light text-black dark:text-white transition-colors duration-300">
          About <span className="font-medium">Me</span>
        </h2>

        <motion.p
          {...fadeIn("up", 0.2)}
          className="text-[#71717A] dark:text-gray-400 text-sm/6 lg:text-base mt-5 lg:mt-6 font-light leading-relaxed transition-colors duration-300"
        >
          {bio.para1}
        </motion.p>

        <motion.p
          {...fadeIn("up", 0.3)}
          className="text-[#71717A] dark:text-gray-400 text-sm/6 lg:text-base mt-3 lg:mt-4 font-light leading-relaxed transition-colors duration-300"
        >
          {bio.para2}
        </motion.p>

        <motion.p
          {...fadeIn("up", 0.4)}
          className="text-[#71717A] dark:text-gray-400 text-sm/6 lg:text-base mt-3 lg:mt-4 font-light leading-relaxed transition-colors duration-300"
        >
          {bio.para3}
        </motion.p>

        <motion.div
          {...fadeIn("up", 0.5)}
          className="mt-6 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]"
        >
          <p className="text-xs lg:text-sm italic text-black/70 dark:text-gray-300 font-medium">
            "{bio.quote}"
          </p>
          <span className="text-[11px] font-bold text-black dark:text-white uppercase tracking-wider block mt-1">
            — {bio.quoteAuthor}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
