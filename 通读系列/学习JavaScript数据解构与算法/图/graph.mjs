import { Queue } from '../队列和双端队列/index.mjs';
import { Stack } from '../栈/index.mjs';

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

  console.log(color);

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

// 广度遍历优先算法
const breadthFirstSearch = (graph, startVertex, callback) => {
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices); // {1}

  const queue = new Queue(); // {2}

  queue.enqueue(startVertex); // {3}

  while (!queue.isEmpty()) {
    // {4}
    const u = queue.denqueue(); // {5}
    const neighbors = adjList.get(u); // {6}

    color[u] = Colors.GREY; // {7}

    for (const neighbor of neighbors) {
      // {8}
      if (color[neighbor] === Colors.WHITE) {
        color[neighbor] = Colors.GREY;
        queue.enqueue(neighbor);
      }
    }

    color[u] = Colors.BLACK;
    callback && callback(u);
  }
};

// 使用BFS寻找最短路径
const BFS = (graph, startVertex) => {
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices);
  const queue = new Queue();
  const distances = {};
  const predecessors = {};
  queue.enqueue(startVertex);

  for (const vertex of vertices) {
    distances[vertex] = 0;
    predecessors[vertex] = null;
  }
  const fromVertex = vertices[0];

  while (!queue.isEmpty()) {
    const u = queue.denqueue();
    const neighbors = adjList.get(u);
    color[u] = Colors.GREY;

    for (const neighbor of neighbors) {
      if (color[neighbor] === Colors.WHITE) {
        color[neighbor] = Colors.GREY;
        distances[neighbor] = distances[u] + 1;
        predecessors[neighbor] = u;
        queue.enqueue(neighbor);
      }
    }
    color[u] = Colors.BLACK;
  }

  return {
    distances,
    predecessors,
  };
};

// 深度优先算法
const depthFirstSearch = (graph, callback) => {
  // {1]}
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices);
  console.log('深度遍历');
  console.log(vertices);

  for (const vertex of vertices) {
    if (color[vertex] === Colors.WHITE) {
      depthFirstSearchVisit(vertex, color, adjList, callback);
    }
  }
};

const depthFirstSearchVisit = (u, color, adjList, callback) => {
  color[u] = Colors.GREY; // {5}
  if (callback) {
    // {6}
    callback(u);
  }

  const neighbors = adjList.get(u);
  // {7}

  for (const w of neighbors) {
    // {8}
    if (color[w] === Colors.WHITE) {
      depthFirstSearchVisit(w, color, adjList, callback);
    }
  }

  color[u] = Colors.BLACK;
};

const DFS = graph => {
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices);

  const d = {};
  const f = {};
  const p = {};

  const time = { count: 0 };

  for (const vertex of vertices) {
    f[vertex] = 0;
    d[vertex] = 0;
    p[vertex] = null;
  }

  for (const vertex of vertices) {
    if (color[vertex] === Colors.WHITE) {
      DFSVisit(vertex, color, d, f, p, time, adjList);
    }
  }

  return {
    discovery: d,
    finished: f,
    predecessors: p,
  };
};

const DFSVisit = (u, color, d, f, p, time, adjList) => {
  color[u] = Colors.GREY;
  d[u] = ++time.count;
  const neighbors = adjList.get(u);

  for (const neighbor of neighbors) {
    if (color[neighbor] === Colors.WHITE) {
      p[neighbor] = u;
      DFSVisit(neighbor, color, d, f, p, time, adjList);
    }
  }
  color[u] = Colors.BLACK;
  f[u] = ++time.count;
};

// Dijkstra算法
const INF = Number.MAX_SAFE_INTEGER;

const dijkstra = (graph, src) => {
  const dist = [];
  const visited = [];
  const { length } = graph;

  for (let i = 0; i < length; i++) {
    dist[i] = INF;
    visited[i] = false;
  }

  dist[src] = 0;

  for (let i = 0; i < length - 1; i++) {
    const u = minDistance(dist, visited);
    visited[u] = true;

    for (let v = 0; v < length; v++) {
      if (
        !visited[v] &&
        graph[u][v] === 0 &&
        dist[u] !== INF &&
        dist[u] + graph[u][v] < dist[v]
      ) {
        dist[v] = dist[u] + graph[u][v];
      }
    }
  }

  return dist;
};

// Floyd-Warshall算法
const floydWarshall = graph => {
  const dist = [];
  const { length } = graph;

  for (let i = 0; i < length; i++) {
    dist[i] = [];

    for (let j = 0; j < length; j++) {
      if (i === j) {
        dist[i][j] = 0;
      } else if (Number.isFinite(graph[i][j])) {
        dist[i][j] = Number.POSITIVE_INFINITY;
      } else {
        dist[i][j] = graph[i][j];
      }
    }
  }

  for (let k = 0; k < length; i++) {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  return dist;
};

const minDistance = (dist, visited) => {
  let min = INF;
  let minIndex = -1;
  for (const [v, element] of dist.entries()) {
    if (visited[v] === false && element <= min) {
      min = element;
      minIndex = v;
    }
  }

  return minIndex;
};

() => {
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

  breadthFirstSearch(graph, 'A', value => {
    console.log(`Visited vertex：${value}`);
  });

  const shortestPathA = BFS(graph, myVertices[0]);
  const fromVertex = myVertices[0];
  depthFirstSearch(graph, value => {
    console.log(`Visited vertex：${value}`);
  });

  DFS(graph);

  for (let i = 1; i < myVertices.length; i++) {
    const toVertex = myVertices[i];
    const path = new Stack();
    for (
      let v = toVertex;
      v !== fromVertex;
      v = shortestPathA.predecessors[v]
    ) {
      path.push(v);
    }
    path.push(fromVertex);
    let s = path.pop();
    while (!path.isEmpty()) {
      s += ` - ${path.pop()}`;
    }
    console.log(s);
  }
};

() => {
  const graph = new Graph();
  const myVertices = ['A', 'B', 'C', 'D', 'E', 'F'];

  for (const myVertex of myVertices) {
    graph.addVertex(myVertex);
  }
  graph.addEdge('A', 'C');
  graph.addEdge('A', 'D');
  graph.addEdge('B', 'D');
  graph.addEdge('B', 'E');
  graph.addEdge('C', 'F');
  graph.addEdge('F', 'E');

  const result = DFS(graph);

  const fTimes = result.finished;
  let s = '';
  for (let count = 0; count < myVertices.length; count++) {
    let max = 0;
    let maxName = null;

    for (const myVertex of myVertices) {
      if (fTimes[myVertex] > max) {
        max = fTimes[myVertex];
        maxName = myVertex;
      }
    }
    s += ` - ${maxName}`;
    delete fTimes[maxName];
  }
  console.log(s);
};

// Prim算法
const prim = graph => {
  const parent = [];
  const key = [];
  const visited = [];
  const { length } = graph;

  for (let i = 0; i < length; i++) {
    key[i] - INF;
    visited[i] = false;
  }

  key[0] = 0;
};

(() => {
  const graph = [
    [0, 2, 4, 0, 0, 0],
    [0, 0, 1, 4, 2, 0],
    [0, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 2],
    [0, 0, 0, 3, 0, 2],
    [0, 0, 0, 0, 0, 0],
  ];

  console.log(dijkstra(graph, 0));
})();
