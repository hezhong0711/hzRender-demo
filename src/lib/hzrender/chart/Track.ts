import {Chart, ChartCfg, ChartModal} from "@/lib/hzrender/basic/Chart";
import {Line, LinePath, Point} from "@/lib/hzrender/unit/Point";
import {Circle} from "@/lib/hzrender/shape/Circle";
import {ScaleType} from "@/lib/hzrender/basic/Displayable";
import {Polyline} from "@/lib/hzrender/shape/Polyline";

const colorList = [
    'rgba(151,0,237,1)',
    'rgba(15,226,251,1)',
    'rgba(255,95,129,1)',
    'rgba(255,214,152,1)',
    'rgba(255,95,129,1)',
    'rgba(254,143,142,1)',
    'rgba(244,91,245,1)',
    'rgba(253,161,134,1)',
    'rgba(254,206,98,1)',
    'rgba(255,144,147,1)',
    'rgba(138,184,255,1)'];
const RADIOUS = 5;
const MAX_DATA_SIZE = 30;

export class Track extends Chart {
    trackModals: Array<TrackModal> = [];
    solidLinePaths: Array<LinePath> = [];
    dashLinePaths: Array<LinePath> = [];

    constructor(cfg: TrackCfg) {
        super(cfg);
        this.selfAdaptation.paddingRight = cfg.paddingRight ? cfg.paddingRight : RADIOUS;
        this.selfAdaptation.paddingTop = cfg.paddingTop ? cfg.paddingTop : RADIOUS;
        this.selfAdaptation.paddingLeft = cfg.paddingLeft ? cfg.paddingLeft : RADIOUS;
        this.selfAdaptation.paddingBottom = cfg.paddingBottom ? cfg.paddingBottom : RADIOUS;
        this.processPoint(cfg.data);

        console.log(this.trackModals);
        console.log(this.solidLinePaths);
        console.log(this.dashLinePaths);
    }

    processPoint(data: Array<any>) {
        for (let item of data.slice(0, MAX_DATA_SIZE)) {
            this.trackModals.push(TrackModal.mapper(item as TrackDataModal));
        }
        let points = this.trackModals.map((v) => {
            return v.point
        });
        this.selfAdaptation.adapt(points);

        for (let modal of this.trackModals) {
            this.hz.add(new Circle({
                cx: modal.point.x * this.selfAdaptation.scaleX + this.selfAdaptation.offsetX,
                cy: modal.point.y * this.selfAdaptation.scaleY + this.selfAdaptation.offsetY,
                r: RADIOUS,
                color: modal.point.color,
                scaleType: ScaleType.POSITION,
                onTap: () => {
                    console.log('click circle');
                }
            }));
        }
        this.calcAllPoint();
        this.solidLinePaths.forEach(path => {
            let start = this.selfAdaptation.adaptPoint(path.start);
            let end = this.selfAdaptation.adaptPoint(path.end);
            this.hz.add(new Polyline({
                points: [start, end],
                lineWidth: 2,
                smooth: 0,
                lineGradient: true,
                // isDash: true,
                lineColor: 'blue',
                scaleType: ScaleType.POSITION,
                onTap: () => console.log('click polyline')
            }));
            // console.log(start, end);
        });
        this.dashLinePaths.forEach(path => {
            let start = this.selfAdaptation.adaptPoint(path.start);
            let end = this.selfAdaptation.adaptPoint(path.end);
            this.hz.add(new Polyline({
                points: [start, end],
                lineWidth: 2,
                smooth: 0,
                lineGradient: true,
                isDash: true,
                lineColor: 'blue',
                scaleType: ScaleType.POSITION,
                onTap: () => console.log('click polyline')
            }));
            // console.log(start, end);
        });
    }

    render() {
        this.hz.render();
    }

    private calcAllPoint() {
        let line = Line.getLine(this.trackModals[0].point, this.trackModals[1].point);
        let start = null;
        let end = null;
        let foot = null;
        for (let i = 0; i < MAX_DATA_SIZE; i++) {
            let item = this.trackModals[i];
            // item.readType *= 1;
            if (start != null) {
                end = item;
                let isDash = end.readType === '2';
                foot = this.drawLinkTemp(start, end, line.k, foot, isDash);
                start = end;
            } else {
                start = item;
            }
        }
    }

    private drawLinkTemp(start: TrackModal, end: TrackModal, k: number, pFoot: Point, isDash: boolean) {

        let p1: TrackModal = start;
        let p2: TrackModal = end;
        // 垂足1
        let line1: Line = Line.getLineByK(p2.point, k);
        let p3: Point = line1.calcFootPoint(p1.point);
        // 垂足2

        let line2: Line = Line.getLineByK(p1.point, k);
        let p4: Point = line2.calcFootPoint(p2.point);
        let p: Point = null;
        if (start.readType === '0') {
            p = p1.point;
            let path = new LinePath(p1.point, p2.point);
            this.addLinePath(isDash, path);
        } else if (pFoot && (p1.point.x > pFoot.x && p4.x > p1.point.x || p1.point.x < pFoot.x && p4.x < p1.point.x)) {
            p = p4;
            let path1 = new LinePath(p1.point, p4);
            let path2 = new LinePath(p4, p2.point);

            this.addLinePath(isDash, path1);
            this.addLinePath(isDash, path2);
        } else {
            p = p3;
            let path1 = new LinePath(p1.point, p3);
            let path2 = new LinePath(p3, p2.point);
            this.addLinePath(isDash, path1);
            this.addLinePath(isDash, path2);
        }

        return p;
    }

    private addLinePath(isDash: boolean, path: LinePath) {
        if (isDash) {
            this.dashLinePaths.push(path);
        } else {
            this.solidLinePaths.push(path);
        }
    }
}

interface TrackCfg extends ChartCfg {
    data: any
}

export class TrackModal extends ChartModal {
    point: Point;
    title: string;
    content: string;
    id: string;
    readType: ReadType;

    static mapper(data: TrackDataModal) {
        let modal = new TrackModal();
        modal.point = new Point(data.list_x, data.list_y, colorList[data.list_type]);
        modal.title = data.list_title;
        modal.content = data.list_content;
        modal.readType = data.read_type as ReadType;
        modal.id = data.list_id;
        return modal;
    }

}

export class TrackDataModal {
    list_id: string;
    read_type: string;
    list_title: string;
    list_content: string;
    list_x: number;
    list_y: number;
    list_type: number;
}


type ReadType = '0' | '1' | '2';

