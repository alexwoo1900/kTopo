import Two from "two.js";
import { Point2D } from "./Base"

export default class Utils {
    static assert(condition: any, msg?: string): asserts condition {
        if (!condition) {
            throw new Error(msg)
        }
    }

    static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    static uuid() {
        let temp_url = URL.createObjectURL(new Blob());
        let uuid = temp_url.toString();
        URL.revokeObjectURL(temp_url);
        return uuid.substr(uuid.lastIndexOf("/") + 1);
    }

    static equals(m: number, n: number, eps=1E-6) {
        return Math.abs(m - n) < eps;
    }

    static random(m: number, n: number) {
        let rand = Math.random();
        return m + Math.floor(rand * (n - m));
    }

    static randomInt(m: number, n: number) {
        let rand = Math.random();
        return Math.floor(m + Math.floor(rand * (n - m)));
    }

    static checkInside(rect: Two.BoundingClientRect, x: number, y: number) {
        return !(rect.top > y || rect.bottom < y || rect.left > x || rect.right < x);
    }

    /**
     * Check whether (a, b) and (c, d) are collinear
     * 
     * @param {Point2D} a
     * @param {Point2D} b
     * @param {Point2D} c
     * @param {Point2D} d
     * @returns 
     */
    static checkSameSegment(a: Point2D, b: Point2D, c: Point2D, d: Point2D) {
        return Utils.equals(a.x, c.x) && Utils.equals(a.y, c.y) && Utils.equals(b.x, d.x) && Utils.equals(b.y, d.y) || 
                Utils.equals(a.x, d.x) && Utils.equals(a.y, d.y) && Utils.equals(b.x, c.x) && Utils.equals(b.y, c.y);
    }

    /**
     * Check whether (a, b) and (c, d) strictly intersect
     * 
     * @param {Point2D} a
     * @param {Point2D} b
     * @param {Point2D} c
     * @param {Point2D} d
     * @returns
     */
    static checkStrictIntersection(a: Point2D, b: Point2D, c: Point2D, d: Point2D) {
        if (Math.max(a.x, b.x) < Math.min(c.x, d.x) ||
            Math.max(a.y, b.y) < Math.min(c.y, d.y) ||
            Math.max(c.x, d.x) < Math.min(a.x, b.x) ||
            Math.max(c.y, d.y) < Math.min(a.y, b.y)) {
            return false;
        }

        if ((((a.x - c.x) * (d.y - c.y) - (a.y - c.y) * (d.x - c.x)) *
            ((b.x - c.x) * (d.y - c.y) - (b.y - c.y) * (d.x - c.x))) < 0 ||
            (((c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x)) *
            ((d.x - a.x) * (b.y - a.y) - (d.y - a.y) * (b.x - a.x))) < 0) {
            return true;
        } else {
            return false;
        }
    }
}