'use strict';
// 表示顶点

function Vertex(label) {
    this.label = label;
}

function addEdge(v, w) {
    this.adj[v].push(w);
    this.adj[w].push(v);
    this.edges++;
}

function showGraph() {
    for (var i = 0; i < this.vertices; ++i) {
        console.log(i + "->");
        for (var j = 0; j < this.vertices; ++j) {
            if (this.adj[i][j] != undefined)
                console.log(this.adj[i][j] + '');
        }
    }
    console.log(this.adj);
}

function Graph(v) {
    this.vertices = v;
    this.edges = 0;
    this.adj = [];
    for (var i = 0; i < this.vertices; i++) {
        this.adj[i] = [];
        this.adj[i].push("");
    }
    console.log(this.adj);
    this.addEdge = addEdge;
    this.showGraph = showGraph;
}

 
var g = new Graph(5);
g.addEdge(0,1);
g.addEdge(0,2);
g.addEdge(1,3);
g.addEdge(2,4);
g.showGraph();

// 程序的输出结果为0 -> 1 2 1 -> 0 3 2 -> 0 4 3 -> 1 4 -> 2 
// 表示顶点0有到顶点1和顶点2的边
// 顶点1有到顶带你0和顶点3的边
// 顶点3有到顶点1的边
// 顶点4有到顶点的边


// 深度优先搜索



