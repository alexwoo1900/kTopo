import Two from "two.js";
import { DrawableNode, DrawableNodeType } from "../../../DrawableNode";
import { CompatibleEvents, Canvas } from "./Canvas";
import { Vertex } from "./Vertex";
import { Edge } from "./Edge";

interface TextStyle {
    offsetX?    : number,
    offsetY?    : number
}

interface Style {
    normal      : TextStyle
}

let defaultStyle = {
    normal: {
        offsetX : 0,
        offsetY : 20
    }
}

class Label extends DrawableNode {
    protected _canvas   : Canvas | null         = null;
    protected _skin     : Two.Group | null      = null;
    protected _style    : Style | null          = null;
    protected _label    : Two.Text | null       = null;
    protected _handler  : (() => any) | null    = null;
    

    constructor() {
        super(DrawableNodeType.Label);
    }

    get skin(): Two.Group | null {
        return this._skin;
    }

    get handler(): (() => any) | null {
        return this._handler;
    }

    show() {
        (this._skin as Two.Group).opacity = 1;
    }

    hide() {
        (this._skin as Two.Group).opacity = 0;
    }
}

export class ComponentLabel extends Label {
    private _owner  :  Vertex | Edge | null = null;
    private _useDefaultLabel: boolean       = false;

    constructor(owner: Vertex | Edge) {
        super();
        this._owner = owner;
    }

    get owner(): Vertex | Edge | null {
        return this._owner;
    }

    _loadDefaultStyle(): void {
        this._style = defaultStyle;
    }

    _createSkin(): void {
        let text;
        if (this._owner!.type == DrawableNodeType.Vertex) {
            let pos = (this._owner! as Vertex).position;
            if (this._owner!.name != "") {
                text = this._owner!.name;
            } else {
                text = "(" + Math.round(pos.x) + ", " + Math.round(pos.y) + ")";
                this._useDefaultLabel = true;
            }
            let style = this._style!.normal;
            this._label = new Two.Text(text, pos.x + style.offsetX!, pos.y + style.offsetY!);
        } else if (this._owner!.type == DrawableNodeType.Edge) {
            if (this._owner!.name != "") {
                text = this._owner!.name;
            } else {
                text = (this._owner! as Edge).weight.toString();
                this._useDefaultLabel = true;
            }
            let targetPos = (this._owner! as Edge).startVertex.position.add((this._owner! as Edge).endVertex.position).imul(0.5);
            let targetDel = (this._owner! as Edge).endVertex.position.sub((this._owner! as Edge).startVertex.position);
            let radian = Math.atan(targetDel.y / targetDel.x);
            this._label = new Two.Text(text, targetPos.x, targetPos.y);
            this._label.rotation = radian;
        }


        this._skin = this._canvas!.two.makeGroup(this._label!);

        this._canvas!.two.update();
    }

    _registerHandler() {
        if (this._owner!.type == DrawableNodeType.Vertex) {
            let style = this._style!.normal;
            let ownerSkin = this._owner!.skin as Two.Group;
            this._handler = () => {
                if (this._useDefaultLabel) {
                    this._label!.value = "(" + Math.round(ownerSkin.translation.x) + ", " + Math.round(ownerSkin.translation.y) + ")";
                }
                this._label!.translation.x = ownerSkin.translation.x + style.offsetX!;
                this._label!.translation.y = ownerSkin.translation.y + style.offsetY!;
            };
            ownerSkin.translation
                .bind(CompatibleEvents.change, this._handler!);
        } else if (this._owner!.type == DrawableNodeType.Edge) {
            let ownerStartSkin = (this._owner! as Edge).startVertex.skin!.translation;
            let ownEndSkin = (this._owner! as Edge).endVertex.skin!.translation;
            this._handler = () => {
                this._label!.translation.x = (ownerStartSkin.x + ownEndSkin.x) * 0.5;
                this._label!.translation.y = (ownerStartSkin.y + ownEndSkin.y) * 0.5;
                this._label!.rotation = Math.atan((ownEndSkin.y - ownerStartSkin.y) / (ownEndSkin.x - ownerStartSkin.x));
            };
            ownerStartSkin
                .bind(CompatibleEvents.change, this._handler!);
            ownEndSkin
                .bind(CompatibleEvents.change, this._handler!);
        }
    }
}