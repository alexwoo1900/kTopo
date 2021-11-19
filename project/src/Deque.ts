export class Deque<T> {
    private _nodes: Array<T> = new Array<T>();

    constructor() {

    }

    get size(): number {
        return this._nodes.length;
    }

    at(i: number): T {
        return this._nodes[i];
    }

    empty(): boolean {
        return this._nodes.length == 0;
    }

    front(): T | undefined {
        if (!this.empty()) {
            return this._nodes[0];
        } else {
            return undefined;
        }
    }

    back(): T | undefined {
        if (!this.empty()) {
            return this._nodes[this._nodes.length - 1];
        } else {
            return undefined;
        }
    }

    pushBack(elem: T) {
        this._nodes.push(elem);
    }

    pushFront(elem: T) {
        this._nodes.unshift(elem);
    }

    popBack(): T | undefined{
        return this._nodes.pop();
    }

    popFront(): T | undefined {
        return this._nodes.shift();
    }

    clear() {
        this._nodes.length = 0;
    }
}