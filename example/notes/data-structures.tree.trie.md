---
title: Trie
id: 2kq2xjhwjv1k32kxc2p41v7
created: 1728246983137
updated: 1728246984137
---

A **Trie** is a tree-like data structure that stores a dynamic set of strings, usually to support fast retrieval. Each node typically represents a single character of a key, and paths from the root to leaves represent words.

## Key Properties

- Each edge represents a character.
- Common prefixes are stored only once.
- Efficient for prefix-based searches (e.g., autocomplete).

## Example

Suppose you insert "cat", "car", and "dog":

```
        (root)
        /    \
      c       d
     /         \
    a           o
   / \           \
  t   r           g
```

## Use Cases

- Autocomplete systems
- Spell checkers
- IP routing (longest prefix match)
- Dictionary implementations

## Complexity

- Insert: O(L), where L is the length of the word
- Search: O(L)
- Space: Can be high for sparse datasets, but efficient for large sets with shared prefixes
