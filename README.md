#  Delay-Aware Route Planner

A graph-based route planning and algorithm analysis system that studies how shortest path algorithms behave under dynamic delay conditions.

---

#  Project Overview

This project models a road network as a graph where:

- Nodes represent junctions
- Edges represent roads
- Edge weights represent travel cost or time

The system dynamically simulates traffic delay by increasing edge weights and recomputes shortest paths using multiple algorithms.

---

#  Features

- Graph representation using adjacency list  
- Dynamic delay simulation  
- Real-time shortest path recalculation  
- Execution time comparison  
- Interactive web interface  
- Multiple shortest path algorithms  

---

#  Algorithms Implemented

## 1️. Dijkstra Algorithm
- Greedy approach
- Uses priority queue
- Fastest for non-negative weights

### Time Complexity
O((V + E) log V)

---

## 2️. Bellman-Ford Algorithm
- Repeated edge relaxation
- Supports negative weights
- Used for comparison and analysis

### Time Complexity
O(VE)

---

## 3️. A* Algorithm
- Heuristic-based search
- Optimized shortest path search
- Uses estimated distance to destination

### Time Complexity
Depends on heuristic quality

---

#  Comparison Parameters

The algorithms are compared based on:

- Path Selected
- Total Distance
- Execution Time

---

#  DAA Concepts Used

- Graphs
- Adjacency List
- Greedy Algorithms
- Dynamic Programming Style
- Heuristic Search
- Time Complexity Analysis

---

#  Technologies Used

## Frontend
- HTML
- CSS
- JavaScript

## Backend / DAA Logic
- C++

---

#  Future Scope

- Real-time traffic integration
- Emergency vehicle routing
- Map visualization
- Advanced heuristics
- Smart city applications

---

#  Team Members

| Name | Roll Number | Section |
|---|---|---|
| Abhinav Benjwal (Leader) | 2418119 | D1 |
| Anubhav Padiyar | 2418309 | F2 |
| Hariom Chamoli | 2418514 | F1 |

---

