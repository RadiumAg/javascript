import { Queue } from '../队列和双端队列/index.mjs';

const Colors = {
  WHITE: 0,
  GREY: 1,
  BLACK: 2,
};

const initializeColor = vertices => {
  const color = {};
  for (const vertex of vertices) {
    color[vertex] = Colors.WHITE;
  }

  return color;
};

class Graph {
  constructor(isDirected = false) {
    this.isDirected = isDirected;
    this.vertices = []; //{2} 存储图中所有顶点的名字
    this.adjList = new Map(); //{3} 存储邻接表
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

  toString() {
    let s = '';
    for (let i = 0; i < this.vertices.length; i++) {
      // {15}
      s += `${this.vertices[i]} ->`;
      const neighbors = this.adjList.get(this.vertices[i]); // {16}

      for (const neighbor of neighbors) {
        // {17}
        s += `${neighbor}`;
      }

      s += '\n'; // {18}
    }

    return s;
  }
}

const breadthFirstSearch = (graph, startVertex, callback) => {
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices); // {1}

  const queue = new Queue();

  queue.enqueue(startVertex);

  while (!queue.isEmpty()) {
    const u = queue.denqueue();
    const neighbors = adjList.get(u);

    color[u] = Colors.GREY;

    for (const neighbor of neighbors) {
      if (color[neighbor] === Colors.WHITE) {
        color[neighbor] = Colors.GREY;
        queue.enqueue(neighbor);
      }
    }

    color[u] = Colors.BLACK;
    callback && callback(u);
  }
};

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

  console.log(graph.toString());
  breadthFirstSearch(graph, 0);
})();
