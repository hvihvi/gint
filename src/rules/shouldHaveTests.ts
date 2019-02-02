import minimatch = require("minimatch");
import git from "../git";
import { ShouldHaveTestsConfig } from "../types/Config";
import { toLevel } from "../types/Level";
import { Rule } from "../types/Rule";

const name = "shouldHaveTests";

// Visible for testing
export const countMatchingFiles = (filenames: string[], pattern: string) => {
  return filenames.filter(filename => minimatch(filename, pattern)).length;
};

const hasModifiedTests = (filenames: string[], test: string) =>
  countMatchingFiles(filenames, test) > 0;

const hasModifiedFiles = (filenames: string[], subject: string) =>
  countMatchingFiles(filenames, subject) > 0;

const hasMissingTests = (filenames: string[], config: ShouldHaveTestsConfig) =>
  hasModifiedFiles(filenames, config.test) &&
  !hasModifiedTests(filenames, config.subject);

// Visible for testing
export const hasSkipTag = (message: string, skipTags: string[]): boolean =>
  skipTags.some(tag => message.includes(tag));

const apply = async (config: ShouldHaveTestsConfig, commit: string) => {
  const filenames = await git.getCommitFiles(commit);
  const message = await git.getCommitMessage(commit);
  if (
    !hasSkipTag(message, config.skipTags) &&
    hasMissingTests(filenames, config)
  ) {
    return {
      pass: false,
      message: {
        content: `You modified source files without modifying a test. Is a test missing? ಠ_ರೃ
        Note: Tag your commit message with [${
          config.skipTags
        }] to bypass this rule`,
        level: toLevel(config.level),
        commit
      }
    };
  } else {
    return { pass: true };
  }
};

const rule: Rule = { name, apply };

export default rule;
