import {Point} from "@/lib/hzrender/unit/Point";

export class ScaleInfo {
    scale: number = 1;
    point: Point = new Point(0, 0);
    prevPoint: Point = new Point(0, 0);
}
