import Two, {SVGRenderer} from "two.js";
import { Point2D } from "../../../Base";
import { DrawableNodeType, DrawableNode } from "../../../DrawableNode";
import { Canvas } from "../components/Canvas";

interface ButtonStyle {
    x?          : number,
    y?          : number,
    width?      : number,
    height?     : number,
    stroke?     : Two.Color,
    lineWidth?  : number,
    fill?       : Two.Color,
    textFill?   : Two.Color,
}

interface Style {
    normal      : ButtonStyle,
    mouseenter? : ButtonStyle,
    mousedown?  : ButtonStyle,
    mouseup?    : ButtonStyle
}

let defaultStyle = {
    "normal": {
        "x": 100,
        "y": 100,
        "width": 100,
        "height": 50,
        "stroke": "#fff",
        "lineWidth": 0,
        "fill": "#0d6efd",
        "textFill": "#fff",
    },
    "mouseenter": {
        "fill": "#0a58ca"
    }
}

class Widget extends DrawableNode {
    constructor() {
        super(DrawableNodeType.Widget);
    }
}

export class Button extends Widget{
    readonly text       : string;
    readonly position   : Point2D;
    readonly width      : number;
    readonly height     : number;
    private _shape      : Two.Rectangle | null  = null;
    private _text       : Two.Text | null       = null;
    private _callback   : (e: JQuery.Event) => any;
    protected _canvas   : Canvas | null         = null;
    protected _skin     : Two.Group | null      = null;
    protected _style    : Style | null          = null;

    constructor(text: string, x: number, y: number, width: number, height: number, callback: (e: JQuery.Event) => any) {
        super()
        this.text = text;
        this.position = new Point2D(x, y);
        this.width = width;
        this.height = height;
        this._callback = callback;
    }

    get skin() {
        return this._skin;
    }

    updateSkin(style: ButtonStyle) {
        this._shape!.stroke     = style.stroke      ?? this._shape!.stroke;
        this._shape!.linewidth  = style.lineWidth   ?? this._shape!.linewidth;
        this._shape!.fill       = style.fill        ?? this._shape!.fill;
        this._text!.fill        = style.textFill    ?? this._text!.fill;
    }

    _loadDefaultStyle() {
        this._style = defaultStyle;
    }

    _createSkin() {
        this._shape             = this._canvas!.two.makeRectangle(this.position.x, this.position.y, this.width, this.height);
        this._text              = new Two.Text(this.text, this.position.x, this.position.y);
        this.updateSkin(this._style!.normal);
        this._skin            = this._canvas!.two.makeGroup(this._shape, this._text);
        this._canvas!.two.update();
    }

    _registerHandler() {
        $((this._skin!.renderer as SVGRenderer).elem)
            .css('cursor', "pointer")
            .on("mouseenter", (e) => {
                e.stopPropagation();
                e.preventDefault();

                if (this._style?.mouseenter) {
                    this.updateSkin(this._style!.mouseenter!);
                }
            })
            .on("mouseleave", (e) => {
                e.stopPropagation();
                e.preventDefault();

                this.updateSkin(this._style!.normal);
            })
            .on("mousedown", (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                if (this._style?.mousedown) {
                    this.updateSkin(this._style!.mousedown!);
                }
            })
            .on("mouseup", (e) => {
                e.stopPropagation();
                e.preventDefault();

                if (this._style?.mouseup) {
                    this.updateSkin(this._style!.mouseup!);
                }
            })
            .on("click", (e) => {
                e.stopPropagation();
                e.preventDefault();

                this._callback(e);
            });
    }
}