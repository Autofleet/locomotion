require('dotenv').config();
import path from 'path';
import express from 'express';
const SExpress = require('./lib/super-express');
const logger = require('./logger');
const packageJson = require('../package');

import alive from './alive';
import api from './api';

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

app.get('/alive', alive);

app.use('/api', api);

app.use(express.static('./web-ui/build'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './web-ui/build/index.html'));
});

export default app;
