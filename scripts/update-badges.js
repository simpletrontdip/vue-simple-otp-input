#!/usr/bin/env node

const fs = require("fs");
const mkdirp = require("mkdirp");

const fsPromise = fs.promises;

const getColor = (coverage) => {
  if (coverage < 80) {
    return "red";
  }
  if (coverage < 90) {
    return "yellow";
  }
  return "brightgreen";
};

const getBadgeData = (key, coverage) => ({
  schemaVersion: 1,
  label: key,
  message: `${coverage}%`,
  color: getColor(coverage),
});

const writeBadgeFile = (key, data) => {
  console.log("Writing badge for", key);
  return fsPromise.writeFile(`${outputPath}/${key}.json`, JSON.stringify(data));
};

const main = async (summaryPath, outputPath) => {
  const reportKeys = ["lines", "functions", "branches", "statements"];
  const summary = await fsPromise.readFile(summaryPath).then(JSON.parse);

  console.log("Creating output dir");
  await mkdirp(outputPath);

  const promises = reportKeys.map((key) => {
    const coverage = summary.total[key].pct;
    const data = getBadgeData(key, coverage);

    return writeBadgeFile(key, data);
  });

  await Promise.all(promises);
};

const summaryPath = process.argv[2] || "tests/coverage/coverage-summary.json";
const outputPath = process.argv[3] || "tests/coverage/badges";

console.log("Processing with summary", summaryPath, "output", outputPath);
main(summaryPath, outputPath);
