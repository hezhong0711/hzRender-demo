import {Displayable, DisplayableCfg, ScaleType} from "@/lib/hzrender/basic/Displayable";
import {Point} from "@/lib/hzrender/unit/Point";

export class Rect extends Displayable {
    p: Point;
    width: number;
    height: number;
    color: string;

    constructor(cfg: RectCfg) {
        super(cfg);
        this.p = new Point(cfg.px, cfg.py);
        this.width = cfg.width;
        this.height = cfg.height;
        this.color = cfg.color == null ? 'blue' : cfg.color;
    }

    contain(x: number, y: number): boolean {
        let deltaX = x - this.p.x * this.scaleInfo.scale;
        let deltaY = y - this.p.y * this.scaleInfo.scale;

        return deltaX >= 0 && deltaX <= this.width * this.scaleInfo.scale
            && deltaY >= 0 && deltaY <= this.height * this.scaleInfo.scale;

    }

    draw(context: any): void {
        let point = this.getScalePoint();
        let wh = this.getScaleWidthAndHeight();
        context.beginPath();
        context.rect(point.x, point.y, wh.width, wh.height);
        context.setFillStyle(this.color);
        context.fill();
    }

    pan(deltaX: number, deltaY: number): void {
        this.p.move(deltaX, deltaY);
    }

    private getScalePoint() {
        if (this.scaleType == ScaleType.NONE) {
            return this.p;
        }
        return Point.scale(this.p, this.scaleInfo);
    }

    private getScaleWidthAndHeight() {
        if (this.scaleType == ScaleType.SHAPE) {
            return {
                width: this.width * this.scaleInfo.scale,
                height: this.height * this.scaleInfo.scale
            };
        }
        return {
            width: this.width,
            height: this.height
        };
    }

}

interface RectCfg extends DisplayableCfg {
    px: number;
    py: number;
    width: number;
    height: number;
    color?: string;
}
