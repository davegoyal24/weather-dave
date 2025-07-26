const https = require('https');
const { URL } = require('url');

module.exports = async function (context, req) {
    context.log('Geocode API function processed a request.');

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

    const city = req.query.city;

    if (!city) {
        context.res.status = 400;
        context.res.body = JSON.stringify({ error: 'City parameter is required' });
        return;
    }

    try {
        const encodedCity = encodeURIComponent(city);
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=1&language=en&format=json`;

        const data = await makeHttpsRequest(url);
        const parsedData = JSON.parse(data);

        if (!parsedData.results || parsedData.results.length === 0) {
            context.res.status = 404;
            context.res.body = JSON.stringify({ error: 'City not found' });
            return;
        }

        // Transform the data to match our expected format
        const result = {
            results: parsedData.results.map(result => ({
                name: result.name,
                country: result.country,
                latitude: result.latitude,
                longitude: result.longitude
            }))
        };

        context.res.status = 200;
        context.res.body = JSON.stringify(result);
    } catch (error) {
        context.log.error('Geocoding API error:', error);
        context.res.status = 500;
        context.res.body = JSON.stringify({ error: 'Failed to fetch location data' });
    }
};

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