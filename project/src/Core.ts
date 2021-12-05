import { CanvasEditMode }               from "./DrawableCanvas";
import { Canvas, ComputationalCanvas }  from "./paint/two.js/components/Canvas";
import { Grid }                         from "./paint/two.js/components/Grid";
import { Vertex }                       from "./paint/two.js/components/Vertex";
import { Edge }                         from "./paint/two.js/components/Edge";
import { ComponentLabel }               from "./paint/two.js/components/Label";
import { Button }                       from "./paint/two.js/misc/Widget";

let kTopo = {
    CanvasEditMode      : CanvasEditMode,
    Canvas              : Canvas,
    ComputationalCanvas : ComputationalCanvas,
    Grid                : Grid,
    Vertex              : Vertex,
    Edge                : Edge,
    ComponentLabel      : ComponentLabel,
    Button              : Button
}

export default kTopo;

