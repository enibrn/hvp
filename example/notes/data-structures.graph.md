---
title: Graph
id: 9kq2xjhwjv1k32kxc2p41v8
created: 1728246985137
updated: 1728246986137
---

A **Graph** is a collection of nodes (vertices) and edges connecting pairs of nodes. Graphs can be directed or undirected, weighted or unweighted, and may contain cycles.

## Types of Graphs

- **Directed Graph (Digraph):** Edges have a direction.
- **Undirected Graph:** Edges do not have a direction.
- **Weighted Graph:** Edges have associated weights.
- **Unweighted Graph:** All edges are equal.

## Representation

- **Adjacency List:** Each node stores a list of connected nodes.
- **Adjacency Matrix:** A 2D matrix indicates edge presence/weight.

## Applications

- Social networks
- Web page linking (PageRank)
- Network routing
- Scheduling and dependency resolution

## Example

Adjacency list for a simple undirected graph:

```
A: B, C
B: A, D
C: A, D
D: B, C
```
