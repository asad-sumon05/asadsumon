import SEOHead from "../components/SEOHead"
import About from "../components/About"

export default function AboutPage() {
  return (
    <div className="mt-24">
      <SEOHead
        title="About Asaduzzaman Sumon | Software Tester & Full Stack Developer | NIT Jalandhar"
        description="Learn about Asaduzzaman Sumon — a dedicated Software Tester and Full-Stack Developer at NIT Jalandhar. Specializing in test automation, manual testing, MERN stack development, React.js, Node.js. Passionate about quality assurance, building robust web applications, and open source."
        keywords="About Asaduzzaman Sumon, Asaduzzaman Sumon biography, Asaduzzaman Sumon NIT Jalandhar, Asaduzzaman Sumon background, Software Tester, Full Stack Developer, QA Engineer, B.Tech CSE, Test Automation, MERN Stack, Open Source Contributor, asadsumon"
        canonicalPath="/about"
      />
      <About />
    </div>
  )
}
