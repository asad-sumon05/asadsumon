import { useState, useEffect } from "react";
import GlassBackground from "./GlassBackground";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Experience from "./Experience";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";

export default function ClassicApp() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return document.documentElement.classList.contains("dark") || localStorage.theme === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  return (
    <div className="relative min-h-screen text-black dark:text-white transition-colors duration-500 overflow-x-hidden font-sans">
      <GlassBackground />
      <Navbar isDark={isDark} onToggleDark={toggleDark} />
      <main className="w-full">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
