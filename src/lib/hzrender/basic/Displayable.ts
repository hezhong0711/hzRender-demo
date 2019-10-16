import EventFul from "@/lib/hzrender/basic/EventFul";

export abstract class Displayable extends EventFul{
    zIndex: number;

    abstract draw(context: any): void;

    abstract contain(x: number, y: number): boolean;

    protected constructor(cfg: DisplayableCfg) {
        super();
        this.zIndex = cfg.zIndex == null ? 0 : cfg.zIndex;
    }
}

export interface DisplayableCfg {
    zIndex?: number;
}


