import {Displayable} from "@/lib/hzrender/basic/Displayable";
import {TouchEvent, TouchEventCfg} from "@/lib/hzrender/basic/TouchEvent";

export class hzRender {
    id: string;
    width: number;
    height: number;
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

        this.width = cfg.width ? cfg.width : 0;
        this.height = cfg.height ? cfg.height : 0;
        this.backgroundScalbale = cfg.backgroundScalable ? false : cfg.backgroundScalable;
        this.touchEventCfg = cfg.touchEventCfg;

        if (this.touchEventCfg) {
            this.registerEvent();
        }
    }

    add(shape: Displayable) {
        this.list.push(shape);

        this.list.sort((a, b) => {
            return a.zIndex - b.zIndex;
        });
    }

    clear() {
        this.context.clearRect(20, 20, 40, 40);
        this.context.draw(true);
    }

    render() {
        this.list.forEach(item => {
            item.draw(this.context);
        });

        this.context.draw();

        // setTimeout(() => {
        //     this.onScale(1.5);
        //     // this.clear();
        //     // this.context.draw();
        // }, 2000);
    }

    destory() {

    }

    private onScale(scale: number) {
        // this.clear();
        // this.context.scale(scale, scale);
        for (let obj of this.list) {
            obj.scale(scale);
        }
        this.render();
    }

    private onTap(x: number, y: number) {

        for (let i = this.list.length - 1; i >= 0; i--) {
            let obj = this.list[i];
            if (obj.contain(x, y)) {
                if (obj.onTap) {
                    obj.onTap();
                }
                break;
            }
        }
    }

    private registerEvent() {
        this.touchEvent = new TouchEvent(this.id);
        this.touchEvent.onScale = (scale: number) => {
            this.onScale(scale);
        };
        this.touchEvent.onTap = (x: number, y: number) => {
            this.onTap(x, y);
        };
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

