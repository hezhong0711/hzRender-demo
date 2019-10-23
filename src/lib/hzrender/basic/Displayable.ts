import EventFul from "@/lib/hzrender/basic/EventFul";
import {ScaleInfo} from "@/lib/hzrender/basic/ScaleInfo";
import {Point} from "@/lib/hzrender/unit/Point";

export abstract class Displayable extends EventFul {
    zIndex: number;
    onTap?: () => void;
    onScale?: () => void;
    onPan?: (x: number, y: number) => void;
    scaleInfo: ScaleInfo = new ScaleInfo();
    scaleType: ScaleType;
    visualSize: VisualSize = new VisualSize();

    abstract draw(context: any, scaleInfo?: ScaleInfo): void;

    abstract contain(x: number, y: number): boolean;

    abstract inVisualArea(params?: any): boolean;

    scale(scaleInfo: ScaleInfo) {
        if (this.scaleType == ScaleType.NONE) {
            return;
        }
        this.scaleInfo = scaleInfo;
    }

    abstract pan(scaleInfo: ScaleInfo): void;

    getScaleLength(length: number) {
        if (this.scaleType == ScaleType.SHAPE) {
            return length * this.scaleInfo.scale;
        }
        return length;
    }

    getScalePoint(point: Point) {
        if (this.scaleType == ScaleType.NONE) {
            return point;
        }
        return Point.scale(point, this.scaleInfo);
    }

    protected constructor(cfg: DisplayableCfg) {
        super();
        this.zIndex = cfg.zIndex == null ? 0 : cfg.zIndex;
        this.onTap = cfg.onTap;
        this.onPan = cfg.onPan;
        this.onScale = cfg.onScale;
        this.scaleType = cfg.scaleType ? cfg.scaleType : ScaleType.NONE;
    }
}

export interface DisplayableCfg {
    zIndex?: number;
    onTap?: () => void;
    onPan?: (x: number, y: number) => void;
    onScale?: () => void;
    scaleType?: ScaleType;// 缩放类型
}

export class VisualSize {
    width: number = 0;
    height: number = 0;
}

export enum ScaleType {
    NONE,// 不缩放
    SHAPE,// 缩放大小
    POSITION// 缩放位置
}


