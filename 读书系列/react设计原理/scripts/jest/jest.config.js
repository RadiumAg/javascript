const { defaults } = require('jest-config');

module.exports = {
  ...defaults,
  rootDir: process.cwd(),
  modulePathIgnorePatterns: ['<rootDir>/.history'],
  moduleDirectories: [...defaults.moduleDirectories, 'dist/node_modules'],
  testEnvironment: 'jsdom',
};
