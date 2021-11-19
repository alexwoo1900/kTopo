import Two from "two.js";


import Utils from "../../../Utils";
import { Vector2, Point2D, Pair } from "../../../Base";
import { Deque } from "../../../Deque";
import { Topo } from "../../../algorithm/Algorithm";
import { AdjNode, AdjGraph } from "../../../AdjGraph";
import { CanvasEditMode, DrawableCanvas } from "../../../DrawableCanvas";
import { DrawableNodeType, DrawableNode } from "../../../DrawableNode";
import { Grid } from "./Grid";
import { Vertex } from "./Vertex";
import { Edge } from "./Edge";
import { CoordLabel, WeightLabel } from "./Text";
import { Button } from "../misc/Widget";
import { Particle } from "../../../physics/2d/particle/Particle";
import { ParticleForceRegistry } from "../../../physics/2d/particle/ForceGenerator";
import { ParticleAnchoredSpring } from "../../../physics/2d/particle/Springforce";

/**
 * The module code of two.js is incompatible with the @types/two.js/index.d.ts provided by npm.
 * The latter corresponds to the browser version of two.js.
 * 
 * CompatibleEvents was born to unify the way source code uses Events of two.js.
 */
export enum CompatibleEvents {
    play    = "play",
    pause   = "pause",
    update  = "update",
    render  = "render",
    resize  = "resize",
    change  = "change",
    remove  = "remove",
    insert  = "insert",
    order   = "order",
    load    = "load"
}

interface OriginalEvent extends MouseEvent{
    wheelDeltaY : number,
    deltaY      : number
}

interface TwoParams {
    fullscreen? : boolean,
    width?      : number,
    height?     : number
}

type Component = Vertex | Edge | CoordLabel | WeightLabel | Button; 

export class Canvas extends DrawableCanvas {
    protected _graph            : AdjGraph          = new AdjGraph();
    protected _vertices         : Array<Vertex>     = new Array<Vertex>();
    protected _edges            : Array<Edge>       = new Array<Edge>();
    protected _two              : Two | null        = null;
    protected _params           : TwoParams         = {};
    protected _usePhysicsEngine : boolean           = true;
    private _zui                : Two.ZUI | null    = null;
    private _layers             : {
                                    V: Two.Group,
                                    E: Two.Group,
                                    T: Two.Group,
                                    W: Two.Group
                                } | null        = null;
    private _panStartPos        : Two.Vector | null = null;
    public dragStartVertex      : Vertex | null     = null;
    public dragEndVertex        : Vertex | null     = null;

    protected _registry     : ParticleForceRegistry = new ParticleForceRegistry();

    constructor(params?: TwoParams) {
        super();
        Object.assign(this._params, {autostart: true, type: Two.Types.svg, fullscreen: true}, params || {});
    }

    get two(): Two { return this._two!; }
    get editMode(): CanvasEditMode { return this._editMode; }
    set editMode(mode: CanvasEditMode) {
        if (mode == CanvasEditMode.InsertEdge) {
            this.dragStartVertex = null;
            this.dragEndVertex = null;
        }
        this._editMode = mode;
    }
    get registry() { return this._registry; }
    get usePhysicsEngine() { return this._usePhysicsEngine; }
    set usePhysicsEngine(v: boolean) { this._usePhysicsEngine = v; }

    getAllVertices(): Array<Vertex> { return this._vertices; }
    getAllEdges(): Array<Edge> { return this._edges; }
    getRandomVertex(): Vertex{
        let node: DrawableNode;
        do {
            node = this._graph.getRandomNode() as DrawableNode;
        } while (node.type != DrawableNodeType.Vertex);
        
        return node as Vertex
    }
    getRandomEdge(): Edge{
        let node: DrawableNode;
        do {
            node = this._graph.getRandomNode() as DrawableNode;
        } while (node.type != DrawableNodeType.Edge);
        
        return node as Edge;
    }
    getNeighbours(node: AdjNode) {
        return this._graph.getAdjNodes(node);
    }

    /**
     * The function must be started first!
     * 
     * @param el 
     */
    appendTo(el: HTMLElement) {
        this._initialize(el);
        this._registerHandler();
    }

    _initialize(el: HTMLElement) {
        this._two = new Two(this._params).appendTo(el);
        this._zui = new Two.ZUI(this._two.scene);
        this._zui.addLimits(0.06, 8);
        this._layers = {
            "E": this._two.makeGroup(),
            "V": this._two.makeGroup(),
            "T": this._two.makeGroup(),
            "W": this._two.makeGroup(),
        }
        this._initialized = true;
    }


