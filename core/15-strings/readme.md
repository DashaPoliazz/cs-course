# Strings

## Table of contents

- [Knuth–Morris–Pratt algorithm](#knuthmorrispratt-algorithm)
- [Trie](#trie)
- [Pattern matcher](#pattern-matcher)
- [Aho-Corasick algorithm](#aho-corasick-algorithm)

# Knuth–Morris–Pratt algorithm

The Knuth-Morris-Pratt (KMP) algorithm is a string-searching algorithm that searches for occurrences of a "pattern" string within a "text" string by employing the observation that when a mismatch occurs, the pattern itself embodies sufficient information to determine where the next match could begin, thus bypassing re-examination of previously matched characters.

## How it Works

1. **Preprocessing (Prefix Function):**
   The KMP algorithm preprocesses the pattern to create a "longest proper prefix which is also a suffix" (LPS) array. The LPS array is used to skip characters in the text while matching.

2. **Pattern Matching:**
   Using the LPS array, the algorithm scans the text from left to right. When a mismatch occurs, the LPS array indicates the next positions to check in the pattern, thereby avoiding unnecessary comparisons.

## Steps

1. **Build the LPS Array:**

   - The LPS array is constructed for the pattern. For each position in the pattern, the LPS array stores the length of the longest proper prefix that matches a proper suffix.

2. **Search the Text:**
   - The text is scanned from left to right. For each character in the text, the corresponding character in the pattern is compared.
   - If a mismatch occurs, the LPS array is consulted to determine the next positions to compare in the pattern, skipping unnecessary comparisons.

## Time Complexity

- **Preprocessing Time:** O(m)
  - Constructing the LPS array takes linear time relative to the length of the pattern.
- **Matching Time:** O(n)
  - The search process also takes linear time relative to the length of the text.

Overall, the KMP algorithm operates in O(n + m) time complexity, where n is the length of the text and m is the length of the pattern.

## Space Complexity

- **Space Complexity:** O(m)
  - The extra space used by the algorithm is mainly for the LPS array, which is proportional to the length of the pattern.

In summary, the KMP algorithm is efficient for string searching with both its time and space complexity being linear in terms of the lengths of the text and the pattern, making it suitable for large text and pattern matching problems.

# Trie

There is 2 tries in the repo: 'char' trie and 'word' trie. In the following description we will be talk about first one.

A Trie, also known as a prefix tree or digital tree, is a tree-like data structure that stores a dynamic set of strings, usually for efficient retrieval. Unlike a binary search tree, no node in the tree stores the key associated with that node; instead, its position in the tree defines the key with which it is associated.

## How it Works

1. **Structure:**

   - Each node in the Trie represents a single character of a string.
   - The root node is associated with an empty string.
   - Each path down the tree may represent a word or a prefix of a word.
   - The links on the children is representes as an array (you have to provide the alphabet. By default I'm using small latin letters)

2. **Operations:**

   - **Insert:**
     - Start from the root and insert characters of the key one by one.
     - If a character is already present, move to the next node.
     - If not, create a new node and move to the next node.
     - Mark the end of the word by a special flag 'term' in the last node.
   - **Includes:**
     - Start from the root and search characters of the key one by one.
     - If a character is present, move to the next node.
     - If not, the key is not present in the Trie.
     - If all characters are found, return true if the end of the word flag is set.
   - **Includes:**
     - Provides you ability to move around char by char with 'Box' functor

   ```
     go(char) {
    	const Box = (node) => ({
      		go: (char) => {
        		const [_, charPosition] = this.#charPosition(char);
        		const boxedNode =
          node.children[charPosition] === -1
            ? this.#createNode()
            : node.children[charPosition];
        return Box(boxedNode);
      },
      isWord: node.term,
    });

    return Box(this.root).go(char);
   }
   ```

## Time Complexity

- **Insertion Time:** O(m)
  - Inserting a word of length m into the Trie takes O(m) time.
- **Search Time:** O(m)
  - Searching for a word of length m in the Trie takes O(m) time.

## Space Complexity

- **Space Complexity:** O(N \* M)
  - N is the number of keys (words) and M is the average length of the keys.
  - Each node in the Trie may have up to 26 children (for lowercase English letters), but in practice, the space usage depends on the input set of keys and their shared prefixes.

In summary, a Trie is an efficient data structure for searching and inserting strings, with linear time complexity relative to the length of the strings. Its space complexity can be significant depending on the number of strings and their lengths, but it provides substantial benefits for problems involving prefix matching and word retrieval.

# Pattern matcher

## Overview

This project implements a pattern matching algorithm using a Trie data structure. It allows for efficient insertion and searching of patterns with support for wildcard characters.

## Patterns

- `*` (Wildcard Pattern): Matches any single level in the Trie.
- `**` (Double Wildcard Pattern): Matches any sequence of levels in the Trie.

## Example of usages

We can read this pattern as "read all mathes before 'baz'"

```
const pattern = "*.baz";
match(pattern, ["foo.bla.bar.baz"]); // -> ["foo", "bla", "bar", "baz"]
```

We can read this pattern as "read all mathes after 'foo'"

```
const pattern = "foo.**";
match(pattern, ["foo.bar.bla"]); // -> ["foo", "bar", "bla"]
```

We can read this pattern as "read all mathes after 'foo'"

```
const pattern = "foo.*.baz.baf.**";
match(pattern, ["foo.bar.baz.fiz.fuz.baf.fab"]); // -> [ 'foo', 'bar', 'baz', 'baf', 'fab' ]
```

# Aho-Corasick algorithm

Unimplemented yet.
