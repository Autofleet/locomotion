const winston = require('winston');
const { createLogger } = winston;
require('dotenv').config();
if (process.env.NEW_RELIC_KEY) {
  require('newrelic'); // eslint-disable-line
}

const { env } = process;

const infoEnvNmaes = [
  'production',
  'staging',
  'test',
];

const getLevel = (logLevel) => {
  if (logLevel) return logLevel;
  if (env.LOG_LEVEL) return env.LOG_LEVEL;
  if (infoEnvNmaes.includes(env.NODE_ENV)) return 'info';
  if (env.NODE_ENV === 'development') return 'debug';
  return 'debug';
};

const enumerateErrorFormat = winston.format((info) => {
  if (info.message instanceof Error) {
    info.message = Object.assign({ // eslint-disable-line
      message: info.message.message,
      stack: info.message.stack,
    }, info.message);
  }
  if (info instanceof Error) {
    return Object.assign({
      message: info.message,
      stack: info.stack,
    }, info);
  }
  return info;
});

const getFormat = () => {
  if (env.NODE_ENV === 'production') {
    return winston.format.combine(
      enumerateErrorFormat(),
      winston.format.json(),
    );
  }

  return winston.format.combine(
    enumerateErrorFormat(),
    winston.format.splat(),
    winston.format.colorize(),
    winston.format.simple(),
  );
};

const createLoggerInstance = (level, exceptionHandlers) => {
  const transports = [new winston.transports.Console()];

  const logger = createLogger({
    level,
    format: getFormat(),
    transports,
    exceptionHandlers,
    exitOnError: false,
  });

  logger.httpMorganInfo = (options) => {
    logger.info(options.url, {
      httpRequest: {
        status: options.status,
        requestUrl: options.url,
        requestMethod: options.method,
        responseSize: options['content-length'],
        latency: {
          seconds: parseInt(options['response-time'], 10) / 1000,
          nanos: parseInt(options['response-time'], 10) * 1000000,
        },
        userAgent: options['user-agent'],
      },
    });
  };
  if (env.NODE_ENV !== 'production') {
    logger.httpMorganInfo = undefined;
  }
  return logger;
};

const getLogger = (logLevel) => {
  const level = getLevel(logLevel);
  return createLoggerInstance(level);
};

const Logger = getLogger;

module.exports = Logger();