    private _panStart = (e: JQuery.MouseEventBase): void => {
        e.stopPropagation();
        e.preventDefault();

        this._zui!.translateSurface(e.clientX - this._panStartPos!.x, e.clientY - this._panStartPos!.y);
        this._panStartPos!.x = e.clientX;
        this._panStartPos!.y = e.clientY;
    };

    private _panEnd = (e: JQuery.MouseEventBase) => {
        e.stopPropagation();
        e.preventDefault();

        this._panStartPos = null;

        $(window)
            .off("mousemove", this._panStart)
            .off("mouseup", this._panEnd);
    };

    _registerHandler() {
        if (!this._initialized) {
            throw Error("_initialize was not called first!");
        }

        $(this._two!.renderer.domElement)
            .on("mousedown", (e: JQuery.MouseEventBase) => {
                e.stopPropagation();
                e.preventDefault();
                
                this._panStartPos = new Two.Vector(e.clientX, e.clientY);

                $(window)
                    .on("mousemove", this._panStart)
                    .on("mouseup", this._panEnd);
            });
        $(this._two!.renderer.domElement)
            .on('mousewheel wheel', (event: JQuery.Event) => {
                event.stopPropagation();
                event.preventDefault();

                let e = ((event as JQuery.MouseEventBase).originalEvent as OriginalEvent);
                let dy = (e.wheelDeltaY || - e.deltaY) / 1000;
                this._zui!.zoomBy(dy, e.clientX, e.clientY);
            });

        this._two!.renderer.domElement.addEventListener('click', (e: Event) => {
            e.stopPropagation();
            e.preventDefault();
            
            if (this._editMode == CanvasEditMode.InsertVertex) {
                let sf = this.clientToSurface((e as MouseEvent).clientX, (e as MouseEvent).clientY);
                this.add(new Vertex(sf.x, sf.y));
            }
        }, false);
    }

    showVertexLabel() { this._vertices.forEach((vertex: Vertex) => vertex.defaultLabel.show()); }
    hideVertexLabel() { this._vertices.forEach((vertex: Vertex) => vertex.defaultLabel.hide()); }
    showEdgeLabel() { this._edges.forEach((edge: Edge) => edge.defaultLabel.show()); }
    hideEdgeLabel() { this._edges.forEach((edge: Edge) => edge.defaultLabel.hide()); }

    add(node: Component) {
        if (!this._initialized) {
            throw Error("The canvas was not initialized! (missing appendTo?)");
        }

        node.init(this);
        switch(node.type) {
            case DrawableNodeType.Vertex:
                this._graph.add(node);
                this._vertices.push(node as Vertex);
                if (this.usePhysicsEngine) {
                    let fg = new ParticleAnchoredSpring((node as Vertex).originalPosition, 100, 0);
                    let p = (node as Vertex).body as Particle;
                    this._registry.add(p, fg);
                }
                break;
            case DrawableNodeType.Edge:
                this._graph.addPair(node, (node as Edge).startVertex);
                this._graph.addPair(node, (node as Edge).endVertex);
                this._edges.push(node as Edge);
                break;
            default:
                break;
        }
        this._layers![node.type].add(node.skin!);

        if (node.defaultLabel) {
            this.add(node.defaultLabel as Component);
        }
    }

    remove(node: Component) {
        if (!this._initialized) {
            throw Error("The canvas was not initialized! (missing appendTo?)");
        }

        if (node.defaultLabel) {
            this.remove(node.defaultLabel as Component);
        }

        if (node.type == DrawableNodeType.Vertex) {
            let adjNodes = this._graph.getAdjNodes(node);
            adjNodes.forEach((adjNode) => {
                this.remove((adjNode as Component));
            });
            this._vertices.splice(this._vertices.indexOf(node as Vertex), 1);
        } else if (node.type == DrawableNodeType.Edge) {
            (node as Edge).startVertex.skin!.translation
                .unbind(CompatibleEvents.change, (node as Edge).startVertexHandler);
            (node as Edge).endVertex.skin!.translation
                .unbind(CompatibleEvents.change, (node as Edge).endVertexHandler);
            this._edges.splice(this._edges.indexOf(node as Edge), 1);
        } else if (node.type == DrawableNodeType.Text && node instanceof CoordLabel) {
            (node as CoordLabel).owner!.skin!.translation
                .unbind(CompatibleEvents.change, (node as CoordLabel).handler);
        } else if (node.type == DrawableNodeType.Text && node instanceof WeightLabel) {
            ((node as WeightLabel).owner! as Edge).startVertex.skin!.translation
                .unbind(CompatibleEvents.change, (node as WeightLabel).handler);
            ((node as WeightLabel).owner! as Edge).endVertex.skin!.translation
                .unbind(CompatibleEvents.change, (node as WeightLabel).handler);
        }

        this._layers![node.type].remove(node.skin!);
        this._graph.remove(node);
    }

