'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import FloatingParticles from '@/components/FloatingParticles';
import { CloudSun, AlertCircle } from 'lucide-react';

interface LocationData {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

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

interface SearchResult {
  location: LocationData;
  weather: WeatherData;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSearch, setCurrentSearch] = useState<SearchResult | null>(null);
  const [backgroundGradient, setBackgroundGradient] = useState('from-blue-400 to-purple-500');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      setBackgroundGradient('from-orange-400 to-pink-500');
    } else if (hour >= 12 && hour < 18) {
      setBackgroundGradient('from-blue-400 to-cyan-500');
    } else if (hour >= 18 && hour < 21) {
      setBackgroundGradient('from-purple-500 to-pink-500');
    } else {
      setBackgroundGradient('from-indigo-900 to-purple-900');
    }
  }, []);

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const geoResponse = await fetch(`/api/geocode?city=${encodeURIComponent(city)}`);
      if (!geoResponse.ok) {
        const data = await geoResponse.json();
        throw new Error(data.error || 'Failed to find location');
      }

      const geoData = await geoResponse.json();
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('No locations found for this city');
      }

      const locationData: LocationData = geoData.results[0];

      const weatherResponse = await fetch(
        `/api/weather?latitude=${locationData.latitude}&longitude=${locationData.longitude}`
      );
      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const weatherData: WeatherData = await weatherResponse.json();

      setCurrentSearch({ location: locationData, weather: weatherData });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient} transition-all duration-1000 relative`}>
      <FloatingParticles />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <CloudSun className="w-12 h-12 text-white" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Weather Now</h1>
          </div>
          <p className="text-white/80 text-base sm:text-lg">
            Discover the weather in any city with beautiful animations
          </p>
        </motion.header>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto mb-8"
            >
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-300" />
                <p className="text-red-100">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center items-center px-4 min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4"
                >
                  <div className="w-full h-full border-4 border-white/20 border-t-white rounded-full"></div>
                </motion.div>
                <p className="text-white/80 text-lg">Searching for weather...</p>
              </motion.div>
            ) : currentSearch ? (
              <motion.div
                key={currentSearch.location.name}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md md:max-w-lg lg:max-w-xl"
              >
                <WeatherCard
                  weather={currentSearch.weather}
                  city={currentSearch.location.name}
                  country={currentSearch.location.country}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {!currentSearch && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-20"
          >
            <p className="text-white/60 text-base sm:text-lg">
              Search for a city to see the current weather
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}