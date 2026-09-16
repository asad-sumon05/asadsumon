import { motion } from "framer-motion";
import { Code2, Palette, Cpu, Layers, User, TrendingUp } from "lucide-react";
import { personalInfo, bio, stats, images } from "../../data/portfolioData";

const STAT_ICONS = [Layers, Code2, User, TrendingUp];

export const AboutSection = () => {
  return (
    <section id="about" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        className="flex flex-col md:flex-row gap-16 items-start"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Left: Bio */}
        <div className="flex-1 space-y-8">
          <div>
            <motion.p
              className="text-xs font-bold uppercase tracking-widest text-primary mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              About Me
            </motion.p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Passionate about{" "}
              <span className="text-gradient-primary">Digital Excellence</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
              <p>{bio.para1}</p>
              <p>{bio.para2}</p>
              <blockquote className="border-l-4 border-primary/50 pl-4 py-1 italic text-sm">
                "{bio.quote}" — <span className="font-semibold text-primary">{bio.quoteAuthor}</span>
              </blockquote>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { href: personalInfo.github, label: "GitHub" },
              { href: personalInfo.linkedin, label: "LinkedIn" },
              { href: `mailto:${personalInfo.email}`, label: personalInfo.email },
              { href: personalInfo.resume, label: "Download Resume", download: true },
            ].map(({ href, label, download }) => (
              <a
                key={label}
                href={href}
                target={download ? undefined : "_blank"}
                rel="noreferrer"
                download={download}
                className="text-xs font-bold text-foreground border border-foreground/15 hover:border-primary/60 hover:text-primary rounded-lg px-3 py-1.5 transition-all duration-200 hover:-translate-y-0.5"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: Stats Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          {stats.map((stat, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <motion.div
                key={i}
                className="glass-panel p-6 rounded-2xl border border-foreground/10 hover:border-primary/50 transition-colors group relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                <div className="text-primary mb-4 p-3 bg-primary/10 w-max rounded-xl">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
