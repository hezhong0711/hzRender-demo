import EventFul, {EventType} from "@/lib/hzrender/basic/EventFul";
import AnyTouch from "any-touch";

export class TouchEvent {
    anyTouch = new AnyTouch();
    private scale: number = 1;
    private lastTimeStamp: number = 0;
    onScale: Function | undefined;
    onTap: Function | undefined;

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

            this.requestAnimationFrame(ev.timestamp, () => {
                if (this.onScale) {
                    this.onScale(this.scale);
                }
            });
        });

        this.anyTouch.on('tap', ev => {
            this.requestAnimationFrame(ev.timestamp, () => {
                if (this.onTap) {
                    this.onTap(ev.x, ev.y, this.scale);
                }
            });
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

    private requestAnimationFrame = (currentTimeStemp: number, callback: () => void) => {
        let deltaTimeStamp = currentTimeStemp - this.lastTimeStamp;
        if (deltaTimeStamp > 50) {
            this.lastTimeStamp = currentTimeStemp;
            callback();
        }
    }

}

export interface TouchEventCfg {
    scalable?: boolean;
}
