import Utils from "./Utils"

export class AdjNode {
    readonly ID: string = Utils.uuid();
    private _successors: Map<string, AdjNode | undefined> = new Map<string, AdjNode | undefined>();

    constructor() {}

    getNext(id: string): AdjNode | undefined {
        return this._successors.get(id);
    }

    setNext(id: string, node?: AdjNode) {
        this._successors.set(id, node);
    }

    removeNext(id: string) {
        this._successors.delete(id);
    }
}

export class AdjLinkedList {
    readonly rootID : string;
    readonly header : AdjNode   = new AdjNode();
    private _tailer : AdjNode   = this.header;
    private _length : number    = 0;

    constructor(id: string) {
        this.rootID = id;
    }

    getAllNodes(): Array<AdjNode> {
        let listNodes = new Array<AdjNode>();
        let currNode = this.header.getNext(this.rootID);
        while (currNode) {
            listNodes.push(currNode);
            currNode = currNode.getNext(this.rootID);
        }
        return listNodes;
    }

    /**
     * Get the number of nodes in the current linked list
     * 
     * @returns Number of nodes
     */
    count(): number {
        return this._length;
    }

    /**
     * Check whether the specified node exists in the current linked list
     * 
     * @param {AdjNode} node 
     * @returns 
     */
    exists(node: AdjNode): boolean {
        let currNode = this.header.getNext(this.rootID);
        while (currNode) {
            if (currNode.ID == node.ID) {
                return true;
            } else {
                currNode = currNode.getNext(this.rootID);
            }
        }
        return false;
    }

    /**
     * Add the target node to the current linked list
     * 
     * @param {AdjNode} node 
     */
    add(node: AdjNode): void {
        let currNode: AdjNode | undefined;
        currNode = this.header;
        while(currNode) {
            if (this.rootID == node.ID || currNode.ID == node.ID) {
                break;
            } else if (currNode.ID == this._tailer.ID) {
                this._tailer.setNext(this.rootID, node);
                this._tailer = this._tailer.getNext(this.rootID)!;
                ++this._length;
                break;
            } else {
                currNode = currNode.getNext(this.rootID);
            }
        }
    }

    /**
     * Remove(not delete) the target node from the current linked list
     * 
     * @param {AdjNode} node 
     */
    remove(node: AdjNode) {
        let prevNode = this.header;
        let currNode = prevNode.getNext(this.rootID);
        while (currNode) {
            if (currNode.ID == node.ID) {
                if (this._tailer.ID == node.ID) {
                    this._tailer = prevNode;
                }
                prevNode.setNext(this.rootID, currNode.getNext(this.rootID));
                currNode.removeNext(this.rootID);
                --this._length;
                break;
            } else {
                prevNode = prevNode.getNext(this.rootID)!;
                currNode = currNode.getNext(this.rootID);
            }
        }
    }

    clear() {
        while (this._tailer != this.header) {
            this.remove(this.header.getNext(this.rootID)!);
        }
    }
}

export class AdjGraph {
    private _nodes: Array<AdjNode> = new Array<AdjNode>();;
    private _llists: Map<string, AdjLinkedList> = new Map<string, AdjLinkedList>();;

    constructor() {}

    private _store(node: AdjNode): void {
        if (this._nodes.indexOf(node) == -1) {
            this._nodes.push(node);
        }
    }

    private _withdraw(node: AdjNode): void {
        let idx = this._nodes.indexOf(node);
        if (idx != -1) {
            this._nodes.splice(idx, 1);
        }
    }

    getAdjNodes(node: AdjNode): Array<AdjNode> {
        let llist = this._llists.get(node.ID);
        if (llist) {
            return llist.getAllNodes();
        } else {
            return [];
        }
    }

    getRandomNode() {
        return this._nodes[Utils.randomInt(0, this._nodes.length)];
    }

    /**
     * Add isolated node to the scene
     * 
     * @param {AdjNode} node 
     */
    add(node: AdjNode): void {
        this._store(node);
        if (!this._llists.get(node.ID)) {
            this._llists.set(node.ID, new AdjLinkedList(node.ID));
        }
    }

    /**
     * Add two adjacent nodes to the scene
     * 
     * @param {AdjNode} firstNode 
     * @param {AdjNode} secondNode 
     */
    addPair(firstNode: AdjNode, secondNode: AdjNode): void {
        this.add(firstNode);
        this.add(secondNode);
        this._llists.get(firstNode.ID)!.add(secondNode);
        this._llists.get(secondNode.ID)!.add(firstNode);
    }

    /**
     * Clear all adjacency relationships of the target node
     * 
     * @param {AdjNode} node 
     */
    isolate(node: AdjNode) {
        let llist = this._llists.get(node.ID);
        if (llist) {
            let currNode = llist.header.getNext(llist.rootID);
            let nextNode = null;
            while (currNode) {
                nextNode = currNode.getNext(llist.rootID);
                this._llists.get(currNode.ID)!.remove(node);
                currNode = nextNode;
            }
            llist.clear();
        }
    }

    /**
     * Remove the target node from the scene
     * 
     * @param {AdjNode} node 
     */
    remove(node: AdjNode) {
        this.isolate(node);
        this._llists.delete(node.ID);
        this._withdraw(node);
    }

    checkConnection(firstNode: AdjNode, secondNode: AdjNode) {
        return firstNode.ID != secondNode.ID && this._llists.get(firstNode.ID) && this._llists.get(firstNode.ID)!.exists(secondNode);
    }
}

