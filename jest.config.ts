import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/__tests__/test.d.ts'],
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        diagnostics: false,
      },
    ],
  },
};

export default config;
