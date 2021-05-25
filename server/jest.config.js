module.exports = {
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      lines: 69,
    },
  },
  preset: 'ts-jest/presets/js-with-ts',
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  globals: {
    'ts-jest': {
      tsconfig: "tsconfig.json"
    }
  },
};
