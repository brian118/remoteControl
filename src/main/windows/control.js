import {BrowserWindow , ipcMain} from 'electron'
import isDev from 'electron-is-dev'
import { format as formatUrl } from 'url'
import path from 'path'

let winControl

export function create(redirectUrl = ""){
    winControl = new BrowserWindow({
        width:1000,
        height:680,
        webPreferences: { nodeIntegration: true, webSecurity: false },
        center: true,
    })
    if (isDev) {
        const url = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}#/controlWin`
        winControl.loadURL(url)
    } else {
        //file:///C:/Users/baichengwei.DACHEN/AppData/Local/Programs/vue_code_electron/resources/app.asar/index.html?#/\controlWin"
        //file:///C:/Users/baichengwei.DACHEN/AppData/Local/Programs/vue_code_electron/resources/app.asar/index.html?#/controlWin
        //winControl.loadURL(path.join(__dirname, 'index.html?#/controlWin'))
        winControl.loadURL(redirectUrl)
    }

    winControl.on('closed', () => {
        console.log("关闭")
        winControl = null;
        // winControl.webContents.send('close')
        // winControl = null
        // ipcMain.on('close' , async (e , remote) =>{
        //     console.log("本地的remote",remote)
        //     signal.send('control' , {remote})
        // })

        // winControl.webContents.send('close-win')

        // ipcMain.on('close-win', function(event, arg) {
        //     // console.log(arg);  // prints "ping"
        //     // event.sender.send('asynchronous-reply', 'pong');
        // });
    })
}

export function send(channel, ...args) {
    winControl.webContents.send(channel, ...args)
}