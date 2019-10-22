import {hzRender} from "@/lib/hzrender/hzRender";
import {Circle} from "@/lib/hzrender/shape/Circle";
import {Rect} from "@/lib/hzrender/shape/Rect";
import {Polyline} from "@/lib/hzrender/shape/Polyline";
import {Point} from "@/lib/hzrender/unit/Point";
import {ScaleType} from "@/lib/hzrender/basic/Displayable";
import {ScaleInfo} from "@/lib/hzrender/basic/ScaleInfo";

export let drawIndex = () => {
    let hz = new hzRender({
        id: 'main',
        width: 300,
        height: 150,
        touchEventCfg: {}
    });

    let circle = new Circle({
        cx: 110,
        cy: 110,
        scaleType: ScaleType.SHAPE,
        onTap: () => {
            console.log('click circle');
        }
    });

    let rect = new Rect({
        px: 50,
        py: 30,
        width: 100,
        height: 40,
        color: '#343434',
        scaleType: ScaleType.SHAPE,
        onTap: () => console.log('click rect')
    });

    let points: Array<Point> = [];
    points.push(new Point(10, 10, 'red'));
    points.push(new Point(105, 133, '#330033'));
    points.push(new Point(105, 13, '#234234'));
    // points.push(new Point(5, 23, '#229922'));
    points.push(new Point(120, 133));

    let polyline = new Polyline({
        zIndex: 100,
        points: points,
        lineWidth: 2,
        smooth: 1,
        // lineGradient: true,
        isDash: false,
        lineColor: 'blue',
        scaleType: ScaleType.SHAPE,
        onTap: () => console.log('click polyline')
    });

    hz.add(circle);
    hz.add(rect);
    hz.add(polyline);
    hz.render();

    // console.log({
    //     hzRender: hz
    // });
    // let scaleInfo = new ScaleInfo();
    //
    // let p = new Point(2, 2);
    // for (let i = 0; i < 5; i++) {
    //     change(i, scaleInfo);
    //     scaleInfo.scale = scaleInfo.scale * scaleInfo.deltaScale;
    //     scaleInfo.lastOffset = new Point(
    //         scaleInfo.lastOffset.x * scaleInfo.deltaScale + (1 - scaleInfo.deltaScale) * scaleInfo.point.x,
    //         scaleInfo.lastOffset.y * scaleInfo.deltaScale + (1 - scaleInfo.deltaScale) * scaleInfo.point.y
    //     );
    //     console.log(scale(p, scaleInfo));
    // }
};

let scale = (point: Point, scaleInfo: ScaleInfo) => {
    let x = scaleInfo.scale * point.x + scaleInfo.lastOffset.x;
    let y = scaleInfo.scale * point.y + scaleInfo.lastOffset.y;
    return new Point(x, y);
};

let change = (id: number, scaleInfo: ScaleInfo) => {
    switch (id) {
        case 0:
            scaleInfo = new ScaleInfo();
            break;
        case 1:
            scaleInfo.deltaScale = 1.5;
            scaleInfo.point = new Point(5, 5);
            break;
        case 2:
            scaleInfo.deltaScale = 1;
            scaleInfo.point = new Point(8, 8);
            break;
        case 3:
            scaleInfo.deltaScale = 1.01;
            scaleInfo.point = new Point(8, 8);
            break;
        case 4:
            scaleInfo.deltaScale = 1;
            scaleInfo.point = new Point(8, 8);
            break;
    }
}
