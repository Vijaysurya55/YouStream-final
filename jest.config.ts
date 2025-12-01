import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
   globals:{
    "ts-jest":{
      tsconfig:"tsconfig.app.json",
      diagnostics:false
    }
   },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.app.json" }]
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },

  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/main.tsx",
    
  ],
  coveragePathIgnorePatterns: [
  "/node_modules/",
  "src/api/googleAuth.ts",
],
};

export default config;