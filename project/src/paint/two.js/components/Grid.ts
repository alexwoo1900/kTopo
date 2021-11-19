import Two from "two.js";

export class Grid {
    readonly width          : number;
    readonly height         : number;
    private _two            : Two | null    = null;
    private _initialized    : boolean       = false;

    constructor(w: number = 50, h: number = 50) {
        this.width = w;
        this.height = h;
    }

    init()  {
        this._initialize();
        this._initSprite();
    }

    _initialize() {
        this._two = new Two({
            type: Two.Types.canvas,
            width: this.width,
            height: this.height
        });
        this._initialized = true;
    }

    _initSprite() {
        let two = this._two!
        let col = two.makeLine(two.width / 2, 0, two.width / 2, two.height);
        let row = two.makeLine(0, two.height / 2, two.width, two.height / 2);
        row.stroke = col.stroke = "#6dcff660";

        two.update();

        $(document.body).css({
            background: "url(" + (two.renderer.domElement as HTMLCanvasElement).toDataURL("image/png") + ") 0 0 repeat",
            backgroundSize: this.width + "px " + this.height + "px"
        });

      }
}