const EventEmitter = require('events')
const peer = new EventEmitter()
const {ipcRenderer} = require('electron')

//打洞服务配置
// const iceServer = {
//     "iceServers": [{
//         "urls" : ["stun:stun.l.google.com:19302"]
//     }, {
//         "urls" : ["turn:numb.viagenie.ca"],
//         "username" : "webrtc@live.com",
//         "credential" : "muazkh"
//     }]
// };

//如果不穿入打洞服务器的配置信息，则只可以在内网中使用实时音频通讯。
const pc = new window.RTCPeerConnection({})
//createDataChannel() 方法创建一个可以发送任意数据的数据通道(data channel)。
//常用于后台传输内容, 例如: 图像, 文件传输, 聊天文字, 游戏数据更新包, 等等。
const dc = pc.createDataChannel('robotchannel')

dc.onopen = function(){
    peer.on('robot', (type, data) => {
        console.log("onopen",type,data)
        dc.send(JSON.stringify({ type, data }))
    })
}

dc.onmessage = event =>{
    console.log('message',event)
}

dc.onerror = e => { console.error('error', e) }

// candidate
pc.onicecandidate = function(e) {
    console.log('candidate', JSON.stringify(e.candidate))
    if(e.candidate) {
        ipcRenderer.send('forward', 'control-candidate', e.candidate)
    }
}
ipcRenderer.on('candidate', (e, candidate) => {
    addIceCandidate(candidate)
})
let candidates = []
async function addIceCandidate(candidate) {
    if(candidate) {
        candidates.push(candidate)
    }
    if(pc.remoteDescription && pc.remoteDescription.type) {
        for(let i = 0; i < candidates.length; i++) {
            if(candidates[i].sdpMid){
                await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
            }
        }
        candidates = []
    }
}

window.addIceCandidate = addIceCandidate

//创建控制端offer  createOffer 方法启动创建一个 SDP offer，目的是启动一个信的WEBRTC 去连接远程端点。 SDP offer 包含有关已附加到WEBRTC会话
//以及ICE代理，目的是通过信令信道发送给潜在远程端点，以请求连接或更新现有连接的配置
//返回一个promise，创建offer后，将使用包含新创建的要约的RTCSessionDescription 对象来解析该返回值
export async function createOffer(){
    const offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: true,
    })

    await pc.setLocalDescription(offer)
    console.log('pc offer', JSON.stringify(offer))
    return pc.localDescription
}

// createOffer().then((offer) =>{
//     ipcRenderer.send('forward','offer',{
//         type:offer.type,
//         sdp:offer.sdp
//     })
// })

// 设置傀儡端SDP
async function setRemote(answer){
    await pc.setRemoteDescription(answer)
}

//响应傀儡端 的 answer 设置 setRemoteDescription
ipcRenderer.on('answer',(e , answer) =>{
    setRemote(answer)
})

window.setRemote = setRemote

//监听视频流的增加
//onaddstream 事件发生时，通过RTCPeerConnection 触发 RTCPeerConnection.onaddstream 事件处理函数
// 当远程媒体流MediaStream 添加到连接后发送事件。
pc.onaddstream = function(e){
    console.log('add stream' , e)
    peer.emit('add-stream', e.stream)
}


export default peer