const { default: logger } = require('../logger');
require('dotenv').config();

const { env } = process;

module.exports = {
  development: {
    username: env.DB_USERNAME || '',
    password: env.DB_PASSWORD || null,
    database: env.DB_NAME || 'locomotion_ms_development',
    host: env.DB_HOST || '127.0.0.1',
    dialect: env.DB_TYPE || 'postgres',
    camelCaseForFileName: true,
    camelCase: true,
    define: {
      underscored: true,
      underscoredAll: true,
    },
    logging: logger.shortInfo,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
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
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
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
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
