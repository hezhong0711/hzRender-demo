import {hzRender} from "@/lib/hzrender/hzRender";
import {Circle} from "@/lib/hzrender/shape/Circle";
import {Rect} from "@/lib/hzrender/shape/Rect";
import {Polyline} from "@/lib/hzrender/shape/Polyline";
import {Point} from "@/lib/hzrender/unit/Point";

export let drawIndex = () => {
    let hz = new hzRender({
        id: 'main',
        width: 300,
        height: 150,
        touchEventCfg: {}
    });

    let circle = new Circle({
        cx: 10,
        cy: 10,
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
        onTap: () => console.log('click rect')
    });
    let points: Array<Point> = [];
    points.push(new Point(5, 13, 'red'));
    points.push(new Point(105, 133, '#330033'));
    points.push(new Point(105, 13, '#234234'));
    points.push(new Point(5, 23, '#229922'));
    points.push(new Point(120, 133));
    let polyline = new Polyline({
        points: points,
        lineWidth: 2,
        smooth: 0,
        lineGradient: true
    });
    hz.add(circle);
    hz.add(rect);
    hz.add(polyline);
    hz.render();
    console.log({
        hzRender: hz
    });
};
