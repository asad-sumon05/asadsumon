import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Experience from "./Experience";
import Projects from "./Projects";
import Contact from "./Contact";

export default function SpidermanApp() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-expo" });
  }, []);

  return (
    <div className="w-full bg-white text-gray-900 font-sans overflow-x-hidden">
      <Navbar />
      <main className="w-full">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}
