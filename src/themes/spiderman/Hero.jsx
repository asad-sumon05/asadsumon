import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { personalInfo, images, marqueeKeywords } from "../../data/portfolioData";

export default function Hero() {
  const sectionRef = useRef(null);
  const maskImgRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const ctaRef = useRef(null);
  const websContainerRef = useRef(null);
  const marquee1Ref = useRef(null);
  const marquee2Ref = useRef(null);

  const coords = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 500,
    alpha: 1,
    size: 50,
  }).current;

  const quickX = useRef(null);
  const quickY = useRef(null);
  const marquee1Tween = useRef(null);
  const marquee2Tween = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance timeline
      gsap
        .timeline({ defaults: { ease: "back.out(1.7)" } })
        .fromTo(
          websContainerRef.current ? websContainerRef.current.children : [],
          { opacity: 0, scale: 0.5 },
          {
            opacity: 0.5,
            scale: 1,
            duration: 2,
            stagger: 0.4,
            ease: "power3.out",
          }
        )
        .fromTo(
          subtitleRef.current,
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2 },
          "-=1.5"
        )
        .fromTo(
          titleRef.current,
          { x: -150, opacity: 0, skewX: -15 },
          { x: 0, opacity: 1, skewX: 0, duration: 1.2 },
          "-=1.0"
        )
        .fromTo(
          ctaRef.current ? ctaRef.current.children : [],
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(2)",
          },
          "-=0.8"
        );

      // Continuous rotation of spider webs
      if (websContainerRef.current) {
        gsap.to(websContainerRef.current.children, {
          rotation: 360,
          duration: 120,
          repeat: -1,
          ease: "linear",
        });

        gsap.to(websContainerRef.current.children, {
          scale: 1.1,
          duration: 4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      // Continuous marquee scrolling
      if (marquee1Ref.current) {
        marquee1Tween.current = gsap.to(marquee1Ref.current, {
          x: "-50%",
          repeat: -1,
          duration: 15,
          ease: "none",
        });
      }

      if (marquee2Ref.current) {
        gsap.set(marquee2Ref.current, { x: "-50%" });
        marquee2Tween.current = gsap.to(marquee2Ref.current, {
          x: "0%",
          repeat: -1,
          duration: 20,
          ease: "none",
        });
      }

      gsap.to(".spiderman-marquee-text", {
        y: -4,
        yoyo: true,
        repeat: -1,
        duration: 0.8,
        ease: "sine.inOut",
        stagger: 0.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    quickX.current = gsap.quickTo(coords, "x", { duration: 0.3, ease: "power4.out" });
    quickY.current = gsap.quickTo(coords, "y", { duration: 0.3, ease: "power4.out" });

    const updateMask = () => {
      if (maskImgRef.current) {
        const { x, y, alpha, size } = coords;
        const maskStyle = `radial-gradient(circle ${size}px at ${x}px ${y}px, rgba(0,0,0,${alpha}) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,1) 100%)`;
        maskImgRef.current.style.webkitMaskImage = maskStyle;
        maskImgRef.current.style.maskImage = maskStyle;
      }
    };

    gsap.ticker.add(updateMask);
    return () => gsap.ticker.remove(updateMask);
  }, [coords]);

  const handleMouseMove = (e) => {
    if (quickX.current && quickY.current) {
      quickX.current(e.clientX);
      quickY.current(e.clientY);
    }
  };

  const handleMouseEnter = () => {
    gsap.to(coords, {
      alpha: 0,
      size: 700,
      duration: 0.8,
      ease: "elastic.out(1, 0.7)",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(coords, {
      alpha: 1,
      size: 50,
      duration: 1.2,
      ease: "power4.inOut",
      overwrite: "auto",
    });
  };

  const handleMarqueeMouseEnter = () => {
    if (marquee1Tween.current && marquee2Tween.current) {
      gsap.to([marquee1Tween.current, marquee2Tween.current], {
        timeScale: 0.1,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  };

  const handleMarqueeMouseLeave = () => {
    if (marquee1Tween.current && marquee2Tween.current) {
      gsap.to([marquee1Tween.current, marquee2Tween.current], {
        timeScale: 1,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  };

  const renderMarqueeContent = (items) => (
    <>
      {[...Array(3)].map((_, groupIdx) => (
        <div key={groupIdx} className="flex items-center h-full shrink-0">
          {items.map((item, itemIdx) => (
            <React.Fragment key={`${groupIdx}-${itemIdx}`}>
              <span className="spiderman-marquee-text mx-3 sm:mx-4 md:mx-6 text-sm md:text-base lg:text-xl font-black uppercase italic tracking-widest whitespace-nowrap shrink-0 drop-shadow-sm">
                {item}
              </span>
              <img
                src={itemIdx % 2 === 0 ? images.spiderIcon : images.spiderWeb}
                alt="Separator"
                className="mx-3 sm:mx-4 md:mx-6 h-5 sm:h-6 md:h-8 lg:h-10 w-auto object-contain shrink-0 drop-shadow-md"
              />
            </React.Fragment>
          ))}
        </div>
      ))}
    </>
  );

  return (
    <div className="w-full flex flex-col bg-white overflow-hidden" id="hero">
      {/* Interactive Hero Banner */}
      <section
        ref={sectionRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Bottom Identity Layer (Profile photo from Classic version behind Spider-Man) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden bg-neutral-950">
          <img
            src={images.profile}
            alt="Bottom Identity Layer"
            className="h-[75vh] md:h-[82vh] max-h-[720px] w-auto max-w-none object-contain object-top filter contrast-105"
          />
        </div>

        {/* Top Mask Layer (Real portrait with radial reveal) */}
        <img
          ref={maskImgRef}
          src={images.spiderTopMask}
          alt="Top Mask Layer"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-20"
          style={{ WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" }}
        />

        {/* Decorative Spider Webs */}
        <div
          ref={websContainerRef}
          className="absolute inset-0 pointer-events-none z-[25] overflow-hidden"
        >
          <img
            src={images.spiderWeb}
            alt="Spider Web Top"
            className="absolute top-0 left-0 w-44 h-44 sm:w-64 sm:h-64 md:w-[400px] md:h-[400px] object-contain opacity-40 sm:opacity-50 -translate-x-1/4 -translate-y-1/4 mix-blend-multiply"
          />
          <img
            src={images.spiderWeb}
            alt="Spider Web Bottom"
            className="absolute bottom-0 right-0 w-52 h-52 sm:w-72 sm:h-72 md:w-[500px] md:h-[500px] object-contain opacity-40 sm:opacity-50 translate-x-1/4 translate-y-1/4 mix-blend-multiply"
          />
        </div>

        {/* Hero Content Text */}
        <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-12 lg:left-24 z-30 flex flex-col gap-3 pointer-events-none drop-shadow-md max-w-lg w-full">
          <span
            ref={subtitleRef}
            className="text-[#a31515] font-bold uppercase text-xs md:text-sm tracking-[0.2em] opacity-0"
          >
            {personalInfo.subtitle}
          </span>
          <h1
            ref={titleRef}
            className="text-gray-900 text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none opacity-0 italic uppercase"
            style={{
              textShadow: "4px 4px 0px #ef4444, 7px 7px 0px #a31515",
            }}
          >
            ASADUZZAMAN
            <br />
            SUMON.
          </h1>
          <div
            ref={ctaRef}
            className="flex flex-wrap items-center gap-4 mt-6 pointer-events-auto"
          >
            <a
              href="#projects"
              className="relative overflow-hidden bg-[#a31515] hover:bg-[#7a0f0f] text-white px-8 py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(163,21,21,0.4)] cursor-pointer uppercase border border-[#a31515]"
            >
              Explore Projects
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-2 text-white bg-gray-900 hover:bg-black px-6 py-3 rounded-lg font-bold transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] uppercase text-sm group"
            >
              <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              {personalInfo.email}
            </a>
          </div>
        </div>
      </section>

      {/* Criss-Crossing Diagonal Marquee Banners */}
      <section
        className="relative w-full h-[20vh] md:h-[30vh] bg-white overflow-hidden flex items-center justify-center z-40"
        onMouseEnter={handleMarqueeMouseEnter}
        onMouseLeave={handleMarqueeMouseLeave}
      >
        {/* Red Banner (+4deg) */}
        <div className="absolute w-[110vw] h-12 md:h-16 lg:h-20 bg-[#a31515] text-white border-y-[3px] border-black rotate-[4deg] -translate-y-4 md:-translate-y-6 shadow-[0_10px_20px_rgba(0,0,0,0.4)] z-20 flex items-center overflow-hidden scale-105">
          <div ref={marquee1Ref} className="flex items-center h-full w-max">
            {renderMarqueeContent(marqueeKeywords)}
          </div>
        </div>

        {/* Dark Banner (-4deg) */}
        <div className="absolute w-[110vw] h-12 md:h-16 lg:h-20 bg-[#111111] text-[#a31515] border-y-[3px] border-[#a31515] rotate-[-4deg] translate-y-4 md:translate-y-6 shadow-[0_5px_15px_rgba(0,0,0,0.5)] z-10 flex items-center overflow-hidden scale-105">
          <div ref={marquee2Ref} className="flex items-center h-full w-max">
            {renderMarqueeContent(marqueeKeywords)}
          </div>
        </div>
      </section>
    </div>
  );
}
