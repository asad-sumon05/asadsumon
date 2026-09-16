import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo, bio, techStack, images } from "../../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const hangingPhotoRef = useRef(null);
  const leftWebRef = useRef(null);
  const rightWebRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const bioRef = useRef(null);
  const techPillsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-triggered entrance timeline
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(
          [leftWebRef.current, rightWebRef.current],
          { y: -600, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.8,
            ease: "elastic.out(0.8, 0.4)",
            stagger: 0.3,
          }
        )
        .fromTo(
          badgeRef.current,
          {
            x: -50,
            opacity: 0,
            clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
          },
          {
            x: 0,
            opacity: 1,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
            duration: 0.8,
            ease: "power3.out",
          },
          "-=1.4"
        )
        .fromTo(
          headingRef.current,
          {
            y: 50,
            opacity: 0,
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
          },
          {
            y: 0,
            opacity: 1,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
            duration: 0.8,
            ease: "power3.out",
          },
          "-=1.0"
        )
        .fromTo(
          hangingPhotoRef.current,
          { y: -800, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.8, ease: "elastic.out(0.7, 0.4)" },
          "-=0.8"
        )
        .fromTo(
          bioRef.current ? bioRef.current.children : [],
          { y: 40, opacity: 0, rotationX: -45 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1,
            stagger: 0.15,
            ease: "back.out(1.2)",
          },
          "-=1.2"
        )
        .fromTo(
          techPillsRef.current ? techPillsRef.current.children : [],
          { scale: 0.5, opacity: 0, y: 20 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.5)",
          },
          "-=0.8"
        );

      // Hanging profile photo pendular swinging
      if (hangingPhotoRef.current) {
        gsap.to(hangingPhotoRef.current, {
          rotation: 2.5,
          transformOrigin: "top center",
          yoyo: true,
          repeat: -1,
          duration: 3.2,
          ease: "sine.inOut",
          delay: 2,
        });
      }

      // Rotating background webs
      gsap.to(".spiderman-bg-web-left", {
        rotation: 360,
        transformOrigin: "center center",
        repeat: -1,
        duration: 70,
        ease: "linear",
      });

      gsap.to(".spiderman-bg-web-right", {
        rotation: -360,
        transformOrigin: "center center",
        repeat: -1,
        duration: 90,
        ease: "linear",
      });

      // Frame glow pulsing
      gsap.to(".spiderman-glow-frame", {
        boxShadow: "0px 15px 35px rgba(163,21,21,0.25)",
        yoyo: true,
        repeat: -1,
        duration: 2,
        ease: "sine.inOut",
      });

      // Tech pills gentle floating
      gsap.to(".spiderman-tech-pill", {
        y: -4,
        yoyo: true,
        repeat: -1,
        duration: 1.5,
        ease: "sine.inOut",
        stagger: { each: 0.2, from: "random" },
        delay: 1.5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-gray-50 text-gray-900 py-24 flex items-center justify-center overflow-hidden"
    >
      {/* Top Left Hanging Web Decoration */}
      <div
        ref={leftWebRef}
        className="absolute top-[-50px] left-[-5%] md:left-[2%] flex flex-col items-center pointer-events-none z-0"
      >
        <div className="w-[1px] h-[250px] md:h-[350px] bg-gradient-to-b from-transparent to-gray-300" />
        <img
          src={images.spiderWeb}
          alt="Hanging Web"
          className="spiderman-bg-web-left w-64 h-64 md:w-96 md:h-96 object-contain -mt-12 opacity-[0.12] mix-blend-multiply"
        />
      </div>

      {/* Top Right Hanging Web Decoration */}
      <div
        ref={rightWebRef}
        className="absolute top-[-50px] right-[-5%] md:right-[2%] flex flex-col items-center pointer-events-none z-0"
      >
        <div className="w-[1px] h-[200px] md:h-[300px] bg-gradient-to-b from-transparent to-gray-300" />
        <img
          src={images.spiderWeb}
          alt="Hanging Web"
          className="spiderman-bg-web-right w-56 h-56 md:w-80 md:h-80 object-contain -mt-10 opacity-[0.12] mix-blend-multiply"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col-reverse lg:flex-row items-center lg:items-start gap-12 lg:gap-20 z-10 relative">
        {/* Left Side: Bio Content */}
        <div className="flex-1 flex flex-col gap-6 mt-10 lg:mt-0 relative z-20">
          <div className="overflow-hidden">
            <span
              ref={badgeRef}
              className="inline-flex items-center gap-2 text-[#a31515] font-bold uppercase text-xs md:text-sm tracking-[0.2em]"
            >
              <img
                src={images.spiderIcon}
                alt="Spider"
                className="w-5 h-5 object-contain drop-shadow-sm"
              />
              Behind the Mask
            </span>
          </div>

          <div className="overflow-hidden py-2">
            <h2
              ref={headingRef}
              className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase italic text-gray-900"
              style={{ textShadow: "2px 2px 0px #fca5a5" }}
            >
              {personalInfo.name}.
            </h2>
          </div>

          <div
            ref={bioRef}
            className="flex flex-col gap-5 text-gray-700 text-base md:text-lg leading-relaxed max-w-xl font-medium mt-2"
            style={{ perspective: "1000px" }}
          >
            <p className="origin-bottom">{bio.para1}</p>
            <p className="origin-bottom">{bio.para2}</p>
            <div className="p-4 bg-red-50/80 border-l-4 border-[#a31515] rounded-r-xl my-1">
              <p className="text-xs md:text-sm italic text-gray-800 font-semibold">
                "{bio.quote}"
              </p>
              <span className="text-[11px] font-bold text-[#a31515] uppercase tracking-wider block mt-1">
                — {bio.quoteAuthor}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-5 font-bold border-b border-gray-300 pb-2 inline-block">
              Primary Tech Stack
            </h3>
            <div ref={techPillsRef} className="flex flex-wrap gap-2.5">
              {techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="spiderman-tech-pill px-4 py-2 border border-[#a31515]/30 bg-white text-[#a31515] rounded-xl text-xs md:text-sm font-bold tracking-wider hover:bg-[#a31515] hover:text-white hover:border-[#a31515] shadow-sm hover:shadow-[0_8px_20px_rgba(163,21,21,0.3)] transition-colors duration-300 cursor-default"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Suspended Profile Picture (using Classic profile photo) */}
        <div className="flex-1 relative flex justify-center items-start min-h-[550px] w-full pt-0">
          <div
            ref={hangingPhotoRef}
            className="flex flex-col items-center z-30 group"
          >
            {/* Hanging Web Cord */}
            <div className="w-[2px] h-[200px] md:h-[350px] bg-gradient-to-b from-transparent via-[#a31515]/60 to-[#a31515]" />
            {/* Glowing Framed Image with Classic asadsumon.jpeg */}
            <div className="spiderman-glow-frame relative w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full border-[5px] border-[#a31515] p-1.5 bg-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <img
                src={images.profile}
                alt={personalInfo.name}
                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
