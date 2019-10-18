import {hzRender} from "@/lib/hzrender/hzRender";
import {Circle} from "@/lib/hzrender/shape/Circle";
import {Rect} from "@/lib/hzrender/shape/Rect";

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
    hz.add(circle);
    hz.add(rect);
    hz.render();
    console.log({
        hzRender: hz
    });
};
