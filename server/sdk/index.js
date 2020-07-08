const SDK = require('./SDK');

const baseToken = '';

module.exports = new SDK({ refreshToken: process.env.AF_REFRESH_TOKEN || baseToken });
