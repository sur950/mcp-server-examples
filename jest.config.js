/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  testMatch: ["**/*.test.ts"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};
