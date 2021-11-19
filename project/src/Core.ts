import { CanvasEditMode }               from "./DrawableCanvas";
import { Canvas, ComputationalCanvas }  from "./paint/two.js/components/Canvas";
import { Grid }                         from "./paint/two.js/components/Grid";
import { Vertex }                       from "./paint/two.js/components/Vertex";
import { Edge }                         from "./paint/two.js/components/Edge";
import { CoordLabel, WeightLabel }      from "./paint/two.js/components/Text";
import { Button }                       from "./paint/two.js/misc/Widget";

let kTopo = {
    CanvasEditMode      : CanvasEditMode,
    Canvas              : Canvas,
    ComputationalCanvas : ComputationalCanvas,
    Grid                : Grid,
    Vertex              : Vertex,
    Edge                : Edge,
    CoordLabel          : CoordLabel,
    WeightLabel         : WeightLabel,
    Button              : Button
}

export default kTopo;

