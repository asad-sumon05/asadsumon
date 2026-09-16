import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences, education, languageProfile, images } from "../../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const bgWebRef = useRef(null);

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
          ".spiderman-timeline-card",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.4)",
          },
          "-=0.3"
        );

      if (bgWebRef.current) {
        gsap.to(bgWebRef.current, {
          rotation: -360,
          transformOrigin: "center center",
          repeat: -1,
          duration: 90,
          ease: "linear",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full bg-gray-50 text-gray-900 py-16 px-6 md:px-16 lg:px-24 flex flex-col items-center justify-center overflow-hidden border-t border-gray-200/80"
    >
      {/* Background Web Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-hidden z-0">
        <img
          ref={bgWebRef}
          src={images.spiderWeb}
          alt="Background Web"
          className="w-[700px] h-[700px] object-contain opacity-[0.03] mix-blend-multiply"
        />
      </div>

      {/* Section Title */}
      <div
        ref={titleRef}
        className="flex flex-col items-center text-center mb-12 z-10"
      >
        <span className="text-[#a31515] font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mb-2 flex items-center gap-1.5">
          <img src={images.spiderIcon} alt="Spider" className="w-4 h-4 object-contain" />
          Journey & Background
        </span>
        <h2
          className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-gray-900"
          style={{ textShadow: "2px 2px 0px #fca5a5" }}
        >
          EXPERIENCE & EDUCATION.
        </h2>
        <div className="w-12 h-1 bg-[#a31515] mt-2 rounded-full" />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 z-10">
        {/* Work Experience Column */}
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
            <span className="w-3 h-3 rounded-sm bg-[#a31515]" />
            Work Experience
          </h3>
          <div className="flex flex-col gap-4">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="spiderman-timeline-card group relative bg-white border border-gray-200 hover:border-[#a31515] p-6 rounded-2xl shadow-sm hover:shadow-[0_8px_25px_rgba(163,21,21,0.12)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-base font-black text-gray-900 group-hover:text-[#a31515] transition-colors">
                      {exp.role}
                    </h4>
                    <span className="text-xs font-bold text-[#a31515] uppercase tracking-wider">
                      {exp.company}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block mb-3">
                  📍 {exp.location}
                </span>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium mb-4">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                  {exp.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Column */}
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
            <span className="w-3 h-3 rounded-sm bg-gray-900" />
            Education & Certifications
          </h3>
          <div className="flex flex-col gap-4">
            {education.map((edu, idx) => (
              <div
                key={idx}
                className="spiderman-timeline-card group relative bg-white border border-gray-200 hover:border-[#a31515] p-6 rounded-2xl shadow-sm hover:shadow-[0_8px_25px_rgba(163,21,21,0.12)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-base font-black text-gray-900 group-hover:text-[#a31515] transition-colors">
                      {edu.degree}
                    </h4>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {edu.institution}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {edu.score}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block mb-2">
                  📍 {edu.location} ({edu.period})
                </span>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium">
                  {edu.description}
                </p>
              </div>
            ))}

            {/* Achievement Badge */}
            <div className="spiderman-timeline-card bg-gradient-to-r from-red-950 to-black text-white p-5 rounded-2xl border border-red-900/50 flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-1">
                  Language Proficiency
                </span>
                <h5 className="text-sm font-black uppercase tracking-wide">
                  {languageProfile.name}
                </h5>
                <span className="text-xs text-gray-300">
                  {languageProfile.languages}
                </span>
              </div>
              <div className="text-center bg-red-600/30 border border-red-500 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-bold text-gray-300 block">Score</span>
                <span className="text-lg font-black text-white">{languageProfile.score}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
