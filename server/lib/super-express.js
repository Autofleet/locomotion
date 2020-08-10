const express = require('express');

const chalk = require('chalk');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

const defaultOptions = {
  bodyParser: true,
  compression: true,
  helmet: true,
};

module.exports = (options = {}) => {
  const app = express(options);

  const isProd = process.env.NODE_ENV === 'production';
  const mergedOptions = Object.assign({}, defaultOptions, options);

  if (options.httpLogCb) {
    app.use(morgan((tokens, req, res) => {
      options.httpLogCb({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        'content-length': tokens.res(req, res, 'content-length'),
        'response-time': tokens['response-time'](req, res),
        'user-agent': tokens['user-agent'](req, res),
      });
    }));
  } else {
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
  }

  // General
  if (mergedOptions.bodyParser) {
    app.use(bodyParser.urlencoded({
      extended: true,
    }));
    app.use(bodyParser.json());
  }

  if (mergedOptions.compression) app.use(compression(mergedOptions.compression.options));
  if (mergedOptions.helmet) app.use(helmet(mergedOptions.helmet.options));

  app.nativeListen = app.listen;
  app.listen = (port, cb) => {
    console.log(chalk.blue(`Super express will listen on port ${port}`));
    console.log(chalk.blue(`Production mode: ${isProd}`));
    app.nativeListen(port, cb);
  };

  return app;
};
