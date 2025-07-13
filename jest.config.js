/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1', // map your alias @ to root folder
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  };
  