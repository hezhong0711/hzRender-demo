import {Coordinate} from "@/lib/hzrender/tool/geometry";

export class Point extends Coordinate {
    color: string;

    constructor(x: number, y: number, color?: string) {
        super(x, y);
        this.color = color ? color : 'black';
    }

    static scale(point: Point, scale: number) {
        return new Point(point.x * scale, point.y * scale, point.color);
    }
}

export class Line {
    start: Point;
    end: Point;

    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
    }
}

export class CatMullCurve extends Line {
    ctrl1: Point;
    ctrl2: Point;

    constructor(start: Point, ctrl1: Point, ctrl2: Point, end: Point) {
        super(start, end);
        this.ctrl1 = ctrl1;
        this.ctrl2 = ctrl2;
    }


}
