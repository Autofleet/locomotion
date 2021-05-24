const SDK = require('./SDK');

module.exports = new SDK({ refreshToken: process.env.AF_REFRESH_TOKEN });
