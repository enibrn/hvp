---
title: Binary Search
id: 6rf6ljhwjv1k32kxc2p41vd
created: 1728246995137
updated: 1728246996137
---

**Binary Search** is an efficient algorithm for finding an item in a sorted array by repeatedly dividing the search interval in half.

## Steps

1. Compare the target value to the middle element.
2. If equal, return the index.
3. If less, repeat the search on the left half.
4. If greater, repeat on the right half.

## Example

Given `[1, 2, 3, 4, 5, 6, 7, 8, 9]`, search for `6`:

- Middle is `5` (index 4). 6 > 5, search right half.
- Middle is `7` (index 6). 6 < 7, search left half.
- Middle is `6` (index 5). Found.

## Complexity

- **Time:** O(log n)
- **Space:** O(1) (iterative), O(log n) (recursive)

## Applications

- Searching in sorted arrays/lists
- Database indexing
- Efficient lookups in dictionaries
