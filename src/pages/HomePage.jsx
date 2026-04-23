import SEOHead from "../components/SEOHead"
import Home from "../components/Home"
import Skills from "../components/Skills"
import About from "../components/About"
import Projects from "../components/Projects"
import Contact from "../components/Contact"
import DinoGame from "../components/DinoGame"
import Experience from "../components/Experience"

export default function HomePage() {
  return (
    <>
      <SEOHead
        title="Asaduzzaman Sumon | Full Stack Web Developer"
        description="Official portfolio of Asaduzzaman Sumon — Full Stack Web Developer. Explore my projects in React, Node.js, Python. Available for opportunities. Contact me today."
        keywords="Asaduzzaman Sumon, asad-sumon05, Full Stack Web Developer, MERN Stack, React Developer, Node.js Developer, Web Developer Bangladesh"
        canonicalPath="/"
        ogType="profile"
      />
      <Home />
      <Skills />
      <Experience />
      <About />
      <Projects />
      <Contact />
      <DinoGame />
    </>
  )
}
