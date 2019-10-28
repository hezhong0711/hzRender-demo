<template>
    <view class="content">
        <view>
            <canvas canvas-id="main" style="width: 400px; height: 600px;"
                    @touchstart="onTouchStart($event,'main')"
                    @touchmove="onTouchMove($event,'main')"
                    @touchend="onTouchEnd($event,'main')"></canvas>
        </view>
    </view>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {drawIndex} from "@/lib/hzrender";
    import EventFul, {EventType} from "hzrender/lib/basic/EventFul";

    export default Vue.extend({
        data() {
            return {
                title: 'Hello'
            }
        },
        onReady() {
            this.draw();
        },
        onLoad() {
        },
        methods: {
            draw() {
                console.log('draw');
                drawIndex();
            },
            onTouchStart(event: any, id: string) {
                uni.$emit(EventFul.getEventName(EventType.onTouchStart, id), event);
            },
            onTouchEnd(event: any, id: string) {
                uni.$emit(EventFul.getEventName(EventType.onTouchEnd, id), event);
            },
            onTouchMove(event:any, id:string){
                uni.$emit(EventFul.getEventName(EventType.onTouchMove, id), event);
            }
        }
    });
</script>

<style>
    .content {
        text-align: center;
        height: 400upx;
    }

    .logo {
        height: 200upx;
        width: 200upx;
        margin-top: 200upx;
    }

    .title {
        font-size: 36upx;
        color: #8f8f94;
    }

    canvas {
        width: 300upx;
        height: 150upx;
        /*background-color: 'green';*/
    }
</style>
