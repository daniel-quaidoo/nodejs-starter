module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/test'],
    testMatch: [
        '**/test/**/*.test.ts',
        '**/test/**/*.test.tsx',
        '**/test/**/*.spec.ts',
        '**/test/**/*.spec.tsx',
        '**/__tests__/**/*.ts?(x)',
        '**/?(*.)+(spec|test).ts?(x)'
    ],
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json',
                useESM: false
            }
        ]
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: [
        'text',
        'lcov'
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/src/__tests__/'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/test/setup.ts'
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/src/__tests__/setup\\.ts$'
    ],
};
