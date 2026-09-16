import { ScrollTimeline } from "../lightswind/scroll-timeline";
import { Briefcase, Code, Palette } from "lucide-react";
import { experiences } from "../../data/portfolioData";

export const CareerTimeline = () => {
  const icons = [
    <Code className="h-4 w-4 mr-2 text-primary" />,
    <Briefcase className="h-4 w-4 mr-2 text-primary" />,
    <Palette className="h-4 w-4 mr-2 text-primary" />,
  ];

  const careerEvents = experiences.map((exp, i) => ({
    year: exp.period,
    title: exp.role,
    subtitle: `${exp.company} • ${exp.location}`,
    description: exp.description,
    icon: icons[i % icons.length],
  }));

  return (
    <div id="career">
      <ScrollTimeline
        events={careerEvents}
        title="Experience & Journey"
        subtitle="A proven track record of web development, frontend design, and team collaboration"
        animationOrder="staggered"
        cardAlignment="alternating"
        cardVariant="elevated"
        parallaxIntensity={0.15}
        revealAnimation="fade"
        progressIndicator={true}
        lineColor="bg-primary/20"
        activeColor="bg-primary"
        progressLineWidth={3}
        progressLineCap="round"
      />
    </div>
  );
};
