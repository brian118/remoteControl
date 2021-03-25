import {ipcMain, remote} from 'electron'
const { send: sendMainWindow } = require('./windows/main')
// 引入 -   创建渲染进程窗口
const { create: createControlWindow, send: sendControlWindow } = require('./windows/control')
import signal from './signal'

// 主进程监听事件
export function handleIPC() {
    ipcMain.handle('login', async () =>{
        //dev 本地测试随机生成code 
        // let code = Math.floor(Math.random() * (999999 - 100000)) + 100000
        console.log("signal",signal.invoke)

        let {code} = await signal.invoke('login' , null , 'logined')

        console.log("code====",code)
        return code
    })
  
    //接受控制码 向服务器发起交互，发送需要被控制的傀儡账号
    ipcMain.on('control' , async (e , remote , url) =>{
        console.log("本地的remote",remote , url)
        signal.send('control' , {remote,url} )
    })


    //接收event响应事件 - 连接用户
    signal.on('controlled',(data) =>{
        //通知当前主窗口状态改变 , 创建控制窗口
        createControlWindow(data.url)
        sendMainWindow('control-state-change',data.remote , 1)
    })

    //接收event响应事件 - 被连接
    signal.on('be-controlled', (data) =>{
        sendMainWindow('control-state-change',data.remote , 2)
    })

    //未匹配到用户
    signal.on('empty', (data) =>{
        console.log("data",data)
        sendMainWindow('empty-change-state',data.msg)
    })

    //监听事件转发 candidate
    ipcMain.on('forward',(e,event,data) =>{
        signal.send('forward',{event,data})
    })

    signal.on('offer' , data =>{
        sendMainWindow('offer',data)
    })

    signal.on('answer',data =>{
        sendControlWindow('answer' , data)
    })

    signal.on('puppet-candidate', data => {
        sendControlWindow('candidate', data)
    })
    signal.on('control-candidate', data => {
        sendMainWindow('candidate', data)
    })
}