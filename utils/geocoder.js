// Node-Geocoder
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: process.env.GEOCODER_PROVIDER, // Mapquest
    apiKey: process.env.GEOCODER_API_KEY, // Mapquest Key
    formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;