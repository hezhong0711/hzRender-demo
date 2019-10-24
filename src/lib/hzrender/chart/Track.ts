import {Chart, ChartCfg, ChartModal} from "@/lib/hzrender/basic/Chart";
import {Point} from "@/lib/hzrender/unit/Point";
import {Circle} from "@/lib/hzrender/shape/Circle";
import {ScaleType} from "@/lib/hzrender/basic/Displayable";

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

export class Track extends Chart {
    trackModals: Array<TrackModal> = [];

    constructor(cfg: TrackCfg) {
        super(cfg);
        this.selfAdaptation.paddingRight = cfg.paddingRight ? cfg.paddingRight : RADIOUS;
        this.selfAdaptation.paddingTop = cfg.paddingTop ? cfg.paddingTop : RADIOUS;
        this.selfAdaptation.paddingLeft = cfg.paddingLeft ? cfg.paddingLeft : RADIOUS;
        this.selfAdaptation.paddingBottom = cfg.paddingBottom ? cfg.paddingBottom : RADIOUS;
        this.processData(cfg.data);
        console.log(this.trackModals);
    }

    processData(data: Array<any>) {
        for (let item of data.slice(0, 30)) {
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

