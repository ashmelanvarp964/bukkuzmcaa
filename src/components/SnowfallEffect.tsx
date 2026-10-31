import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Snowflake {
  id: number;
  xStart: number; // percentage (0 - 100)
  size: number; // in pixels
  fallDuration: number; // fall duration in seconds (fast & crisp)
  swayDuration: number; // sway period in seconds
  delay: number; // start delay in seconds (negative for immediate full cascade)
  swayDistance: number; // horizontal sway distance in px
  opacity: number;
  blur: number; // depth of field blur in px
  char?: string; // flake shape or soft circular dot
  rotationDuration: number;
}

interface SnowfallEffectProps {
  count?: number;
  reducedMotion?: boolean;
}

export const SnowfallEffect: React.FC<SnowfallEffectProps> = ({
  count = 48,
  reducedMotion = false,
}) => {
  // If user prefers reduced motion, render fewer flakes
  const effectiveCount = reducedMotion ? 16 : count;

  // Generate randomized snowflake properties once with optimized fast & smooth physics
  const snowflakes: Snowflake[] = useMemo(() => {
    const chars = ['❄', '❅', '•', '·', '✦'];
    const flakes: Snowflake[] = [];

    for (let i = 0; i < effectiveCount; i++) {
      const isCharFlake = i % 4 === 0;
      // Faster durations: 2.8s - 5.8s for fast, fluid winter snowfall
      const fallDuration = reducedMotion ? 12 : 2.8 + Math.random() * 3.0;

      flakes.push({
        id: i,
        xStart: Math.random() * 100, // 0% - 100% viewport width
        size: isCharFlake ? 11 + Math.random() * 9 : 3 + Math.random() * 4,
        fallDuration,
        swayDuration: 1.4 + Math.random() * 1.6, // smooth rhythmic sway
        delay: -(Math.random() * fallDuration), // evenly pre-distributed across fall cycle
        swayDistance: 12 + Math.random() * 28,
        opacity: 0.35 + Math.random() * 0.55,
        blur: Math.random() > 0.8 ? 1.2 : 0,
        char: isCharFlake ? chars[Math.floor(Math.random() * chars.length)] : undefined,
        rotationDuration: 4 + Math.random() * 5,
      });
    }

    return flakes;
  }, [effectiveCount, reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none"
    >
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          initial={{
            y: '-5vh',
            x: 0,
            opacity: flake.opacity,
            rotate: 0,
          }}
          animate={
            reducedMotion
              ? {
                  y: ['-5vh', '105vh'],
                }
              : {
                  y: ['-5vh', '105vh'],
                  x: [-flake.swayDistance, flake.swayDistance, -flake.swayDistance],
                  rotate: [0, 180, 360],
                }
          }
          transition={{
            y: {
              duration: flake.fallDuration,
              repeat: Infinity,
              ease: 'linear',
              delay: flake.delay,
            },
            x: {
              duration: flake.swayDuration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: flake.delay,
            },
            rotate: {
              duration: flake.rotationDuration,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          style={{
            position: 'absolute',
            left: `${flake.xStart}%`,
            top: 0,
            fontSize: flake.char ? `${flake.size}px` : undefined,
            width: flake.char ? undefined : `${flake.size}px`,
            height: flake.char ? undefined : `${flake.size}px`,
            filter: flake.blur > 0 ? `blur(${flake.blur}px)` : undefined,
            textShadow: '0 0 10px rgba(186, 230, 253, 0.85)',
            boxShadow: flake.char ? undefined : '0 0 8px 1.5px rgba(186, 230, 253, 0.85)',
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
          className={`flex items-center justify-center font-sans ${
            flake.char
              ? 'text-sky-200/95'
              : 'rounded-full bg-gradient-to-br from-white via-sky-100 to-sky-300'
          }`}
        >
          {flake.char}
        </motion.div>
      ))}
    </div>
  );
};
