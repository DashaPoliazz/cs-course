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
