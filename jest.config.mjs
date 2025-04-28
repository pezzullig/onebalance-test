export default {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js'], // Use setupFiles to run setup before env
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // Use ts-jest for TypeScript files, configured for ESM
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
    }],
  },
  // Specify extensions Jest should treat as ES modules
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  // Ensure Jest recognizes all necessary file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}; 