
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8088 })

console.log("连接成功wss")

//控制码集合
const code2ws = new Map()

wss.on('connection' , function connection (ws , request){
    console.log("触发了ws连接")
    //随机生成
    let code = Math.floor(Math.random() * (999999 - 100000)) + 100000

    code2ws.set(code , ws)
    
    //发送
    ws.sendData = (event , data) =>{
        ws.send(JSON.stringify({event,data}))
    }

    ws.sendError = msg =>{
        ws.send('Error',{msg})
    }

    //接受消息
    ws.on('message' , function incoming(message){
        console.log('imcoming',message)

        let parseMsg = {}

        try{
            parseMsg = JSON.parse(message)
        }catch(err){
            console.error('parse message error', error)
            ws.sendError('message invalid')
            return
        }

        //事件名，参数
        let {event , data } = parseMsg
        
        //触发登录
        if(event === 'login'){
            console.log("用户登录生成控制码",code)
            ws.sendData('logined' , {code})
        }else if(event === 'control'){      //触发控制
            let remote = +data.remote
            let url = data.url
            console.log("传来的remote",remote , url)

            //检查是否包含已登录的控制码
            if(code2ws.has(remote)){
                //进行连接
                ws.sendData('controlled',{remote,url})
                ws.sendRemote = code2ws.get(remote).sendData
                code2ws.get(remote).sendRemote = ws.sendData
                ws.sendRemote('be-controlled',{remote:code})
                console.log(JSON.stringify(code2ws))
            }else{
                // ws.sendData('controlled',{remote})
                ws.sendData('empty',{msg:'未找到'})
            }
        }else if(event === 'forward'){
            ws.sendRemote(data.event , data.data)
        }
    })

    ws.on('close',() =>{
        code2ws.delete(code)
        clearTimeout(ws._closeTimeout)
    })

    ws._closeTimeout = setTimeout(() =>{
        ws.terminate()
    },10*60*1000)
})

