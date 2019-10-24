import {Chart, ChartCfg, ChartModal} from "@/lib/hzrender/basic/Chart";
import {Line, LinePath, Point} from "@/lib/hzrender/unit/Point";
import {Circle} from "@/lib/hzrender/shape/Circle";
import {ScaleType} from "@/lib/hzrender/basic/Displayable";
import {RightAnglePolyline} from "@/lib/hzrender/shape/polyline/RightAnglePolyline";

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
    solidLinePoints: Array<Array<Point>> = [];
    dashLinePoints: Array<Array<Point>> = [];

    constructor(cfg: TrackCfg) {
        super(cfg);
        this.selfAdaptation.paddingRight = cfg.paddingRight ? cfg.paddingRight : RADIOUS;
        this.selfAdaptation.paddingTop = cfg.paddingTop ? cfg.paddingTop : RADIOUS;
        this.selfAdaptation.paddingLeft = cfg.paddingLeft ? cfg.paddingLeft : RADIOUS;
        this.selfAdaptation.paddingBottom = cfg.paddingBottom ? cfg.paddingBottom : RADIOUS;
        this.process(cfg.data);

        console.log(this.trackModals);
        console.log(this.solidLinePoints);
        console.log(this.dashLinePoints);
    }

    process(data: Array<any>) {
        // data
        for (let item of data.slice(0, MAX_DATA_SIZE)) {
            this.trackModals.push(TrackModal.mapper(item as TrackDataModal));
        }

        this.splitTrackModal();

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

        let startK = Line.calcK(this.solidLinePoints[0][0], this.solidLinePoints[0][1]);
        this.solidLinePoints.forEach(points => {
            let adaptPoints = points.map((p) => {
                return this.selfAdaptation.adaptPoint(p);
            });
            if (adaptPoints.length > 1) {
                this.hz.add(new RightAnglePolyline({
                    startK: startK,
                    points: adaptPoints,
                    lineWidth: 2,
                    smooth: 1,
                    // lineGradient: true,
                    // isDash: true,
                    lineColor: 'blue',
                    scaleType: ScaleType.POSITION,
                    onTap: () => console.log('click polyline')
                }));
            }
        });


        this.dashLinePoints.forEach(points => {
            let adaptPoints = points.map((p) => {
                return this.selfAdaptation.adaptPoint(p);
            });
            if (adaptPoints.length > 1) {
                this.hz.add(new RightAnglePolyline({
                    startK: startK,
                    points: adaptPoints,
                    lineWidth: 2,
                    smooth: 1,
                    // lineGradient: true,
                    isDash: true,
                    lineColor: 'blue',
                    scaleType: ScaleType.POSITION,
                    onTap: () => console.log('click polyline')
                }));
            }
        });
    }

    splitTrackModal() {
        let idx: [number, number] = [0, 0];
        let lastReadType: ReadType = '0';
        for (let i = 0; i < this.trackModals.length; i++) {
            let modal = this.trackModals[i];
            // readType 与上一次 readType相同，加入到上一次的容器中
            if (lastReadType === modal.readType ||
                (lastReadType === '0' && modal.readType === '1')) {
                this.addLinePathPoint(lastReadType, modal.point, idx);
            }
            // 如果不相同，则要在上一个容器中添加，然后在另一个容器中新添加意向
            else {
                this.addLinePathPoint(lastReadType, modal.point, idx);
                switch (modal.readType) {
                    case '0':
                    case '1':
                        idx[0]++;
                        break;
                    case '2':
                        idx[1]++;
                        break;
                }
                this.addLinePathPoint(modal.readType, modal.point, idx);
            }
            lastReadType = modal.readType;
        }
    }

    private addLinePathPoint(readType: ReadType, point: Point, idx: [number, number]) {
        switch (readType) {
            case '0':
            case '1': {
                let arr = this.solidLinePoints[idx[0]];
                if (arr == null) {
                    arr = [point];
                } else {
                    arr.push(point);
                }
                this.solidLinePoints[idx[0]] = arr;
            }
                break;
            case '2': {
                let arr = this.dashLinePoints[idx[1]];
                if (arr == null) {
                    arr = [point];
                } else {
                    arr.push(point);
                }
                this.dashLinePoints[idx[1]] = arr;
            }
                break;

        }
    }

    render() {
        this.hz.render();
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

