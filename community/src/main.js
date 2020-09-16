import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import axios from "axios";
import 'vant/lib/index.css';
import ElementLoading from 'vue-element-loading';
import format from "@/conment/js/dateFormat/dateFormat.js"
import loginTest from "@/conment/js/loginTest/loginTesting.js"

Vue.component("Footer", () => import("./components/Footer.vue"));
Vue.component("note", () => import("./components/note.vue"));
Vue.component("commodity", () => import("./components/commodity.vue"));
Vue.component("shoppingshow", () => import("./components/shoppingshow.vue"));
Vue.component("ElementLoading", ElementLoading);//加载动画组件
Vue.config.productionTip = false
Vue.use(Vant);

//定义全局axios的公用服务端口
axios.defaults.baseURL = "http://localhost:88";
axios.defaults.withCredentials=true;//让ajax携带cookie
//向原型上追加通用方法
Vue.prototype.axios = axios;//axios包
Vue.prototype.format=format;//日期时间格式
Vue.prototype.loginTest=loginTest;//验证是否已登录
//设置跳转组件后从顶部开始显示
router.afterEach((to, from, next) => {
  window.scrollTo(0,0)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
