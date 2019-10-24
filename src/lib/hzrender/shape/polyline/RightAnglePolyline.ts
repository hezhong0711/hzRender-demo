import {Polyline, PolylineCfg} from "@/lib/hzrender/shape/Polyline";
import {Line, LinePath, Point} from "@/lib/hzrender/unit/Point";

export class RightAnglePolyline extends Polyline {
    startK: number;

    constructor(cfg: RightAnglePolylineCfg) {
        super(cfg);
        this.startK = cfg.startK;
    }

    draw(context: any): void {
        this.drawRightAngleLine(context);
    }

    private drawRightAngleLine(context: any) {
        this.getRightAngleLinePaths();

        for (let i = 0; i < this.linePaths.length; i++) {
            let path = this.linePaths[i];
            if (!this.inVisualArea(path)) {
                continue;
            }

            context.beginPath();
            if (this.isDash) {
                context.setLineDash([4, 6]);
            } else {
                context.setLineDash([]);
            }
            context.setLineWidth(this.lineWidth);
            if (i === 0) {
                context.moveTo(path.start.x, path.start.y);
            } else {
                context.lineTo(path.start.x, path.start.y);
            }
            context.lineTo(path.end.x, path.end.y);
            if (this.lineGradient) {
                let grd = context.createLinearGradient(path.start.x, path.start.y, path.end.x, path.end.y);
                grd.addColorStop(0, path.start.color);
                grd.addColorStop(1, path.end.color);
                context.setStrokeStyle(grd);
            } else {
                context.setStrokeStyle(this.lineColor);
            }
            context.stroke();
        }
    }

    private getRightAngleLinePaths() {
        this.linePaths = [];
        let start = null;
        let end = null;
        let foot = null;
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            if (start != null) {
                end = point;
                foot = this.drawLinkTemp(start, end, foot);
                start = end;
            } else {
                start = point;
            }
        }
    }

    private drawLinkTemp(start: Point, end: Point, pFoot: Point) {

        let p1: Point = start;
        let p2: Point = end;
        // 垂足1
        let line1: Line = Line.getLineByK(p2, this.startK);
        let p3: Point = line1.calcFootPoint(p1);
        // 垂足2

        let line2: Line = Line.getLineByK(p1, this.startK);
        let p4: Point = line2.calcFootPoint(p2);
        let p: Point = null;
        if (pFoot && (p1.x > pFoot.x && p4.x > p1.x || p1.x < pFoot.x && p4.x < p1.x)) {
            p = p4;
            let path1 = new LinePath(p1, p4);
            let path2 = new LinePath(p4, p2);
            this.linePaths.push(path1);
            this.linePaths.push(path2);
        } else {
            p = p3;
            let path1 = new LinePath(p1, p3);
            let path2 = new LinePath(p3, p2);
            this.linePaths.push(path1);
            this.linePaths.push(path2);
        }

        return p;
    }
}

export interface RightAnglePolylineCfg extends PolylineCfg {
    startK: number;
}