    clear() {
        if (!this._initialized) {
            throw Error("The canvas was not initialized! (missing appendTo?)");
        }
        let l = this._vertices.length;
        for (let i = l - 1; i >= 0; --i) { this.remove(this._vertices[i]); }
        l = this._edges.length;
        for (let i = l - 1; i >= 0; --i) { this.remove(this._edges[i]); }
    }

    snapshot() {
        this._snapshot.vertices.length = 0;
        this._snapshot.edges.length = 0;
        this._vertices.forEach((vertex: Vertex) => this._snapshot.vertices.push(vertex.position.clone()));
        this._edges.forEach((edge: Edge) => this._snapshot.edges.push(new Pair<number>(this._vertices.indexOf(edge.startVertex), this._vertices.indexOf(edge.endVertex))));
    }

    restore() {
        this.clear();
        this._snapshot.vertices.forEach((pos: Point2D) => this.add(new Vertex(pos.x, pos.y)));
        this._snapshot.edges.forEach((idxPair: Pair<number> ) => this.add(new Edge(this._vertices[idxPair.l], this._vertices[idxPair.r])));
    }

    /**
     * Convert client coordinates to coordinates in canvas
     * 
     * @param {number} clientX 
     * @param {number} clientY 
     * @returns 
     */
    clientToSurface(clientX: number, clientY: number) {
        if (!this._initialized) {
            throw Error("The canvas was not initialized! (missing appendTo?)");
        }

        return this._zui!.clientToSurface(clientX, clientY);
    }

    /**
     * Convert coordinates in canvas to client coordinates
     * 
     * @param {Two.Matrix} surfacePos
     * @returns 
     */
    surfaceToClient(surfacePos: Two.Vector) {
        if (!this._initialized) {
            throw Error("The canvas was not initialized! (missing appendTo?)");
        }

        return this._zui!.surfaceToClient(surfacePos);
    }

    getCoordCollision(coord: Two.Vector, targetType: DrawableNodeType) {
        if (targetType == DrawableNodeType.Vertex) {
            let target: Vertex, targetRect: Two.BoundingClientRect;
            let l = this._vertices.length;
            for (let i = 0; i < l; ++i) {
                target = this._vertices[i];
                targetRect = target.skin!.getBoundingClientRect();
                if (Utils.checkInside(targetRect, coord.x - targetRect.width / 2, coord.y - targetRect.height / 2)
                || Utils.checkInside(targetRect, coord.x - targetRect.width / 2, coord.y + targetRect.height / 2)
                || Utils.checkInside(targetRect, coord.x + targetRect.width / 2, coord.y - targetRect.height / 2)
                || Utils.checkInside(targetRect, coord.x + targetRect.width / 2, coord.y + targetRect.height / 2)) {
                    return target;
                }
            }
        }
        return null;
    }

    getNodeCollision(node: DrawableNode, targetType: DrawableNodeType) {
        if (targetType == DrawableNodeType.Edge) {
            if (node.type == DrawableNodeType.Edge) {
                let target: Edge;
                let l = this._edges.length;
                for (let i = 0; i < l; ++i) {
                    target = this._edges[i];
                    if (Utils.checkSameSegment(
                            target.startVertex.position, 
                            target.endVertex.position, 
                            (node as Edge).startVertex.position, 
                            (node as Edge).endVertex.position) || 
                        Utils.checkStrictIntersection(
                            target.startVertex.position, 
                            target.endVertex.position, 
                            (node as Edge).startVertex.position, 
                            (node as Edge).endVertex.position)) {
                        return target;
                    }
                }
            }
        }
        return null;
    }
}

export class ComputationalCanvas extends Canvas {
    private _grid: Grid = new Grid();

    constructor(params?: TwoParams) {
        super(params)
        this._grid.init();
    }

    // Animation for vertex of connected component
    _playVertex(vertex: Vertex) {
        vertex.createOrUpdateSkin(this._two!, {fill: "#cc9933"});
    }

