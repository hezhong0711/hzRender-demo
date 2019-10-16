import EventFul, {EventType} from "@/lib/hzrender/basic/EventFul";
import {Coordinate} from "@/lib/hzrender/tool/geometry";

export class TouchEvent {
    private initScalePosition: ScalePosition | undefined;
    private initScale: number = 1;
    private curScalePosition: ScalePosition | undefined;
    private curScale: number | undefined;
    onScale: Function | undefined;

    constructor(private id: string) {
        uni.$on(EventFul.getEventName(EventType.onTouchStart, this.id), (event) => {
            console.log(EventFul.getEventName(EventType.onTouchStart, this.id));
            this.onTouchStart(event);
        });
        uni.$on(EventFul.getEventName(EventType.onTouchEnd, this.id), (event) => {
            console.log(EventFul.getEventName(EventType.onTouchEnd, this.id));
            this.onTouchEnd(event);
        });
        uni.$on(EventFul.getEventName(EventType.onTouchMove, this.id), (event) => {
            console.log(EventFul.getEventName(EventType.onTouchMove, this.id));
            this.onTouchMove(event);
        });
    }

    private onTouchStart(event: any) {
        let touches = event.touches;
        // console.log(touches[0].x);
        if (touches.length == 2) {
            console.log(event);
        }
    }

    private onTouchMove(event: any) {
        let touches = event.touches;
        if (touches.length != 2 || event.changedTouches.length != 2) {
            // console.log({
            //     touches: touches.length,
            //     changedTouches: event.changedTouches.length
            // });
            return;
        }
        if (this.initScalePosition == undefined) {
            console.log(111);
            this.initScalePosition = new ScalePosition(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
        } else {
            this.curScalePosition = new ScalePosition(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
            let preDistanceX = this.initScalePosition.getDistanceX();
            let curDistanceX = this.curScalePosition.getDistanceX();
            this.curScale = curDistanceX / preDistanceX * this.initScale;
            console.log({
                curDistanceX,
                preDistanceX,
                initScale: this.initScale,
                curScale: this.curScale
            })
            // this.preScalePosition = curScalePosition;
            // console.log({
            //     scale: this.curScalePosition.scale,
            //     init: this.initScalePosition,
            //     cur: this.curScalePosition
            // });
            if (this.onScale) {
                this.onScale(this.curScale, 1);
            }
        }
    }

    private onTouchEnd(event: any) {
        this.initScalePosition = undefined;
        this.initScale = this.curScale ? this.curScale : 1;

    }

}

export interface TouchEventCfg {
    scalable?: boolean;
}

export class ScalePosition {
    p1: Coordinate;
    p2: Coordinate;

    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.p1 = new Coordinate(x1, y1);
        this.p2 = new Coordinate(x2, y2);
    }

    getDistanceX() {
        return Math.abs(this.p1.x - this.p2.x);
    }
}
