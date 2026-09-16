import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone, CheckCircle2 } from "lucide-react";
import { Input } from "../lightswind/input";
import { Textarea } from "../lightswind/textarea";
import { Button } from "../lightswind/button";
import { personalInfo } from "../../data/portfolioData";

export const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="glass-panel p-8 md:p-12 rounded-[3rem] border border-foreground/10 relative overflow-hidden"
      >
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-12 md:gap-24">
          {/* Contact Info */}
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Let's <span className="text-gradient-primary">Connect</span>
              </h2>
              <p className="text-muted-foreground">
                Currently open for new opportunities and exciting collaborations. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
            </div>

            <div className="space-y-6">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-medium">{personalInfo.email}</span>
              </a>
              <a
                href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="font-medium">{personalInfo.phone}</span>
              </a>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-medium">{personalInfo.location}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 glass-panel p-8 rounded-[2rem] border border-foreground/10 relative">
            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-primary animate-bounce" />
                <h3 className="text-xl font-bold text-foreground">Message Sent!</h3>
                <p className="text-sm text-muted-foreground">
                  Thanks for reaching out! Asaduzzaman will get back to you shortly.
                </p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Your Name</label>
                  <Input
                    type="text"
                    required
                    className="rounded-xl py-3 px-4 bg-foreground/5 border-foreground/10 text-foreground focus-visible:ring-primary placeholder:text-muted-foreground/50"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Your Email</label>
                  <Input
                    type="email"
                    required
                    className="rounded-xl py-3 px-4 bg-foreground/5 border-foreground/10 text-foreground focus-visible:ring-primary placeholder:text-muted-foreground/50"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Message</label>
                  <Textarea
                    rows={4}
                    required
                    className="rounded-xl py-3 px-4 bg-foreground/5 border-foreground/10 text-foreground focus-visible:ring-primary resize-none placeholder:text-muted-foreground/50 min-h-[120px]"
                    placeholder="How can I help you?"
                  />
                </div>

                <Button
                  size="lg"
                  type="submit"
                  className="w-full rounded-xl bg-primary text-primary-foreground font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] mt-4 h-12 cursor-pointer"
                >
                  Send Message <Send className="w-4 h-4 ml-1" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
