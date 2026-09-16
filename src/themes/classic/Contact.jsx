import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { SocialIcon } from "../../components/SocialIcon";
import { personalInfo, socialLinks } from "../../data/portfolioData";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-16 lg:py-24 px-5 lg:px-28 max-w-7xl mx-auto" id="contact" aria-label="Contact form">
      <motion.h2
        className="text-2xl lg:text-4xl text-center font-light text-black dark:text-white transition-colors duration-300 mb-12 lg:mb-16"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Contact <span className="font-semibold">Me</span>
      </motion.h2>

      <div className="flex justify-between items-start gap-12 flex-col lg:flex-row">
        {/* Left: Form */}
        <div className="w-full lg:w-[48%]">
          {submitted ? (
            <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-xl font-medium text-black dark:text-white">Message Sent!</h3>
              <p className="text-sm text-[#71717A] dark:text-gray-400">
                Thank you for reaching out. Asaduzzaman will get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="w-full space-y-4">
              <input
                name="name"
                className="border px-5 py-3.5 border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white rounded-xl placeholder:text-[#71717A] dark:placeholder:text-gray-400 text-sm w-full font-light transition-all duration-300 focus:border-black dark:focus:border-white focus:outline-none"
                type="text"
                placeholder="Your name"
                required
              />
              <input
                name="email"
                className="border px-5 py-3.5 border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white rounded-xl placeholder:text-[#71717A] dark:placeholder:text-gray-400 text-sm w-full font-light transition-all duration-300 focus:border-black dark:focus:border-white focus:outline-none"
                type="email"
                placeholder="Your email"
                required
              />
              <textarea
                name="message"
                className="resize-none border px-5 py-3.5 h-36 border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white placeholder:text-[#71717A] dark:placeholder:text-gray-400 rounded-xl text-sm w-full font-light transition-all duration-300 focus:border-black dark:focus:border-white focus:outline-none"
                placeholder="How can I help? *"
                required
              />

              <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="bg-black dark:bg-white text-white dark:text-black hover:shadow-lg px-6 py-3 rounded-xl flex items-center justify-center font-medium text-sm transition-all duration-300 cursor-pointer"
                >
                  Send Message
                </motion.button>

                <div className="flex items-center gap-2">
                  {socialLinks.map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.label}
                      aria-label={item.label}
                      className="w-9 h-9 rounded-xl border border-black/20 dark:border-white/20 flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                      <SocialIcon name={item.label} size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Right: Info */}
        <div className="w-full lg:w-[48%] space-y-6">
          <div className="font-medium text-2xl lg:text-4xl text-black dark:text-white space-y-1">
            <h2>Let's talk for</h2>
            <h2 className="text-[#71717A] dark:text-gray-400">Something special</h2>
          </div>
          <p className="text-[#71717A] dark:text-gray-400 text-sm lg:text-base font-light leading-relaxed">
            I seek to push the limits of creativity to create high-engaging, user-friendly, and memorable interactive web experiences.
          </p>
          <div className="space-y-4 pt-2 text-black dark:text-white">
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-3 text-sm lg:text-base hover:opacity-70 transition-opacity"
            >
              <div className="p-2 rounded-full border border-black/20 dark:border-white/20">
                <Mail size={16} />
              </div>
              <span>{personalInfo.email}</span>
            </a>
            <a
              href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-3 text-sm lg:text-base hover:opacity-70 transition-opacity"
            >
              <div className="p-2 rounded-full border border-black/20 dark:border-white/20">
                <Phone size={16} />
              </div>
              <span>{personalInfo.phone}</span>
            </a>
            <div className="flex items-center gap-3 text-sm lg:text-base text-black/60 dark:text-white/60">
              <div className="p-2 rounded-full border border-black/20 dark:border-white/20">
                <MapPin size={16} />
              </div>
              <span>{personalInfo.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
