module.exports = {
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  collectCoverage: true,
  coveragePathIgnorePatterns: [".test.", ".d.ts$", "index.ts"],
  coverageReporters: ["lcov", "text-summary"],
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  setupFiles: ["./setup/enzyme.ts"],
  testRegex: "((\\.|/)test)\\.tsx?$",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
