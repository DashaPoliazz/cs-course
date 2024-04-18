const Graph = require("./Graph.js");

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
