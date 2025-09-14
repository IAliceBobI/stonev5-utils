import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  verbose: false,
  collectCoverageFrom: [],
  coverageReporters: [],
};

export default config;