require('dotenv').config();
const logger = require('../logger');

const { env } = process;

module.exports = {
  development: {
    username: env.DB_USERNAME || '',
    password: env.DB_PASSWORD || null,
    database: env.DB_NAME || 'locomotion_ms_development',
    host: env.DB_HOST || '127.0.0.1',
    dialect: env.DB_TYPE || 'postgres',
    define: {
      underscored: true,
      underscoredAll: true,
    },
    logging: logger.shortInfo,
  },
  test: {
    username: env.DB_USERNAME || '',
    password: env.DB_PASSWORD || null,
    database: env.DB_NAME || 'locomotion_ms_test',
    host: env.DB_HOST || '127.0.0.1',
    dialect: env.DB_TYPE || 'postgres',
    define: {
      underscored: true,
      underscoredAll: true,
    },
    logging: logger.shortInfo,
  },
  production: {
    username: env.DB_USERNAME || 'root',
    password: env.DB_PASSWORD || null,
    database: env.DB_NAME || 'locomotion_ms_production',
    host: env.DB_HOST || '127.0.0.1',
    dialect: env.DB_TYPE || 'postgres',
    define: {
      underscored: true,
      underscoredAll: true,
    },
    logging: logger.shortInfo,
  },
};
