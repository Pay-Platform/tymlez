const config = require('./jest.config');

module.exports = {
  ...config,
  roots: ['<rootDir>/e2e'],
  testMatch: ['**/*.e2e-(spec|test).+(ts|tsx|js)'],
};
