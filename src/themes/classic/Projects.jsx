import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Github } from "lucide-react";
import { projects } from "../../data/portfolioData";

const Card = ({ project, onSelect }) => (
  <motion.div
    className="flex-shrink-0 w-[300px] sm:w-[350px] lg:w-[380px] cursor-pointer group"
    onClick={() => onSelect(project)}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="h-full rounded-2xl border border-black/10 dark:border-white/10 p-5 sm:p-6 relative transition-all duration-400 hover:shadow-xl hover:border-black/25 dark:hover:border-white/25 bg-white dark:bg-[#1a1a1a]">
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-[100px] font-light text-black/[0.03] dark:text-white/[0.03] select-none pointer-events-none">
        {String(project.id).padStart(2, "0")}
      </div>

      <div className="relative">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-black/40 dark:text-white/40">
            {project.category}
          </span>
          <span className="text-xs font-mono text-black/30 dark:text-white/30 font-bold">
            {String(project.id).padStart(2, "0")}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-medium mt-3 text-black dark:text-white transition-colors duration-300">
          {project.title}
        </h3>

        <p className="text-black/60 dark:text-gray-400 text-sm mt-3 line-clamp-3 font-light leading-relaxed transition-colors duration-300">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 text-[11px] font-light bg-black/[0.04] dark:bg-white/[0.1] rounded-md text-black/70 dark:text-white/80 transition-colors duration-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 flex justify-between items-center transition-colors duration-300">
          <span className="text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white text-sm font-light transition-colors duration-300">
            View Details →
          </span>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full border border-black/20 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 text-black dark:text-white"
              aria-label={`Source code of ${project.title}`}
            >
              <Github size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const Modal = ({ project, onClose }) =>
  project && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg rounded-2xl shadow-2xl p-6 relative border border-white/50 dark:border-white/20 bg-white dark:bg-[#1a1a1a]"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close modal"
        >
          <X size={16} />
        </motion.button>

        <span className="text-[10px] font-bold tracking-widest uppercase text-black/40 dark:text-white/40">
          {project.category}
        </span>
        <h2 className="text-xl font-medium mt-2 mb-3 text-black dark:text-white transition-colors duration-300">
          {project.title}
        </h2>
        <p className="text-black/70 dark:text-gray-300 text-sm mb-6 font-light leading-relaxed transition-colors duration-300">
          {project.description}
        </p>

        {project.features && (
          <>
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-black/40 dark:text-white/40 mb-3">
              Features
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {project.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.05]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40" />
                  <span className="text-xs text-black/70 dark:text-gray-300 font-light">
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <h4 className="text-[10px] font-bold tracking-widest uppercase text-black/40 dark:text-white/40 mb-3">
          Technologies
        </h4>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((t) => (
            <span
              key={t}
              className="px-3 py-1.5 text-xs bg-black/90 dark:bg-white/90 text-white dark:text-black rounded-md font-light shadow-sm"
            >
              {t}
            </span>
          ))}
        </div>

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-black/80 dark:border-white/80 text-black/80 dark:text-white/80 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 text-sm font-medium"
        >
          <Github size={16} /> View on GitHub
        </a>
      </motion.div>
    </motion.div>
  );

export default function Projects() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <>
      <section className="py-16 lg:py-24" id="projects" aria-label="Projects showcase">
        <div className="px-5 lg:px-28 mb-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-black/40 dark:text-white/40 block mb-2 transition-colors duration-300">
                Selected Work
              </span>
              <h2 className="text-2xl lg:text-4xl font-medium text-black dark:text-white transition-colors duration-300">
                Projects
              </h2>
            </div>
            <p className="text-black/50 dark:text-white/50 text-sm max-w-xs font-light transition-colors duration-300">
              Scroll horizontally to explore my work. Click on any card for details.
            </p>
          </div>
        </div>

        <div className="px-5 lg:px-28 max-w-7xl mx-auto">
          <div className="overflow-x-auto pb-6 scrollbar-thin">
            <div className="flex gap-5 lg:gap-6 pr-5">
              {projects.map((p) => (
                <Card key={p.id} project={p} onSelect={setSelected} />
              ))}
              <motion.a
                href="https://github.com/asad-sumon05"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[150px] flex flex-col items-center justify-center gap-3 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white group transition-colors duration-300 border border-dashed border-black/20 dark:border-white/20 rounded-2xl p-4"
                whileHover={{ scale: 1.05 }}
                aria-label="View more projects on GitHub"
              >
                <div className="w-12 h-12 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
                  <Github size={20} />
                </div>
                <span className="text-xs text-center font-medium">
                  More on<br />GitHub
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
