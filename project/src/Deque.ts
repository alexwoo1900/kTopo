export class Deque<T> {
    private _data: Array<T> = new Array<T>();

    constructor() {

    }

    get size(): number {
        return this._data.length;
    }

    at(i: number): T {
        return this._data[i];
    }

    empty(): boolean {
        return this._data.length == 0;
    }

    front(): T | undefined {
        if (!this.empty()) {
            return this._data[0];
        } else {
            return undefined;
        }
    }

    back(): T | undefined {
        if (!this.empty()) {
            return this._data[this._data.length - 1];
        } else {
            return undefined;
        }
    }

    pushBack(elem: T) {
        this._data.push(elem);
    }

    pushFront(elem: T) {
        this._data.unshift(elem);
    }

    popBack(): T | undefined{
        return this._data.pop();
    }

    popFront(): T | undefined {
        return this._data.shift();
    }

    clear() {
        this._data.length = 0;
    }
}