import { Particle } from "./Particle";

export class ParticleForceGenerator {
    updateForce(p: Particle, duration: number) {
        throw Error("This method must be implemented!");
    }
}

export class ParticleForceRegistration {
    public particle         : Particle | null                  = null;
    public forceGenerator   : ParticleForceGenerator | null    = null;
}

type Registry = Array<ParticleForceRegistration>

export class ParticleForceRegistry {
    private _registrations : Registry = new Array<ParticleForceRegistration>();

    constructor() {

    }

    add(p: Particle, fg: ParticleForceGenerator) {
        let registration = new ParticleForceRegistration();
        registration.particle = p;
        registration.forceGenerator = fg;
        this._registrations.push(registration);
    }

    remove(p: Particle, fg: ParticleForceGenerator) {
        for (let i = this._registrations.length - 1; i >= 0; --i) {
            if (this._registrations[i].particle == p && this._registrations[i].forceGenerator == fg) {
                this._registrations.splice(i, 1);
            }
        }
    }

    clear() {
        this._registrations.length = 0;
    }

    updateForces(duration: number) {
        this._registrations.forEach((registration: ParticleForceRegistration) => {
            registration.forceGenerator!.updateForce(registration.particle!, duration);
        })
    }
}