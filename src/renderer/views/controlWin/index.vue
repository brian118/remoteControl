<template>
    <div style="height:100%">
        <!-- 渲染进程页面 -->
        <video id="screen-video"></video>
    </div>
</template>

<script>
const {ipcRenderer} = require('electron')
import peer,{createOffer} from './peer-control'

export default {
    name:'controlWin',
    data(){
        return {}
    },
    created(){
        this.init()
    },
    methods:{
        //初始化
        init(){
            const videoTag = document.getElementById('screen-video')
            //创建 offer
            createOffer().then((offer) =>{
                ipcRenderer.send('forward','offer',{
                    type:offer.type,
                    sdp:offer.sdp
                })
            })

            peer.on('add-stream', stream =>{
                this.paly(stream)
            })

            //监听键盘事件
            document.addEventListener('keydown',(e) =>{
                const data = {
                    keyCode: e.keyCode,
                    shift: e.shiftKey,
                    alt: e.altKey,
                    ctrl: e.ctrlKey,
                    meta: e.metaKey
                }
                //事件触发
                peer.emit('robot', 'key', data)
            })

            //监听鼠标点击 
            document.addEventListener('mouseup',(e) =>{
                let data = {}
                //获取当前屏幕的实际 x y
                data.clientX = e.clientX
                data.clientY = e.clientY
                const videoWidth = videoTag.getBoundingClientRect().width
                const videoHeight = videoTag.getBoundingClientRect().height
                console.log("videoWidth",videoWidth)
                console.log("videoHeight",videoHeight)
                data.video = {
                    //控制端的真实宽高
                    width:videoWidth,
                    height:videoHeight
                }

                peer.emit('robot' , 'click' ,data)
            })

            //监听鼠标移动事件
            document.addEventListener('mousemove',(e) =>{
                let data = {}
                //获取当前屏幕的实际 x y
                data.clientX = e.clientX
                data.clientY = e.clientY
                const videoWidth = videoTag.getBoundingClientRect().width
                const videoHeight = videoTag.getBoundingClientRect().height
                console.log("videoWidth",videoWidth)
                console.log("videoHeight",videoHeight)
                data.video = {
                    //控制端的真实宽高
                    width:videoWidth,
                    height:videoHeight
                }

                peer.emit('robot' , 'move' ,data)
            })
        },
        //播放视频流
        paly(stream){
            console.log("stream====",stream)
            const videoTag = document.getElementById('screen-video')
            videoTag.srcObject = stream
            videoTag.onloadedmetadata = function() {
                videoTag.play()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#screen-video{
    width: 100%;
    height: 100%;
    /* 将整个video铺满 */
    object-fit: fill;
}
</style>
