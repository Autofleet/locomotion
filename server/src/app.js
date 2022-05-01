require('dotenv').config();
const path = require('path');
const express = require('express');
const SExpress = require('./lib/super-express');
const logger = require('./logger');
const { default: parseHeaderOperationId } = require('./middlewares/parse-header-operation-id');
const packageJson = require('../package.json');
require('./models');

const app = new SExpress({
  httpLogCb: logger.httpMorganInfo,
});
const serverRunningSince = new Date();
app.get(['/version', '/'], (req, res) => {
  res.json({
    name: packageJson.name,
    version: packageJson.version,
    commit: packageJson.commit,
    serverRunningSince,
  });
});

app.use(parseHeaderOperationId);
app.get('/alive', require('./alive'));

app.use('/api', require('./api'));

app.use('/admin', express.static('./web-ui/build/index.html'));
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, './web-ui/build/index.html'));
});

module.exports = app;
