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
        context.arc(this.c.x, this.c.y, this.r, 0, 2 * Math.PI);
        context.setFillStyle(this.color);

        context.fill();
    }

    contain(x: number, y: number): boolean {
        let p = new Coordinate(x, y);
        let distance = Geometry.calcDistance(p, this.c);
        return distance <= this.r;
    }
}

interface CircleCfg extends DisplayableCfg {
    cx: number;
    cy: number;
    r?: number;
    color?: string;
}
