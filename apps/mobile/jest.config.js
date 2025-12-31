export default {
  testEnvironment: 'node',

  // Setup files
  setupFiles: ['<rootDir>/src/test-utils/setup-jest.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/setup.ts'],

  // Transform TypeScript and JavaScript files with Flow support for React Native
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-flow', { all: true, enums: true }], // Strip all Flow syntax
        '@babel/preset-react',
      ],
    }],
    '^.+\\.(ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-typescript', { allowNamespaces: true }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    }],
  },

  // Transform ignore patterns - transform React Native and Expo packages
  // Updated for monorepo structure where node_modules might be at root
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|expo|@expo|@supabase)/)',
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

  // Coverage thresholds
  // NOTE: This project is early-stage and most modules are not yet covered by tests.
  // Keep thresholds disabled (0) until test coverage improves, so `npm run test:coverage`
  // is useful locally without blocking.
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
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

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
