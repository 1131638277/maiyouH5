import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
import Album from '../views/homepage/Album.vue'
import Data from '../views/homepage/Data.vue'
import Vip from '../views/homepage/Vip.vue'
import message from '../views/message/message.vue'
import chat from '../views/message/chat.vue'
import info from '../views/info.vue'
import notes from '../views/notes.vue'
import Nearby from '../views/nearby/Nearby.vue'
import Search from '../views/home/Search.vue'
import Login from '../views/homepage/Login.vue'
import AdimManage from '../views/homepage/AdimManage.vue'
import BusinessManage from '../views/homepage/BusinessManage.vue'
import Publish from '../views/Publish.vue'
import Shopping from '../views/shopping/Shopping.vue'
import Searchcom from '../views/shopping/Searchcom.vue'
import details from '../views/shopping/details.vue'
import commentList from '../views/shopping/commentList.vue'
import commodityList from '../views/shopping/commodityList.vue'
import add from '../views/home/add.vue'
import deviceControl from '../views/home/deviceControl.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/deviceControl',
    name: 'deviceControl',
    component: deviceControl
  },
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/album',
    name: 'album',
    component: Album
  },
  {
    path: '/data',
    name: 'data',
    component: Data
  },
  {
    path: '/vip',
    name: 'vip',
    component: Vip
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/homepage/About.vue')
  },
  {
    path: '/message',
    name: 'message',
    component: message
  },
  {
    path: '/chat',
    name: 'chat',
    component: chat
  }
  ,
  {
    path: '/info',
    name: 'info',
    component: info
  }, {
    path: '/notes',
    name: 'notes',
    component: notes
  }, {
    path: "/nearby",
    name: "nearby",
    component: Nearby
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/publish',
    name: 'publish',
    component: Publish
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/shopping',
    name: 'shopping',
    component: Shopping
  },
  {
    path: '/searchcom',
    name: 'searchcom',
    component: Searchcom
  },
  {
    path: '/details',
    name: 'details',
    component: details
  },
  {
    path: '/commentList',
    name: 'commentList',
    component: commentList
  },
  {
    path: '/commodityList',
    name: 'commodityList',
    component: commodityList
  },
  {
    path: '/add',
    name: 'add',
    component: add
  },
  {
    path: '/adimManage',
    name: 'adimManage',
    component: AdimManage
  },
  {
    path: '/businessManage',
    name: 'businessManage',
    component: BusinessManage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
