<template>
    <el-row>
        <el-col :span="24">
            <div v-if="!controlText" class="grid-content">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="你的控制码">
                        <span @contextmenu="handleContextMenu">{{form.lcoalCode}}</span>
                    </el-form-item>
                    <el-form-item label="伙伴ID">
                        <el-input v-model="form.remoteCode"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="startControl">确认</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-else>{{controlText}}</div>
        </el-col>
    </el-row>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
const { Menu, MenuItem } = remote
import './peer-puppet.js'
// // Move the mouse across the screen as a sine wave.
// const robot = require("robotjs");

// // Speed up the mouse.
// robot.setMouseDelay(2);

// var twoPI = Math.PI * 2.0;
// var screenSize = robot.getScreenSize();
// var height = (screenSize.height / 2) - 10;
// var width = screenSize.width;

// for (var x = 0; x < width; x++)
// {
// 	let y = height * Math.sin((twoPI * x) / width) + height;
// 	robot.moveMouse(x, y);
// }
export default {
    name:'Main',
    data(){
        return{
            form:{
                lcoalCode:'',
                remoteCode:''
            },
            controlText:''
        }
    },
    computed:{},
    watch:{},
    created(){
        this.login()
        this.handleControlState()
    },
    methods:{
        //向主进程发送消息，获取本机控制码
        async login(){
            let code = await ipcRenderer.invoke('login')
            this.form.lcoalCode = code
        },
        startControl(){
            ipcRenderer.send('control', this.form.remoteCode)
        },
        handleControlState(){
            //监听主进程发来的消息
            ipcRenderer.on('control-state-change', (e, remoteCode, type) =>{
                this.controlText = ''
                if(type === 1){
                    this.controlText = `正在远程控制${remoteCode}....`
                }else if(type === 2){
                    this.controlText = `被${remoteCode}控制....`
                }
            })

            ipcRenderer.on('empty-change-state',(e,msg) =>{
                this.$message({
                    message: msg,
                    type: 'warning'
                });
            })

            ipcRenderer.on('close-win',(e) =>{
                this.controlText = ""
                console.log("关闭了窗口")
            })
        },
        handleContextMenu(e){
            e.preventDefault()
            const menu = new Menu()
            menu.append(new MenuItem({
                label: '复制',
                role: 'copy'
            }))
            menu.popup()
        }
    }
}
</script>

<style lang="scss" scoped>
.grid-content{
    width: 58%;
    margin: auto;
    margin-top: 60px;
}
</style>