const Trie = require("./trie/wordTrie/wordTrie.js");

// All matches BEFORE the next pattern
const WILDCARD_PATTERN = "*";
// All matches AFTER pattern
const DOUBLE_WILDCARD_PATTERN = "**";

/**
 * Check for unreachable patterns in the delimiters.
 *
 * Unreachable patterns:
 * "*.**",
 * "**.*",
 * "**.pattern"
 *
 * @param {string} curr - The current delimiter.
 * @param {string} next - The next delimiter.
 * @returns {boolean} - Returns true if the pattern is unreachable, otherwise false.
 */
function unreachablePattern(curr, next) {
  // unreacheble patterns
  const wildcards = [WILDCARD_PATTERN, DOUBLE_WILDCARD_PATTERN];
  if (wildcards.includes(curr) && wildcards.includes(next)) return true;
  if (curr === DOUBLE_WILDCARD_PATTERN && next) return true;
}

/**
 * Find a node in the trie.
 * @param {Node} haystack - The node to start searching from.
 * @param {string} needle - The key to find.
 * @returns {Node|null} - Returns the found node, or null if not found.
 * @timecomplexity O(n) where n is the number of all nodes in tree
 * @spacecomplexity O(n) where n is the number of all nodes in tree
 */
function find(haystack, needle) {
  if (haystack.children.has(needle)) return haystack.children.get(needle);
  for (const value of haystack.children.values()) {
    const founded = find(value, needle);
    if (founded) return founded;
  }
}

/**
 * Slice branches in the trie between start and end nodes.
 * @param {Trie} trie - The trie to slice branches from.
 * @param {string|null} start - The starting key.
 * @param {string|null} end - The ending key.
 * @returns {Array<string>} - Returns an array of keys representing the path.
 * @timecomplexity O(n) where n is the number of all nodes in tree
 * @spacecomplexity O(n) where n is the number of all nodes in tree
 */
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

/**
 * Match keys in the trie with the given pattern.
 * @param {string} pattern - The pattern to match.
 * @param {Array<string>} keys - The keys to insert into the trie.
 * @returns {Array<string>} - Returns an array of matched keys.
 * @timecomplexity O(m * n)  where m is the length of the pattern and n is the number of keys.
 * @spacecomplexity O(n) where n is the number of all nodes in tree
 */
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

    if (unreachablePattern(curr, next)) throw new Error("Unreachable pattern");

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
