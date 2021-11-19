import { Point2D, Pair } from "./Base";
import { AdjGraph } from "./AdjGraph";
import { DrawableNode } from "./DrawableNode";

export enum CanvasEditMode {
    Move            = "MV", // Move
    InsertVertex    = "IV", // Insert Vertex
    InsertEdge      = "IE", // Insert Edge
    DeleteVertex    = "DV", // Delete Vertex
    DeleteEdge      = "DE"  // Delete Edge
}

export interface Snapshot {
    vertices: Array<Point2D>;
    edges: Array<Pair<number> >;
}

export class DrawableCanvas {
    protected _graph        : AdjGraph          = new AdjGraph();
    protected _editMode     : CanvasEditMode    = CanvasEditMode.Move;
    protected _initialized  : boolean           = false;
    protected _snapshot     : Snapshot          = { vertices: new Array<Point2D>(), edges: new Array<Pair<number> >()};

    add(node: DrawableNode): void {
        throw Error("This method must be implemented!");
    }

    remove(node: DrawableNode): void{
        throw Error("This method must be implemented!");
    }
}