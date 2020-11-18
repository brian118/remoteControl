import { BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import { format as formatUrl } from 'url'
import path from 'path'

//主进程
let win
let willQuitaApp = false

export function create(){
    win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences: { nodeIntegration: true, webSecurity: false },
        center: true,
    })

    win.on('close' , e =>{
        if(willQuitaApp){
            win = null
        }else{
            e.preventDefault()
            win.hide()
        }
    })

    if (isDev) {
        const url = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
        win.loadURL(url)
    } else {
        win.loadURL(formatUrl({
          pathname: path.join(__dirname, 'index.html'),
          protocol: 'file',
          slashes: true
        }))
    }
}

//主进程向渲染进程发送消息 channel 消息名 ， args 参数
export function send(channel , ...args){
    win.webContents.send(channel,...args)
}

export function show(){
    win.show()
}

export function close(){
    willQuitaApp = true
    win.close()
}