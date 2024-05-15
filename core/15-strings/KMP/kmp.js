/**
 *	Returns 'true' if the pattern is in the haystack, otherwise 'false'
 *
 * T -> O(m + n)
 * S -> O(n)
 *
 * where m - haystack, n - pattern
 *
 * @param {string} haystack - String to search within
 * @param {string} needle - Pattern to search for
 * @returns {boolean}
 */
function KMP(haystack, pattern) {
  const p = buildP(pattern);

  let i = 0;
  let j = 0;

  while (i < haystack.length) {
    if (haystack[i] === pattern[j]) {
      i++;
      j++;
      if (j === pattern.length) return true;
    } else {
      if (j > 0) j = p[j - 1];
      else i++;
    }
  }

  return false;
}

/**
 * Builds the prefix array (partial match table) for the given pattern.
 *
 * @param {string} pattern - The pattern string.
 * @returns {number[]} - Returns an array representing the prefix array.
 */
function buildP(pattern) {
  const p = new Array(pattern.length).fill(0);

  let i = 1;
  let j = 0;
  while (i < pattern.length) {
    if (pattern[i] === pattern[j]) {
      p[i] = j + 1;
      i++;
      j++;
    } else {
      if (j === 0) {
        p[i] = 0;
        i++;
      } else {
        j = p[j - 1];
      }
    }
  }

  return p;
}

module.exports = { KMP, buildP };
