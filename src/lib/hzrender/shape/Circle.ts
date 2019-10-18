import {Displayable, DisplayableCfg} from "@/lib/hzrender/basic/Displayable";
import Geometry, {Coordinate} from "@/lib/hzrender/tool/geometry";

export class Circle extends Displayable {
    c: Coordinate;
    r: number;
    color: string;

    constructor(cfg: CircleCfg) {
        super(cfg);
        this.c = new Coordinate(cfg.cx, cfg.cy);
        this.r = cfg.r == null ? 10 : cfg.r;
        this.color = cfg.color == null ? 'blue' : cfg.color;
    }

    draw(context: CanvasContext): void {
        context.beginPath();
        context.arc(this.c.x * this.scaleInfo.scale,
            this.c.y * this.scaleInfo.scale,
            this.r * this.scaleInfo.scale
            , 0, 2 * Math.PI);
        context.setFillStyle(this.color);
        context.fill();
    }

    contain(x: number, y: number): boolean {
        let p1 = new Coordinate(x, y);
        let p2 = new Coordinate(this.c.x * this.scaleInfo.scale, this.c.y * this.scaleInfo.scale);
        let distance = Geometry.calcDistance(p1, p2);
        return distance <= this.r * this.scaleInfo.scale;
    }
}

interface CircleCfg extends DisplayableCfg {
    cx: number;
    cy: number;
    r?: number;
    color?: string;
}
