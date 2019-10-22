import {Point} from "@/lib/hzrender/unit/Point";

export class ScaleInfo {
    deltaScale: number = 1;
    scale: number = 1;
    lastOffset: Point = new Point(0, 0);
    point: Point = new Point(0, 0);
    panOffset: Point = new Point(0, 0);
}

