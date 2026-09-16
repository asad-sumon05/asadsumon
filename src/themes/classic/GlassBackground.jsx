import { motion, useScroll, useTransform } from "framer-motion";

export default function GlassBackground() {
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], ["-20vh", "60vh"]);
  const x1 = useTransform(scrollYProgress, [0, 1], ["-10vw", "30vw"]);
  const color1 = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgba(34,211,238,0.12)", "rgba(59,130,246,0.12)", "rgba(168,85,247,0.12)"]
  );

  const y2 = useTransform(scrollYProgress, [0, 1], ["80vh", "-10vh"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["80vw", "20vw"]);
  const color2 = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgba(168,85,247,0.12)", "rgba(34,211,238,0.12)", "rgba(16,185,129,0.12)"]
  );

  const y3 = useTransform(scrollYProgress, [0, 1], ["30vh", "80vh"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["60vw", "-20vw"]);
  const color3 = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgba(59,130,246,0.12)", "rgba(168,85,247,0.12)", "rgba(34,211,238,0.12)"]
  );

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-500">
      <motion.div
        style={{ x: x1, y: y1, backgroundColor: color1 }}
        className="absolute w-[50vw] h-[50vw] rounded-full blur-[100px]"
      />
      <motion.div
        style={{ x: x2, y: y2, backgroundColor: color2 }}
        className="absolute w-[60vw] h-[60vw] rounded-full blur-[100px]"
      />
      <motion.div
        style={{ x: x3, y: y3, backgroundColor: color3 }}
        className="absolute w-[45vw] h-[45vw] rounded-full blur-[100px]"
      />
      <div className="absolute inset-0 backdrop-blur-[80px] bg-white/40 dark:bg-[#111111]/50 transition-colors duration-500" />
    </div>
  );
}
