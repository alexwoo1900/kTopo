import { Pair } from "../Base";
import { NetworkNode } from "./interface";
import { Deque } from "../Deque";
import Utils from "../Utils";

let _checked: Array<NetworkNode> = new Array<NetworkNode>();

/**
 * Breadth First Search (BFS)
 * 
 * @param q         Container that store nodes hierarchically. 
 *                  A pair of nodes can be stored at the same time to serve some special structure like Edge.
 * @param src       Starting node of BFS.
 * @param callback  The function (animation) to be called during traversal.
 * @param duration  Time interval for each set of animation.
 */
export async function BFS<T extends NetworkNode>(q: Deque<Pair<T> >, src: T, callback: (m: T, n: T) => any, duration: number = 0) {
    _checked.length = 0;

    q.pushBack(new Pair<T> (src, src));

    while (!q.empty()) {
        let {l, r} = q.popFront()!;

        if(_checked.indexOf(r) == -1) {
            _checked.push(r);
        } else {
            continue;
        }
        
        callback(l, r);
        await Utils.sleep(duration);

        r.neighbours!.forEach((k) => {
            q.pushBack(new Pair<T>(r, k));
        });
    }
}