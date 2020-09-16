<template>
    <div>
        <van-nav-bar class="title" left-arrow left-text="返回" title="管理信息" @click-left="toHome"></van-nav-bar>
        <div>
            <van-tabs sticky>
                <van-tab title="投诉信息">
                    <van-empty v-if="msg.length==0" description="太好了，没有投诉~" />
                    <div class="box" v-for="(value,index) in msg" @click="tomsg(value.id,value.type)" :key="index">
                        <van-swipe-cell>
                            <van-cell :border="false" :title="value.type" :value="value.content" />
                            <template #right>
                                <van-button square type="danger" text="删除" @click="deleteThis(value.rid)" />
                                <van-button square type="primary" :text="value.type=='笔记'?'禁用':'下架'"
                                    @click="handle(value.id,value.rid,value.type)" />
                            </template>
                        </van-swipe-cell>

                    </div>
                </van-tab>
                <van-tab title="查询">
                    <div class="serchBox">
                        <van-field name="radio" :rules="[{ required: false}]">
                            <template #input>
                                <van-radio-group style="margin:0 auto;" v-model="radio" direction="horizontal">
                                    <van-radio name="1">笔记</van-radio>
                                    <van-radio name="2">商品</van-radio>
                                    <van-radio name="3">用户</van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                        <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" @search="onSearch">
                            <template #action>
                                <div @click="onSearch(searchText)">搜索</div>
                            </template>
                        </van-search>
                    </div>
                    <van-empty v-if="resFlag" image="search" description="没找到相关数据呢~" />
                    <div class="resultBox" v-for="(value,index) in searchMsg" :key="index"
                        @click="tocli(value.id,radio)">
                        <van-swipe-cell>
                            <van-card :desc="value.status==1?'状态：有效':'状态：无效'" :title="(radio=='1')?('笔记标题：'+value.title):((radio=='2')?('商品名：'+value.title):('用户名：'+value.title))"
                                class="goods-card" :thumb="value.img" />
                            <template #right>
                                <van-button v-if="value.status==0" square text="解禁" type="primary" class="delete-button"
                                    @click="untie(value.id,radio)" />
                                <van-button v-if="value.status==1" square text="禁用" type="danger" class="delete-button"
                                    @click="handle(value.id,0,radio)" />
                            </template>
                        </van-swipe-cell>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {
        Empty,
        SwipeCell,
        Sticky,
        Search,
        Toast,
        Form
    } from 'vant';

    Vue.use(Empty);
    Vue.use(SwipeCell);
    Vue.use(Sticky);
    Vue.use(Search);
    Vue.use(Form);
    export default {
        data() {
            return {
                msg: [],
                radio: "1",
                searchText: "",
                searchMsg: [],
                resFlag: false
            }
        },
        watch:{
            radio:function(){
                this.searchMsg=[];
            }

        },
        methods: {
            toHome() {
                this.$router.push({
                    path: "/about"
                });
            },
            //拿取举报信息
            getMsgInfo() {
                this.axios
                    .get(`http://ylin:88/administrators/getMsgInfo`)
                    .then(response => {
                        if (response.data.code == 1) {
                            this.msg = response.data.data;
                        } else {
                            Toast({
                                message: response.data.Msg,
                                duration: 1000
                            })
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            //查看被举报的笔记或者商品
            tomsg(num, type) {
                // if (type == "笔记" || type == '1') {
                    this.$router.push({
                        path: "/notes",
                        query: {
                            nid: num
                        }
                    })
                // } else if (type == "商品" || type == '2') {
                //     this.$router.push({
                //         path: "/details",
                //         query: {
                //             cid: num
                //         }
                //     });
                // }
            },
            tocli(num, typenum) {
                if (typenum == '1') {
                    this.$router.push({
                        path: "/notes",
                        query: {
                            nid: num
                        }
                    })
                } else if (typenum == '2') {
                    this.$router.push({
                        path: "/details",
                        query: {
                            cid: num
                        }
                    });
                }

            },
            //禁用笔记或下架商品
            handle(id, rid, type) {
                this.axios.post('/administrators/handle', {
                    rid: rid,
                    nid: id,
                    type: type
                }).then(response => {
                    if (response.data.code == 1) {
                        //清除处理后的投诉信息
                        Toast({
                            message: "禁用成功！",
                            duration: 1000
                        })
                        this.deleteOne(rid);
                        this.onSearch(this.searchText);
                    } else {
                        console.log(response.data);
                        Toast({
                            message: response.data.Msg,
                            duration: 1000
                        })
                    }

                }).catch(function (error) {
                    console.log(error);
                })
            },
            //解禁笔记或商品
            untie(id, type) {
                this.axios.post('/administrators/untie', {
                    nid: id,
                    type: type
                }).then(response => {
                    if (response.data.code == 1) {
                        //清除处理后的投诉信息
                        Toast({
                            message: response.data.Msg,
                            duration: 1000
                        })
                        this.onSearch(this.searchText);
                    } else {
                        console.log(response.data);
                        Toast({
                            message: response.data.Msg,
                            duration: 1000
                        })
                    }

                }).catch(function (error) {
                    console.log(error);
                })
            },
            //删除某条投诉
            deleteThis(rid) {
                this.axios.post("/administrators/deleteComplaint", {
                    rid: rid
                }).then(response => {
                    if (response.data.code == 1) {
                        this.deleteOne(rid);
                    } else {
                        console.log(response);
                        Toast({
                            message: response.data.Msg,
                            duration: 1000
                        })
                    }
                }).catch(function (error) {
                    console.log(error);

                })

            },
            // 删除举报列表中的某一条数据
            deleteOne(rid) {
                for (let i = 0, num = this.msg.length; i < num; i++) {
                    if (this.msg[i].rid == rid) {
                        this.msg.splice(i, 1);
                    }
                }
            },
            //提交查询信息
            onSearch(values) {
                if (values == "") {
                    return;
                }
                this.axios.post("/administrators/selectMsg", {
                    msg: {
                        'keywords': values,
                        'radio': this.radio
                    }
                }).then(response => {
                    if (response.data.code == 1) {
                        if (response.data.data.length && this.radio == '1') {//笔记
                            this.resFlag=false;
                            this.searchMsg = [];
                            for (let i = 0, num = response.data.data.length; i < num; i++) {
                                let msg = {
                                    id: response.data.data[i].nid,
                                    title: response.data.data[i].title,
                                    img: response.data.data[i].imgs,
                                    status: response.data.data[i].status
                                }
                                this.searchMsg.push(msg);
                            }
                        } else if (response.data.data.length && this.radio == '2') {//商品
                            this.resFlag=false;
                            this.searchMsg = [];
                            for (let i = 0, num = response.data.data.length; i < num; i++) {
                                let msg = {
                                    id: response.data.data[i].cid,
                                    title: response.data.data[i].name,
                                    img: response.data.data[i].imgs,
                                    status: response.data.data[i].status
                                }
                                this.searchMsg.push(msg);
                            }
                        }else if (response.data.data.length && this.radio == '3') {//用户
                            this.resFlag=false;
                            this.searchMsg = [];
                            for (let i = 0, num = response.data.data.length; i < num; i++) {
                                let msg = {
                                    id: response.data.data[i].uid,
                                    title: response.data.data[i].username,
                                    img: response.data.data[i].avatar,
                                    status: response.data.data[i].status
                                }
                                this.searchMsg.push(msg);
                            }
                        }
                        else{
                            this.searchMsg = [];
                            this.resFlag=true;
                        }
                    } else {
                        console.log(response.data);
                        Toast({
                            message: response.data.Msg,
                            duration: 1000
                        })
                    }

                }).catch(function (error) {
                    console.log(error);

                })
            },

        },
        created() {
            this.getMsgInfo();
        }
    }
</script>
<style scoped>
    * {
        margin: 0;
        padding: 0;
    }

    .serchBox p {
        display: inline-block;
        line-height: 3rem;
        font-size: 1.4rem;
        padding-left: 2rem;
    }

    .serchBox p i {
        display: inline-block;
        width: 0.3rem;
        height: 1rem;
        background-color: rgb(74, 150, 236);
        margin-right: 0.5rem;

    }

    .goods-card {
        margin: 0;
        background-color: #fff;
    }

    .delete-button {
        height: 100%;
    }
</style>