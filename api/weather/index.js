module.exports = async function (context, req) {
    context.log('Weather API function processed a request.');

    // CORS headers
    context.res = {
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    };

    // Handle preflight
    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        return;
    }

    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    if (!latitude || !longitude) {
        context.res.status = 400;
        context.res.body = { error: 'Latitude and longitude are required' };
        return;
    }

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        const weatherCode = data.current.weather_code;
        const weatherCondition = getWeatherCondition(weatherCode);

        context.res.status = 200;
        context.res.body = {
            current: {
                ...data.current,
                condition: weatherCondition,
            },
            hourly: data.hourly,
            daily: data.daily,
            timezone: data.timezone,
            location: {
                latitude: data.latitude,
                longitude: data.longitude,
            },
        };
    } catch (error) {
        context.log.error('Weather API error:', error);
        context.res.status = 500;
        context.res.body = { error: 'Failed to fetch weather data' };
    }
};

function getWeatherCondition(code) {
    if (code === 0) return 'clear';
    if (code === 1 || code === 2 || code === 3) return 'partly-cloudy';
    if (code >= 45 && code <= 48) return 'foggy';
    if (code >= 51 && code <= 67) return 'rainy';
    if (code >= 71 && code <= 77) return 'snowy';
    if (code >= 80 && code <= 99) return 'rainy';
    return 'cloudy';
}