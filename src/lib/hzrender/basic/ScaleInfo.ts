import {Point} from "@/lib/hzrender/unit/Point";

export class ScaleInfo {
    matrix = [1, 0, 0, 1, 0, 0];//x缩放，无，无，y缩放，x平移，y平移
    lastScale: number = 1;
    lastTranslate = new Point(0, 0);
    lastPoint: Point = new Point(0, 0);
    posCenter: Point = new Point(0, 0);
    lastCenter: Point = new Point(0, 0);
    center: Point = new Point(0, 0);
}
