'use client';

import { motion } from 'framer-motion';

export default function LoadingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-xl max-w-md mx-auto"
    >
      <div className="animate-pulse">
        <div className="h-8 bg-white/30 rounded mb-4"></div>
        <div className="h-4 bg-white/20 rounded mb-6"></div>
        <div className="flex justify-between items-center mb-8">
          <div className="h-16 w-24 bg-white/30 rounded"></div>
          <div className="h-16 w-16 bg-white/20 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-white/20 rounded-lg"></div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}