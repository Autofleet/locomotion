import winston, { Logger } from 'winston';
import sizeof from 'object-sizeof';

const { createLogger } = winston;
require('dotenv').config();

const { env } = process;

const isProd = env.NODE_ENV === 'production';

const infoEnvNmaes = [
  'production',
  'staging',
  'test',
];

const serializeError = (error) => {
  const fields = ['code', 'status', 'statusCode', 'message', 'messageData', 'name', 'stack', 'stackTrace'];
  return fields.reduce((v, field) => ({ ...v, [field]: error[field] }), {});
};

const getLevel = () => {
  if (env.LOG_LEVEL) return env.LOG_LEVEL;
  if (infoEnvNmaes.includes(env.NODE_ENV)) return 'info';
  if (env.NODE_ENV === 'development') return 'debug';
  return 'debug';
};

const addLogsSize = winston.format((info) => {
  const logSize = sizeof(info);
  if (logSize > 256000) {
    console.log(`[WARNING] Found Oversized log with message "${info.message}"`);
    return {
      message: info.message,
      stack: info.stack,
      level: info.level,
      logSize,
    };
  }

  return { ...info, logSize };
});

const enumerateErrorFormat = winston.format((info) => {
  // eslint-disable-next-line no-param-reassign
  info.severity = info.level.toUpperCase();

  if (info instanceof Error) {
    return {
      message: info.message,
      stack: info.stack,
      ...info,
    };
  }

  // eslint-disable-next-line array-callback-return
  Object.keys(info).map((k) => {
    if (info[k] instanceof Error) {
      // eslint-disable-next-line no-param-reassign
      info[k] = serializeError(info[k]);
    }
  });

  return info;
});

const getFormat = () => {
  if (isProd) {
    return winston.format.combine(
      addLogsSize(),
      enumerateErrorFormat(),
      winston.format.json(),
    );
  }

  return winston.format.combine(
    addLogsSize(),
    enumerateErrorFormat(),
    winston.format.splat(),
    winston.format.simple(),
  );
};

const createLoggerInstance = (exceptionHandlers = undefined): Logger => createLogger({
  level: getLevel(),
  format: getFormat(),
  transports: [
    new winston.transports.Console(),
  ],
  exceptionHandlers,
  exitOnError: false,
});

class LoggerInstanceManager {
  static instance: Logger;

  static getLoggerInstance(): Logger {
    if (!LoggerInstanceManager.instance) {
      LoggerInstanceManager.instance = createLoggerInstance();
    }
    return LoggerInstanceManager.instance;
  }
}

export default LoggerInstanceManager.getLoggerInstance();
