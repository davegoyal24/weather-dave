'use client';

import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import WeatherAnimations from './WeatherAnimations';

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    wind_speed_10m: number;
    pressure_msl: number;
    condition: string;
    is_day: number;
  };
  location: {
    latitude: number;
    longitude: number;
  };
}

interface WeatherCardProps {
  weather: WeatherData;
  city: string;
  country: string;
}

export default function WeatherCard({ weather, city, country }: WeatherCardProps) {
  const { current } = weather;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/20 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/30 shadow-xl"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {city}
        </h2>
        <p className="text-white/80 text-sm sm:text-base">{country}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
        <div className="text-center sm:text-left">
          <div className="text-5xl sm:text-6xl font-bold text-white mb-2">
            {Math.round(current.temperature_2m)}°C
          </div>
          <div className="text-white/80 text-lg capitalize">
            {current.condition.replace('-', ' ')}
          </div>
          <div className="text-white/60 text-sm">
            Feels like {Math.round(current.apparent_temperature)}°C
          </div>
        </div>

        <div className="flex-shrink-0">
          <WeatherAnimations condition={current.condition} isDay={current.is_day === 1} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-white/10 rounded-lg">
          <Droplets className="w-5 h-5 text-blue-300 mx-auto mb-2" />
          <div className="text-white font-semibold text-sm">{current.relative_humidity_2m}%</div>
          <div className="text-white/60 text-xs">Humidity</div>
        </div>

        <div className="text-center p-3 bg-white/10 rounded-lg">
          <Wind className="w-5 h-5 text-gray-300 mx-auto mb-2" />
          <div className="text-white font-semibold text-sm">{Math.round(current.wind_speed_10m)} km/h</div>
          <div className="text-white/60 text-xs">Wind</div>
        </div>

        <div className="text-center p-3 bg-white/10 rounded-lg">
          <Eye className="w-5 h-5 text-purple-300 mx-auto mb-2" />
          <div className="text-white font-semibold text-sm">{Math.round(current.pressure_msl)} hPa</div>
          <div className="text-white/60 text-xs">Pressure</div>
        </div>

        <div className="text-center p-3 bg-white/10 rounded-lg">
          <Thermometer className="w-5 h-5 text-orange-300 mx-auto mb-2" />
          <div className="text-white font-semibold text-sm">{current.precipitation} mm</div>
          <div className="text-white/60 text-xs">Rain</div>
        </div>
      </div>
    </motion.div>
  );
}