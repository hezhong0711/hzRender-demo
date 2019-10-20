import EventFul from "@/lib/hzrender/basic/EventFul";
import {ScaleInfo} from "@/lib/hzrender/basic/ScaleInfo";

export abstract class Displayable extends EventFul {
    zIndex: number;
    onTap?: () => void;
    onScale?: () => void;
    onPan?: (x: number, y: number) => void;
    scaleInfo: ScaleInfo = new ScaleInfo();
    scaleType: ScaleType;

    abstract draw(context: any, scaleInfo?: ScaleInfo): void;

    abstract contain(x: number, y: number): boolean;

    scale( scaleInfo:ScaleInfo) {
        if (this.scaleType == ScaleType.NONE) {
            return;
        }
        this.scaleInfo = scaleInfo;
    }

    abstract pan(deltaX: number, deltaY: number): void;

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

export enum ScaleType {
    NONE,// 不缩放
    SHAPE,// 缩放大小
    POSITION// 缩放位置
}


