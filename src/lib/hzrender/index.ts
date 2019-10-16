import {hzRender} from "@/lib/hzrender/hzRender";
import {Circle} from "@/lib/hzrender/shape/Circle";

export let drawIndex = () => {
    let hz = new hzRender({
        id: 'main',
        width: 300,
        height: 150,
        touchEventCfg:{}
    });

    let circle = new Circle({
        cx: 10,
        cy: 10,
    });
    hz.add(circle);
    hz.render();
    console.log({
        hzRender: hz
    });
};
