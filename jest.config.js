/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Keep using the tsconfig.json
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // This tells Jest to resolve '@' to the 'src' folder
  },
};