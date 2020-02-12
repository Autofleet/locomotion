require('dotenv').config();

const express = require('express');
const SExpress = require('@autofleet/super-express');
const logger = require('./logger');
const packageJson = require('./package');

const app = new SExpress({
  httpLogCb: logger.httpMorganInfo,
});

const serverRunningSince = new Date();
app.get('/version', (req, res) => {
  res.json({
    name: packageJson.name,
    version: packageJson.version,
    commit: packageJson.commit,
    serverRunningSince,
  });
});

app.get('/alive', require('./alive'));

app.use('/api', require('./api'));

app.use('/', express.static('./web-ui/build'));

module.exports = app;
