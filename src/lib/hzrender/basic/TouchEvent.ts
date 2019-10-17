import EventFul, {EventType} from "@/lib/hzrender/basic/EventFul";
import {Coordinate} from "@/lib/hzrender/tool/geometry";
import AnyTouch from "any-touch";

export class TouchEvent {
    anyTouch = new AnyTouch();
    private scale: number = 1;
    private lastTimeStemp: number = 0;
    onScale: Function | undefined;

    constructor(private id: string) {
        uni.$on(EventFul.getEventName(EventType.onTouchStart, this.id), (event) => {
            this.anyTouch.catchEvent(this.mapTouchEvent(event));
        });
        uni.$on(EventFul.getEventName(EventType.onTouchEnd, this.id), (event) => {
            this.anyTouch.catchEvent(this.mapTouchEvent(event));
        });
        uni.$on(EventFul.getEventName(EventType.onTouchMove, this.id), (event) => {
            this.anyTouch.catchEvent(this.mapTouchEvent(event));
        });

        this.anyTouch.on('pinch', ev => {
            this.scale = this.scale * ev.deltaScale;
            console.log(this.scale);
            if (this.onScale) {
                if (this.requestAnimationFrame(ev.timestamp)) {
                    this.onScale(this.scale, this.scale);
                }
            }
        });
    }

    // 将 touchEvent 装换成 anyTouch 可以使用的类型
    private mapTouchEvent(event: any) {
        for (let touch of event.touches) {
            touch.clientX = touch.x;
            touch.clientY = touch.y;
        }
        for (let touch of event.changedTouches) {
            touch.clientX = touch.x;
            touch.clientY = touch.y;
        }
        return event;
    }

    private requestAnimationFrame = (currentTimeStemp: number) => {
        let deltaTimeStemp = currentTimeStemp - this.lastTimeStemp;
        if (deltaTimeStemp > 50) {
            this.lastTimeStemp = currentTimeStemp;
            return true;
        }
        return false;
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
