const Graph = require("./Graph.js");

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
