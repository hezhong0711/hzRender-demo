import {Line} from "@/lib/hzrender/unit/Point";

export default class Geometry {
    static calcDistance(p1: Coordinate, p2: Coordinate) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    // 计算点到条线的垂足
    static calcFootPoint(line, point) {
        if (line.isKNull == null || line.k === 0) {
            return new Coordinate(
                line.point.x,
                point.y
            );
        }
        let kv = -1 / line.k;
        let bv = point.y - kv * point.x;
        let x = (line.b - bv) / (kv - line.k);
        let y = line.k * x + line.b;

        return new Coordinate(
            x,
            y
        );
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
}

export class Coordinate {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

}
