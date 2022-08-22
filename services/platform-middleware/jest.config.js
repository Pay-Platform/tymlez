const esModules = ['p-limit', 'p-retry', 'yocto-queue'].join('|');

module.exports = {
  globalSetup: '../../jest.global-setup.js',
  collectCoverage: true,
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(js|ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [`node_modules/(?!${esModules})`],
  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: {
        warnOnly: true,
        ignoreCodes: [7006],
      },
    },
  },
  moduleNameMapper: {
    '@tymlez/common-libs': '<rootDir>../../packages/common-libs/src',
  },
};
