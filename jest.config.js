
module.exports = {
  projects: [
    {
      displayName: "backend",
      testEnvironment: "node",
      testMatch: ["<rootDir>/backend/tests/**/*.test.js"],
      coverageDirectory: "<rootDir>/backend/coverage",
      coverageReporters: ["text", "lcov", "html"],
      transform: {
        "^.+\\.jsx?$": "babel-jest"
      },
      reporters: [
        "default",
        ["jest-html-reporter", {
          "outputPath": "<rootDir>/backend/coverage/backend-test-report.html",
          "pageTitle": "Backend Test Report",
          "includeFailureMsg": true,
          "includeConsoleLog": true
        }]
      ]
    },
    {
      displayName: "frontend",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/frontend/src/__tests__/**/*.test.js"],
      coverageDirectory: "<rootDir>/frontend/coverage",
      coverageReporters: ["text", "lcov", "html"],
      transform: {
        "^.+\\.jsx?$": "babel-jest"
      },
      reporters: [
        "default",
        ["jest-html-reporter", {
          "outputPath": "<rootDir>/frontend/coverage/frontend-test-report.html",
          "pageTitle": "Frontend Test Report",
          "includeFailureMsg": true,
          "includeConsoleLog": true
        }]
      ]
    }
  ]
};
