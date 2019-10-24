import {Point} from "@/lib/hzrender/unit/Point";

export class SelfAdaptation {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    width: number;
    height: number;
    scaleX: number = 1;
    scaleY: number = 1;
    offsetX: number = 0;
    offsetY: number = 0;

    constructor(cfg: SelfAdaptationCfg) {
        this.width = cfg.width;
        this.height = cfg.height;
        this.paddingTop = cfg.paddingTop ? cfg.paddingTop : 0;
        this.paddingBottom = cfg.paddingBottom ? cfg.paddingBottom : 0;
        this.paddingLeft = cfg.paddingLeft ? cfg.paddingLeft : 0;
        this.paddingRight = cfg.paddingRight ? cfg.paddingRight : 0;
    }

    adapt(points: Array<Point>) {
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        for (let point of points) {
            minX = SelfAdaptation.getMin(minX, point.x);
            maxX = SelfAdaptation.getMax(maxX, point.x);
            minY = SelfAdaptation.getMin(minY, point.y);
            maxY = SelfAdaptation.getMax(maxY, point.y);
        }
        let deltaX = maxX - minX;
        let deltaY = maxY - minY;


        this.scaleX = deltaX == 0 ? 1 : (this.width - this.paddingLeft - this.paddingRight) / (maxX - minX);
        this.scaleY = deltaY == 0 ? 1 : (this.height - this.paddingTop - this.paddingBottom) / (maxY - minY);
        this.offsetX = this.paddingLeft - minX * this.scaleX;
        this.offsetY = this.paddingTop - minY * this.scaleY;
    }

    static getMin(a: number, b: number) {
        return a > b ? b : a;
    }

    static getMax(a: number, b: number) {
        return a > b ? a : b;
    }
}

export interface SelfAdaptationCfg {
    width: number;
    height: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
}
