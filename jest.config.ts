import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // 源码按 ESM 习惯写 .js 扩展名，jest(CJS) 需剥掉后缀才能解析到 .ts
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/*.test.ts'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  verbose: false,
  collectCoverageFrom: [],
  coverageReporters: [],
};

export default config;