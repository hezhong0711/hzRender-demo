import EventFul, {EventType} from "@/lib/hzrender/basic/EventFul";
import AnyTouch from "any-touch";

export class TouchEvent {
    FRAME_RATE: number = 50;
    anyTouch = new AnyTouch();
    private scale: number = 1;
    private lastTimeStamp: number = 0;
    onScale: Function | undefined;
    onTap: Function | undefined;
    onPan: Function | undefined;
    deltaPanX: number = 0;
    deltaPanY: number = 0;


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
            console.log(`${this.scale * ev.deltaScale}=${this.scale}*${ev.deltaScale}`);

            this.scale = this.scale * ev.deltaScale;

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

        this.anyTouch.on('pan', ev => {
            this.deltaPanX += ev.deltaX;
            this.deltaPanY += ev.deltaY;
            this.requestAnimationFrame(ev.timestamp, () => {
                if (this.onPan) {
                    this.onPan(this.deltaPanX, this.deltaPanY);
                }
                this.deltaPanX = 0;
                this.deltaPanY = 0;
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
        if (deltaTimeStamp > this.FRAME_RATE) {
            this.lastTimeStamp = currentTimeStemp;
            callback();
        }
    }

}

export interface TouchEventCfg {
    scalable?: boolean;
}
