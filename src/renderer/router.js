import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main'
import ControlWin from '@/views/controlWin'
Vue.use(Router)

export default new Router({
    routes:[
        {
            path: '/',
            name: 'Main',
            component: Main
        },
        {
            path:'/controlWin',
            name:'ControlWin',
            component:ControlWin
        }
    ]
})