import { AdjNode } from "./AdjGraph";
import { DrawableCanvas } from "./DrawableCanvas";

export enum DrawableNodeType {
    Vertex  = "V",
    Edge    = "E",
    Label   = "L",
    Widget  = "W"
}

export class DrawableNode extends AdjNode {

    readonly type           : DrawableNodeType;
    readonly label          : unknown                   = null;
    protected _canvas       : DrawableCanvas | null     = null;
    protected _skin         : unknown                   = null;
    protected _style        : unknown                   = {};
    protected _initialized  : boolean                   = false;

    constructor(type: DrawableNodeType) {
        super();
        this.type = type;
    }

    get skin(): unknown {
        return this._skin;
    }

    init(canvas: DrawableCanvas) {
        this._initialize(canvas);
        this._loadDefaultStyle();
        this._createSkin();
        this._registerHandler();
    }

    _initialize(canvas: DrawableCanvas) {
        this._canvas = canvas
        this._initialized = true;
    }

    _loadDefaultStyle() {
        throw Error("This method must be implemented!");
    }

    _createSkin() {
        throw Error("This method must be implemented!");
    };

    _registerHandler() {
        throw Error("This method must be implemented!");
    };
}