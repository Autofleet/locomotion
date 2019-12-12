require('dotenv').config();

const SExpress = require('@autofleet/super-express');
const logger = require('./logger');
const packageJson = require('./package');

const app = new SExpress({
  httpLogCb: logger.httpMorganInfo,
});

const serverRunningSince = new Date();
app.get('/', (req, res) => {
  res.json({
    name: packageJson.name,
    version: packageJson.version,
    commit: packageJson.commit,
    serverRunningSince,
  });
});

app.get('/alive', require('./alive'));

app.use('/api', require('./api'));

module.exports = app;
