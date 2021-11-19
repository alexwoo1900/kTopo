import Utils from "../../../Utils";

import { Vector2 } from "../../../Base";
import { Particle } from "./Particle";

export class ParticleContact {
    public particle         : Array<Particle>   = new Array<Particle>(2);
    public contactNormal    : Vector2           = new Vector2();
    public restitution      : number            = 0;
    public penetration      : number            = -1;

    resolve(duration: number) {
        this._resolveVelocity(duration)
        this._resolveInterpenetration(duration);
    }

    calculateSeparatingVelocity() {
        let relativeVelocity = this.particle[0].velocity.clone();
        if (this.particle[1]) {
            relativeVelocity.isub(this.particle[1].velocity);
        }
        return relativeVelocity.scalarProduct(this.contactNormal);
    }

    private _resolveVelocity(duration: number) {
        let seperatingVelocity = this.calculateSeparatingVelocity();

        if (seperatingVelocity > 0) {
            return;
        }

        let newSepVelocity = -seperatingVelocity * this.restitution;
        let deltaVelocity = newSepVelocity - seperatingVelocity;
        let totalInverseMass = this.particle[0].inverseMass;
        if (this.particle[1]) {
            totalInverseMass += this.particle[1].inverseMass;
        }

        if (totalInverseMass < 0 || Utils.equals(totalInverseMass, 0)) {
            return;
        }

        let impulse = deltaVelocity / totalInverseMass;

        let impulsePerIMass = this.contactNormal.mul(impulse);

        this.particle[0].velocity = this.particle[0].velocity.add(impulsePerIMass.mul(this.particle[0].inverseMass));
        if (this.particle[1]) {
            this.particle[1].velocity = this.particle[1].velocity.add(impulsePerIMass.mul(-this.particle[1].inverseMass));
        }
    }

    private _resolveInterpenetration(duration: number) {
        if (this.penetration < 0 || Utils.equals(this.penetration, 0)) {
            return;
        }

        let totalInverseMass = this.particle[0].inverseMass;
        if (this.particle[1]) {
            totalInverseMass += this.particle[1].inverseMass;
        }

        if (totalInverseMass < 0 || Utils.equals(totalInverseMass, 0)) {
            return 0;
        }

        let movePerIMass = this.contactNormal.mul(-this.penetration / totalInverseMass);

        this.particle[0].position.iadd(movePerIMass.mul(this.particle[0].inverseMass));
        if (this.particle[1]) {
            this.particle[1].position.iadd(movePerIMass.mul(this.particle[1].inverseMass));
        }
    }
}

export class ParticleContactResolver {
    private _iterations         : number;
    private _iterationsUsed     : number = 0;

    constructor(iterations: number) {
        this._iterations = iterations;
    }

    set iterations(iterations: number) {
        this._iterations = iterations;
    }

    resolveContacts(contactArray: Array<ParticleContact>, numContacts: number, duration: number) {
        this._iterationsUsed = 0;
        while (this._iterationsUsed < this._iterations) {
            let max = 0, maxIndex = numContacts;
            for (let i = 0; i < numContacts; ++i) {
                let sepVal = contactArray[i].calculateSeparatingVelocity();
                if (sepVal < max) {
                    max = sepVal;
                    maxIndex = i;
                }
            }
            contactArray[maxIndex].resolve(duration);
            ++this._iterationsUsed;
        }
    }
}

export class ParticleContactGenerator {
    addContact(contact: ParticleContact, limit: number): number {
        throw Error("This method must be implemented!");
    }
}