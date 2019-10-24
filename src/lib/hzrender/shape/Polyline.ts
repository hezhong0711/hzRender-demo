import {Displayable, DisplayableCfg} from "@/lib/hzrender/basic/Displayable";
import {CatMullCurve, Line, LinePath, Point} from "@/lib/hzrender/unit/Point";
import {ScaleInfo} from "@/lib/hzrender/basic/ScaleInfo";

export class Polyline extends Displayable {
    points: Array<Point> = [];
    smooth: number = 0;
    lineWidth?: number;
    lineColor?: string;
    lineGradient?: boolean;
    isDash?: boolean;
    isHighlight: boolean = false;
    highlightStyle?: PolylineStyle;
    clickable: boolean;
    linePaths: Array<LinePath> = [];
    catMullPaths: Array<CatMullCurve> = [];
    tapOffset: number;

    constructor(cfg: PolylineCfg) {
        super(cfg);
        this.points = cfg.points;
        this.smooth = cfg.smooth ? cfg.smooth : 0;
        this.lineWidth = cfg.lineWidth ? cfg.lineWidth : 1;
        this.lineGradient = cfg.lineGradient ? cfg.lineGradient : false;
        this.lineColor = cfg.lineColor ? cfg.lineColor : 'black';
        this.isDash = cfg.isDash ? cfg.isDash : false;
        this.tapOffset = cfg.tapOffset ? cfg.tapOffset : 2;
        this.highlightStyle = cfg.highlightStyle ? cfg.highlightStyle : new PolylineStyle();
        this.clickable = cfg.clickable ? cfg.clickable : false;
    }

    contain(x: number, y: number): boolean {
        let point = new Point(x, y);
        for (let i = 0; i < this.linePaths.length; i++) {
            let path = this.linePaths[i];
            let distance = path.toLine().calcDistanceFromPointToLine(point);
            if (distance < this.tapOffset) {
                return true;
            }
        }
        return false;
    }

    inVisualArea(linePath: LinePath): boolean {
        if (linePath instanceof CatMullCurve) {

            return !(!this.isPointInVisualArea(linePath.start)
                && !this.isPointInVisualArea(linePath.end)
                && !this.isPointInVisualArea(linePath.ctrl1)
                && !this.isPointInVisualArea(linePath.ctrl2)
                && !this.isLineInVisualArea(linePath.toLine()));
        }

        return !(!this.isPointInVisualArea(linePath.start)
            && !this.isPointInVisualArea(linePath.end)
            && !this.isLineInVisualArea(linePath.toLine()));
    }

    draw(context: any): void {
        if (this.smooth === 0) {
            this.drawLine(context);
        } else {
            this.drawCatMull(context);
        }
    }

    pan(scaleInfo: ScaleInfo): void {
        this.points.forEach(point => {
            point.move(scaleInfo.panOffset.x, scaleInfo.panOffset.y);
        });
    }

    tap() {
        if (this.clickable) {
            super.tap();
            this.isHighlight = true;
        }
    }

    unTap() {
        super.unTap();
        this.isHighlight = false;
    }

    private isLineInVisualArea(line: Line): boolean {
        return !(line.getCrossPointToLine(this.visualSize.topLine()) == null
            && line.getCrossPointToLine(this.visualSize.bottomLine()) == null
            && line.getCrossPointToLine(this.visualSize.leftLine()) == null
            && line.getCrossPointToLine(this.visualSize.rightLine()) == null);
    }

    private isPointInVisualArea(point: Point): boolean {
        return point.x <= this.visualSize.width
            && point.x >= 0
            && point.y <= this.visualSize.height
            && point.y >= 0;
    }

