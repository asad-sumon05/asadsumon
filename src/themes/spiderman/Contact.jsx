import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SocialIcon } from "../../components/SocialIcon";
import { personalInfo, socialLinks, images } from "../../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const bgWebRef = useRef(null);
  const formCardRef = useRef(null);
  const hangingSpydyRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(
          titleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
        )
        .fromTo(
          formCardRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.4)" },
          "-=0.3"
        );

      if (bgWebRef.current) {
        gsap.to(bgWebRef.current, {
          scale: 1.15,
          opacity: 0.06,
          repeat: -1,
          yoyo: true,
          duration: 4.5,
          ease: "sine.inOut",
        });
      }

      if (hangingSpydyRef.current) {
        gsap.to(hangingSpydyRef.current, {
          rotation: 8,
          transformOrigin: "top center",
          repeat: -1,
          yoyo: true,
          duration: 2,
          ease: "sine.inOut",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-white text-gray-900 py-16 px-6 md:px-16 lg:px-24 flex flex-col items-center justify-center overflow-hidden border-t border-gray-100"
    >
      {/* Background Web Bottom-Left */}
      <div className="absolute bottom-0 left-0 pointer-events-none overflow-hidden z-0">
        <img
          ref={bgWebRef}
          src={images.spiderWeb}
          alt="Background Web"
          className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] object-contain opacity-[0.04] mix-blend-multiply -translate-x-1/4 translate-y-1/4"
        />
      </div>

      {/* Hanging Spider-Man Sprite Top-Right */}
      <div
        ref={hangingSpydyRef}
        className="absolute top-0 right-8 md:right-20 z-30 pointer-events-none flex flex-col items-center origin-top"
      >
        <div className="w-[2px] h-24 md:h-36 bg-gradient-to-b from-transparent to-gray-400 opacity-60" />
        <img
          src={images.spiderHang}
          alt="Hanging Spider-Man"
          className="w-40 md:w-60 h-auto object-contain drop-shadow-2xl -mt-2"
        />
      </div>

      {/* Section Title */}
      <div
        ref={titleRef}
        className="flex flex-col items-center text-center mb-10 z-10"
      >
        <span className="text-[#a31515] font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mb-2 flex items-center gap-1.5">
          <img src={images.spiderIcon} alt="Spider" className="w-4 h-4 object-contain" />
          Get In Touch
        </span>
        <h2
          className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-gray-900"
          style={{ textShadow: "2px 2px 0px #fca5a5" }}
        >
          CONTACT.
        </h2>
        <div className="w-12 h-1 bg-[#a31515] mt-2 rounded-full" />
      </div>

      {/* Main Container */}
      <div
        ref={formCardRef}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 gap-8 bg-gray-50/90 backdrop-blur-sm border border-gray-200 p-6 md:p-8 rounded-2xl shadow-sm relative z-10"
      >
        {/* Left Column: Direct Info */}
        <div className="md:col-span-2 flex flex-col justify-between gap-6 border-b md:border-b-0 md:border-r border-gray-200/80 pb-6 md:pb-0 md:pr-6">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">
              Let's Connect
            </h3>
            <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed mb-6">
              Have a project in mind, need full-stack expertise, or want to collaborate? Reach out anytime!
            </p>

            <div className="flex flex-col gap-3.5 text-xs font-semibold text-gray-700">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-3 hover:text-[#a31515] transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg bg-red-100/80 text-[#a31515] flex items-center justify-center font-bold">
                  ✉
                </span>
                <span>{personalInfo.email}</span>
              </a>
              <a
                href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-3 hover:text-[#a31515] transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg bg-red-100/80 text-[#a31515] flex items-center justify-center font-bold">
                  📞
                </span>
                <span>{personalInfo.phone}</span>
              </a>
              <div className="flex items-center gap-3 text-gray-600">
                <span className="w-8 h-8 rounded-lg bg-gray-200/70 text-gray-700 flex items-center justify-center font-bold">
                  📍
                </span>
                <span>{personalInfo.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              Find Me Online
            </h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  title={item.label}
                  aria-label={item.label}
                  className="w-9 h-9 flex items-center justify-center bg-white hover:bg-[#a31515] text-gray-700 hover:text-white border border-gray-200 hover:border-[#a31515] rounded-xl shadow-sm transition-all duration-300 hover:scale-105"
                >
                  <SocialIcon name={item.label} size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-3 flex flex-col justify-center">
          {isSubmitted ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#a31515] text-white rounded-full flex items-center justify-center text-xl font-black mb-4 shadow-md animate-bounce">
                ✓
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">
                Message Sent!
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                Thanks for reaching out, Asaduzzaman will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Peter Parker"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#a31515] focus:ring-1 focus:ring-[#a31515] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    Your Email
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="peter@stark.com"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#a31515] focus:ring-1 focus:ring-[#a31515] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Let's build something amazing together..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#a31515] focus:ring-1 focus:ring-[#a31515] transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#a31515] hover:bg-[#7a0f0f] text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all duration-300 shadow-[0_4px_15px_rgba(163,21,21,0.3)] hover:shadow-[0_6px_20px_rgba(163,21,21,0.5)] cursor-pointer mt-1"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
