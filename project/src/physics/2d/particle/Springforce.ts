import { Point2D } from "../../../Base";
import { ParticleForceGenerator } from "./ForceGenerator";
import { Particle } from "./Particle";

export class ParticleSpring extends ParticleForceGenerator {
    protected _theOther         : Particle;
    protected _springConstant   : number;
    protected _restLength       : number;

    constructor(theOther: Particle, sc: number, rl: number) {
        super();
        this._theOther = theOther;
        this._springConstant = sc;
        this._restLength = rl;
    }

    updateForce(p: Particle, duration: number) {
        // Hooke's law
        let forceVec = p.position.sub(this._theOther.position);
        let forceMag = Math.abs(forceVec.magnitude() - this._restLength) * this._springConstant;
        forceVec.inormalize().imul(-forceMag);

        p.addForce(forceVec);
    }
}

export class ParticleAnchoredSpring extends ParticleForceGenerator {
    protected _anchor           : Point2D;
    protected _springConstant   : number;
    protected _restLength       : number;

    constructor(anchor: Point2D, sc: number, rl: number) {
        super();
        this._anchor = anchor;
        this._springConstant = sc;
        this._restLength = rl;
    }

    updateForce(p: Particle, duration: number) {
        let forceVec = p.position.sub(this._anchor);
        let forceMag = Math.abs(forceVec.magnitude() - this._restLength) * this._springConstant;
        forceVec.inormalize().imul(-forceMag);
        p.addForce(forceVec);
    }
}

export class ParticleBungee extends ParticleForceGenerator {
    protected _theOther         : Particle;
    protected _springConstant   : number;
    protected _restLength       : number;

    constructor(theOther: Particle, sc: number, rl: number) {
        super();
        this._theOther = theOther;
        this._springConstant = sc;
        this._restLength = rl;
    }

    updateForce(p: Particle, duration:number) {
        let forceVec = p.position.sub(this._theOther.position);
        let mag = forceVec.magnitude();
        if (mag <= this._restLength) return;
        let forceMag = (mag - this._restLength) * this._springConstant;
        forceVec.inormalize().imul(-forceMag);

        p.addForce(forceVec);
    }
}

export class ParticleAnchoredBungee extends ParticleForceGenerator {
    protected _anchor           : Point2D;
    protected _springConstant   : number;
    protected _restLength       : number;

    constructor(anchor: Point2D, sc: number, rl: number) {
        super();
        this._anchor = anchor;
        this._springConstant = sc;
        this._restLength = rl;
    }

    updateForce(p: Particle, duration:number) {
        let forceVec = p.position.sub(this._anchor);
        let mag = forceVec.magnitude();
        if (mag <= this._restLength) return;
        let forceMag = (mag - this._restLength) * this._springConstant;
        forceVec.inormalize().imul(-forceMag);

        p.addForce(forceVec);
    }
}