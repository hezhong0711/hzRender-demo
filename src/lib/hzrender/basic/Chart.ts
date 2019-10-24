import {SelfAdaptation, SelfAdaptationCfg} from "@/lib/hzrender/basic/SelfAdaptation";
import {hzRender} from "@/lib/hzrender/hzRender";

export class Chart {
    hz: hzRender;
    selfAdaptation: SelfAdaptation;

    constructor(cfg: ChartCfg) {
        this.hz = cfg.hz;
        this.selfAdaptation = new SelfAdaptation({
            width: cfg.width,
            height: cfg.height
        });
    }
}

export interface ChartCfg extends SelfAdaptationCfg {
    hz: hzRender,
}

export class ChartModal {

}

