import { NetworkNode } from "./interface";
import Utils from "../Utils";

let _checked: Array<NetworkNode> = new Array<NetworkNode>();

/**
 *  Depth First Search (DFS)
 * 
 * @param l         Last traversed node.
 * @param r         Current node.
 * @param callback  The function (animation) to be called during traversal.
 * @param duration  Time interval for each set of animation.
 * @param firstRun  If true, reset all global variables.
 * @returns 
 */
export async function DFS<T extends NetworkNode> (l: T, r: T, callback: (m: T, n: T) => any, duration: number = 0, firstRun = true) {
    if (firstRun) {
        _checked.length = 0;
    }

    if(_checked.indexOf(r) == -1) {
        _checked.push(r);
    } else {
        return;
    }

    callback(l, r);
    await Utils.sleep(duration);

    let ks = r.neighbours!;
    for (let i = 0; i < ks.length; ++i) {
        await DFS<T>(r, r.neighbours![i], callback, duration, false);
    }
}