import {BrowserWindow , ipcMain} from 'electron'
import isDev from 'electron-is-dev'
import { format as formatUrl } from 'url'
import path from 'path'

let win

export function create(){
    win = new BrowserWindow({
        width:1000,
        height:680,
        webPreferences: { nodeIntegration: true, webSecurity: false },
        center: true,
    })


    if (isDev) {
        const url = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}#/controlWin`
        win.loadURL(url)
    } else {
        win.loadURL(formatUrl({
          pathname: path.join(__dirname, 'index.html#/controlWin'),
          protocol: 'file',
          slashes: true
        }))
    }

    win.on('closed', () => {
        console.log("关闭")
        // win.webContents.send('close')
        // win = null
        // ipcMain.on('close' , async (e , remote) =>{
        //     console.log("本地的remote",remote)
        //     signal.send('control' , {remote})
        // })

        // win.webContents.send('close-win')

        // ipcMain.on('close-win', function(event, arg) {
        //     // console.log(arg);  // prints "ping"
        //     // event.sender.send('asynchronous-reply', 'pong');
        // });
    })
}

export function send(channel, ...args) {
    win.webContents.send(channel, ...args)
}