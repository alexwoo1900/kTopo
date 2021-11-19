import { Vector2 } from "../../../Base";
import { Particle } from "./Particle";
import { ParticleForceGenerator } from "./ForceGenerator";

export class ParticleGravity extends ParticleForceGenerator {
    protected _gravity : Vector2;

    constructor(g: Vector2) {
        super();
        this._gravity = g;
    }

    updateForce(p: Particle, duration: number) {
        if (!p.hasFiniteMass()) return;

        p.addForce(this._gravity.mul(p.mass));
    }
}