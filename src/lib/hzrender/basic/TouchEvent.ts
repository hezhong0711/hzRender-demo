import EventFul, {EventType} from "@/lib/hzrender/basic/EventFul";
import AnyTouch from "any-touch";
import {Coordinate} from "@/lib/hzrender/tool/geometry";
import {ScaleInfo} from "@/lib/hzrender/basic/ScaleInfo";
import {Point} from "@/lib/hzrender/unit/Point";

export class TouchEvent {
    FRAME_RATE: number = 50;
    anyTouch = new AnyTouch();
    private scaleInfo: ScaleInfo = new ScaleInfo();
    // private scale: number = 1;
    // private scalePoint: Coordinate = new Coordinate(0, 0);
    // private scalePrevPoint: Coordinate = new Coordinate(0, 0);
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
            console.log('pinch');
            // console.log(`${this.scale * ev.deltaScale}=${this.scale}*${ev.deltaScale}`);
            // console.log(ev.x, ev.y);
            // if (ev.deltaScale == 1) {
            //     console.log({
            //         scalePoint: this.scalePoint,
            //         center: ev.center
            //     });
            //     this.scalePoint = new Coordinate(0, 0);
            // } else
            if (ev.center) {
                this.scaleInfo.point = new Point(ev.center.x, ev.center.y);
                this.scaleInfo.scale = this.scaleInfo.scale * ev.deltaScale;
                this.requestAnimationFrame(ev.timestamp, () => {
                    if (this.onScale) {
                        this.onScale(this.scaleInfo);
                    }
                });
                this.scaleInfo.prevPoint = this.scaleInfo.point;
            }
        });

        // this.anyTouch.on('pinchstart', ev => {
        //     console.log('pinchstart');
        //     if (ev.center) {
        //         this.scalePoint = new Coordinate(ev.center.x, ev.center.y);
        //     }
        // });
        // this.anyTouch.on('pinchend', ev => {
        //     console.log('pinchend');
        //     this.scalePrevPoint = this.scalePoint;
        // });

        this.anyTouch.on('tap', ev => {
            console.log('tap');
            this.requestAnimationFrame(ev.timestamp, () => {
                if (this.onTap) {
                    this.onTap(ev.x, ev.y, this.scaleInfo.scale);
                }
            });
        });

        this.anyTouch.on('pan', ev => {
            console.log('pan');
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
