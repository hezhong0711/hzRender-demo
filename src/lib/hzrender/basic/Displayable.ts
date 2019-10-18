import EventFul from "@/lib/hzrender/basic/EventFul";
import {ScaleInfo} from "@/lib/hzrender/basic/ScaleInfo";
import {Coordinate} from "@/lib/hzrender/tool/geometry";

export abstract class Displayable extends EventFul {
    zIndex: number;
    onTap?: () => void;
    onScale?: () => void;
    scaleInfo: ScaleInfo = new ScaleInfo();

    abstract draw(context: any, scaleInfo?: ScaleInfo): void;

    abstract contain(x: number, y: number): boolean;

    scale(scale: number, point?: Coordinate) {
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
    }
}

export interface DisplayableCfg {
    zIndex?: number;
    onTap?: () => void;
    onScale?: () => void;
}


