<template>
  <div>
    <!-- 消息的页面 -->
    <van-nav-bar title="消 息">
      <!-- <van-icon name="chat-o" slot="right" color="grey" size="1.9em" /> -->
    </van-nav-bar>
    <div class="secondbar">
      <van-cell is-link @click="showPopup()">我的关注</van-cell>
      <van-popup v-model="followshow" position="right" :style="{ height: '100%',width:'100%' }">
        <div class="ListBox">
          <van-nav-bar class="title" left-arrow left-text="返回" title="我的关注" @click-left="close">
          </van-nav-bar>
          <div style="width:100%">
            <van-empty v-if="friendsList.length==0" description="快去添加好友吧~" />
            <div class="friendsListBox" v-for="(value,index) in friendsList" :key="index" @click="tochat(value.fuid)">
              <div class="List-left">
                <van-image width="3.5rem" height="3.5rem" round fit="cover" :src="value.avatar" />
              </div>
              <div class="List-right">
                <div class="right-top">
                  <p>{{value.fname}}</p>
                </div>
                <div class="right-bottom">
                  <p>{{value.fsynopsis}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
    <div class="container">
      <van-empty v-if="chatArr.length==0" description="暂无消息" />
      <div class="friendsListBox1" v-for="(value,index) in chatArr" :key="index" @click="tochat(value.id)">
        <div class="List-left1">
          <van-image width="3.5rem" height="3.5rem" round fit="cover" :src="value.avatar" />
        </div>
        <div class="List-right1">
          <div class="right-top1">
            <p>{{value.name}}</p>
            <p class="time">{{value.lastTime}}</p>
          </div>
          <div class="right-bottom1">
            <p>{{value.chatInfo}}</p>
          </div>
        </div>
      </div>

    </div>

    <Footer />
  </div>
</template>

<script>
  import Vue from 'vue';
  import {
    Image as VanImage,
    Toast
  } from 'vant';
  import {
    Image,
    Popup,
    IndexBar,
    IndexAnchor,
    Empty,
  } from 'vant';
  Vue.use(Image);
  Vue.use(Popup);
  Vue.use(IndexBar);
  Vue.use(IndexAnchor);
  Vue.use(VanImage);
  Vue.use(Empty);

  export default {
    data() {
      return {
        chatArr: [],
        followshow: false,
        friendsList: [],
        myuid:""
      }
    },
    methods: {
      //打开关注列表
      showPopup() {
        this.followshow = true;
        if (sessionStorage.getItem("userInfo")) {
          this.getInfos(JSON.parse(sessionStorage.getItem("userInfo")).uid);
        } else {
          Toast({
            message: "请先登录",
            duration: 1000
          })
          this.$router.push({
            path: "/login"
          })
        }
      },
      //返回
      close() {
        this.followshow = false;
      },
      //跳到聊天界面
      tochat(uid) {
        //引用检测是否已登录的loginTesting.js文件(此文件在main.js已经全局引用，所以可以直接this.调用)
        this.loginTest.loginTesting().then((value) => { //解析检测是否登录的方法的返回值，then为调用成功触发的方法
          if (value) {
            this.$router.push({
              path: "/chat",
              query: {
                otherUid: uid
              }
            });
          } else {
            this.$router.push({
              path: "/Login"
            });
          }
        }).catch((value) => { //调用时报触发的方法
          Toast("检测登录失败！")
        });
      },
      //获取关注人信息
      getInfos(uid) {
        this.axios
          .get(`http://ylin:88/chat/getInfos?uid=${uid}`)
          .then(response => {
            if (response.data.code == 1) {
              this.friendsList = response.data.data;
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
      //获取当前聊天列表信息
      getChatInfos(thisUid) {
        this.axios
          .get(`http://ylin:88/chat/getChatList?uid=${thisUid}`)
          .then(response => {
            if (response.data.code == 1) {
              // console.log("查询数据：",response.data.data);
              this.chatArr = response.data.data;
              // console.log("数据：",this.chatArr);
              let todayTime = this.format.dateFormat("YYYY-mm-dd", new Date()); //今天的日期
              let Yesterday = new Date().getTime() - 24 * 60 * 60 * 1000;
              let YesterdayTime = this.format.dateFormat("YYYY-mm-dd", new Date(Yesterday)); //昨天的日期
              for (let i = 0, num = this.chatArr.length; i < num; i++) {
                if(this.chatArr[i].myuid==thisUid){//找出对方的id
                  this.chatArr[i].id=this.chatArr[i].otheruid;
                  this.chatArr[i].name=this.chatArr[i].yname;
                  this.chatArr[i].avatar=this.chatArr[i].yavatar;                  
                }else{
                  this.chatArr[i].id=this.chatArr[i].myuid;
                   this.chatArr[i].name=this.chatArr[i].mname;
                  this.chatArr[i].avatar=this.chatArr[i].mavatar;  
                }
                let thisTime = this.format.dateFormat("YYYY-mm-dd", new Date(this.chatArr[i].lastTime));
                if (todayTime == thisTime) {
                  this.chatArr[i].lastTime = this.format.dateFormat("HH:MM", new Date(this.chatArr[i].lastTime));
                } else if (thisTime == YesterdayTime) {
                  this.chatArr[i].lastTime = "昨天 " + this.format.dateFormat("HH:MM", new Date(this.chatArr[i]
                    .lastTime));
                } else { //其它时间
                  this.chatArr[i].lastTime = this.format.dateFormat("mm-dd", new Date(this.chatArr[i].lastTime));
                }
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

      }
    },
    created: function () {
      if (sessionStorage.getItem("userInfo")) {
        this.getChatInfos(JSON.parse(sessionStorage.getItem("userInfo")).uid);
      }
    }
  };
</script>

<style>
  html {
    font-size: 62.5%;
  }

  .secondbar {
    width: 100%;
    height: auto;
  }

  .container {
    margin-bottom: 5rem;
  }

  .van-cell__title {
    text-align: left;
    padding-left: 1.5rem;
  }

  .ListBox {
    width: 100%;
    height: auto;
  }

  .friendsListBox,
  .friendsListBox1 {
    width: 100%;
    height: 6rem;
    padding: 0.5rem 2rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-top: 1px solid rgb(245, 242, 242);
    box-sizing: border-box;
  }

  .List-left,
  .List-left1 {
    /* margin-right: 1rem; */
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20%;
  }


  .List-right,
  .List-right1 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 75%;
  }

  .List-right .right-top,
  .List-right1 .right-top1 {
    font-size: 1.3rem;
    height: 50%;
    margin-bottom: 0.3rem;
  }

  .List-right1 .right-top1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .List-right1 .right-top1>.time {
    font-size: 1.2rem;
    color: rgb(179, 174, 174);
  }

  .List-right .right-bottom,
  .List-right1 .right-bottom1 {
    font-size: 1.1rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>