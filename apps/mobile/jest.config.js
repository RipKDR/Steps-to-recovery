module.exports = {
  // No preset - custom minimal configuration
  testEnvironment: 'node',

  // Setup files
  setupFiles: ['<rootDir>/src/test-utils/setup-jest.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/setup.ts'],

  // Transform TypeScript and JavaScript files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        '@babel/preset-react',
      ],
    }],
  },

  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@supabase)/)',
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

  // Coverage thresholds - 75% global (temporarily lowered)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
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
