import git from "../git";
import { RuleConfig } from "../types/Config";
import { FAIL, PASS, Rule } from "../types/Rule";

const name = "shouldHaveSeparatorLine";

// Visible for testing
export const hasNoSeparatorLine = (msg: string) => {
  const lines = msg.split("\n");
  return lines.length > 1 && lines[1] !== "";
};

const apply = async (config: RuleConfig, commit: string) => {
  const msg = await git.getCommitMessage(commit);
  if (hasNoSeparatorLine(msg)) {
    return FAIL(
      `Commit message should have a separator line between header and body`
    );
  }
  return PASS;
};

const rule: Rule = { name, apply };

export default rule;
