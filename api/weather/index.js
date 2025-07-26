const https = require('https');
const { URL } = require('url');

module.exports = async function (context, req) {
    context.log('Weather API function processed a request.');

    // CORS headers
    context.res = {
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
        }
    };

    // Handle preflight
    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        context.res.body = '';
        return;
    }

    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    if (!latitude || !longitude) {
        context.res.status = 400;
        context.res.body = JSON.stringify({ error: 'Latitude and longitude are required' });
        return;
    }

    try {
        const params = new URLSearchParams({
            latitude,
            longitude,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,is_day',
            timezone: 'auto'
        });

        const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
        const data = await makeHttpsRequest(url);
        const parsedData = JSON.parse(data);

        const weatherCode = parsedData.current.weather_code;
        const isDay = parsedData.current.is_day;
        const condition = getWeatherCondition(weatherCode, isDay);

        const result = {
            current: {
                temperature_2m: parsedData.current.temperature_2m,
                relative_humidity_2m: parsedData.current.relative_humidity_2m,
                apparent_temperature: parsedData.current.apparent_temperature,
                precipitation: parsedData.current.precipitation,
                wind_speed_10m: parsedData.current.wind_speed_10m,
                pressure_msl: parsedData.current.surface_pressure,
                condition: condition,
                is_day: isDay
            },
            location: {
                latitude: parsedData.latitude,
                longitude: parsedData.longitude
            }
        };

        context.res.status = 200;
        context.res.body = JSON.stringify(result);
    } catch (error) {
        context.log.error('Weather API error:', error);
        context.res.status = 500;
        context.res.body = JSON.stringify({ error: 'Failed to fetch weather data' });
    }
};

function getWeatherCondition(code, isDay) {
    const weatherCodes = {
        0: { day: 'Clear Sky', night: 'Clear Night' },
        1: { day: 'Mainly Clear', night: 'Mainly Clear' },
        2: { day: 'Partly Cloudy', night: 'Partly Cloudy' },
        3: { day: 'Overcast', night: 'Overcast' },
        45: { day: 'Foggy', night: 'Foggy' },
        48: { day: 'Depositing Rime Fog', night: 'Depositing Rime Fog' },
        51: { day: 'Light Drizzle', night: 'Light Drizzle' },
        53: { day: 'Moderate Drizzle', night: 'Moderate Drizzle' },
        55: { day: 'Dense Drizzle', night: 'Dense Drizzle' },
        61: { day: 'Slight Rain', night: 'Slight Rain' },
        63: { day: 'Moderate Rain', night: 'Moderate Rain' },
        65: { day: 'Heavy Rain', night: 'Heavy Rain' },
        71: { day: 'Slight Snow', night: 'Slight Snow' },
        73: { day: 'Moderate Snow', night: 'Moderate Snow' },
        75: { day: 'Heavy Snow', night: 'Heavy Snow' },
        80: { day: 'Slight Rain Showers', night: 'Slight Rain Showers' },
        81: { day: 'Moderate Rain Showers', night: 'Moderate Rain Showers' },
        82: { day: 'Violent Rain Showers', night: 'Violent Rain Showers' },
        95: { day: 'Thunderstorm', night: 'Thunderstorm' }
    };

    const condition = weatherCodes[code] || { day: 'Unknown', night: 'Unknown' };
    return isDay === 1 ? condition.day : condition.night;
}

function makeHttpsRequest(url) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: 443,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}