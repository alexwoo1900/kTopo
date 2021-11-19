import Utils from "../../../Utils";

import { Particle } from "./Particle";
import { ParticleForceRegistry } from "./ForceGenerator";
import { ParticleContact, ParticleContactGenerator, ParticleContactResolver } from "./Contact";

type Particles = Array<Particle>;
type ContactGenerators = Array<ParticleContactGenerator>;

class ParticleWorld {
    
    private _particles              : Particles                 = new Array<Particle>();
    private _contactGenerators      : ContactGenerators         = new Array<ParticleContactGenerator>();
    private _registry               : ParticleForceRegistry     = new ParticleForceRegistry();
    private _resolver               : ParticleContactResolver;
    private _contacts               : Array<ParticleContact>;
    private _calculateIterations    : boolean;
    private _maxContacts            : number;
    

    constructor(maxContacts: number, iterations: number = 0) {
        this._resolver = new ParticleContactResolver(iterations);
        this._contacts = new Array<ParticleContact>(maxContacts);
        this._maxContacts = maxContacts;
        this._calculateIterations = (iterations == 0);
    }

    get particles() {
        return this._particles;
    }

    get contactGenerators() {
        return this._contactGenerators;
    }

    get forceRegistry() {
        return this._registry;
    }

    startFrame() {
        this._particles.forEach((p: Particle) => {
            p.clearAccumulator();
        });
    }

    generateContacts() {
        let limit = this._maxContacts;
        let nextIdx = 0;

        for (let i = 0; i < this.contactGenerators.length; ++i) {
            let used = this.contactGenerators[i].addContact(this._contacts[nextIdx], limit);
            limit -= used;
            nextIdx += used;
            if (limit < 0 || Utils.equals(limit, 0)) {
                break;
            }
        }
        
        return this._maxContacts - limit;
    }

    integrate(duration: number) {
        this._particles.forEach((p: Particle) => {
            p.integrate(duration);
        });
    }

    runPhysics(duration: number) {
        this._registry!.updateForces(duration);

        this.integrate(duration);

        let usedContacts = this.generateContacts();

        if (this._calculateIterations) {
            this._resolver.iterations = usedContacts * 2;
            this._resolver.resolveContacts(this._contacts, usedContacts, duration);
        }
    }
}