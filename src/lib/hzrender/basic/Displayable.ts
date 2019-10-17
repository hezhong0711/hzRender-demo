import EventFul from "@/lib/hzrender/basic/EventFul";

export abstract class Displayable extends EventFul {
    zIndex: number;
    onTap: () => void;

    abstract draw(context: any): void;

    abstract contain(x: number, y: number, scale: number): boolean;

    protected constructor(cfg: DisplayableCfg) {
        super();
        this.zIndex = cfg.zIndex == null ? 0 : cfg.zIndex;
        this.onTap = cfg.onTap == null ? () => {
        } : cfg.onTap;
    }
}

export interface DisplayableCfg {
    zIndex?: number;
    onTap?: () => void;
}


