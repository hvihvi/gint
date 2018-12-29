const findProjectRoot = require("find-project-root");
const fs = require("fs");

const CONF_FILE_NAME = ".gintrc.json";

const loadConfig = defaultConfig => {
  const projectRoot = findProjectRoot(process.cwd());
  const loadedConfig = JSON.parse(
    fs.readFileSync(projectRoot + "/" + CONF_FILE_NAME, "utf8")
  );
  return { ...defaultConfig, ...loadedConfig };
};

const defaultConfig = {
  origin: "origin/master",
  shouldHaveTests: {
    enabled: true,
    level: "INFO",
    subject: "**/*.js",
    test: "**/*.test.js",
    untestedTag: "#untested"
  },
  shouldHaveFormattedMessage: {
    enabled: true,
    level: "INFO",
    charactersPerLine: 72
  },
  shouldHaveNoKeywordsInDiffs: {
    enabled: true,
    level: "INFO",
    keywords: ["TODO"]
  }
};

const config = loadConfig(defaultConfig);

module.exports = { config };
