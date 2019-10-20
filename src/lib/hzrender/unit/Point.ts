import Geometry, {Coordinate} from "@/lib/hzrender/tool/geometry";
import {ScaleInfo} from "@/lib/hzrender/basic/ScaleInfo";

export class Point extends Coordinate {
    color: string;

    constructor(x: number, y: number, color?: string) {
        super(x, y);
        this.color = color ? color : 'black';
    }

    static scale(point: Point, scaleInfo: ScaleInfo) {
        // console.log(scaleInfo.matrix);
        let x = scaleInfo.matrix[0] * point.x + scaleInfo.matrix[2] * point.y + scaleInfo.matrix[4];
        let y = scaleInfo.matrix[1] * point.x + scaleInfo.matrix[3] * point.y + scaleInfo.matrix[5];
        return new Point(x, y, point.color);
    }

    //
    // static scale(point: Point, scaleInfo: ScaleInfo) {
    //     let p = new Point(point.x - scaleInfo.point.x, point.y - scaleInfo.point.y);
    //     let distanceScaleX = scaleInfo.point.x - scaleInfo.prevPoint.x;
    //     let distanceScaleY = scaleInfo.point.y - scaleInfo.prevPoint.y;
    //
    //     console.log({distanceScaleX, distanceScaleY, p, scaleInfo});
    //     // console.log(`${point.x} + ${scaleInfo.scale} * ${directionX}: ${scaleInfo.point.x}`);
    //     return new Point(scaleInfo.point.x + p.x * scaleInfo.scale,
    //         scaleInfo.point.y + p.y * scaleInfo.scale, point.color);
    // }

    move(distanceX: number, distanceY: number) {
        this.x = this.x + distanceX;
        this.y = this.y + distanceY;
    }
}

export class LinePath {
    start: Point;
    end: Point;

    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
    }

    toLine() {
        let line = Line.getLine(this.start, this.end);
        line.setLineStart(this.start);
        line.setLineEnd(this.end);
        return line;
    }
}

export class CatMullCurve extends LinePath {
    ctrl1: Point;
    ctrl2: Point;

    constructor(start: Point, ctrl1: Point, ctrl2: Point, end: Point) {
        super(start, end);
        this.ctrl1 = ctrl1;
        this.ctrl2 = ctrl2;
    }
}

export class Line {
    start?: Point;
    end?: Point;
    point: Point;
    k: number | null;
    b?: number;
    isKNull: boolean;

    constructor(k: number | null, b: number | undefined, point: Point) {
        this.k = k;
        this.b = b;
        this.isKNull = this.k == null;
        this.point = point;
        this.start = undefined;
        this.end = undefined;
    }

    setLineStart(pStart) {
        this.start = pStart;
    }

    setLineEnd(pEnd) {
        this.end = pEnd;
    }

    getX(y) {
        if (this.isKNull || this.k == null || this.b == undefined) {
            return null;
        }

        return (y - this.b) / this.k;
    }

    getY(x) {
        if (this.isKNull || this.k == null || this.b == undefined) {
            return this.point.y;
        }

        return this.k * x + this.b;
    }

    // 判断点和线的距离是否小于一个偏移量
    isPointInLine(point, offset) {
        let distance = Geometry.calcDistanceFromPointToLine(point, this);
        return distance <= offset;
    }

    // 判断点是否在起点和终点之间
    isPointInLineLimit(point) {
        let result = true;
        if (this.start != null && this.end != null) {

            if (this.isKNull) {
                result = point.y <= this.end.y && point.y >= this.start.y
                    || point.y <= this.start.y && point.y >= this.end.y;
            } else {
                result = point.x <= this.end.x && point.x >= this.start.x && this.start.x < this.end.x
                    || point.x >= this.end.x && point.x <= this.start.x && this.start.x > this.end.x;
            }
        }
        return result;
    }

    static getLineLimit(start: Point, end: Point) {
        let line = this.getLine(start, end);
        line.setLineStart(start);
        line.setLineEnd(end);
        return line;
    }

    static getLine(p1: Point, p2: Point) {
        let k = Line.calcK(p1, p2);
        let b: number | undefined = undefined;
        if (k != null) {
            b = p1.y - k * p1.x;
        }
        return new Line(k, b, p1);
    }

    static getLineByK(p: Point, k: number) {
        let b: number | undefined = undefined;
        if (k != null) {
            b = p.y - k * p.x;
        }
        return new Line(k, b, p);
    }

    // 计算斜率
    static calcK(p1: Point, p2: Point) {
        if (p2.x === p1.x) {
            return null;
        }
        return (p2.y - p1.y) / (p2.x - p1.x);
    }

    static calcDistance(p1: Coordinate, p2: Coordinate) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    // 计算点到线的距离
    static calcDistanceFromPointToLine(point, line) {
        // 计算垂足
        let footPoint = this.calcFootPoint(line, point);
        // 如果 垂足在线段上
        let distance = 10000;
        if (line.isPointInLineLimit(footPoint)) {
            // 计算两点的距离
            distance = this.calcDistance(point, footPoint);
        } else {
            // 计算起点或者终点的距离
            let d1 = this.calcDistance(point, line.start);
            let d2 = this.calcDistance(point, line.end);
            distance = d1 > d2 ? d2 : d1;
        }

        return distance;
    }


    // 计算点到条线的垂足
    static calcFootPoint(line, point) {
        if (line.isKNull || line.k === 0) {
            return new Point(
                line.point.x,
                point.y
            );
        }
        let kv = -1 / line.k;
        let bv = point.y - kv * point.x;
        let x = (line.b - bv) / (kv - line.k);
        let y = line.k * x + line.b;

        return new Point(
            x,
            y
        );
    }
}

