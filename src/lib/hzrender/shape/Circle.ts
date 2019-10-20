import {Displayable, DisplayableCfg, ScaleType} from "@/lib/hzrender/basic/Displayable";
import Geometry from "@/lib/hzrender/tool/geometry";
import {Point} from "@/lib/hzrender/unit/Point";

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
        let scaleC = this.getScaleCenterPoint();
        console.log(scaleC);
        let scaleR = this.getScaleRadius();
        // console.log(`${scaleR}=${this.r}*${this.scaleInfo.scale}`);
        context.beginPath();
        context.arc(scaleC.x, scaleC.y, scaleR, 0, 2 * Math.PI);
        context.setFillStyle(this.color);
        context.fill();
    }

    contain(x: number, y: number): boolean {
        let p1 = new Point(x, y);
        let p2 = this.getScaleCenterPoint();
        let distance = Geometry.calcDistance(p1, p2);
        return distance <= this.r * this.scaleInfo.scale;
    }

    pan(deltaX: number, deltaY: number): void {
        this.c.move(deltaX, deltaY);
    }

    private getScaleCenterPoint() {
        if (this.scaleType == ScaleType.NONE) {
            return this.c;
        }
        return Point.scale(this.c, this.scaleInfo);
    }

    private getScaleRadius() {
        if (this.scaleType == ScaleType.SHAPE) {
            return this.r * this.scaleInfo.scale;
        }
        return this.r;
    }
}

interface CircleCfg extends DisplayableCfg {
    cx: number;
    cy: number;
    r?: number;
    color?: string;
}
