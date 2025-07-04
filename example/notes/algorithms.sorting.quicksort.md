---
title: Quicksort
id: 4rf6ljhwjv1k32kxc2p41vb
created: 1728246991137
updated: 1728246992137
---

**Quicksort** is a fast, divide-and-conquer sorting algorithm. It works by selecting a 'pivot' element and partitioning the array into two sub-arrays: elements less than the pivot and elements greater than the pivot, then recursively sorting the sub-arrays.

## Steps

1. Choose a pivot element from the array.
2. Partition the array so that elements less than the pivot are on the left, greater on the right.
3. Recursively apply the above steps to the sub-arrays.

## Example

Given `[3, 6, 8, 10, 1, 2, 1]`:

- Choose pivot: `1`
- Partition: `[1, 1] [2, 3, 6, 8, 10]`
- Recursively sort sub-arrays.

## Complexity

- **Average case:** O(n log n)
- **Worst case:** O(n²) (rare, with poor pivot choices)
- **Space:** O(log n) (in-place, but recursion stack)

## Applications

- General-purpose sorting
- Often used in standard libraries
