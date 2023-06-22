class Graph {
  constructor(isDirected = false) {
    this.isDirected = isDirected;
    this.vertices = []; //{2} 存储图中所有顶点的名字
    this.adjList = new Map();
  }

  addVertex(v) {
    if (!this.vertices.includes(v)) {
      // {5}
      this.vertices.push(v); // {6}
      this.adjList.set(v, []); // {7}
    }
  }

  addEdge(v, w) {
    if (!this.adjList.get(v)) {
      this.addVertex(v); // {8}
    }

    if (!this.adjList.get(w)) {
      this.addVertex(w); // {9}
    }

    this.adjList.get(v).push(w); // {10}

    if (!this.isDirected) {
      this.adjList.get(w).push(v); // {11}
    }
  }

  getVertices() {
    return this.vertices;
  }

  getAdjList() {
    return this.adjList;
  }
}

(() => {
  const graph = new Graph();

  const myVertices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  for (const myVertex of myVertices) {
    graph.addVertex(myVertex);
  }

  graph.addEdge('A', 'B'); // {14}
  graph.addEdge('A', 'C');
  graph.addEdge('A', 'D');
  graph.addEdge('C', 'D');
  graph.addEdge('C', 'G');
  graph.addEdge('D', 'G');
  graph.addEdge('D', 'H');
  graph.addEdge('B', 'E');
  graph.addEdge('B', 'F');
  graph.addEdge('E', 'I');

  console.log(graph);
})();
