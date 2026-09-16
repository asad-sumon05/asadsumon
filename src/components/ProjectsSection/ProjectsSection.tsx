import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "../../data/portfolioData";

export const ProjectsSection = () => {
  const gridClasses = [
    "md:col-span-7 h-[400px]",
    "md:col-span-5 h-[400px]",
    "md:col-span-5 h-[360px]",
    "md:col-span-7 h-[360px]",
  ];

  return (
    <section id="projects" className="w-full max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="mb-12 md:mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center md:text-left">
          Selected <span className="text-gradient-primary">Projects</span>
        </h2>
        <p className="text-muted-foreground text-center md:text-left max-w-2xl text-lg">
          A showcase of web applications, interactive projects, and full-stack solutions I've engineered.
        </p>
      </motion.div>

      {/* 12-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        {projects.map((project, i) => (
          <motion.a
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className={`group relative overflow-hidden rounded-[2.25rem] block shadow-xl border border-foreground/10 bg-card/60 backdrop-blur-md p-8 flex flex-col justify-between hover:border-primary/50 transition-all duration-300 ${gridClasses[i % gridClasses.length]}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Background Accent Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500 pointer-events-none" />

            <div className="relative z-10 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                  {project.category}
                </span>
                <span className="font-mono text-sm text-muted-foreground font-bold">
                  0{project.id}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="relative z-10 pt-6 border-t border-foreground/10 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-foreground/5 text-muted-foreground border border-foreground/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="w-10 h-10 rounded-full bg-foreground/5 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center shrink-0 transition-all duration-300 ml-3">
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};