    // Animation for edge of connected component
    _playEdge(edge: Edge, vertex: Vertex) {
        let colors = [
            "#cc9966",
            "#cccccc"
        ];

        let srcVertex: Vertex, distVertex: Vertex;
        if (vertex.ID == edge.startVertex.ID) {
            srcVertex = edge.startVertex;
            distVertex = edge.endVertex;
        } else {
            srcVertex = edge.endVertex;
            distVertex = edge.startVertex;
        }

        let linearGradient = this._two!.makeLinearGradient(
            srcVertex.x, srcVertex.y,
            distVertex.x, distVertex.y,
            new Two.Stop(0, colors[0], 1),
            new Two.Stop(0, colors[1], 1),
        );

        edge.updateSkin({stroke: linearGradient});

        let that = this;
        this._two!
            .bind("update", function() {
                if (linearGradient.stops[1].offset < 1) {
                    linearGradient.stops[0].offset += (that._two!.timeDelta / 200);
                } else {
                    return;
                }
            })
            .play();
    }

    playTraversal(lastNode: DrawableNode, currNode: DrawableNode) {
        if (currNode.type == DrawableNodeType.Vertex) {
            this._playVertex(currNode as Vertex);
        } else if (currNode.type == DrawableNodeType.Edge) {
            this._playEdge(currNode as Edge, lastNode as Vertex);
        }
    }

    playRandomDFS() {
        let v = this.getRandomVertex();
        Topo.DFS<DrawableNode> (v, v, this.playTraversal.bind(this), 500);
    }

    playRandomBFS() {
        let q = new Deque<Pair<DrawableNode> > ();
        let v = this.getRandomVertex();
        Topo.BFS<DrawableNode> (q, v, this.playTraversal.bind(this), 500);
    }

    generateConvexHull() {
        if (this._vertices.length < 3) {
            return;
        }

        let hull = new Array<Vector2>();
        let positions = this._vertices.map((v) => {return v.position;});
        Topo.generateConvexHull(hull, positions);

        for (let i = 0; i < hull.length; ++i) {
            this.add(new Edge(hull[i].reserve as Vertex, hull[(i + 1) % hull.length].reserve as Vertex));
        }
    }

    generateRandomVertices(m: number, maxWidth = 960, maxHeight = 640) {
        let x: number, y: number;
        for (let i = 0; i < m; ++i) {
            do {
                x = Utils.random(100, maxWidth);
                y = Utils.random(200, maxHeight);
            } while (this.getCoordCollision(new Two.Vector(x, y), DrawableNodeType.Vertex));
            this.add(new Vertex(x, y));
        }
    }

    generateRandomEdges(n: number, hasWeight: boolean, allowEdgeIntersect: boolean) {
        let m = this._vertices.length;
        n = Math.min(m * (m-1) / 2, n);
        let v1: Vertex, v2: Vertex, edge: Edge;
        for (let i = 0; i < n; ++i) {
            while (1) {
                v1 = this.getRandomVertex();
                v2 = this.getRandomVertex();
                if (v1.ID != v2.ID && !this._graph.checkConnection(v1, v2)) {
                    edge = new Edge(v1, v2);
                    if (allowEdgeIntersect || !this.getNodeCollision(edge, DrawableNodeType.Edge)) {
                        if (hasWeight) {
                            edge.weight = Utils.randomInt(1, 10);
                        }
                        this.add(edge);
                        break;
                    }
                }
            }
        }
    }

    /**
     * Create a network of m vertices and n edges
     * 
     * @param {number} m number of vertices
     * @param {number} n number of edges
     */
    generateRandomGraph(m: number, n: number, maxWidth = 960, maxHeight = 640, allowEdgeIntersect = true) {
        this.clear();
        this.generateRandomVertices(m, maxWidth, maxHeight);
        this.generateRandomEdges(n, false, allowEdgeIntersect);
    }

    generateRandomWeightedGraph(m: number, n: number, maxWidth = 960, maxHeight = 640, allowEdgeIntersect = true) {
        this.clear();
        this.generateRandomVertices(m, maxWidth, maxHeight);
        this.generateRandomEdges(n, true, allowEdgeIntersect);
    }

    playVertexRandomMoves() {
        this._vertices.forEach((vertex: Vertex) => {
            vertex.playMove(vertex.position.x + Utils.randomInt(-100, 100), vertex.position.y + Utils.randomInt(-100, 100));
        });
    }
}