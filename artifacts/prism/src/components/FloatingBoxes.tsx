import { motion } from "framer-motion";

interface BoxConfig {
  size: number;
  top: string;
  left: string;
  spinDuration: number;
  driftDuration: number;
  driftDelay: number;
  startRX: number;
  startRY: number;
  startRZ: number;
  opacity: number;
  color: string;
}

const BOXES: BoxConfig[] = [
  { size: 80,  top: "8%",  left: "7%",  spinDuration: 20, driftDuration: 9,  driftDelay: 0,   startRX: 35,  startRY: 45,  startRZ: 10,  opacity: 0.55, color: "99,102,241" },
  { size: 52,  top: "20%", left: "88%", spinDuration: 15, driftDuration: 11, driftDelay: 3,   startRX: 25,  startRY: 60,  startRZ: -15, opacity: 0.48, color: "16,185,129" },
  { size: 96,  top: "68%", left: "4%",  spinDuration: 25, driftDuration: 13, driftDelay: 1.5, startRX: 50,  startRY: 28,  startRZ: 20,  opacity: 0.36, color: "251,146,60"  },
  { size: 42,  top: "76%", left: "82%", spinDuration: 13, driftDuration: 8,  driftDelay: 5,   startRX: 20,  startRY: 65,  startRZ: -5,  opacity: 0.50, color: "244,63,94"   },
  { size: 62,  top: "45%", left: "93%", spinDuration: 22, driftDuration: 12, driftDelay: 2,   startRX: 42,  startRY: 38,  startRZ: 15,  opacity: 0.40, color: "124,58,237"  },
  { size: 34,  top: "13%", left: "56%", spinDuration: 11, driftDuration: 7,  driftDelay: 7,   startRX: 30,  startRY: 50,  startRZ: -22, opacity: 0.38, color: "37,99,235"   },
  { size: 56,  top: "85%", left: "46%", spinDuration: 18, driftDuration: 10, driftDelay: 4,   startRX: 45,  startRY: 25,  startRZ: 8,   opacity: 0.42, color: "99,102,241"  },
];

function DiamondBox({ cfg }: { cfg: BoxConfig }) {
  const s = cfg.size;
  const half = s / 2;

  const faceTransforms = [
    `translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];

  // Slightly different shading per face for depth illusion
  const faceOpacities = [0.14, 0.04, 0.09, 0.09, 0.12, 0.05];

  return (
    <motion.div
      style={{
        position: "absolute",
        top: cfg.top,
        left: cfg.left,
        width: s,
        height: s,
        perspective: s * 7,
        perspectiveOrigin: "50% 50%",
        pointerEvents: "none",
      }}
      animate={{ y: [0, -16, 8, -6, 0] }}
      transition={{
        y: { duration: cfg.driftDuration, repeat: Infinity, ease: "easeInOut", delay: cfg.driftDelay },
      }}
    >
      <motion.div
        style={{
          width: s,
          height: s,
          transformStyle: "preserve-3d",
          opacity: cfg.opacity,
        }}
        animate={{
          rotateX: [cfg.startRX, cfg.startRX + 360],
          rotateY: [cfg.startRY, cfg.startRY + 360],
          rotateZ: [cfg.startRZ, cfg.startRZ + 180],
        }}
        transition={{
          duration: cfg.spinDuration,
          repeat: Infinity,
          ease: "linear",
          delay: cfg.driftDelay * 0.4,
        }}
      >
        {faceTransforms.map((transform, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              transform,
              background: `rgba(${cfg.color}, ${faceOpacities[i]})`,
              border: `1px solid rgba(${cfg.color}, 0.35)`,
              borderRadius: 6,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), inset 0 0 ${s * 0.25}px rgba(${cfg.color}, 0.08)`,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

export function FloatingBoxes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {BOXES.map((cfg, i) => (
        <DiamondBox key={i} cfg={cfg} />
      ))}
    </div>
  );
}
