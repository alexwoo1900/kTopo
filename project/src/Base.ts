import kEvent from "./kEvent";
import Utils from "./Utils";

export class System {
    static FPS = 60;
    static SPF = 1 / System.FPS
}

export class Vector3 extends kEvent {
    private _x      : number;
    private _y      : number;
    private _z      : number;

    public reserve  : object | null = null;

    constructor(x: number = 0, y: number = 0, z: number = 0) { super(); this._x = x; this._y = y; this._z = z; }

    set x(x: number) { this._x = x; this.trigger(kEvent.Types.change, this._x, this._y, this._z); }
    set y(y: number) { this._y = y; this.trigger(kEvent.Types.change, this._x, this._y, this._z); }
    set z(z: number) { this._z = z; this.trigger(kEvent.Types.change, this._x, this._y, this._z); }
    get x() { return this._x; }
    get y() { return this._y; }
    get z() { return this._z; }

    set(x: number, y: number, z: number) { this._x = x; this._y = y; this._z = z; return this.trigger(kEvent.Types.change, this._x, this._y, this._z); }
}

export class Vector2 extends kEvent{
    private _x      : number;
    private _y      : number;

    // for holding necessary reference
    public reserve  : object | null = null;

    constructor(x: number = 0, y: number = 0) { super(); this._x = x; this._y = y; }
    
    set x(x: number) { this._x = x; this.trigger(kEvent.Types.change, this._x, this._y); }
    set y(y: number) { this._y = y; this.trigger(kEvent.Types.change, this._x, this._y); }
    get x() { return this._x; }
    get y() { return this._y; }

    set(x: number, y: number) { this._x = x; this._y = y; return this.trigger(kEvent.Types.change, this._x, this._y); }

    copy(v: Vector2) { this._x = v.x; this._y = v.y; return this.trigger(kEvent.Types.change, this._x, this._y); }
    clear() { this._x = 0; this._y = 0; return this.trigger(kEvent.Types.change, this._x, this._y); }
    iadd(...vs: Vector2[]) { vs.forEach((v) => { this._x += v.x; this._y += v.y; }); return this.trigger(kEvent.Types.change, this._x, this._y); }
    isub(...vs: Vector2[]) { vs.forEach((v) => { this._x -= v.x; this._y -= v.y; }); return this.trigger(kEvent.Types.change, this._x, this._y); }
    imul(...ms: number[]) { ms.forEach((m) => { this._x *= m; this._y *= m; }); return this.trigger(kEvent.Types.change, this._x, this._y); }
    idiv(...ms: number[]) { ms.forEach((m) => {
            if (!Utils.equals(m, 0)) {
                this._x /= m;
                this._y /= m;
            } else {
                throw new RangeError("0 cannot be a divisor");
            }
        });
        return this.trigger(kEvent.Types.change, "both", this._x, this._y);
    }
    icomponentProduct(...vs: Vector2[]) { vs.forEach((v) => { this._x *= v.x; this._y *= v.y; }); return this.trigger(kEvent.Types.change, this._x, this._y); }
    inormalize() {
        let l = this.magnitude();
        if (Utils.equals(l, 0)){
            return this.clear();
        } else if (l > 0) {
            return this.idiv(l);
        }
    }

    clone() { return new Vector2(this.x, this.y); }
    add(...vs: Vector2[]) { let x = this.x, y = this.y; vs.forEach((v) => { x += v.x; y += v.y; }); return new Vector2(x, y); }
    sub(...vs: Vector2[]) { let x = this.x, y = this.y; vs.forEach((v) => { x -= v.x; y -= v.y; }); return new Vector2(x, y); }
    mul(...ms: number[]) { let x = this.x, y = this.y; ms.forEach((m) => { x *= m; y *= m; }); return new Vector2(x, y); }
    div(...ms: number[]) { let x = this.x, y = this.y; ms.forEach((m) => {
            if (!Utils.equals(m, 0)) {
                x /= m;
                y /= m;
            } else {
                throw new RangeError("0 cannot be a divisor");
            }
        });
        return new Vector2(x, y);
    }

    scalarProduct(v: Vector2) { return this.x * v.x + this.y * v.y; }
    vectorProduct(v: Vector2) { return this.x * v.y - v.x * this.y; }
    componentProduct(...vs: Vector2[]) { let x = this.x, y = this.y; vs.forEach((v) => { x *= v.x; y *= v.y; }); return new Vector2(x, y); }
    
    magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    normalize() {
        let l = this.magnitude();
        if (Utils.equals(l, 0)){
            return new Vector2(0, 0);
        } else if (l > 0) {
            return this.div(l);
        }
    }

    bind(evName: string, evHandler: any) {
        kEvent.bind.call(this, evName, evHandler);
        return this;
    }

    unbind(evName: string, evHandler: any) {
        kEvent.unbind.call(this, evName, evHandler);
        return this;
    }

    change(handler: (x: number, y: number) => any) {
        this.unbind(kEvent.Types.change, handler);
        this.bind(kEvent.Types.change, handler);
    }
}

export class Point2D extends Vector2 {
    constructor(x: number, y: number) { super(x, y); }
}

export class Pair<T> {
    public l    : T;
    public r    : T;

    constructor(l: T, r: T) { this.l = l; this.r = r; }
}