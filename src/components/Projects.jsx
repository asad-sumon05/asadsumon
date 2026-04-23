import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TbExternalLink, TbX } from "react-icons/tb"
import { BsGithub } from "react-icons/bs"

const projects = [
  { 
    id: 1, 
    title: "Dhaka City Bus Route", 
    category: "Web App", 
    description: "A tool to simplify route searches built with HTML, Tailwind CSS, JavaScript, MySQL, and Express.js.", 
    features: ["Route Searches", "Responsive Design", "Fast Performance"], 
    tech: ["HTML", "Tailwind CSS", "JavaScript", "MySQL", "Express.js"], 
    codeUrl: "https://github.com/asad-sumon05/Dhaka_City_Bus_Route" 
  },
  { 
    id: 2, 
    title: "Simon-Says-Game", 
    category: "Interactive Game", 
    description: "A responsive interactive game featuring color-based sequences.", 
    features: ["Color Sequences", "Interactive", "Responsive UI"], 
    tech: ["HTML", "CSS", "JavaScript"], 
    codeUrl: "https://github.com/asad-sumon05/Simon-Says-Game" 
  },
  { 
    id: 3, 
    title: "Portfolio Website", 
    category: "Personal Website", 
    description: "Personal portfolio website.", 
    features: ["Modern Design", "Responsive", "Project Showcase"], 
    tech: ["React", "Tailwind CSS", "Vite"], 
    liveUrl: "https://asad-sumon.com",
    codeUrl: "https://github.com/asad-sumon05/portfolio-website-project-1" 
  }
]

const Card = ({ project, onSelect }) => (
  <motion.div
    className="flex-shrink-0 w-[300px] sm:w-[350px] lg:w-[380px] cursor-pointer group"
    onClick={() => onSelect(project)}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="h-full rounded-2xl border border-black/10 dark:border-white/10 p-5 sm:p-6 relative transition-all duration-400 hover:shadow-xl hover:border-black/15 dark:hover:border-white/15 bg-white dark:bg-[#1a1a1a]">
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-[100px] font-light text-black/[0.03] dark:text-white/[0.03] select-none">{String(project.id).padStart(2, "0")}</div>
      <div className="relative">
        <div className="flex justify-between"><span className="text-[10px] font-normal tracking-widest uppercase text-black/40 dark:text-white/40">{project.category}</span><span className="text-xs font-mono text-black/20 dark:text-white/20">{String(project.id).padStart(2, "0")}</span></div>
        <h3 className="text-lg sm:text-xl font-medium mt-3 text-black dark:text-white transition-colors duration-300">{project.title}</h3>
        <p className="text-black/50 dark:text-gray-400 text-sm mt-3 line-clamp-3 font-light leading-relaxed transition-colors duration-300">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-4">{project.tech.map(t => <span key={t} className="px-2.5 py-1 text-[11px] font-light bg-black/[0.04] dark:bg-white/[0.1] rounded-md text-black/60 dark:text-white/80 transition-colors duration-300">{t}</span>)}</div>
        <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 flex justify-between items-center transition-colors duration-300">
          <span className="text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white text-sm font-light transition-colors duration-300">View Details →</span>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black transition-transform duration-200 hover:scale-110" aria-label={`Live demo of ${project.title}`}><TbExternalLink size={14} /></a>}
            <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-2 rounded-full border border-black/20 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 text-black dark:text-white" aria-label={`Source code of ${project.title}`}><BsGithub size={14} /></a>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
)

const Modal = ({ project, onClose }) => project && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 dark:bg-white/10 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.92, opacity: 0, y: 24 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.92, opacity: 0, y: 24 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg glassmorphism rounded-2xl shadow-2xl p-6 relative border border-white/50 dark:border-white/20 bg-white dark:bg-[#1a1a1a]"
      onClick={e => e.stopPropagation()}
    >
      <motion.button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Close modal"
      >
        <TbX size={16} />
      </motion.button>
      <span className="text-[10px] font-normal tracking-widest uppercase text-black/40 dark:text-white/40">{project.category}</span>
      <h2 className="text-xl font-medium mt-2 mb-3 text-black dark:text-white transition-colors duration-300">{project.title}</h2>
      <p className="text-black/60 dark:text-gray-400 text-sm mb-6 font-light leading-relaxed transition-colors duration-300">{project.description}</p>
      <h4 className="text-[10px] font-normal tracking-widest uppercase text-black/40 dark:text-white/40 mb-3">Features</h4>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {project.features.map((f, i) => (
          <motion.div
            key={f}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] transition-colors duration-300"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
          >
            <div className="w-1 h-1 rounded-full bg-black/30 dark:bg-white/30 transition-colors duration-300" />
            <span className="text-xs text-black/60 dark:text-gray-400 font-light transition-colors duration-300">{f}</span>
          </motion.div>
        ))}
      </div>
      <h4 className="text-[10px] font-normal tracking-widest uppercase text-black/40 dark:text-white/40 mb-3">Stack</h4>
      <div className="flex flex-wrap gap-2 mb-6">{project.tech.map(t => <span key={t} className="px-3 py-1.5 text-xs bg-black/90 dark:bg-white/90 text-white dark:text-black rounded-md font-light shadow-sm transition-colors duration-300">{t}</span>)}</div>
      <div className="flex gap-3">
        {project.liveUrl && (
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-black/90 dark:bg-white/90 hover:bg-black dark:hover:bg-white text-white dark:text-black text-sm font-normal shadow-md transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TbExternalLink size={16} />Live
          </motion.a>
        )}
        <motion.a
          href={project.codeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-black/80 dark:border-white/80 text-black/80 dark:text-white/80 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <BsGithub size={16} />Code
        </motion.a>
      </div>
    </motion.div>
  </motion.div>
)

export default function Projects() {
  const [selected, setSelected] = useState(null)

  useEffect(() => { document.body.style.overflow = selected ? "hidden" : "" }, [selected])

  return (
    <>
      <section className="py-16 lg:py-24" id="projects" aria-label="Projects showcase">
        <div className="px-5 lg:px-28 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <span className="text-[10px] font-normal tracking-widest uppercase text-black/40 dark:text-white/40 block mb-2 transition-colors duration-300">Selected Work</span>
              <h2 className="text-2xl lg:text-4xl font-medium text-black dark:text-white transition-colors duration-300">Projects</h2>
            </div>
            <p className="text-black/40 dark:text-white/40 text-sm max-w-xs font-light transition-colors duration-300">Swipe to explore my work.</p>
          </div>
        </div>
        
        <div className="px-5 lg:px-28">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-5 lg:gap-6 pb-4 pr-5">
              {projects.map(p => <Card key={p.id} project={p} onSelect={setSelected} />)}
              <motion.a
                href="https://github.com/asad-sumon05"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[150px] flex flex-col items-center justify-center gap-3 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white group transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                aria-label="View more projects on GitHub"
              >
                <div className="w-14 h-14 rounded-full border-2 border-black/20 dark:border-white/20 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300"><BsGithub size={24} /></div>
                <span className="text-xs text-center transition-colors duration-300">More on<br />GitHub</span>
              </motion.a>
            </div>
          </div>
        </div>
      </section>
      <AnimatePresence>{selected && <Modal project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </>
  )
}
