'use client';

import { motion } from 'framer-motion';

export default function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1024),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 768),
          }}
          animate={{
            x: Math.random() * 1024,
            y: Math.random() * 768,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}