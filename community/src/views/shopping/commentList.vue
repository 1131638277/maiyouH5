<template>
    <div>
        <nav>
            <van-nav-bar title="评论" left-text="返回" fixed left-arrow @click-left="onClickLeft" />
        </nav>
        <div class="commentList-box">
            <ElementLoading :active="this.$store.state.vueElementLoading" color="#c6c9c9" spinner="line-down" background-color="#fff"
                text="加载中..." />
            <!-- 评论占位区 -->
            <van-skeleton title avatar :row="3" :loading="loading">
                <div class="personComment" v-for="(el,index) in comments" :key="index">
                    <div class="comment-top">
                        <div class="commentUser">
                            <div>
                                <van-image width="30" height="30" lazy-load round :src="el.avatar">
                                    <template v-slot:loading>
                                        <van-loading type="spinner" size="20" />
                                    </template>
                                    <template v-slot:error>
                                        <van-icon name="warning-o" /></template>
                                </van-image>
                            </div>
                            <div class="userMsg">
                                <p>{{el.username}}</p>
                                <span>{{el.time}}</span>
                            </div>
                        </div>
                        <div class="rightdo">
                            <van-icon name="like-o" color="#000" size='12' />
                            <van-icon name="comment-o" color="#000" size='12' />
                        </div>
                    </div>
                    <div class="commentContent">
                        <span style="line-height:15px;">{{el.contents}}</span>
                    </div>
                </div>
            </van-skeleton>
        </div>
    </div>


</template>

<script>
    import Vue from 'vue';
    import {
        NavBar,
        Toast,
        Skeleton
    } from 'vant';
    Vue.use(NavBar);
    Vue.use(Skeleton);
    export default {
        data() {
            return {
                loading: true,
                comments: [{
                    avatar: require("@/assets/headimg.png"),
                    contents: "",
                    username: "暂无评论",
                    time: "",
                    support: ""
                }]
            }
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1);
            }
        },
        created: function () {
            if (this.$route.query.cid) {
                this.$store.commit('updateLoading', true); //打开加载动画
                var that = this;
                this.axios.get(`/shopping/getcomments?cid=${this.$route.query.cid}`)
                    .then((response) => {
                        this.$store.commit('updateLoading', false); //关闭加载动画
                        if (response.data.code == 1) {
                            if (response.data.data.length != 0) {
                                that.comments = response.data.data;
                            }
                        } else {
                            console.log(response.data.Msg)
                            Toast(response.data.Msg);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        mounted() {
            this.loading = false; //评论占位符消失
        }
    }
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

    nav>>>.van-nav-bar__text,
    nav>>>.van-nav-bar .van-icon {
        color: #000;
    }

    .commentList-box {
        height: auto;
        padding: 1rem;
        margin-top: 4rem;
    }

    .commentList-box .personComment {
        border-top: 1px solid #eee;
        padding-top: 1rem;
    }

    .commentList-box .personComment:first-child {
        border: 0px;
        padding-top: 0rem;
    }

    .commentList-box .personComment .comment-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .commentList-box .personComment .commentUser {
        display: flex;
        align-items: center;
    }

    .commentList-box .personComment .commentUser>.userMsg {
        margin-left: 0.5rem;
    }

    .commentList-box .personComment .commentUser>.userMsg>span {
        font-size: 0.8rem;
        color: rgb(138, 136, 136);
    }

    .commentList-box .personComment .comment-top>.rightdo {
        width: 3.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .commentList-box .personComment .commentContent {
        margin: 0 0 0.5rem 3.5rem;
    }
</style>