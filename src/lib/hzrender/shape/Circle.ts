import {Displayable, DisplayableCfg} from "@/lib/hzrender/basic/Displayable";
import Geometry from "@/lib/hzrender/tool/Geometry";
import {Point} from "@/lib/hzrender/unit/Point";
import {ScaleInfo} from "@/lib/hzrender/basic/ScaleInfo";

export class Circle extends Displayable {
    c: Point;
    r: number;
    color: string;

    constructor(cfg: CircleCfg) {
        super(cfg);
        this.c = new Point(cfg.cx, cfg.cy);
        this.r = cfg.r == null ? 10 : cfg.r;
        this.color = cfg.color == null ? 'blue' : cfg.color;
    }

    draw(context: CanvasContext): void {
        let scaleC = this.getScalePoint(this.c);
        let scaleR = this.getScaleLength(this.r);
        context.beginPath();
        context.arc(scaleC.x, scaleC.y, scaleR, 0, 2 * Math.PI);
        context.setFillStyle(this.color);
        context.fill();
    }

    contain(x: number, y: number): boolean {
        let p1 = new Point(x, y);
        let p2 = this.getScalePoint(this.c);
        let distance = Geometry.calcDistance(p1, p2);
        return distance <= this.getScaleLength(this.r);
    }

    pan(scaleInfo: ScaleInfo): void {
        this.c.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
    }
}

interface CircleCfg extends DisplayableCfg {
    cx: number;
    cy: number;
    r?: number;
    color?: string;
}