    private drawLine(context: any) {
        this.linePaths = this.getLinePaths();

        for (let i = 0; i < this.linePaths.length; i++) {
            let path = this.linePaths[i];
            if (!this.inVisualArea(path)) {
                // console.log('line is out of visual area');
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

    private drawCatMull(context: any) {
        this.catMullPaths = this.getCatMullPaths();
        // console.log(this.catMullPaths);
        for (let i = 0; i < this.catMullPaths.length; i++) {
            let path = this.catMullPaths[i];
            if (!this.inVisualArea(path)) {
                // console.log('cat mull curve is out of visual area');
                continue;
            }
            context.beginPath();
            context.moveTo(path.start.x, path.start.y);
            if (this.isDash) {
                context.setLineDash([4, 6]);
            } else {
                context.setLineDash([]);
            }
            context.setLineWidth(this.lineWidth);
            context.bezierCurveTo(path.ctrl1.x, path.ctrl1.y, path.ctrl2.x, path.ctrl2.y, path.end.x, path.end.y);
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

    private getCatMullPaths() {
        let cache: Array<CatMullCurve> = [];
        let data = this.points;

        let p0, p1, p2, p3, bp1, bp2, d1, d2, d3, A, B, N, M;
        let d3powA, d2powA, d3pow2A, d2pow2A, d1pow2A, d1powA;
        let length = data.length;
        for (let i = 0; i < length - 1; i++) {

            p0 = i == 0 ? Point.scale(data[0], this.scaleInfo)
                : Point.scale(data[i - 1], this.scaleInfo);
            p1 = Point.scale(data[i], this.scaleInfo);
            p2 = Point.scale(data[i + 1], this.scaleInfo);
            p3 = i + 2 < length ? Point.scale(data[i + 2], this.scaleInfo) : p2;

            d1 = Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
            d2 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
            d3 = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));

            d3powA = Math.pow(d3, this.smooth);
            d3pow2A = Math.pow(d3, 2 * this.smooth);
            d2powA = Math.pow(d2, this.smooth);
            d2pow2A = Math.pow(d2, 2 * this.smooth);
            d1powA = Math.pow(d1, this.smooth);
            d1pow2A = Math.pow(d1, 2 * this.smooth);

            A = 2 * d1pow2A + 3 * d1powA * d2powA + d2pow2A;
            B = 2 * d3pow2A + 3 * d3powA * d2powA + d2pow2A;
            N = 3 * d1powA * (d1powA + d2powA);
            if (N > 0) {
                N = 1 / N;
            }
            M = 3 * d3powA * (d3powA + d2powA);
            if (M > 0) {
                M = 1 / M;
            }

            bp1 = {
                x: (-d2pow2A * p0.x + A * p1.x + d1pow2A * p2.x) * N,
                y: (-d2pow2A * p0.y + A * p1.y + d1pow2A * p2.y) * N
            };

            bp2 = {
                x: (d3pow2A * p1.x + B * p2.x - d2pow2A * p3.x) * M,
                y: (d3pow2A * p1.y + B * p2.y - d2pow2A * p3.y) * M
            };

            if (bp1.x == 0 && bp1.y == 0) {
                bp1 = p1;
            }
            if (bp2.x == 0 && bp2.y == 0) {
                bp2 = p2;
            }

            cache.push(new CatMullCurve(p1, bp1, bp2, p2));
        }
        return cache;
    }

    private getLinePaths() {
        let cache: Array<LinePath> = [];

        for (let i = 1; i < this.points.length; i++) {
            cache.push(
                new LinePath(this.getScalePoint(this.points[i - 1]), this.getScalePoint(this.points[i]))
            );
        }
        return cache;
    }

}

export interface PolylineCfg extends DisplayableCfg {
    points: Array<Point>;
    isDash?: boolean;
    lineWidth?: number;
    lineColor?: string;
    lineGradient?: boolean;
    smooth?: number;
    tapOffset?: number;
    highlightStyle?: PolylineStyle;
    clickable?: boolean;
}

export class PolylineStyle {
    color: string = 'black';
    lineWidth: number = 3;
    lineGradient: boolean = false;
}
