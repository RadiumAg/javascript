import { beforeEach } from '@jest/globals';

// Mock environment variables
process.env.NODE_ENV = 'test';

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});