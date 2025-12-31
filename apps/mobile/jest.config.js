module.exports = {
  preset: 'jest-expo',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/setup.ts'],

  // Transform ignore patterns - ensure React Native modules are transformed
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@supabase/.*|@react-native-async-storage/.*|@tanstack/.*|zustand|crypto-js)',
  ],

  // Module name mapper for shared packages and assets
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@recovery/shared/(.*)$': '<rootDir>/../../packages/shared/src/$1',
    '^@recovery/shared$': '<rootDir>/../../packages/shared/src/index.ts',
    '^@repo/shared/(.*)$': '<rootDir>/../../packages/shared/src/$1',
    '^@repo/shared$': '<rootDir>/../../packages/shared/src/index.ts',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/test-utils/mocks/fileMock.ts',
  },

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/test-utils/**',
    '!src/types/**',
    '!src/**/index.ts',
    '!**/node_modules/**',
  ],

  // Coverage thresholds - 75% global
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
  ],

  // Coverage directory
  coverageDirectory: '<rootDir>/coverage',

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Test environment
  testEnvironment: 'node',

  // Globals
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
