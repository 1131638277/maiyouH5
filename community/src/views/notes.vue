<template>
    <div class="all-box" @click="canhide">
        <!-- 加载动画 -->
        <ElementLoading :active="this.$store.state.vueElementLoading" background-color='#fff' color="#c6c9c9"
            text="加载中...">
        </ElementLoading>

        <nav>
            <!-- 标题导航 -->
            <!-- 左侧 返回与头像 -->
            <div class="nav-lfet">
                <van-icon name="arrow-left" size="2rem" @click="comeback" />
                <div class="userMsg">
                    <van-image round width="2.5rem" height="2.5rem" fit="cover" :src="message.avatar">
                        <template v-slot:loading>
                            <van-loading type="spinner" size="20" />
                        </template>
                        <template v-slot:error>
                            <van-icon name="warning-o" /></template>
                    </van-image>
                    <span style="font-size:1.4rem;margin-left:0.5rem;">{{message.username}}</span>
                </div>
            </div>
            <!-- 导航栏右侧按钮 收藏/关注/转发 -->
            <div :class="hideFlag?'nav-right':'nav-rightX'">
                <div class="supportBox" @click="support">
                    <img :src="supportFlag?supportedImg:supportImg" alt="点赞">
                </div>
                <div class="collectionBox" @click="collection">
                    <img :src="collectionFlag?CollectionedImg:CollectionImg" alt="收藏">
                </div>
                <div class="followBox" @click="follow">
                    <img :src="followFlag?followedImg:followImg" alt="关注">
                </div>
                <!-- <div class="forwarded" @touchstart="mousedown()" @touchend="mouseUp()">
                    <img :src="forwardFlag?forwardedImg:forwardImg" alt="转发">
                </div> -->
            </div>
            <div :class="hideFlag?'deleteBoxX':'deleteBox'" @touchstart="deletedown(message.nid)"
                @touchend="deleteUp()">
                <img :src="deleteFlag?deletedImg:deleteImg" alt="删除">
            </div>
        </nav>
        <!-- 笔记内容 -->
        <div class="notes-box">
            <!-- 轮播图 -->
            <div class="swipeBox">
                <van-swipe :autoplay="3000">
                    <van-swipe-item v-for="(image, index) in message.imgs" :key="index">
                        <img style="width:100%;height:auto" v-lazy="image" />
                    </van-swipe-item>
                </van-swipe>
            </div>
            <!-- 内容 -->
            <div class="textContent">
                <p>{{message.title}}</p>
                <div class="textInfo-box">
                    <div class="textInfo">
                        <p><span type="textarea">{{message.info}}</span></p>
                    </div>
                    <div class="noteLabel" v-for="(txtLabel, index) in message.keywords" :key="index">
                        <span>#{{txtLabel}}</span>
                    </div>
                    <div class="publishTime">
                        <!-- 发表时间 -->
                        <span>{{message.releasetime}}</span>
                        <!-- 投诉举报 -->
                        <div class="report" @click="report">
                            <img :src="reportImg" alt="投诉举报">
                        </div>
                    </div>
                    <van-action-sheet v-model="showreportFlag">
                        <van-picker show-toolbar title="举报原因" :default-index="0" :columns="columns" @cancel="onCancel"
                            @confirm="onConfirm" />
                    </van-action-sheet>

                </div>
            </div>
        </div>
        <!-- 评论 -->
        <div class="comments-box">
            <div class="tx6">
                <span>共 {{nums}} 条评论</span>
            </div>
            <div class="com1">
                <van-image width="3rem" height="3rem" fit="cover" lazy-load round :src="userHead">
                    <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                    </template>
                    <template v-slot:error>
                        <van-icon name="warning-o" /></template>
                </van-image>
                <input type="commenttexts" @click="toPublish" readonly placeholder="快来发表你的评论~" />
            </div>
            <!-- 用户评论信息 -->
            <div class="commentList-box">
                <div class="personComment" v-for="el in comments" :key="el.cid">
                    <div class="comment-top">
                        <div class="commentUser">
                            <div>
                                <van-image width="3rem" height="3rem" lazy-load round fit="cover" :src="el.avatar">
                                    <template v-slot:loading>
                                        <van-loading type="spinner" size="20" />
                                    </template>
                                    <template v-slot:error>
                                        <van-icon name="warning-o" /></template>
                                </van-image>
                            </div>
                            <div class="userMsg">
                                <p>{{el.username}}</p>
                                <span>{{el.comtimes}}</span>
                            </div>
                        </div>
                        <div class="rightdo">
                            <!-- 点赞图标 -->
                            <van-icon style="margin-right:1rem" name="like" ref="commentsupport"
                                @click="clickSupport(el.cid,el.uid,$event)"
                                :color="(el.support&&el.colorFlag)?'red':'#d4d1d1'" size='1.5rem' />
                            <!-- 评论图标 -->
                            <van-icon name="comment-o" @click.stop="clickComment(el.cid)" color="#000" size='1.5rem' />
                        </div>
                    </div>
                    <div class="commentContent">
                        <span style="line-height:15px;">{{el.content}}</span>
                        <!-- 其它评论 -->
                        <div v-if="el.sonflag" class="morecomments">
                            <p v-if="thisComment?(el.cid!=thisComment):1" @click="openothercomments(el.cid,el.nid)"
                                style="color: rgb(14, 153, 245);width:7rem">更多评论>></p>
                            <ul v-if="moreflag&&el.cid==thisComment" class="othercomments">
                                <li v-for="(value,index) in newcomment" :key='index'>
                                    <span class="name">{{value.name}}：</span>
                                    <span class="textcomment">{{value.text}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="commentFlag" @click.stop="nohide" class="commentTextBox">
            <van-field v-model="content" @blur="loseFocus" maxlength='200' @focus="getFocus" autofocus type="textarea"
                center clearable placeholder="发表你的评论吧~">
                <template #button>
                    <van-button size="small" type="primary" @click="commentOK">确定</van-button>
                </template>
            </van-field>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {
        Lazyload,
        Toast,
        Icon,
        Overlay,
        Field,
        Dialog,
        ActionSheet
    } from 'vant';

    Vue.use(Lazyload);
    Vue.use(Icon);
    Vue.use(Overlay);
    Vue.use(Field);
    Vue.use(ActionSheet);
    export default {
        data() {
            return {
                newcomment: [], //更多评论
                content: "", //触底评论内容
                thisComment: "", //评论时当前点击的某个评论
                moreflag: false, //点击展开更多评论标记
                clickContent: 0, //触底评论点击的某个评论的cid,默认是0
                commentFlag: false, //触底评论标记
                userInfos: "", //拿到用户登录后的信息
                hideFlag: true, //导航栏右侧是否显示
                collectionFlag: false, //收藏标记
                supportFlag: false, //点赞标记
                followFlag: false, //关注标记
                forwardFlag: false, //转发标记
                deleteFlag: false, //删除标记
                showreportFlag: false, //举报标记
                userHead: require("@/assets/headimg.png"),
                followImg: require('@/assets/follow.png'),
                followedImg: require('@/assets/followed.png'),
                CollectionImg: require('@/assets/shou.png'),
                supportImg: require('@/assets/zan.png'),
                CollectionedImg: require("@/assets/shoued.png"),
                supportedImg: require("@/assets/zaned.png"),
                forwardImg: require("@/assets/share.png"),
                forwardedImg: require("@/assets/shared.png"),
                deleteImg: require("@/assets/delete.png"),
                deletedImg: require("@/assets/deleted.png"),
                reportImg: require("@/assets/report.png"),
                thisNid: 0,
                nums: 0,
                message: {
                    uid: "",
                    nid: "",
                    avatar: "@/assets/moren.png",
                    imgs: ["@/assets/yujiazai.png"],
                    info: "加载中...",
                    releasetime: "0000-00-00 00:00:00",
                    support: 0,
                    title: "加载中...",
                    username: "加载中...",
                    keywords: []
                },
                comments: [], //评论容器
                columns: ["色情低俗", "暴力血腥", "诈骗欺瞒", "政治敏感", "违法违纪", "其它"]

            }
        },
        methods: {
            comeback() { //返回上一级
                this.$router.go(-1);
            },
            toPublish: function () { //点击评论
                this.loginTest.loginTesting().then((value) => { //解析检测是否登录的方法的返回值，then为调用成功触发的方法
                        if (!value) {
                            this.$router.push({
                                path: "/Login"
                            });
                        } else {
                            this.$router.push({
                                path: "/publish",
                                query: {
                                    nid: this.thisNid
                                }
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            support() { //点击点赞图标
                if (this.supportFlag) { //取消点赞
                    this.axios
                        .post(`http://ylin:88/note/cancelSupport`, {
                            uid: this.userInfos.uid,
                            nuid: this.message.uid,
                            nid: this.message.nid
                        }) //拿取用户信息
                        .then(response => {
                            if (response.data.code == 1) {
                                // Toast({
                                //     message: response.data.Msg,
                                //     duration: 1000
                                // });
                                this.supportFlag = false;
                            } else if (response.data.code == -1) {
                                Toast({
                                    message: response.data.Msg,
                                    duration: 1000
                                });
                                this.supportFlag = true;
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                } else { //点赞
                    //引用检测是否已登录的loginTesting.js文件(此文件在main.js已经全局引用，所以可以直接this.调用)
                    this.loginTest.loginTesting().then((value) => { //解析检测是否登录的方法的返回值，then为调用成功触发的方法
                        if (value) {
                            this.axios
                                .post(`http://ylin:88/note/supportnote`, {
                                    uid: this.userInfos.uid,
                                    nuid: this.message.uid,
                                    nid: this.message.nid
                                })
                                .then(response => {
                                    if (response.data.code == 1) {
                                        this.supportFlag = true;
                                    } else if (response.data.code == -1) {
                                        Toast({
                                            message: response.data.Msg,
                                            duration: 1000
                                        });
                                        this.supportFlag = false;

                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        } else {
                            this.supportFlag = false;
                            this.$router.push({
                                path: "/Login"
                            });
                        }
                    }).catch((value) => { //调用时报触发的方法
                        Toast("检测登录失败！")
                    });
                }
            },
            collection() { //点击收藏图标
                if (this.collectionFlag) { //取消收藏
                    this.axios
                        .post(`http://ylin:88/note/cancelCollection`, {
                            uid: this.userInfos.uid,
                            nid: this.message.nid
                        }) //拿取用户信息
                        .then(response => {
                            if (response.data.code == 1) {
                                Toast({
                                    message: response.data.Msg,
                                    duration: 1000
                                });
                                this.collectionFlag = false;
                            } else if (response.data.code == -1) {
                                Toast({
                                    message: response.data.Msg,
                                    duration: 1000
                                });
                                this.collectionFlag = true;
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                } else { //收藏
                    //引用检测是否已登录的loginTesting.js文件(此文件在main.js已经全局引用，所以可以直接this.调用)
                    this.loginTest.loginTesting().then((value) => { //解析检测是否登录的方法的返回值，then为调用成功触发的方法
                        if (value) {
                            this.axios
                                .post(`http://ylin:88/note/collectionnote`, {
                                    uid: this.userInfos.uid,
                                    nid: this.message.nid
                                })
                                .then(response => {
                                    if (response.data.code == 1) {
                                        this.collectionFlag = true;
                                        Toast({
                                            message: response.data.Msg,
                                            duration: 1000
                                        });
                                    } else if (response.data.code == -1) {
                                        Toast({
                                            message: response.data.Msg,
                                            duration: 1000
                                        });
                                        this.collectionFlag = false;

                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        } else {
                            this.collectionFlag = false;
                            this.$router.push({
                                path: "/Login"
                            });
                        }
                    }).catch((value) => { //调用时报触发的方法
                        Toast("检测登录失败！")
                    });
                }
            },
            follow() { //点击关注图标
                if (this.followFlag) {
                    this.axios
                        .post(`http://ylin:88/note/cancelFollow`, { //取消关注
                            suid: this.userInfos.uid,
                            fuid: this.message.uid
                        })
                        .then(response => {
                            if (response.data.code == 1) {
                                Toast({
                                    message: response.data.Msg,
                                    duration: 1000
                                });
                                this.followFlag = false;
                            } else if (response.data.code == -1) {
                                Toast({
                                    message: response.data.Msg,
                                    duration: 1000
                                });
                                this.followFlag = true;
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                } else { //关注
                    //引用检测是否已登录的loginTesting.js文件(此文件在main.js已经全局引用，所以可以直接this.调用)
                    this.loginTest.loginTesting().then((value) => { //解析检测是否登录的方法的返回值，then为调用成功触发的方法
                        if (value) {
                            this.axios
                                .post(`http://ylin:88/note/follow`, {
                                    suid: this.userInfos.uid,
                                    fuid: this.message.uid,
                                    fsynopsis: this.message.synopsis,
                                    fname: this.message.username,
                                    avatar: this.message.avatar

                                })
                                .then(response => {
                                    if (response.data.code == 1) {
                                        this.followFlag = true;
                                        Toast({
                                            message: response.data.Msg,
                                            duration: 1000
                                        });
                                    } else if (response.data.code == -1) {
                                        Toast({
                                            message: response.data.Msg,
                                            duration: 1000
                                        });
                                        this.followFlag = false;

                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        } else {
                            this.followFlag = false;
                            this.$router.push({
                                path: "/Login"
                            });
                        }
                    }).catch((value) => { //调用时报触发的方法
                        Toast("检测登录失败！")
                    });
                }
            },
            mousedown() { //按下转发按钮
                this.forwardFlag = true;

            },
            mouseUp() { //松开转发按钮
                this.forwardFlag = false;

            },
            //删除笔记
            deletedown(noteNid) {
                this.deleteFlag = true;
                Dialog.confirm({
                    title: '确认删除笔记？'
                }).then(() => {
                    this.axios
                        .post(`http://ylin:88/note/delete`, {
                            nid: noteNid
                        }) //退出删除数据库的session
                        .then(response => {
                            if (response.data.code == 1) {
                                Toast({
                                    message: "删除成功！",
                                    duration: 1000
                                })
                                this.$router.go(-1);
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
                }).catch(() => {
                    // console.log("haha");
                });
            },
            deleteUp() {
                this.deleteFlag = false;
            },
            TestingRight(uid, nuid, nid) { //检测 是否已点赞/关注/收藏
                this.axios
                    .post(`http://ylin:88/note/testing`, {
                        uid: uid,
                        nuid: nuid,
                        nid: nid
                    }) //退出删除数据库的session
                    .then(response => {
                        if (response.data.code == 1) {
                            if (response.data.data[0] && response.data.data[0].length != 0) {
                                this.collectionFlag = true; //点亮收藏标记

                            }
                            if (response.data.data[1] && response.data.data[1].length != 0) {
                                this.followFlag = true; //点亮关注标记
                            }
                            if (response.data.data[2] && response.data.data[2].length != 0) {
                                this.supportFlag = true; //点亮点赞标记
                            }
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
            //举报
            report() {
                this.showreportFlag = true;
            },
            // 取消举报
            onCancel() {
                this.showreportFlag = false;
            },
            //确认举报
            onConfirm(value) {
                this.axios
                    .post(`http://ylin:88/note/report`, {
                        id: this.message.nid,
                        uid: this.message.uid,
                        touid: this.userInfos.uid,
                        content: value,
                        type: "笔记"
                    })
                    .then(response => {
                        if (response.data.code == 1) {
                            Toast({
                                message: response.data.Msg,
                                duration: 1000
                            })
                            this.showreportFlag = false;
                        } else {
                            console.log(response.data);
                            Toast({
                                message: response.data.Msg,
                                duration: 1000
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            //点击评论的点赞
            clickSupport(cid, cuid, event) {
                if (event.currentTarget.style.color == 'red') { //取消点赞
                    this.axios
                        .post(`http://ylin:88/note/cancelSptcomments`, {
                            cid: cid,
                            uid: this.userInfos.uid,
                            cuid: cuid
                        }) //退出删除数据库的session
                        .then(response => {
                            if (response.data.code == 1) {
                                this.getALLComment();
                            } else {
                                Toast({
                                    message: response.data.Msg,
                                    duration: 1000
                                });
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else { //点赞
                    this.loginTest.loginTesting().then((loginflag) => { //检测是否已登录
                        if (loginflag) {
                            this.axios
                                .post(`http://ylin:88/note/supportcomments`, {
                                    cid: cid,
                                    uid: this.userInfos.uid,
                                    cuid: cuid
                                }) //退出删除数据库的session
                                .then(response => {
                                    if (response.data.code == 1) {
                                        this.getALLComment();
                                    } else {
                                        Toast({
                                            message: response.data.Msg,
                                            duration: 1000
                                        });
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        } else {
                            this.$router.push({
                                path: "/Login"
                            });
                        }
                    }).catch((value) => { //调用时报触发的方法
                        Toast("点赞失败！")
                    });
                }
            },
            //点击回复评论
            clickComment(value) {
                let that = this;
                this.loginTest.loginTesting().then((loginflag) => { //检测是否已登录
                    if (loginflag) {
                        that.clickContent = value; //拿到父级评论的cid
                        that.commentFlag = true;
                        setTimeout(() => { //自动获取焦点
                            document.querySelector(".van-field__control").focus()
                        }, 1000)
                    } else {
                        that.$router.push({
                            path: "/Login"
                        });
                    }
                }).catch((value) => { //调用时报触发的方法
                    Toast("检测登录失败！")
                });
            },
            getFocus() {
                this.commentFlag = true;
            },
            nohide() {

                this.commentFlag = true;
            },
            canhide() {
                this.commentFlag = false;
            },
            //失去焦点时
            loseFocus() {
                // this.commentFlag = false;
            },
            //点击确定，提交二级评论
            commentOK() {
                if (this.content) {
                    this.axios
                        .post(`http://ylin:88/note/comments`, {
                            uid: this.userInfos.uid,
                            fcid: this.clickContent,
                            nid: this.message.nid,
                            content: this.content
                        }) //退出删除数据库的session
                        .then(response => {
                            if (response.data.code == 1) {
                                this.commentFlag = false;
                                this.getALLComment();
                                this.openothercomments(this.clickContent, this.message.nid); //刷新当前评论
                                this.moreflag = true;
                                this.thisComment = this.clickContent;

                            } else {
                                Toast({
                                    message: response.data.Msg,
                                    icon: "cross"
                                });
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else {
                    Toast({
                        message: "评论不能为空",
                    });
                }
            },
            closecomment() { //关闭底部评论
                this.commentFlag = false;
            },
            openothercomments(cid, nid) { //展开更多评论
                this.newcomment = [];
                this.axios.post(`http://ylin:88/note/getmorecomments`, {
                        cid: cid,
                        nid: nid,
                    })
                    .then(response => {
                        if (response.data.code == 1) {
                            if (response.data.data) { //将每条评论的用户名和信息相匹配拼接
                                for (let i = 0; i < response.data.data[0].length; i++) {
                                    var moban = {
                                        name: "",
                                        text: ""
                                    }
                                    moban.text = response.data.data[0][i].content
                                    for (let j = 0; j < response.data.data[1].length; j++) {
                                        if (response.data.data[0][i].uid == response.data.data[1][j].uid) {
                                            moban.name = response.data.data[1][j].username;
                                            this.newcomment.push(moban);
                                        }
                                    }
                                }

                            }
                            this.thisComment = cid;
                            this.moreflag = true;
                        } else {
                            Toast({
                                message: "查询更多评论失败！",
                                duration: 1000
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            getALLComment() { //获取所有评论
                this.axios.get(`/note/getcomments?nid=${this.$route.query.nid}`)
                    .then(response => {
                        // 评论信息
                        if (response.data) {
                            this.comments = [];
                            for (let h = 0; h < response.data.length; h++) {
                                if (response.data[h].fcid == 0) { //选出直接子评论
                                    this.comments.push(response.data[h]);
                                }
                            }
                            this.nums = this.comments.length;
                            //格式化每条评论发表时间
                            for (var i = 0; i < this.nums; i++) {
                                if (this.format.dateFormat("YYYY-mm-dd", new Date(this.comments[i].comtimes)) ==
                                    this.format.dateFormat("YYYY-mm-dd", new Date())) {
                                    this.comments[i].comtimes = "今天 " + this.format.dateFormat("HH:MM",
                                        new Date(
                                            this.comments[i].comtimes));
                                } else {
                                    this.comments[i].comtimes = this.format.dateFormat("YYYY-mm-dd HH:MM",
                                        new Date(this.comments[i].comtimes));
                                }
                            }
                            this.getcommentflag(this.userInfos.uid); //获取点赞的信息
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            },
            //获得登录人支持过的评论信息
            getcommentflag(uid) {
                this.axios.get(`/note/getsuppportcomments?uid=${uid}`)
                    .then(response => {
                        if (response.data.code == 1) {
                            var allsupportcom = response.data.data;
                            for (let k = 0; k < this.comments.length; k++) {
                                this.comments[k]['colorFlag'] = false;
                                for (let j = 0; j < allsupportcom.length; j++) {
                                    if (allsupportcom[j].cid == this.comments[k].cid) {
                                        this.comments[k]["username"] = this.comments[k].username + " ";
                                        this.comments[k]['colorFlag'] = true;
                                    }
                                }
                            }

                        } else {
                            Toast({
                                message: response.data.Msg,
                                duration: 1000
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        created: function () { //页面初始化，获取数据
            this.$store.commit('updateLoading', true); //打开加载动画

            if (JSON.parse(sessionStorage.getItem('userInfo'))) { //如果已登录
                this.userInfos = JSON.parse(sessionStorage.getItem('userInfo'));
            }

            if (this.userInfos) {
                this.userHead = this.userInfos.avatar; //从session中拿到登陆人的头像
            }

            this.thisNid = this.$route.query.nid; //传递笔记nid
            var that = this;

            function getUserAccount() { //拿笔记信息
                return that.axios.get(`/note/userNotes?nid=${that.$route.query.nid}`);
            }

            function getUserPermissions() { //拿评论信息
                return that.axios.get(`/note/getcomments?nid=${that.$route.query.nid}`);
            }
            this.axios.all([getUserAccount(), getUserPermissions()]).then(
                that.axios.spread((acct, perms) => {
                    that.$store.commit('updateLoading', false); //关闭加载动画
                    this.show = false;
                    // 两个请求现在都执行完成
                    // 笔记信息
                    this.message = acct.data[0];
                    // 今天发表的显示小时分钟，否则只显示到日期
                    if (this.format.dateFormat("YYYY-mm-dd", new Date(acct.data[0].releasetime)) == this
                        .format.dateFormat("YYYY-mm-dd", new Date())) {
                        this.message.releasetime = "今天 " + this.format.dateFormat("HH:MM", new Date(acct
                            .data[0].releasetime)); //格式化笔记发表时间
                    } else {
                        this.message.releasetime = this.format.dateFormat("YYYY-mm-dd HH:MM", new Date(acct.data[
                            0].releasetime)); //格式化笔记发表时间
                    }

                    //如果是自己的笔记就隐藏导航条右侧按钮
                    if (this.userInfos && this.message && (this.userInfos.uid == this.message.uid)) {
                        this.hideFlag = false;
                    }

                    // 评论信息
                    if (perms.data) {
                        for (let h = 0; h < perms.data.length; h++) {
                            if (perms.data[h].fcid == 0) { //选出直接子评论
                                this.comments.push(perms.data[h]);
                            }
                        }
                        this.nums = this.comments.length;
                        //格式化每条评论发表时间
                        for (var i = 0; i < this.nums; i++) {
                            if (this.format.dateFormat("YYYY-mm-dd", new Date(this.comments[i].comtimes)) ==
                                this.format.dateFormat("YYYY-mm-dd", new Date())) {
                                this.comments[i].comtimes = "今天 " + this.format.dateFormat("HH:MM",
                                    new Date(
                                        this.comments[i].comtimes));
                            } else {
                                this.comments[i].comtimes = this.format.dateFormat("YYYY-mm-dd HH:MM",
                                    new Date(this.comments[i].comtimes));
                            }
                        }
                    }

                    //检测 是否已点赞/关注/收藏
                    if (this.userInfos && this.message) {
                        this.TestingRight(this.userInfos.uid, this.message.uid, this.message.nid);
                        this.getcommentflag(this.userInfos.uid);
                    }

                })).catch(function (error) {
                console.log(error);
            });

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
        box-sizing: border-box;
    }

    a {
        text-decoration: none;
        color: rgb(212, 209, 209);
    }

    li {
        list-style: none;
    }

    .notes-box {
        width: 100%;
    }

    .block {
        width: 120px;
        height: 120px;
        background-color: #fff;
    }

    /* 导航栏部分 */
    nav {
        height: 4rem;
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        z-index: 100;
        top: 0;
        padding: 0.5rem 1rem 0.5rem 0rem;
        box-sizing: border-box;
    }

    nav>.nav-lfet {
        width: 12rem;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    nav>.nav-lfet>.userMsg {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    nav>.nav-right {
        width: 10rem;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    nav>.nav-rightX {
        display: none;
    }

    nav>.deleteBox {
        width: 3rem;
        height: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    nav>.deleteBox>img {
        line-height: 3rem;
        width: 2rem;
        height: 2rem;
    }

    nav>.deleteBoxX {
        display: none;
    }


    .supportBox>img {
        width: 2.5rem;
        height: 2.5rem;
    }

    .collectionBox>img {
        width: 2.5rem;
        height: 2.5rem;
    }

    .followBox>img {
        width: 2rem;
        height: 2rem;
    }

    .reprint>img {
        width: 2.5rem;
        height: 2.5rem;
    }

    .forwarded>img {
        width: 2.5rem;
        height: 2.5rem;
    }

    /* 笔记部分 */
    .notes-box {
        height: auto;
        margin-top: 4rem;
    }

    .swipeBox>>>.van-swipe {
        height: auto;
    }

    .swipeBox>>>.van-swipe__track {
        display: flex;
        align-items: center;
    }

    .textContent>p {
        font-size: 16px;
        font-weight: 600;
        padding: 1rem 1.5rem;
    }

    .textContent>.textInfo-box {
        padding: 0 1rem;
    }

    .textContent>.textInfo-box>.textInfo span {
        font-size: 1.3rem;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .textContent>.textInfo-box>.noteLabel {
        margin-top: 1rem;
        font-size: 1.2rem;
        display: inline-block;
        color: rgb(31, 100, 228);
        background-color: rgb(204, 238, 248);
        border-radius: 8px;
        padding: 0 0.5rem;
        margin-right: 0.5rem;
    }

    .textContent>.textInfo-box>.noteLabel>span {
        width: auto;
        line-height: 20px;
    }

    .textContent>.textInfo-box>.publishTime {
        display: flex;
        justify-content: space-between;
        align-content: center;
        color: #b3b6b6;
        margin-top: 0.5rem;
    }

    .textContent>.textInfo-box>.publishTime>.report {
        width: 1.5rem;
        height: 100%;
    }

    .textContent>.textInfo-box>.publishTime>.report>img {
        width: 100%;
        height: 100%;
    }


    /* 评论部分 */
    .comments-box {
        margin-top: 1rem;
        border-top: 1px solid #d8d1d1;
        padding: 1rem;
    }

    .tx6 {
        font-size: 1.3rem;
        color: #565454;
    }

    .com1 {
        height: auto;
        display: flex;
        justify-content: space-between;
        margin: 1rem 0;
    }

    .ig5 {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
    }

    .com1>input {
        width: 85%;
        text-align: center;
        border: 0px solid rgb(218, 215, 215);
        background-color: rgb(245, 240, 240);
        border-radius: 999em;
        font-size: 1.2rem;
    }

    /* 评论内容样式 */
    .commentList-box {
        height: auto;
        font-size: 1.2rem;
        /* padding: 1rem; */
    }

    .commentList-box .personComment {
        border-top: 2px solid #eee;
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
        font-size: 1rem;
        color: rgb(138, 136, 136);
    }

    .commentList-box .personComment .comment-top>.rightdo {
        width: 4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
    }

    .commentList-box .personComment .commentContent {
        margin: 1rem 0 0.5rem 3.5rem;
    }

    /* 其他评论 */
    .morecomments {
        font-size: 1.1rem;
        margin-top: 3rem;
    }

    .othercomments {
        background-color: rgb(250, 249, 249);
    }

    .othercomments li {
        line-height: 1.8rem;
    }

    .othercomments li .name {
        margin-right: 0.5rem;
        color: rgb(89, 211, 241);
    }

    .othercomments li p {
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .othercomments li .textcomment {
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .commentTextBox {
        background-color: rgb(218, 214, 214);
        position: fixed;
        bottom: 0;
        width: 100%;
    }

    .commentTextBox .van-cell {
        padding: 0.5rem 1rem;
        background-color: rgb(250, 246, 246);
        box-sizing: border-box;
        height: 7rem;
        line-height: 2rem;
        align-items: self-start;
    }

    .commentTextBox>>>.van-cell__value {
        max-height: 5rem;

    }

    .commentTextBox>>>.van-field__body {
        align-items: center;
    }

    .commentTextBox>>>.van-field__control {
        background-color: #fff;
    }
</style>