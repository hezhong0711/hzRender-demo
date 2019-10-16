import {Displayable} from "@/lib/hzrender/basic/Displayable";
import {TouchEvent, TouchEventCfg} from "@/lib/hzrender/basic/TouchEvent";

export class hzRender {
    id: string;
    width?: number;
    height?: number;
    backgroundScalbale?: boolean;
    touchEventCfg?: TouchEventCfg;

    touchEvent: TouchEvent | undefined = undefined;
    private list: Array<Displayable> = [];
    private context: CanvasContext;

    constructor(cfg: hzRenderCfg) {
        console.log({
            message: 'hzRender init'
        });

        this.id = cfg.id;
        this.context = uni.createCanvasContext(this.id);

        this.width = cfg.width ? 0 : cfg.width;
        this.height = cfg.height ? 0 : cfg.height;
        this.backgroundScalbale = cfg.backgroundScalable ? false : cfg.backgroundScalable;
        this.touchEventCfg = cfg.touchEventCfg;

        if (this.touchEventCfg) {
            this.registerEvent();
        }
    }

    add(shape: Displayable) {
        this.list.push(shape);
    }

    render() {
        this.list.sort((a, b) => {
            return a.zIndex - b.zIndex;
        });

        this.list.forEach(item => {
            item.draw(this.context);
        });

        this.context.draw();
    }

    destory() {

    }

    private registerEvent() {
        this.touchEvent = new TouchEvent(this.id);
        this.touchEvent.onScale = (scalex: number, scaley: number) => {
            this.context.scale(scalex, scaley);
            this.context.save();
            this.render();
        }
    }

}

interface hzRenderCfg {
    id: string;
    width?: number;
    height?: number;
    // 背景进行缩放，图形不缩放
    backgroundScalable?: boolean;
    touchEventCfg?: TouchEventCfg;
}

