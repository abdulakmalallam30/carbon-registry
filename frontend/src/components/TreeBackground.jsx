import { motion } from 'framer-motion'

const TreeBackground = () => {
  // Define CO₂ particle paths from roots → trunk → branches
  const particlePaths = [
    // Path 1: Left root → trunk → left branch
    {
      path: [
        { x: 200, y: 1000 },
        { x: 400, y: 950 },
        { x: 600, y: 900 },
        { x: 800, y: 850 },
        { x: 960, y: 800 },
        { x: 960, y: 700 },
        { x: 960, y: 600 },
        { x: 960, y: 500 },
        { x: 900, y: 450 },
        { x: 800, y: 400 },
        { x: 700, y: 360 }
      ],
      delay: 0,
      duration: 12
    },
    // Path 2: Right root → trunk → right branch
    {
      path: [
        { x: 1720, y: 1000 },
        { x: 1520, y: 950 },
        { x: 1320, y: 900 },
        { x: 1120, y: 850 },
        { x: 960, y: 800 },
        { x: 960, y: 700 },
        { x: 960, y: 600 },
        { x: 960, y: 500 },
        { x: 1020, y: 450 },
        { x: 1120, y: 400 },
        { x: 1220, y: 360 }
      ],
      delay: 3,
      duration: 12
    },
    // Path 3: Center-left root → trunk → top branches
    {
      path: [
        { x: 500, y: 1000 },
        { x: 700, y: 930 },
        { x: 900, y: 850 },
        { x: 960, y: 800 },
        { x: 960, y: 650 },
        { x: 960, y: 500 },
        { x: 910, y: 420 },
        { x: 850, y: 350 },
        { x: 780, y: 300 }
      ],
      delay: 6,
      duration: 10
    },
    // Path 4: Center-right root → trunk → top branches
    {
      path: [
        { x: 1420, y: 1000 },
        { x: 1220, y: 930 },
        { x: 1020, y: 850 },
        { x: 960, y: 800 },
        { x: 960, y: 650 },
        { x: 960, y: 500 },
        { x: 1010, y: 420 },
        { x: 1070, y: 350 },
        { x: 1140, y: 300 }
      ],
      delay: 9,
      duration: 10
    },
    // Path 5: Far left root → trunk → mid branch
    {
      path: [
        { x: 100, y: 1000 },
        { x: 300, y: 960 },
        { x: 500, y: 920 },
        { x: 700, y: 870 },
        { x: 850, y: 830 },
        { x: 960, y: 800 },
        { x: 960, y: 680 },
        { x: 960, y: 550 },
        { x: 880, y: 500 },
        { x: 750, y: 450 }
      ],
      delay: 1.5,
      duration: 13
    },
    // Path 6: Far right root → trunk → mid branch
    {
      path: [
        { x: 1820, y: 1000 },
        { x: 1620, y: 960 },
        { x: 1420, y: 920 },
        { x: 1220, y: 870 },
        { x: 1070, y: 830 },
        { x: 960, y: 800 },
        { x: 960, y: 680 },
        { x: 960, y: 550 },
        { x: 1040, y: 500 },
        { x: 1170, y: 450 }
      ],
      delay: 4.5,
      duration: 13
    }
  ]

  // Generate smooth path coordinates for particles
  const generatePathString = (points) => {
    return points.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(' ')
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Cyan/Teal gradient for tree */}
          <linearGradient id="treeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00bfa5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0097a7" stopOpacity="0.5" />
          </linearGradient>
          
          {/* Glow filter for all elements */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Stronger glow for CO₂ particles */}
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Gradient for CO₂ particles */}
          <radialGradient id="particleGradient">
            <stop offset="0%" stopColor="#64ffda" stopOpacity="1" />
            <stop offset="70%" stopColor="#00d9ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00bfa5" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ROOT SYSTEM - Large underground network */}
        
        {/* Main Root Network - Left Side */}
        <motion.path
          d="M 960 800 Q 800 850 650 900 Q 500 940 350 980 Q 250 1000 150 1010"
          stroke="url(#treeGradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ 
            pathLength: { duration: 2, ease: "easeInOut" },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        <motion.path
          d="M 650 900 Q 550 930 450 960 Q 350 985 250 1000"
          stroke="url(#treeGradient)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ 
            pathLength: { duration: 2, delay: 0.3, ease: "easeInOut" },
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        <motion.path
          d="M 800 850 Q 700 890 600 920 Q 500 950 400 970"
          stroke="url(#treeGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            pathLength: { duration: 2, delay: 0.5, ease: "easeInOut" },
            opacity: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Main Root Network - Right Side */}
        <motion.path
          d="M 960 800 Q 1120 850 1270 900 Q 1420 940 1570 980 Q 1670 1000 1770 1010"
          stroke="url(#treeGradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ 
            pathLength: { duration: 2, delay: 0.2, ease: "easeInOut" },
            opacity: { duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        <motion.path
          d="M 1270 900 Q 1370 930 1470 960 Q 1570 985 1670 1000"
          stroke="url(#treeGradient)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ 
            pathLength: { duration: 2, delay: 0.5, ease: "easeInOut" },
            opacity: { duration: 4, delay: 0.3, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        <motion.path
          d="M 1120 850 Q 1220 890 1320 920 Q 1420 950 1520 970"
          stroke="url(#treeGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            pathLength: { duration: 2, delay: 0.7, ease: "easeInOut" },
            opacity: { duration: 3.5, delay: 0.6, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Central Roots */}
        <motion.path
          d="M 960 800 Q 920 880 880 950 Q 850 990 820 1020"
          stroke="url(#treeGradient)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ 
            pathLength: { duration: 2, delay: 0.4, ease: "easeInOut" },
            opacity: { duration: 3, delay: 0.2, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        <motion.path
          d="M 960 800 Q 1000 880 1040 950 Q 1070 990 1100 1020"
          stroke="url(#treeGradient)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ 
            pathLength: { duration: 2, delay: 0.6, ease: "easeInOut" },
            opacity: { duration: 3, delay: 0.4, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* TRUNK - Main vertical structure */}
        <motion.path
          d="M 960 800 L 960 750 L 960 700 L 960 650 L 960 600 L 960 550 L 960 500 L 960 450"
          stroke="url(#treeGradient)"
          strokeWidth="5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 2.5, delay: 1, ease: "easeInOut" }}
        />

        {/* BRANCHES - Upper structure */}
        
        {/* Main Left Branch */}
        <motion.path
          d="M 960 500 Q 900 470 840 440 Q 780 410 720 380 Q 670 360 620 340"
          stroke="url(#treeGradient)"
          strokeWidth="3.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
        />

        {/* Main Right Branch */}
        <motion.path
          d="M 960 500 Q 1020 470 1080 440 Q 1140 410 1200 380 Q 1250 360 1300 340"
          stroke="url(#treeGradient)"
          strokeWidth="3.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
        />

        {/* Mid-level Branches */}
        <motion.path
          d="M 960 550 Q 880 520 800 490 Q 740 470 680 450"
          stroke="url(#treeGradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 1.7, ease: "easeInOut" }}
        />

        <motion.path
          d="M 960 550 Q 1040 520 1120 490 Q 1180 470 1240 450"
          stroke="url(#treeGradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 1.7, ease: "easeInOut" }}
        />

        {/* Upper Branches */}
        <motion.path
          d="M 960 450 Q 910 410 860 370 Q 820 340 780 310"
          stroke="url(#treeGradient)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.8, delay: 2, ease: "easeInOut" }}
        />

        <motion.path
          d="M 960 450 Q 1010 410 1060 370 Q 1100 340 1140 310"
          stroke="url(#treeGradient)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.8, delay: 2, ease: "easeInOut" }}
        />

        {/* Fine branches */}
        <motion.path
          d="M 720 380 Q 680 360 640 340"
          stroke="url(#treeGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 2.2, ease: "easeInOut" }}
        />

        <motion.path
          d="M 1200 380 Q 1240 360 1280 340"
          stroke="url(#treeGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 2.2, ease: "easeInOut" }}
        />

        {/* CO₂ PARTICLES - Flowing through entire system */}
        {particlePaths.map((particleData, index) => (
          <g key={`particle-${index}`}>
            {/* Main CO₂ particle */}
            <motion.circle
              r="5"
              fill="url(#particleGradient)"
              filter="url(#strongGlow)"
              initial={{ 
                offsetDistance: '0%',
                scale: 0,
                opacity: 0
              }}
              animate={{
                offsetDistance: '100%',
                scale: [0, 1.2, 1, 1, 0.8, 0],
                opacity: [0, 0.8, 1, 1, 0.8, 0]
              }}
              transition={{
                duration: particleData.duration,
                delay: particleData.delay,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                offsetPath: `path('${generatePathString(particleData.path)}')`,
              }}
            />
            
            {/* Particle trail effect */}
            <motion.circle
              r="3"
              fill="#00d9ff"
              opacity="0.4"
              filter="url(#glow)"
              initial={{ 
                offsetDistance: '0%',
                scale: 0
              }}
              animate={{
                offsetDistance: '100%',
                scale: [0, 1, 0.8, 0.6, 0],
                opacity: [0, 0.6, 0.4, 0.2, 0]
              }}
              transition={{
                duration: particleData.duration,
                delay: particleData.delay + 0.3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                offsetPath: `path('${generatePathString(particleData.path)}')`,
              }}
            />
          </g>
        ))}

        {/* Additional ambient CO₂ particles on roots */}
        {[...Array(12)].map((_, i) => {
          const startX = 200 + (i * 130)
          const startY = 1000 - (i % 3) * 20
          const endX = 960
          const endY = 800
          
          return (
            <motion.circle
              key={`ambient-${i}`}
              r="3"
              fill="#64ffda"
              filter="url(#strongGlow)"
              initial={{ cx: startX, cy: startY, opacity: 0, scale: 0 }}
              animate={{
                cx: [startX, (startX + endX) / 2, endX],
                cy: [startY, (startY + endY) / 2, endY],
                opacity: [0, 0.7, 0],
                scale: [0, 1.2, 0]
              }}
              transition={{
                duration: 8,
                delay: i * 0.7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )
        })}

        {/* Pulsing root energy effect */}
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx="960"
            cy="800"
            r="10"
            fill="none"
            stroke="#00d9ff"
            strokeWidth="2"
            opacity="0"
            filter="url(#glow)"
            animate={{
              r: [10, 80, 150],
              opacity: [0.6, 0.3, 0],
              strokeWidth: [2, 1, 0]
            }}
            transition={{
              duration: 4,
              delay: i * 1,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}
      </svg>

      {/* Ambient atmospheric effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/3 rounded-full blur-3xl" />
    </div>
  )
}

export default TreeBackground
