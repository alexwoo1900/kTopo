import Two, {SVGRenderer} from "two.js";
import Utils from "../../../Utils";
import { System, Point2D } from "../../../Base";
import { Particle } from "../../../physics/2d/particle/Particle";
import { DrawableNodeType, DrawableNode } from "../../../DrawableNode";
import { CanvasEditMode } from "../../../DrawableCanvas";
import { Canvas } from "./Canvas";
import { Edge } from "./Edge";
import { CoordLabel } from "./Text";

interface VertexStyle {
    x?          : number,
    y?          : number,
    radius?     : number,
    stroke?     : Two.Color,
    lineWidth?  : number,
    fill?       : Two.Color,
    opacity?    : number,
    scale?      : number,
    dlStroke?   : Two.Color,
    dlLineWidth?: number,
    dlCap?      : string
}

interface Style {
    normal      : VertexStyle,
    mouseenter? : VertexStyle
}

let defaultStyle = {
    "normal": {
        "x"             : 100,
        "y"             : 100,
        "radius"        : 8,
        "stroke"        : "#fff",
        "lineWidth"     : 2,
        "fill"          : "#0099ff",
        "opacity"       : 1,
        "scale"         : 1,
        "dlStroke"      : "#00ff33",
        "dlLineWidth"   : 6,
        "dlCap"         : "round"
    },
    "mouseenter": {
        "fill"          : "#ff0000",
        "scale"         : 1.2,
    }
}

export class Vertex extends DrawableNode {
    /**
     * static variables
     **/ 
    readonly defaultLabel       : CoordLabel;
    readonly originalPosition   : Point2D;
    readonly body               : Particle;     // default body type: particle

    private _shape              : Two.Circle | null     = null;
    private _dragLine           : Two.Line | null       = null;
    
    protected _canvas           : Canvas | null         = null;
    protected _skin             : Two.Group | null      = null;
    protected _style            : Style | null          = null;
    private _usePhysicsEngine   : boolean               = true;
    private _applyPhysicsEngine  : (() => any) | null   = null;

    constructor(x: number, y: number) {
        super(DrawableNodeType.Vertex);
        this.defaultLabel = new CoordLabel(this);
        this.originalPosition = new Point2D(x, y);
        this.body = new Particle();
        this.body.position.set(x, y);
        this.body.position.reserve = this;
    }

    get x()                 { return this.body.position.x; }
    get y()                 { return this.body.position.y; }
    get position()          { return this.body.position; }

    get neighbours()        { return this._canvas!.getNeighbours(this); }
    get usePhysicsEngine()  { return this._usePhysicsEngine; }
    set usePhysicsEngine(v: boolean) { this._usePhysicsEngine = v; }
    
    _loadDefaultStyle() {
        this._style = defaultStyle;
    }

    createOrUpdateSkin(two: Two, style: VertexStyle) {
        this._shape             = this._shape       ?? two.makeCircle(0, 0, style.radius!);
        this._shape.stroke      = style.stroke      ?? this._shape.stroke;
        this._shape.linewidth   = style.lineWidth   ?? this._shape.linewidth;
        this._shape.fill        = style.fill        ?? this._shape.fill;
        this._shape.opacity     = style.opacity     ?? this._shape.opacity;
        this._shape.scale       = style.scale       ?? this._shape.scale;
    }

    createOrUpdateDragLineSkin(two: Two, style: VertexStyle, x1: number, y1: number, x2: number, y2: number) {
        this._dragLine              = this._dragLine    ?? two.makeLine(x1, y1, x2, y2);
        this._dragLine.stroke       = style.dlStroke    ?? this._dragLine.stroke;
        this._dragLine.linewidth    = style.dlLineWidth ?? this._dragLine.linewidth;
        this._dragLine.cap          = style.dlCap       ?? this._dragLine.cap;
    }

    _createSkin() {
        this.createOrUpdateSkin(this._canvas!.two, this._style!.normal);
        this._skin = this._canvas!.two.makeGroup(this._shape!);
        this._skin.translation.set(this.x, this.y);
        this.position.change((x: number, y: number) => {
            this._skin!.translation.set(x, y);
        });
        this._canvas!.two.update();
    }

    get skin()            { return this._skin; }

    private _dragStart = (e: JQuery.Event) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (this._usePhysicsEngine) {
            this._canvas!.two
                .unbind("update", this._applyPhysicsEngine);
        }

