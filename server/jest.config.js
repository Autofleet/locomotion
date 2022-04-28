const {defaults} = require('jest-config');
module.exports = {
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      lines: 0,
    },
  },
  preset: 'ts-jest/presets/js-with-ts',
  moduleFileExtensions: [...defaults.moduleFileExtensions,
    "ts",
    "tsx",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  globals: {
    'ts-jest': {
      tsConfigFile: "tsconfig.json"
    }
  },
};
