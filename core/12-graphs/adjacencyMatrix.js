const Matrix = require("../07-matrix/matrix.js");

class Graph {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.adjacencyMatrix = new Matrix(Uint8Array, x, y);
  }

  // Checks adjacency between two vertexes
  // T -> O(1)
  // S -> O(1)
  checkAdjacency(v1, v2) {
    return this.adjacencyMatrix.get(v1, v2);
  }

  // *Only for UNDIRECTED graph & MIXED graph
  // Creates new edge between two vertexes
  // T -> O(1)
  // S -> O(1)
  createEdge(v1, v2, weight = 0) {
    this.adjacencyMatrix.set(v1, v2, weight);
    this.adjacencyMatrix.set(v2, v1, weight);
    return true;
  }

  // *Only for UNDIRECTED graph
  // Removes edge between two vertexes
  // T -> O(1)
  // S -> O(1)
  removeEdge(v1, v2) {
    this.adjacencyMatrix.set(v1, v2, 0);
    this.adjacencyMatrix.set(v2, v1, 0);
    return true;
  }

  // *Only for DIRECTED graph & MIXES graph
  // Creates new edge between two vertexes
  // T -> O(1)
  // S -> O(1)
  createArc(from, to, weight = 0) {
    this.adjacencyMatrix.set(from, to, weight);
    return true;
  }

  // *Only for DIRECTED graph & MIXES graph
  // Creates new edge between two vertexes
  // T -> O(1)
  // S -> O(1)
  removeArc(from, to) {
    this.adjacencyMatrix.set(from, to, 0);
    return true;
  }

  // T -> O(V + E)
  // S -> O(V)
  bfs(startVertex) {
    const q = [startVertex];
    const out = [];
    const seen = new Set();

    while (q.length) {
      const len = q.length;
      for (let i = 0; i < len; i++) {
        const x = q.shift();
        for (let y = 0; y < this.y; y++) {
          const weight = this.checkAdjacency(x, y);
          if (weight) console.log("weight:", weight, y);
          if (!weight || seen.has(x)) continue;
          q.push(y);
          out.push(`${x} -> ${y} = ${weight}`);
        }
        seen.add(x);
      }
    }

    return out;
  }

  // T -> O(V + E)
  // S -> O(V)
  dfs(startVertex) {
    const seen = new Set();
    const out = [];

    const dfs = (x) => {
      // 1. Already seen it
      if (seen.has(x)) return;

      // Mark vertext as seen
      seen.add(x);

      for (let y = 0; y < this.y; y++) {
        const weight = this.checkAdjacency(x, y);
        if (!weight) continue;
        out.push(`${x} -> ${y} = ${weight}`);
        dfs(y);
      }
    };

    dfs(startVertex);

    return out;
  }
}

class DirectedGraph extends Graph {
  constructor(adjacencyMatrix) {
    super(adjacencyMatrix);
  }

  createEdge(v1, v2, weight = 0) {
    throw new Error("Directed graph does not support 'edge' operations");
  }
  removeEdge(v1, v2, weight = 0) {
    throw new Error("Directed graph does not support 'edge' operations");
  }
}

class UndirectedGraph extends Graph {
  constructor(adjacencyMatrix) {
    super(adjacencyMatrix);
  }

  createArc(v1, v2, weight = 0) {
    throw new Error("Undirected graph does not support 'arc' operations");
  }
  removeArc(v1, v2, weight = 0) {
    throw new Error("Undirected graph does not support 'arc' operations");
  }
}

{
  // Mixed graph
  //     >(1)<--->(4) ---->(5)
  //    /          |       /|
  // (0)     ------|------- |
  //    \   v      v        v
  //     >(2) --> (3) <----(6)

  const graph = new Graph(7, 7);

  // Creating relationships in "top-right-bottom-left" sequence
  graph.createArc(0, 1, 1);
  graph.createEdge(1, 4, 2);
  graph.createArc(4, 5, 3);
  graph.createArc(5, 6, 4);
  graph.createArc(6, 3, 5);
  graph.createArc(2, 3, 6);
  graph.createArc(0, 2, 7);
  // Diagonal
  graph.createArc(5, 2, 8);

  console.log(graph.checkAdjacency(0, 1)); // 1
  console.log(graph.checkAdjacency(1, 4)); // 2
  console.log(graph.checkAdjacency(4, 5)); // 3
  console.log(graph.checkAdjacency(5, 6)); // 4
  console.log(graph.checkAdjacency(6, 3)); // 5
  console.log(graph.checkAdjacency(2, 3)); // 6
  console.log(graph.checkAdjacency(0, 2)); // 7
  console.log(graph.checkAdjacency(5, 2)); // 8

  // BFS:
  const bfs = graph.bfs(0);
  console.log("bfs:", bfs);

  // DFS:
  const dfs = graph.dfs(0);
  console.log(dfs);
}
