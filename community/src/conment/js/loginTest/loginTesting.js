import axios from "axios";
import Vue from 'vue';
import {
    Toast
} from 'vant';
Vue.use(Toast);

export default {//验证是否登录
    loginTesting() {
        return new Promise(function (resolve, reject) {//promise实现方法同步加载
            if (sessionStorage.getItem("userInfo")) {
                resolve(true);
            } else {
                Toast({
                    message: "请先登录~",
                    duration: 1000
                });
                resolve(false);
            }
        })
    }
}