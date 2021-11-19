import Utils from "../../../Utils";

import { Vector2, Point2D } from "../../../Base";


export class Particle
{
    protected _position     : Point2D   = new Point2D(0, 0);
    protected _velocity     : Vector2   = new Vector2(0, 0);
    protected _acceleration : Vector2   = new Vector2(0, 0);
    protected _forceAccum   : Vector2   = new Vector2(0, 0);
    protected _damping      : number    = 0.1;
    protected _inverseMass  : number    = 0.1;

    constructor() {

    }

    get position() {
        return this._position;
    }

    set position(v: Vector2) {
        this._position.copy(v);
    } 

    get velocity() {
        return this._velocity;
    }

    set velocity(v: Vector2) {
        this.velocity.copy(v);
    }

    set acceleration(v: Vector2) {
        this._acceleration.copy(v);
    }

    get acceleration() {
        return this._acceleration;
    }

    get damping() {
        return this._damping;
    }

    set damping(d: number) {
        this._damping = d;
    }

    get mass() {
        if (Utils.equals(this._inverseMass, 0)) {
            return Number.MAX_VALUE;
        } else {
            return 1 / this._inverseMass;
        }
    }

    set mass(m: number) {
        Utils.assert(m != 0);
        this.inverseMass = 1 / m;
    }

    get inverseMass() {
        return this._inverseMass
    }

    set inverseMass(im: number) {
        this._inverseMass = im;
    }

    hasFiniteMass() {
        return this._inverseMass > 0 || Utils.equals(this._inverseMass, 0);
    }

    addForce(force: Vector2) {
        this._forceAccum.iadd(force);
    }

    clearAccumulator() {
        this._forceAccum.clear();
    }

    integrate(duration: number) {
        if (this._inverseMass < 0 || Utils.equals(this._inverseMass, 0)) return;

        Utils.assert(duration > 0);

        this._position.iadd(this._velocity.mul(duration));
        let resultAcc = this._acceleration.clone();
        resultAcc.iadd(this._forceAccum.mul(this.inverseMass));
        this._velocity.iadd(resultAcc.mul(duration));
        this._velocity.imul(Math.pow(this._damping, duration));

        this.clearAccumulator();
    }
}
