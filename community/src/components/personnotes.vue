<template>
    <div>
        <div class="contents">
            <ElementLoading :active="this.$store.state.vueElementLoading" color="#c1c2c2" background-color="#fff"
                text="加载中..." />
            <div style="margin:0 auto" v-if="!falgdata">
                <van-empty image="search" description="暂无笔记~" />
            </div>
            <router-link :to="{path:'/notes',query:{nid:num.nid}}" class="router-note" v-for="(num,index) in note"
                :key="index">
                <div class="note-contents" style="margin-right:0">
                    <img class="note-img" :src="num.imgs[0]" alt="笔记封面" />
                    <div>
                        <p class="note-title">{{num.title}}</p>
                    </div> 
                    <div class="note-user">
                        <div class="left">
                            <van-image style="vertical-align: middle;margin-right: 0.5rem;" width="2.5rem"
                                height="2.5rem" round fit="cover" :src="num.avatar" />
                            <span>{{num.username}}</span>
                        </div>
                        <div class="right">
                            <img class="note-support" :src="zan" alt="赞" />
                            <span>{{num.support}}</span>
                        </div>
                    </div>
                    <div class="timeBox">
                        <span>发表日期：{{num.releasetime}}</span>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {
        Empty,
        DatetimePicker,
        ActionSheet,
        Form
    } from 'vant';
    Vue.use(Empty);
    Vue.use(DatetimePicker);
    Vue.use(ActionSheet);
    Vue.use(Form);
    export default {
        props: {
            personalUid: String
        },
        data() {
            return {
                timeValue: '',
                showPicker: false,
                tpyeFlag: "",
                falgdata: false,
                zan: require("../assets/xin.png"),
                note: [],
            };
        },
        watch: {
            personalUid(newVal, oldVal) {
                if (newVal) {
                    let thisdata = newVal.split(';')[0];
                    let thisflag = newVal.split(';')[1];
                    this.axios
                        .get("http://ylin:88/note/allNotes", {
                            params: {
                                uid: thisdata,
                                flag: thisflag
                            }
                        })
                        .then(response => {
                            this.$store.commit('updateLoading', false); //关闭加载动画
                            this.note = response.data;
                            if (response.data.length != 0) {
                                this.falgdata = true;
                            } else {
                                this.falgdata = false;
                            }
                        })
                        .catch((error)=>{
                            this.$store.commit('updateLoading', false); //关闭加载动画
                            console.log(error);
                        });
                }
            }
        },
        methods: {
        },
        created: function () {
            this.$store.commit('updateLoading', true); //开启加载动画
        },
        mounted: function () {},

    };
</script>

<style scoped>
    html {
        font-size: 62.5%;
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

    .contents {
        height: auto;
        margin: 0 0.5rem;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        border: 0 solid;
    }

    /* 有数据时 */
    .have {
        display: none;
    }

    /*无数据时数据 */
    .none {
        display: block;
        width: 100%;
        height: 10rem;
        line-height: 10rem;
        text-align: center;
        font-size: 16px;
        color: #a8a7a7;
    }

    .contents>.router-note {
        display: block;
        width: 49%;
        height: auto;
        box-sizing: border-box;
        margin-right: 0 !important;
    }

    .contents .note-contents {
        border-radius: 0.5rem;
        width: 100%;
        height: auto;
        margin-bottom: 0.5rem;
    }

    .note-contents .note-img {
        width: 100%;
        height: 100%;
        min-height: 5rem;
        border-radius: 0.5rem;
    }

    .note-contents .note-title {
        font-size: 1.5rem;
        font-weight: 500;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 0.5rem;
    }

    .note-contents>.note-user {
        width: 100%;
        padding-right:1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.2rem;
        box-sizing: border-box;
    }

    .note-contents>.note-user>.left {
        width: 50%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

    }

    .note-contents>.note-user>.left>span {
        line-height: 2rem;
    }

    .note-contents>.note-user>.left>.user-header {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 0.2rem;
    }

    .note-contents>.note-user>.right>span {
        line-height: 2rem;
    }

    .note-contents>.note-user>.right>.note-support {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 0.2rem;
    }
    .timeBox{
        margin: 0.5rem 0rem 1rem 0rem;
        color: rgb(176, 177, 176);
    }
</style>