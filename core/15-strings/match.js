const Trie = require("./trie/wordTrie/wordTrie.js");

// All matches BEFORE the next pattern
const WILDCARD_PATTERN = "*";
// All matches AFTER pattern
const DOUBLE_WILDCARD_PATTERN = "**";

function unreacheblePattern(curr, next) {
  // unreacheble patterns
  const wildcards = [WILDCARD_PATTERN, DOUBLE_WILDCARD_PATTERN];
  if (wildcards.includes(curr) && wildcards.includes(next)) return true;
  if (curr === DOUBLE_WILDCARD_PATTERN && next) return true;
}

function find(haystack, needle) {
  if (haystack.children.has(needle)) return haystack.children.get(needle);
  for (const value of haystack.children.values()) {
    const founded = find(value, needle);
    if (founded) return founded;
  }
}

function sliceBranches(trie, start, end) {
  const stackTrace = [];
  let out = [];
  // "*.bar"
  const startNode = start ? find(trie.root, start) : trie.root;

  const dfs = (node) => {
    if (!end && node.children.size === 0) return true;
    if (node.children.has(end)) return true;

    for (const [key, value] of node.children.entries()) {
      stackTrace.push(key);
      if (dfs(value)) out = stackTrace.slice();
      stackTrace.pop();
    }
  };

  dfs(startNode);

  return out;
}

function match(pattern, keys) {
  const splitter = ".";
  const delimiters = pattern.split(splitter);

  const trie = new Trie(splitter);
  for (const key of keys) trie.insert(key);

  const result = [];

  for (let i = 0; i < delimiters.length; i++) {
    const prev = delimiters[i - 1];
    const curr = delimiters[i];
    const next = delimiters[i + 1];

    if (unreacheblePattern(curr, next)) throw new Error("Unreachable pattern");

    if (curr === WILDCARD_PATTERN) {
      // "*.next"
      if (!prev) result.push(sliceBranches(trie, null, next));
      // "prev.*.next"
      else result.push(sliceBranches(trie, prev, next));
    } else if (curr === DOUBLE_WILDCARD_PATTERN) {
      result.push(sliceBranches(trie, prev));
    } else {
      result.push(curr);
    }
  }

  return result.flat();
}

module.exports = match;
