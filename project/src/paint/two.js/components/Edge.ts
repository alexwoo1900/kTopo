import Two, {SVGRenderer} from "two.js";
import { AdjNode } from "../../../AdjGraph";
import { DrawableNodeType, DrawableNode } from "../../../DrawableNode";
import { CanvasEditMode } from "../../../DrawableCanvas";
import { CompatibleEvents, Canvas } from "./Canvas";
import { Vertex } from "./Vertex";
import { ComponentLabel } from "./Label";


interface EdgeStyle {
    stroke?     : Two.Color,
    lineWidth?  : number,
    cap?        : string
}

interface Style {
    normal      : EdgeStyle,
    mouseenter? : EdgeStyle
}

let defaultStyle = {
    normal: {
        stroke: "#cccccc",
        lineWidth: 6,
        cap: "round"
    },
    mouseenter: {
        stroke: "#ff0000"
    }
}

export class Edge extends DrawableNode {
    readonly label              : ComponentLabel;
    readonly startVertex        : Vertex;
    readonly endVertex          : Vertex;
    readonly startVertexHandler : (() => any);
    readonly endVertexHandler   : (() => any);
    
    private _innerLine          : Two.Line | null   = null;
    private _name               : string            = "";
    private _weight             : number            = 1;

    protected _canvas           : Canvas | null     = null;
    protected _skin             : Two.Group | null  = null;
    protected _style            : Style | null      = null;
    

    constructor(v1: Vertex, v2: Vertex) {
        super(DrawableNodeType.Edge);
        this.label = new ComponentLabel(this);
        this.startVertex = v1;
        this.endVertex = v2;
        this.startVertexHandler = () => this._innerLine!.vertices[0].copy(this.startVertex.skin!.translation);
        this.endVertexHandler = () => this._innerLine!.vertices[1].copy(this.endVertex.skin!.translation);
    }

    get name(): string { return this._name; }
    get weight(): number { return this._weight; }
    get skin(): Two.Group | null { return this._skin; }
    get neighbours(): AdjNode[] { return this._canvas!.getNeighbours(this); }

    set name(s: string) { this._name = s; }
    set weight(value: number) { this._weight = value; }

    _loadDefaultStyle() {
        this._style = defaultStyle;
    }

    updateSkin(style: EdgeStyle) {
        this._innerLine!.stroke     = style.stroke      ?? this._innerLine!.stroke;
        this._innerLine!.linewidth  = style.lineWidth   ?? this._innerLine!.linewidth;
        this._innerLine!.cap        = style.cap         ?? this._innerLine!.cap;
    }

    _createSkin() {
        this._innerLine = this._canvas!.two.makeLine(this.startVertex.position.x, 
                                                    this.startVertex.position.y, 
                                                    this.endVertex.position.x, 
                                                    this.endVertex.position.y);
        this.updateSkin(this._style!.normal);
        this._skin = this._canvas!.two.makeGroup(this._innerLine);

        this._canvas!.two.update();
    }

    _registerHandler() {
        this.startVertex.skin!.translation.bind(CompatibleEvents.change, this.startVertexHandler);
        this.endVertex.skin!.translation.bind(CompatibleEvents.change, this.endVertexHandler);

        $((this._skin!.renderer as SVGRenderer).elem)
            .css("cursor", "pointer")
            .on("mouseenter", (e: JQuery.Event) => {
                e.stopPropagation();
                e.preventDefault();

                if (this._style!.mouseenter) {
                    this.updateSkin(this._style!.mouseenter!);
                }
            })
            .on("mouseleave", (e: JQuery.Event) => {
                e.stopPropagation();
                e.preventDefault();

                this.updateSkin(this._style!.normal);
            })
            .on("click", (e: JQuery.Event) => {
                e.stopPropagation();
                e.preventDefault();

                if (this._canvas!.editMode == CanvasEditMode.DeleteEdge) {
                    this._canvas!.remove(this);
                }
            });
    }
}