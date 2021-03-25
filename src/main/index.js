'use strict'

import { app } from 'electron'
// 引入主进程监听事件
import * as ipcService from './ipc'
 // 引入主进程
 const {create : createMainWindow , show : showMainWindow , close : closeMainWindow} = require('./windows/main')


 //禁止多开
 const gotThelock = app.requestSingleInstanceLock()

 if(!gotThelock){
   app.quit()
 }else{
    app.on('second-instance', () =>{
      showMainWindow()
    })

    app.on('ready' , () =>{
      createMainWindow()
      ipcService.handleIPC()
      require('./robot.js')()
    })
    app.on('before-quit', () => {
      closeMainWindow()
    })
    app.on('activate', () => {
      showMainWindow()
    })
 }

 app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});