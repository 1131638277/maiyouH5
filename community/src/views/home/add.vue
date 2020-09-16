<template>
    <div>
        <!-- 导航条 -->
        <nav>
            <van-nav-bar title="发表笔记" left-text="取消" right-text="确定" left-arrow @click-left="onClickLeft"
                @click-right="onClickRight" />
        </nav>
        <div class="text-box">
            <!-- 标题框 -->
            <van-field v-model="notesContent.title" placeholder="标题(不超过50个字符)" maxlength="50" show-word-limit />
            <!-- 内容框 -->
            <van-field v-model="notesContent.info" :autosize='textHeight' type="textarea" maxlength="1000"
                placeholder="内容" show-word-limit />
            <!-- 种类 -->
            <div id="text-box">
                <van-field label="种类：" :value="notesContent.category" placeholder="必填" readonly @click="showType" />
                <van-action-sheet v-model="showTypeFlag">
                    <van-picker show-toolbar title="种类" :default-index="0" :columns="columns" @cancel="onCancel"
                        @confirm="onConfirm" />
                </van-action-sheet>

            </div>
            <!-- 关键字 -->
            <div id="keyword-box">
                <van-field label="关键字：" :value="notesContent.keywords" v-model="notesContent.keywords"
                    placeholder="最多五个字符" show-word-limit maxlength="5" />
                <!-- <van-action-sheet id="showkeywordBox" v-model="showKeywdFlag">  @click="showkeywd"
                    <van-nav-bar title="关键字" left-text="取消" right-text="确定" @click-left="Lkeyword"
                        @click-right="Rkeyword" />
                    <div id="keywdlist">
                        <van-checkbox-group v-model="keywordlist" :max="3">
                            <van-checkbox class="oneword" :name="value" v-for="(value,index) in keywordOldList"
                                :key="index">{{value}}
                            </van-checkbox>
                        </van-checkbox-group>

                    </div>

                </van-action-sheet> -->
            </div>
            <!-- 图片 -->
            <div>
                <van-uploader v-model="fileList" multiple :before-read="beforeRead" :after-read="afterRead"
                    :max-count="6" />
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {
        Toast,
        Field,
        List,
        Checkbox,
        CheckboxGroup,
        NavBar
    } from "vant";

    Vue.use(Field);
    Vue.use(List);
    Vue.use(Checkbox);
    Vue.use(CheckboxGroup);
    Vue.use(NavBar);
    export default {
        data() {
            return {
                imgInfo: "",
                showTypeFlag: false,
                showKeywdFlag: false,
                textHeight: { //设置内容文本框的高
                    maxHeight: 300,
                    minHeight: 100
                },
                notesContent: {
                    uid:"",
                    uname: "",
                    title: "",
                    info: "",
                    category: "",
                    keywords: "",
                    imgs: ""
                },
                fileList: [], // Uploader 根据文件后缀来判断是否为图片文件// 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
                columns: ["无数据"],
                keywordOldList: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
                keywordlist: [],
                loading: false,
                finished: false
            }

        },
        methods: {
            onClickLeft() { //返回上一级
                this.$router.go(-1);
            },
            onClickRight() { //发表文章
                let that = this;
                if (this.fileList.length == 0) {
                    Toast("请先上传一张图片");
                } else if (!this.notesContent.category) {
                    Toast("请选择种类");
                } else {
                    this.notesContent.uname = JSON.parse(sessionStorage.getItem("userInfo")).username;
                    this.notesContent.uid = JSON.parse(sessionStorage.getItem("userInfo")).uid;
                    this.axios.post('/note/publishNote', {
                            notesContent: this.notesContent
                        })
                        .then(function (response) {
                            if (response.data && response.data.code == 1) {
                                Toast(response.data.Msg);
                                that.$router.go(-1);

                            } else {
                                Toast(response.data.Msg);
                                console.log(response);
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            },
            //上传前校验图片
            beforeRead(file) {
                if (file && file.length) { // 判断是否是多图上传 多图则循环添加进去
                    for (const el in file) {
                        if (file[el].type != 'image/jpeg' && file[el].type != 'image/jpg' && file[el].type !=
                            'image/png' && file[el].type != 'image/gif') { //或者所有图片格式 image/*
                            Toast('请上传 jpg/jpeg/png/gif 格式图片');
                            return false;
                        }
                    }
                } else {
                    if (file.type != 'image/jpeg' && file.type != 'image/jpg' && file.type !=
                        'image/png' && file.type != 'image/gif') { //或者所有图片格式 image/*
                        Toast('请上传 jpg/jpeg/png/gif 格式图片');
                        return false;
                    }
                }

                return true;
            },
            //上传后校验上传效果
            afterRead(file) {
                let that = this;
                let content = file.file;
                let data = new FormData();
                if (file && file.length) { // 判断是否是多图上传 多图则循环添加进去
                    for (const el in file) {
                        console.log("图片数据：", file[el]);

                        data.append('avatar', file[el]);
                    }
                } else {
                    data.append('avatar', file.file);
                }
                this.imgInfo = data;
                // //定义一个请求拦截器
                // this.axios.interceptors.request.use(function (config) {
                //     file.status = 'uploading';
                //     file.message = '上传中...';
                //     return config
                // })
                // //定义一个响应拦截器
                // this.axios.interceptors.response.use(function (config) {
                //     console.log("aa",config)
                //     if (!config) {
                //         file.status = 'failed';
                //         file.message = '上传失败';
                //     }
                //     return config
                // })
                this.axios.post('/upload/uploadImg', data)
                    .then(function (response) {
                        if (response.data && response.data.code == 1) {
                            that.notesContent.imgs += response.data.url + ";";
                            file.status = 'done';
                            file.message = '上传成功！';
                        } else {
                            // file.status = 'failed';
                            // file.message = '上传失败';
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            onConfirm(value, index) { //确定种类选择
                this.notesContent.category = value;
                this.showTypeFlag = false;
            },
            onCancel() { //取消种类选择
                this.showTypeFlag = false;

            },
            showType() { //显示种类选择
                var that = this;
                this.axios
                    .get("http://ylin:88/note/types", { //查询所有的笔记种类
                        params: {}
                    })
                    .then(response => {
                        if (response.data.length != 0) {
                            that.columns = [];
                            for (var i = 0; i < response.data.length; i++) {
                                that.columns.push(response.data[i].tname);
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                this.showTypeFlag = true;

            },
            showkeywd() { //显示关键字选择
                this.showKeywdFlag = true;
            },
            Lkeyword() { //取消关键字选择
                this.showKeywdFlag = false;
            },
            Rkeyword() { //确定关键字
                this.notesContent.keywords = "";
                for (let i = 0; i < this.keywordlist.length; i++) {
                    this.notesContent.keywords += this.keywordlist[i] + ","
                }
                let str = this.notesContent.keywords;
                this.notesContent.keywords = str.substr(0, str.length - 1);
                this.showKeywdFlag = false;
            }
        }

    }
</script>
<style scoped>
    html {
        font-size: 62.5%;
        /* font-size: calc(100vw/62.5);  */
    }

    * {
        margin: 0;
        padding: 0;
    }

    a {
        text-decoration: none;
        color: #000;
    }

    li {
        list-style: none;
    }

    #text-box>>>.van-field__label,
    #keyword-box>>>.van-field__label {
        padding-left: 0rem;
        color: rgb(148, 145, 145);
    }

    #keyword-box>>>.van-cell__value {
        display: flex;
        justify-content: space-between;
    }

    #showkeywordBox {
        padding: 1rem;
        box-sizing: border-box;
    }

    #keywdlist>>>span {
        font-size: 14px;
    }

    #keywdlist>>>.oneword {
        margin-bottom: 0.5rem;
    }
</style>