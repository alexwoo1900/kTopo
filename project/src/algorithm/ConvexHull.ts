import { Vector2 } from "../Base";

function computeDirectedProduct<T extends Vector2> (a: T, b: T, c: T, eps = 1E-6) {
    let area = a.x * b.y + c.x * a.y + b.x * c.y - c.x * b.y - b.x * a.y - a.x * c.y;
    if (Math.abs(area) < eps) {
        return 0;
    } else {
        return area;
    }
}

function findPeak<T extends Vector2> (output: Array<T>, input: Array<T>, p1: T, p2: T): void {
    let area: number, downMaxArea: number = 0;
    let peak: T | null = null;
    let nextInput = input.filter((p: T) => {
        area = computeDirectedProduct(p1, p2, p);
        if (area > 0) {
            if (area > downMaxArea) {
                downMaxArea = area;
                peak = p;
            }
            return true;
        } else {
            return false;
        }
    });
    if (peak) {
        findPeak(output, nextInput, peak, p2);
        output.push(peak);
        findPeak(output, nextInput, p1, peak);
    }
}

/**
 * Quick Hull Algorithm (nlogn ~ n^2)
 * 
 * @param output    An ordered array representing convex hull
 * @param input     Point array
 */
export function generateConvexHull<T extends Vector2> (output: Array<T>, input: Array<T>) {
    let topLeft: T, bottomRight: T;
    topLeft = bottomRight = input[0];
    input.forEach((p: T) => {
        if ((p.x < topLeft.x) || (p.x == topLeft.x && p.y < topLeft.y)){
            topLeft = p;
        } else if ((p.x > bottomRight.x) || (p.x == bottomRight.x && p.y > bottomRight.y)) {
            bottomRight = p;
        }
    });
    
    findPeak(output, input, topLeft, bottomRight);
    output.push(topLeft);
    findPeak(output, input, bottomRight, topLeft);
    output.push(bottomRight);
}