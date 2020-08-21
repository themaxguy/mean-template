module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["dotenv/config"],
  moduleNameMapper: {
    '@controllers/(.*)': [
      '<rootDir>/src/controllers/$1'
    ],
    '@daos/(.*)': [
      '<rootDir>/src/daos/$1'
    ],
    '@db/(.*)': [
      '<rootDir>/src/db/$1'
    ],
    '@entities/(.*)': [
      '<rootDir>/src/entities/$1'
    ],
    '@shared/(.*)': [
      '<rootDir>/src/shared/$1'
    ],
    '@server': [
      '<rootDir>/src/Server.ts'
    ],
    '@services/(.*)': [
      '<rootDir>/src/services/$1'
    ]
  }
};