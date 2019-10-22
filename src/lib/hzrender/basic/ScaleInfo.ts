import {Point} from "@/lib/hzrender/unit/Point";

export class ScaleInfo {
    lastScale: number = 1;
    deltaScale: number = 1;
    scale: number = 1;
    index: number = 0;
    lastOffset: Point = new Point(0, 0);
    point: Point = new Point(0, 0);
    prevPoint: Point = new Point(0, 0);
}

