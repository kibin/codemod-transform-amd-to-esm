export default {
  testRegex: '/__tests__/.*?\\.spec\\.m?js$',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.m?js$': 'babel-jest',
  },
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  moduleFileExtensions: ['js', 'jsx', 'mjs']
}