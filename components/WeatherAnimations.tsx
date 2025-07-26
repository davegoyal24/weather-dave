'use client';

import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, Zap } from 'lucide-react';

interface WeatherAnimationsProps {
  condition: string;
  isDay: boolean;
}

export default function WeatherAnimations({ condition, isDay }: WeatherAnimationsProps) {
  const getWeatherIcon = () => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return isDay ?
          <Sun className="w-16 h-16 text-yellow-300" /> :
          <div className="w-16 h-16 bg-gray-300 rounded-full opacity-80" />;
      case 'partly-cloudy':
        return <Cloud className="w-16 h-16 text-gray-300" />;
      case 'cloudy':
        return <Cloud className="w-16 h-16 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="w-16 h-16 text-blue-300" />;
      case 'snowy':
        return <CloudSnow className="w-16 h-16 text-white" />;
      case 'stormy':
        return <Zap className="w-16 h-16 text-yellow-400" />;
      default:
        return <Cloud className="w-16 h-16 text-gray-300" />;
    }
  };

  const getAnimation = () => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return {
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        };
      case 'rainy':
        return {
          y: [0, -5, 0],
          x: [0, 2, -2, 0],
        };
      case 'snowy':
        return {
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        };
      default:
        return {
          x: [0, 5, -5, 0],
        };
    }
  };

  return (
    <motion.div
      animate={getAnimation()}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="flex items-center justify-center"
    >
      {getWeatherIcon()}
    </motion.div>
  );
}