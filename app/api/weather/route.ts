import { NextResponse } from 'next/server';

function getWeatherCondition(code: number, isDay: number): string {
  const weatherCodes: { [key: number]: { day: string; night: string } } = {
    0: { day: 'Clear Sky', night: 'Clear Night' },
    1: { day: 'Mainly Clear', night: 'Mainly Clear' },
    2: { day: 'Partly Cloudy', night: 'Partly Cloudy' },
    3: { day: 'Overcast', night: 'Overcast' },
    45: { day: 'Foggy', night: 'Foggy' },
    48: { day: 'Depositing Rime Fog', night: 'Depositing Rime Fog' },
    51: { day: 'Light Drizzle', night: 'Light Drizzle' },
    53: { day: 'Moderate Drizzle', night: 'Moderate Drizzle' },
    55: { day: 'Dense Drizzle', night: 'Dense Drizzle' },
    56: { day: 'Freezing Drizzle', night: 'Freezing Drizzle' },
    57: { day: 'Dense Freezing Drizzle', night: 'Dense Freezing Drizzle' },
    61: { day: 'Slight Rain', night: 'Slight Rain' },
    63: { day: 'Moderate Rain', night: 'Moderate Rain' },
    65: { day: 'Heavy Rain', night: 'Heavy Rain' },
    66: { day: 'Light Freezing Rain', night: 'Light Freezing Rain' },
    67: { day: 'Heavy Freezing Rain', night: 'Heavy Freezing Rain' },
    71: { day: 'Slight Snow', night: 'Slight Snow' },
    73: { day: 'Moderate Snow', night: 'Moderate Snow' },
    75: { day: 'Heavy Snow', night: 'Heavy Snow' },
    77: { day: 'Snow Grains', night: 'Snow Grains' },
    80: { day: 'Slight Rain Showers', night: 'Slight Rain Showers' },
    81: { day: 'Moderate Rain Showers', night: 'Moderate Rain Showers' },
    82: { day: 'Violent Rain Showers', night: 'Violent Rain Showers' },
    85: { day: 'Slight Snow Showers', night: 'Slight Snow Showers' },
    86: { day: 'Heavy Snow Showers', night: 'Heavy Snow Showers' },
    95: { day: 'Thunderstorm', night: 'Thunderstorm' },
    96: { day: 'Thunderstorm with Slight Hail', night: 'Thunderstorm with Slight Hail' },
    99: { day: 'Thunderstorm with Heavy Hail', night: 'Thunderstorm with Heavy Hail' },
  };

  const condition = weatherCodes[code] || { day: 'Unknown', night: 'Unknown' };
  return isDay === 1 ? condition.day : condition.night;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');

  if (!latitude || !longitude) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,is_day',
      timezone: 'auto',
    });

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    return NextResponse.json({
      current: {
        temperature_2m: data.current.temperature_2m,
        relative_humidity_2m: data.current.relative_humidity_2m,
        apparent_temperature: data.current.apparent_temperature,
        precipitation: data.current.precipitation,
        wind_speed_10m: data.current.wind_speed_10m,
        pressure_msl: data.current.surface_pressure,
        condition: getWeatherCondition(data.current.weather_code, data.current.is_day),
        is_day: data.current.is_day,
      },
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}