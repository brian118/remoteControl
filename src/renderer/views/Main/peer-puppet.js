import {desktopCapturer , ipcRenderer} from 'electron'
console.log(12321312)
//响应控制端，创建answer -创建视频流addstream
// 获取视频流
async function getScreenStream() {
    const sources = await desktopCapturer.getSources({ types: ['screen'] })
    return new Promise((resolve, reject) => {
        navigator.webkitGetUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sources[0].id,
                    maxWidth: window.screen.width,
                    maxHeight: window.screen.height
                }
            }
        }, stream => {
            resolve(stream)
            // peer.emit('add-stream', stream)
        }, err => {
            console.error(err)
        })
    })
}

//RTCPeerConnection接口代表一个由本地计算机到远端的WebRTC连接。该接口提供了创建，保持，监控，关闭连接的方法的实现
const pc = new window.RTCPeerConnection({})

//ondatachannel 属性是一个EventHandler , 当这个datachannel事件在RTCPeerConnection 发生时，它指定的那个事件处理函数就
//会被调用。这个事件继承于RTCDataChannelEvent,当远方伙伴调用crateDataChannel()时这个事件被加到这个连接（RTCPeerConnection）中
pc.ondatachannel = e =>{
    console.log('datachannel' , e)
    e.channel.onmessage = e =>{
        let {type , data } = JSON.parse(e.data)
        console.log(type , data )
        if(type === 'click' || type === 'move'){
            data.screen = {
                width:window.screen.width,
                height:window.screen.height
            }
        }

        ipcRenderer.send('robot',type,data)
    }
}

//onicecandidate (是一个事件触发器EventHandler)能够让函数在事件icecandidate 发生在实例 RTCPeerConnection上时被调用。
//只要本地代理ICE需要通过信令服务器传递信息给其他对等端时就会触发。这让本地代理与其他对等相协商而浏览器本身在使用时无需知道任何详细的有关信令技术的细节，
//只需要简单地应用这种方法就可使用您选择的任何消息传递技术将ICE候选发送到远程对等方
pc.onicecandidate = function(e){
    console.log('candidate',JSON.stringify(e.candidate))
    if(e.candidate){
        ipcRenderer.send('forward','puppet-candidate',e.candidate)
    }
}

ipcRenderer.on('candidate' ,(e , candidate) =>{
    addIceCandidate(candidate)
})

let candidates = []
async function addIceCandidate(candidate){
    if(candidate){
        candidates.push(candidate)
    }
    if(pc.remoteDescription && pc.remoteDescription.type){
        for(let i = 0 ; i < candidates.length; i++){
            //当本机当前页面的 RTCPeerConnection 接收到一个从远端页面通过信号通道发来的新的 ICE 候选地址信息
            //本机可以通过 RTCPeerConnection.addIceCandidate() 来添加一个ICE代理
            await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
        }
        candidates = []
    }
}

//测试
window.addIceCandidate = addIceCandidate

//监听傀儡端offer，发送本机sdp进行连接
ipcRenderer.on('offer',async(e,offer) =>{
    let answer = await createAnswer(offer)
    ipcRenderer.send('forward','answer',{
        type:answer.type,
        sdp:answer.sdp
    })
})

//createAnswer 创建一个SDP , setRemoteDescription //设置远程描述 ， //setLocalDescription 设置本地描述
async function createAnswer(offer){
    //添加桌面流
    let screenStream = await getScreenStream()
    //添加进去
    pc.addStream(screenStream)
    //设置远程会话描述
    await pc.setRemoteDescription(offer)
    //设置本地会话描述
    await pc.setLocalDescription(await pc.createAnswer())
    console.log('answer', JSON.stringify(pc.localDescription))
    return pc.localDescription
}

window.createAnswer = createAnswer