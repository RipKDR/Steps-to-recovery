import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
    {
        ignores: [
            'node_modules/**',
            '.expo/**',
            '.turbo/**',
            'coverage/**',
            'android/**',
            'ios/**',
            '**/*.config.js',
            '**/*.config.ts',
            'babel.config.js',
            'metro.config.js',
            'jest.config.js',
            'jest.setup.js',
            'polyfills.cjs',
            'polyfills.ts',
        ],
    },
    {
        files: ['src/**/*.{ts,tsx}', 'App.tsx'],
        languageOptions: {
            parser: tsparser,
            ecmaVersion: 2021,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            // Enforce no console.log (use logger instead per CLAUDE.md)
            'no-console': ['error', { allow: ['warn', 'error'] }],

            // Enforce no 'any' types (CLAUDE.md requirement)
            '@typescript-eslint/no-explicit-any': 'warn',

            // General code quality
            'prefer-const': 'error',
            'no-var': 'error',
            'no-unused-vars': 'off', // Use TypeScript version
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
];