        let sf = this._canvas!.clientToSurface(e.clientX!, e.clientY!);
        if (this._canvas!.editMode == CanvasEditMode.Move) {
            this.position.set(sf.x, sf.y);
        } else if (this._canvas!.editMode == CanvasEditMode.InsertEdge) {
            if (!this._dragLine) {
                this.createOrUpdateDragLineSkin(this._canvas!.two, this._style!.normal, this.x, this.y, sf.x, sf.y);
            } else {
                this._dragLine.vertices[1].set(sf.x, sf.y);
            }
        }
    };

    private _dragEnd = (e: JQuery.Event) => {
        e.stopPropagation();
        e.preventDefault();

        if (this._canvas!.editMode == CanvasEditMode.InsertEdge) {
            if (this._canvas!.dragStartVertex && this._canvas!.dragEndVertex) {
                this._canvas!.add(new Edge(this._canvas!.dragStartVertex, this._canvas!.dragEndVertex));
            } else if (this._canvas!.dragStartVertex && !this._canvas!.dragEndVertex) {
                let target = this._canvas!.getCoordCollision(new Two.Vector(e.clientX!, e.clientY!), DrawableNodeType.Vertex);
                if (target) {
                    this._canvas!.dragEndVertex = target;
                } else {
                    let sf = this._canvas!.clientToSurface(e.clientX!, e.clientY!);
                    this._canvas!.dragEndVertex = new Vertex(sf.x, sf.y);
                    this._canvas!.add(this._canvas!.dragEndVertex!);
                }
                this._canvas!.add(new Edge(this._canvas!.dragStartVertex, this._canvas!.dragEndVertex));
            }

            this._canvas!.dragStartVertex = null;
            this._canvas!.dragEndVertex = null;
            if (this._dragLine) {
                this._canvas!.two.remove(this._dragLine);
                this._dragLine = null;
            }
        }
        
        $(window)
            .off("mousemove", this._dragStart)
            .off("mouseup", this._dragEnd);

        if (this._usePhysicsEngine) {
            this._canvas!.two
                .bind("update", this._applyPhysicsEngine!);
        }
    };

    _registerHandler() {

        this._applyPhysicsEngine = () => {
            this._canvas!.registry.updateForces(System.SPF);
            this._canvas!.getAllVertices().forEach((v) => {
                (v.body as Particle).integrate(System.SPF);
            });
        };

        $((this._skin!.renderer as SVGRenderer).elem)
            .css("cursor", "pointer")
            .on("mouseenter", (e: JQuery.Event) => {
                e.stopPropagation();
                e.preventDefault();

                if (this._style!.mouseenter) {
                    this.createOrUpdateSkin(this._canvas!.two, this._style!.mouseenter!);
                }

                if (this._canvas!.editMode == CanvasEditMode.InsertEdge) {
                    if (this._canvas!.dragStartVertex && this != this._canvas!.dragStartVertex){
                        this._canvas!.dragEndVertex = this;
                    }
                }
            })
            .on("mouseleave", (e: JQuery.Event) => {
                e.stopPropagation();
                e.preventDefault();

                this.createOrUpdateSkin(this._canvas!.two, this._style!.normal);

                if (this._canvas!.editMode == CanvasEditMode.InsertEdge) {
                    this._canvas!.dragEndVertex = null;
                }
            })
            .on("mousedown", (e: JQuery.Event) => {
                e.stopPropagation();
                e.preventDefault();

                if (this._canvas!.editMode == CanvasEditMode.InsertEdge) {
                    this._canvas!.dragStartVertex = this._canvas!.dragStartVertex ?? this;
                }

                $(window)
                    .on("mousemove", this._dragStart)
                    .on("mouseup", this._dragEnd);
            })
            .on("click", (e: JQuery.Event) => {
                e.stopPropagation();
                e.preventDefault();

                if (this._canvas!.editMode == CanvasEditMode.DeleteVertex) {
                    this._canvas!.remove(this);
                }
            });
    }

    /**
     * Play vertex moving
     * Default duration: 1.5s
     * 
     * @param x 
     * @param y 
     */
    playMove(x: number, y: number, duration: number = 1.5) {
        let step = new Point2D((x - this.x) / (60 * duration), (y - this.y) / (60 * duration));
        
        let move = () => {
            if (!Utils.equals(this.x, x) || !Utils.equals(this.y, y)) {
                this.position.iadd(step);
                this._skin!.translation.set(this.x, this.y);
            } else {
                this._canvas!.two.unbind('update', move);
                return;
            }
        }
        this._canvas!.two.bind('update', move).play();
    }
    
}