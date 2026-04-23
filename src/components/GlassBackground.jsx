import { motion, useScroll, useTransform } from 'framer-motion'

export default function GlassBackground() {
  const { scrollYProgress } = useScroll()

  // Map scroll progress (0 to 1) to vertical and horizontal movements (parallax)
  const y1 = useTransform(scrollYProgress, [0, 1], ['-20vh', '60vh'])
  const x1 = useTransform(scrollYProgress, [0, 1], ['-10vw', '30vw'])
  // Color changing on scroll (Cyan -> Blue -> Purple)
  const color1 = useTransform(scrollYProgress, [0, 0.5, 1], ['rgba(34,211,238,0.12)', 'rgba(59,130,246,0.12)', 'rgba(168,85,247,0.12)'])

  const y2 = useTransform(scrollYProgress, [0, 1], ['80vh', '-10vh'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['80vw', '20vw'])
  // Color changing on scroll (Purple -> Cyan -> Emerald)
  const color2 = useTransform(scrollYProgress, [0, 0.5, 1], ['rgba(168,85,247,0.12)', 'rgba(34,211,238,0.12)', 'rgba(16,185,129,0.12)'])

  const y3 = useTransform(scrollYProgress, [0, 1], ['30vh', '80vh'])
  const x3 = useTransform(scrollYProgress, [0, 1], ['60vw', '-20vw'])
  // Color changing on scroll (Blue -> Purple -> Cyan)
  const color3 = useTransform(scrollYProgress, [0, 0.5, 1], ['rgba(59,130,246,0.12)', 'rgba(168,85,247,0.12)', 'rgba(34,211,238,0.12)'])

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-500">
      {/* Scroll-driven color changing blobs */}
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

      {/* Main glass overlay */}
      <div className="absolute inset-0 backdrop-blur-[80px] bg-white/40 dark:bg-[#111111]/50 transition-colors duration-500" />
      
      {/* Very subtle noise/texture */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
    </div>
  )
}
