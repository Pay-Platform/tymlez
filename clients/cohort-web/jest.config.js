const esModules = ['p-limit', 'yocto-queue'].join('|');

module.exports = {
  globalSetup: '../../jest.global-setup.js',
  collectCoverage: true,
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(js|ts|tsx)$': [
      'esbuild-jest',
      {
        sourcemap: true,
      },
    ],
  },
  transformIgnorePatterns: [`node_modules/(?!${esModules})`],
};
