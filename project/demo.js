kTopo.Env.init();

let canvas = new kTopo.ComputationalCanvas();
canvas.appendTo(document.body);

let selectMoveBtn = new kTopo.Button("Move", 75, 25, 100, 30, function() {
    canvas.editMode = kTopo.CanvasEditMode.Move;
});
canvas.add(selectMoveBtn);

let selectInsertVBtn = new kTopo.Button("Insert Vertex", 225, 25, 100, 30, function() {
    canvas.editMode = kTopo.CanvasEditMode.InsertVertex;
});
canvas.add(selectInsertVBtn);

let selectDeleteVBtn = new kTopo.Button("Delete Vertex", 225, 80, 100, 30, function() {
    canvas.editMode = kTopo.CanvasEditMode.DeleteVertex;
});
canvas.add(selectDeleteVBtn);

let selectInsertEBtn = new kTopo.Button("Insert Edge", 375, 25, 100, 30, function() {
    canvas.editMode = kTopo.CanvasEditMode.InsertEdge;
});
canvas.add(selectInsertEBtn);

let selectDeleteEBtn = new kTopo.Button("Delete Edge", 375, 80, 100, 30, function() {
    canvas.editMode = kTopo.CanvasEditMode.DeleteEdge;
});
canvas.add(selectDeleteEBtn);

let createRandomVerticesBtn = new kTopo.Button("50 Random Vertices", 550, 25, 150, 30, function() {
    canvas.generateRandomVertices(50);
});
canvas.add(createRandomVerticesBtn);

let createNIGraphBtn = new kTopo.Button("Non-intersect", 750, 25, 150, 30, function() {
    canvas.generateRandomGraph(50, 50, undefined, undefined, false);
});
canvas.add(createNIGraphBtn);

let createIGraphBtn = new kTopo.Button("Intersect", 750, 80, 150, 30, function() {
    canvas.generateRandomGraph(50, 50);
});
canvas.add(createIGraphBtn);

let createRWGraphBtn = new kTopo.Button("Random Weighted", 750, 135, 150, 30, function() {
    canvas.generateRandomWeightedGraph(50, 50);
});
canvas.add(createRWGraphBtn);

let ConvexHullBtn = new kTopo.Button("Convex Hull", 925, 25, 100, 30, function() {
    canvas.generateConvexHull();
});
canvas.add(ConvexHullBtn);

let DFSBtn = new kTopo.Button("DFS", 925, 80, 100, 30, function() {
    canvas.playRandomDFS();
});
canvas.add(DFSBtn);

let BFSBtn = new kTopo.Button("BFS", 925, 135, 100, 30, function() {
    canvas.playRandomBFS();
});
canvas.add(BFSBtn);

let clearBtn = new kTopo.Button("Clear", 1075, 25, 100, 30, function() {
    canvas.clear();
});
canvas.add(clearBtn);

let playRandomBtn = new kTopo.Button("Play Random", 1225, 25, 100, 30, function() {
    canvas.playRandomMove();
});
canvas.add(playRandomBtn);

let snapshotBtn = new kTopo.Button("Snapshot", 1700, 25, 100, 30, function() {
    canvas.snapshot();
});
canvas.add(snapshotBtn);

let restoreBtn = new kTopo.Button("Restore", 1700, 80, 100, 30, function() {
    canvas.restore();
});
canvas.add(restoreBtn);

let showVertexLabelBtn = new kTopo.Button("Show Vertex Label", 100, 800, 150, 30, function() {
    canvas.showVertexLabel();
});
canvas.add(showVertexLabelBtn); 

let hideVertexLabelBtn = new kTopo.Button("Hide Vertex Label", 100, 880, 150, 30, function() {
    canvas.hideVertexLabel();
});
canvas.add(hideVertexLabelBtn); 

let showEdgeLabelBtn = new kTopo.Button("Show Edge Label", 300, 800, 150, 30, function() {
    canvas.showEdgeLabel();
});
canvas.add(showEdgeLabelBtn); 

let hideEdgeLabelBtn = new kTopo.Button("Hide Edge Label", 300, 880, 150, 30, function() {
    canvas.hideEdgeLabel();
});
canvas.add(hideEdgeLabelBtn); 

