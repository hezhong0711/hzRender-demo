import EventFul, {EventType} from "@/lib/hzrender/basic/EventFul";
import AnyTouch from "any-touch";
import {ScaleInfo} from "@/lib/hzrender/basic/ScaleInfo";
import {Point} from "@/lib/hzrender/unit/Point";

export class TouchEvent {
    FRAME_RATE: number = 1000 / 60;
    anyTouch = new AnyTouch();
    private scaleInfo: ScaleInfo = new ScaleInfo();
    private lastTimeStamp: number = 0;
    onScale: Function | undefined;
    onTap: Function | undefined;
    onPan: Function | undefined;
    deltaPanX: number = 0;
    deltaPanY: number = 0;
    gesturePanStatus: GestureStatus = GestureStatus.NONE;
    gesturePinchStatus: GestureStatus = GestureStatus.NONE;


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
            if (this.gesturePinchStatus == GestureStatus.START) {
                this.gesturePinchStatus = GestureStatus.ON;
            }
            if (this.gesturePinchStatus == GestureStatus.ON) {
                // console.log('pinch');
                if (ev.center) {
                    let a = ev.deltaScale * this.scaleInfo.lastScale;
                    let d = a;
                    let e = (1 - ev.deltaScale) * (ev.center.x - (this.scaleInfo.lastPoint.x + this.scaleInfo.lastTranslate.x) + this.scaleInfo.lastTranslate.x);
                    let f = (1 - ev.deltaScale) * (ev.center.y - (this.scaleInfo.lastPoint.y + this.scaleInfo.lastTranslate.y) + this.scaleInfo.lastTranslate.y);

                    this.scaleInfo.matrix = [a, 0, 0, d, e, f];
                    // this.scaleInfo.point = new Point(ev.center.x, ev.center.y);
                    // this.scaleInfo.scale = this.scaleInfo.scale * ev.deltaScale;
                    this.requestAnimationFrame(ev.timestamp, () => {
                        if (this.onScale) {
                            this.onScale(this.scaleInfo);

                            this.scaleInfo.lastTranslate.x = e;
                            this.scaleInfo.lastTranslate.y = f;
                            this.scaleInfo.lastScale = a;
                        }
                    });
                    // this.scaleInfo.prevPoint = this.scaleInfo.point;
                }
            }
        });

        this.anyTouch.on('pinchstart', ev => {
            if (this.gesturePinchStatus == GestureStatus.NONE) {
                this.gesturePinchStatus = GestureStatus.START;
                console.log('pinchstart');
                this.scaleInfo.lastTranslate = new Point(this.scaleInfo.matrix[4], this.scaleInfo.matrix[5]);
                this.scaleInfo.posCenter = new Point(ev.x, ev.y);
                this.scaleInfo.lastCenter = new Point(this.scaleInfo.center.x + this.scaleInfo.lastTranslate.x,
                    this.scaleInfo.center.y + this.scaleInfo.lastTranslate.y);
                this.scaleInfo.posCenter = new Point(ev.x - this.scaleInfo.lastCenter.x,
                    ev.y - this.scaleInfo.lastCenter.y);
            }
        });

        this.anyTouch.on('pinchend', ev => {
            if (this.gesturePinchStatus == GestureStatus.ON
                || this.gesturePinchStatus == GestureStatus.START) {
                console.log('pinchend');
                this.gesturePinchStatus = GestureStatus.NONE;
            }
        });

        this.anyTouch.on('tap', ev => {
            console.log('tap');
            this.requestAnimationFrame(ev.timestamp, () => {
                if (this.onTap) {
                    this.onTap(ev.x, ev.y);
                }
            });
        });

        this.anyTouch.on('panstart', ev => {
            if (this.gesturePanStatus == GestureStatus.NONE) {
                this.gesturePanStatus = GestureStatus.START;
                console.log('panstart');
                this.scaleInfo.lastTranslate = new Point(this.scaleInfo.matrix[4], this.scaleInfo.matrix[5]);
            }
        });
        this.anyTouch.on('panend', ev => {
            if (this.gesturePanStatus == GestureStatus.ON
                || this.gesturePanStatus == GestureStatus.START) {
                console.log('panend');
                this.gesturePanStatus = GestureStatus.NONE;
                this.scaleInfo.matrix[4] = 0;
                this.scaleInfo.matrix[5] = 0;
            }
        });
        this.anyTouch.on('pan', ev => {
            if (this.gesturePanStatus == GestureStatus.START) {
                this.gesturePanStatus = GestureStatus.ON;
            }
            if (this.gesturePanStatus == GestureStatus.ON) {
                // console.log('pan');

                this.deltaPanX += ev.deltaX;
                this.deltaPanY += ev.deltaY;
                this.requestAnimationFrame(ev.timestamp, () => {
                    this.scaleInfo.matrix[4] = this.scaleInfo.lastTranslate.x + this.deltaPanX;
                    this.scaleInfo.matrix[5] = this.scaleInfo.lastTranslate.y + this.deltaPanY;
                    if (this.onPan) {
                        this.onPan(this.scaleInfo.matrix[4], this.scaleInfo.matrix[5]);
                    }
                    this.deltaPanX = 0;
                    this.deltaPanY = 0;
                });
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

enum GestureStatus {
    NONE,
    START,
    ON,
}
