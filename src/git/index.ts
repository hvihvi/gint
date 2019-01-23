import util from "./util";

const findCommonAncestor = async (branch1, branch2) => {
  return util.git(`merge-base ${branch1} ${branch2}`).then(sha1 => sha1.trim());
};

/**
 * Returns an array of strings, their value is the full sha1 of commits reachable from head not in base
 */
const listCommits = async (base, head) =>
  util
    .git(`rev-list ${base}..${head}`)
    .then(result => result.trim())
    .then(str => util.toLineArray(str));

const getCommitMessage = sha1 =>
  util.git(`show -s --format=%B ${sha1}`).then(msg => msg.trim());

const toShortHash = sha1 =>
  util.git(`rev-parse --short ${sha1}`).then(result => result.trim());

/**
 * Returns an array of strings, their value is the path to modified filenames in given commit
 */
const getCommitFiles = sha1 =>
  util
    .git(`diff-tree --no-commit-id --name-only -r ${sha1}`)
    .then(result => result.trim())
    .then(str => util.toLineArray(str));

/**
 * Returns a string containing the diff patch of the commit
 */
const getCommitDiff = sha1 =>
  util
    .git(`diff-tree -p ${sha1}`)
    .then(result => result.trim())
    .then(str => util.toLineArray(str));

/**
 * Returns wether the working directory is clean or not
 */
const isCleanWorkDir = async () => {
  const result = await util.git(`status --porcelain`);
  return util.toLineArray(result.trim()).length === 0;
};

/**
 * Lists all remote repositories
 */
const listRemotes = async () => {
  const remotes = await util.git(`remote`);
  return util.toLineArray(remotes.trim());
};

const canMerge = async (branch: string) => {
  await util.git(`merge --no-commit --no-ff ${branch}`);
  const conflicts = await util.git(`git ls-files -u`);
  await util.git(`merge --abort`);
  return util.toLineArray(conflicts.trim()).length === 0;
};

export default {
  findCommonAncestor,
  listCommits,
  getCommitMessage,
  toShortHash,
  getCommitFiles,
  getCommitDiff,
  isCleanWorkDir,
  listRemotes,
  canMerge
};