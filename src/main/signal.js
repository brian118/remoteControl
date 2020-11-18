// websocket
const WebSocket = require('ws')
const EventEmitter = require('events')
const signal = new EventEmitter()

const ws = new WebSocket('ws://192.168.2.23:8088')

ws.on('open',() =>{
    console.log("ws 连接成功")
})

ws.on('message' , function (msg){
    let data = {}
    try{
        data = JSON.parse(msg)
    }catch(err){
        console.log("parse err",err)
    }
   
    console.log("event 事件响应",data)
    //响应注册事件
    signal.emit(data.event , data.data)
})

//发送
function send(event , data){
    console.log("event",event)
    console.log('msgData',data)
    ws.send(JSON.stringify({event , data}))
}


function invoke(event , data , answerEvent){
    return new Promise((resolve,reject) =>{
        send(event, data)
        
        //保证每次用户在线 只触发一次 生成唯一控制码12
        signal.once(answerEvent , resolve)

        setTimeout(() =>{
            reject('超时')
        },5000)
    })
}

signal.send = send
signal.invoke = invoke

export default signal
