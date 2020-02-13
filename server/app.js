require('dotenv').config();
const path = require('path');
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

app.use(express.static('./web-ui/build'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './web-ui/build/index.html'));
});

module.exports = app;
