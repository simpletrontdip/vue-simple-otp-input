module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  coverageDirectory: "<rootDir>/tests/coverage",
  coverageReporters: ["json-summary", "text-summary", "lcov"],
};
