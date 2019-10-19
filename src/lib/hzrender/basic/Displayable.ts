import EventFul from "@/lib/hzrender/basic/EventFul";
import {ScaleInfo} from "@/lib/hzrender/basic/ScaleInfo";
import {Coordinate} from "@/lib/hzrender/tool/geometry";

export abstract class Displayable extends EventFul {
    zIndex: number;
    onTap?: () => void;
    onScale?: () => void;
    scaleInfo: ScaleInfo = new ScaleInfo();
    scaleType: ScaleType;

    abstract draw(context: any, scaleInfo?: ScaleInfo): void;

    abstract contain(x: number, y: number): boolean;

    scale(scale: number, point?: Coordinate) {
        if (this.scaleType == ScaleType.NONE) {
            return;
        }
        this.scaleInfo.scale = scale;
        if (point) {
            this.scaleInfo.coordiate = point;
        }
    }

    protected constructor(cfg: DisplayableCfg) {
        super();
        this.zIndex = cfg.zIndex == null ? 0 : cfg.zIndex;
        this.onTap = cfg.onTap;
        this.onScale = cfg.onScale;
        this.scaleType = cfg.scaleType ? cfg.scaleType : ScaleType.NONE;
    }
}

export interface DisplayableCfg {
    zIndex?: number;
    onTap?: () => void;
    onScale?: () => void;
    scaleType?: ScaleType;// 缩放类型
}

export enum ScaleType {
    NONE,// 不缩放
    SHAPE,// 缩放大小
    POSITION// 缩放位置
}


