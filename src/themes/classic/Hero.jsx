import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Instagram, Github } from "lucide-react";
import ThreeBackground from "./ThreeBackground";
import { personalInfo, bio, images } from "../../data/portfolioData";

const socials = [
  { Icon: Mail, link: `mailto:${personalInfo.email}`, label: "Email" },
  { Icon: Linkedin, link: personalInfo.linkedin, label: "LinkedIn" },
  { Icon: Instagram, link: personalInfo.instagram, label: "Instagram" },
  { Icon: Github, link: personalInfo.github, label: "GitHub" },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

function TypewriterText({ text }) {
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    if (!isDeleting && displayed.length < text.length) {
      timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, 90);
    } else if (!isDeleting && displayed.length === text.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length - 1));
      }, 40);
    } else if (isDeleting && displayed.length === 0) {
      timeout = setTimeout(() => setIsDeleting(false), 500);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, text]);

  return (
    <span>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function Hero() {
  return (
    <section className="pt-28 pb-16 relative min-h-[90vh] flex items-center" id="hero" aria-label="Hero section">
      <div className="hidden lg:block">
        <ThreeBackground />
      </div>

      <div className="flex justify-between py-10 items-center px-5 lg:px-28 lg:flex-row flex-col-reverse relative z-10 w-full max-w-7xl mx-auto">
        <motion.div
          className="lg:w-[48%]"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div
            variants={fadeUp}
            className="text-2xl lg:text-4xl flex flex-col mt-8 lg:mt-0 gap-2 lg:gap-5 font-light"
          >
            <h1 className="text-black dark:text-white">
              Hello, <TypewriterText text={`I am ${personalInfo.name}`} />
            </h1>
            <h2>
              <span className="font-medium text-black dark:text-white transition-colors duration-300">
                Full Stack Web
              </span>{" "}
              <span className="text-white dark:text-[#111] font-medium transition-colors duration-300 [-webkit-text-stroke:1px_black] dark:[-webkit-text-stroke:1px_white]">
                Developer
              </span>
            </h2>
            <h2 className="text-black dark:text-white transition-colors duration-300">
              Based In <span className="font-medium">Bangladesh.</span>
            </h2>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-[#71717A] dark:text-gray-400 text-sm lg:text-base mt-5 font-light leading-relaxed transition-colors duration-300 max-w-lg"
          >
            {bio.short}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex items-center gap-x-4 mt-8 lg:mt-12 text-black dark:text-white"
          >
            {socials.map(({ Icon, link, label }, i) => (
              <motion.a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2.5 lg:p-3 rounded border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
              >
                <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
              </motion.a>
            ))}

            <motion.a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-2 px-5 py-2.5 rounded bg-black dark:bg-white text-white dark:text-black font-medium text-sm transition-all"
            >
              Explore Work →
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:w-[48%] w-full flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <img
            className="w-full max-w-md lg:max-w-lg object-contain drop-shadow-md"
            src={images.heroVector}
            alt="Asaduzzaman Sumon illustration"
            loading="eager"
          />
        </motion.div>
      </div>
    </section>
  );
}
