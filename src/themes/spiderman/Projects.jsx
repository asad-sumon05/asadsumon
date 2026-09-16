import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, images } from "../../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const bgWebRef = useRef(null);
  const standingSpydyRef = useRef(null);

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
          ".spiderman-project-item",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.4)",
          },
          "-=0.3"
        )
        .fromTo(
          standingSpydyRef.current,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.4"
        );

      if (bgWebRef.current) {
        gsap.set(bgWebRef.current, { transformOrigin: "top right" });
        gsap.to(bgWebRef.current, {
          rotation: 8,
          repeat: -1,
          yoyo: true,
          duration: 6,
          ease: "sine.inOut",
        });

        gsap.to(bgWebRef.current, {
          scale: 1.1,
          opacity: 0.07,
          repeat: -1,
          yoyo: true,
          duration: 4,
          ease: "sine.inOut",
        });
      }

      if (standingSpydyRef.current) {
        gsap.to(standingSpydyRef.current, {
          y: -10,
          repeat: -1,
          yoyo: true,
          duration: 2.5,
          ease: "sine.inOut",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full bg-white text-gray-900 py-16 px-6 md:px-16 lg:px-24 flex flex-col items-center justify-center overflow-hidden border-t border-gray-100"
    >
      {/* Background Web Watermark Top-Right */}
      <div className="absolute top-0 right-0 pointer-events-none overflow-hidden z-0">
        <img
          ref={bgWebRef}
          src={images.spiderWeb}
          alt="Background Web"
          className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] object-contain opacity-[0.04] mix-blend-multiply translate-x-1/4 -translate-y-1/4"
        />
      </div>

      {/* Standing Spider-Man Sprite Bottom-Left */}
      <div
        ref={standingSpydyRef}
        className="absolute bottom-0 left-4 md:left-12 z-30 pointer-events-none"
      >
        <img
          src={images.spiderStand}
          alt="Standing Spider-Man"
          className="w-32 md:w-48 h-auto object-contain drop-shadow-2xl"
        />
      </div>

      {/* Section Title */}
      <div
        ref={titleRef}
        className="flex flex-col items-center text-center mb-10 z-10"
      >
        <span className="text-[#a31515] font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mb-2">
          Featured Works & Open Source
        </span>
        <h2
          className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-gray-900"
          style={{ textShadow: "2px 2px 0px #fca5a5" }}
        >
          PROJECTS.
        </h2>
        <div className="w-12 h-1 bg-[#a31515] mt-2 rounded-full" />
      </div>

      {/* Projects Cards Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 z-10">
        {projects.map((project, idx) => (
          <a
            key={idx}
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="spiderman-project-item group relative bg-gray-50/90 backdrop-blur-sm border border-gray-200 hover:border-[#a31515] p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden shadow-sm hover:shadow-[0_10px_25px_rgba(163,21,21,0.15)] transform hover:-translate-y-1 block text-left"
          >
            {/* Top Red Accent Hover Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#a31515] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 group-hover:text-[#a31515] transition-colors duration-300">
                  {project.title}
                </h3>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-[#a31515] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium mb-6">
                {project.description}
              </p>
            </div>

            {/* Tags Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200/60">
              {project.tags.map((tag, tagIdx) => (
                <span
                  key={tagIdx}
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white border border-gray-200 text-gray-600 group-hover:border-[#a31515]/30 group-hover:text-[#a31515] rounded-md transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
