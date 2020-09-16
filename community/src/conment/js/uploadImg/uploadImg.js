import axios from "axios";
import Vue from 'vue';
import {
    Toast
} from 'vant';
Vue.use(Toast);

export default {//验证是否登录
    uploadImg(imgInfo) {
        return new Promise(function (resolve, reject) {//promise实现方法同步加载
            this.axios.post('/upload/uploadImg', imgInfo)
                .then(function (response) {
                    if (response.data && response.data.code == 1) {
                        resolve(response.data.url + ";");
                        // that.notesContent.imgs += ;
                    } else {
                        Toast({
                            message: "图片上传失败！",
                            duration: 1000
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    }
}