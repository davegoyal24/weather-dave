module.exports = async function (context, req) {
    context.log('Geocode API function processed a request.');

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

    const city = req.query.city;

    if (!city) {
        context.res.status = 400;
        context.res.body = { error: 'City parameter is required' };
        return;
    }

    try {
        const encodedCity = encodeURIComponent(city);
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=5&language=en&format=json`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status}`);
        }

        const data = await response.json();

        context.res.status = 200;
        context.res.body = data;
    } catch (error) {
        context.log.error('Geocoding API error:', error);
        context.res.status = 500;
        context.res.body = { error: 'Failed to fetch location data' };
    }
};