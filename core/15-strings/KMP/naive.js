/**
 * Naive implementation of searching string in substring
 * T -> O(n * m)
 * S -> O(1)
 *
 * @param {string} haystack
 * @param {string} needle
 * @returns {number}
 */
function naiveSubstringSearch(haystack, needle) {
  for (let i = 0; i < haystack.length; i++) {
    let k = i;
    let j = 0;
    inner: for (; j < needle.length; k++, j++) {
      if (haystack[k] !== needle[j]) break inner;
    }
    if (j > needle.length - 1) return i;
  }
  return -1;
}

module.exports = naiveSubstringSearch;
