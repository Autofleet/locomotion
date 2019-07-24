if (process.env.NEW_RELIC_KEY) {
  require('newrelic'); // eslint-disable-line
}

const { Logger } = require('@autofleet/node-common');

module.exports = Logger();
