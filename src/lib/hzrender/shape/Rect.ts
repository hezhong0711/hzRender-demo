import {Displayable, DisplayableCfg} from "@/lib/hzrender/basic/Displayable";
import {Coordinate} from "@/lib/hzrender/tool/geometry";

export class Rect extends Displayable {
    p: Coordinate;
    width: number;
    height: number;
    color: string;

    constructor(cfg: RectCfg) {
        super(cfg);
        this.p = new Coordinate(cfg.px, cfg.py);
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
        context.beginPath();
        context.rect(this.p.x * this.scaleInfo.scale,
            this.p.y * this.scaleInfo.scale,
            this.width * this.scaleInfo.scale,
            this.height * this.scaleInfo.scale);
        context.setFillStyle(this.color);
        context.fill();
    }

}

interface RectCfg extends DisplayableCfg {
    px: number;
    py: number;
    width: number;
    height: number;
    color?: string;
}
