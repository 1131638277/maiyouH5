<template>
  <div class="container" @click="zanheight" ref="containerBox">
    <van-sticky class="mynav">
      <van-nav-bar :title="otheruser.username" left-text="取消" right-text="用户" left-arrow @click-left="onClickLeft"
        @click-right="onClickRight" />
    </van-sticky>

    <div>
      <!-- 表情显示框 -->
      <!-- <div class="text-place">
        <p style="word-break: break-all;word-wrap: break-word;" v-html="content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)" ></p>
      </div> -->

      <!-- 聊天内容 -->
      <div class="chatContent" :style="{'height':chatHeight}" id="chatContents" @click="closeEmoji" ref="chatbox">
        <div :class="(value.falg!=userInfo.uid)?'otherword':'myword'" v-for="(value,index) in chatdata.textinfo"
          :key="index">
          <div v-if='(value.falg!=userInfo.uid)' class="left">
            <div class="otherUserheader">
              <van-image round width="4rem" height="4rem" fit="cover" :src="otheruser.avatar" />
            </div>
            <div class="chatText">
              <div class="contentText" v-html="(value.text).replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)"
                @click="enlarge(value.text)"></div>
              <i :class="(value.falg!=userInfo.uid)?'otherArrow':'myArrow'"></i>
            </div>
          </div>
          <div v-else class="right">
            <div class="chatText">
              <div class="contentText" v-html="(value.text).replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)"
                @click="enlarge(value.text)"></div>
              <i :class="(value.falg!=userInfo.uid)?'otherArrow':'myArrow'"></i>
            </div>
            <div class="myheader">
              <van-image round width="4rem" height="4rem" fit="cover" :src="userInfo.avatar" />
            </div>
          </div>
        </div>
      </div>

      <div id="foot" :style="'height:'+footheight">
        <!-- 我是消息队列下的占位空间 -->
      </div>

      <!-- 文本输入框 -->
      <div class="input-box">
        <div class="topBox">
          <textarea class="text" rows="1" v-model="content"></textarea>
          <!-- <p class="text" contenteditable="true" @keyup="editnameSet($event)" ref="input"
            v-html="content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)">
          </p> -->

          <van-button class="setbutton" color="#7232dd" @click="setText" size="small">发送</van-button>
        </div>
        <!-- 选择相册、拍照、表情 -->
        <div class="bottomBox">
          <van-uploader :after-read="afterRead" accept="image/*" preview-size="30px" preview-image
            upload-icon="photo" />
          <van-uploader :after-read="afterRead" accept="image/*" preview-size="30px" :preview-image="true"
            capture="camera" upload-icon="photograph" />
          <van-icon @click="emojifun" name="smile" size="25px" color="#dcdee0" />

        </div>
        <!-- 表情框 -->
        <div class='emoji-box' v-if="emojiFalg">
          <emotion @emotion="handleEmotion" :height="140"></emotion>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import io from 'socket.io-client'
  import Emotion from '@/components/Emotion/index.vue'
  import Vue from 'vue';
  import {
    Toast,
    Field,
    Sticky,
    Button,
    Uploader,
    Icon,
    ImagePreview,
    Image,
    Info
  } from "vant";

  Vue.use(Toast);
  Vue.use(Field);
  Vue.use(Sticky);
  Vue.use(Button);
  Vue.use(Icon);
  Vue.use(Uploader);
  Vue.use(ImagePreview);
  Vue.use(Image);
  export default {
    components: {
      Emotion
    },
    data() {
      return {
        otherUid: "",
        userInfo: {
          avatar: require("@/assets/touxiang.png")
        },
        otheruser: {
          avatar: require("@/assets/touxiang.png"),
          username: ""
        },
        chatHeight: "",
        footheight: "", //底部占位符高度
        emojiFalg: false, //表情是否显示标志
        content: '',
        comment: '',
        chatdata: {
          cid: "",
          textinfo: [],
          myuid: "",
          otheruid: "",
          avatar: "",
          name: "",
          oldInfo: "", //存放上一次的聊天数据
        },
        imgchatdata: {},
      }
    },
    watch: {
      chatdata: { //监听对话数据，有变化就显示到最底端
        handler(val, oldVal) {},
        deep: true
      },
      imgchatdata: { //监听对话数据，有变化就显示到最底端
        handler(val, oldVal) {
          // console.log("监听")
          let that = this;
          setTimeout(() => {
            that.$refs.chatbox.scrollTop = that.$refs.chatbox.scrollHeight;
          }, 0);
          this.imgchatdata.myuid = this.userInfo.uid;
          this.imgchatdata.otheruid = this.otherUid;
          this.imgchatdata.mavatar = this.userInfo.avatar;
          this.imgchatdata.yavatar = this.otheruser.avatar;
          this.imgchatdata.mname = this.userInfo.username;
          this.imgchatdata.yname = this.otheruser.username;
          // sessionStorage.setItem("chatmsgs", JSON.stringify(val)); //将当前页面的数据存入session
          return val;
        },
        deep: true
      },
    },
    mounted() {},
    methods: {
      onClickLeft() { //返回上一级
        this.$router.go(-1);
        // window.clearInterval(this.timer);
      },
      onClickRight() { //右键
        Toast({
          message: "暂未开放",
          duration: 1000
        })
      },
      handleEmotion(i) { //表情序号
        this.content += i;
      },
      // 将匹配结果替换表情图片
      emotion(res) {
        let word = res.replace(/\#|\;/gi, '')
        const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷',
          '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕',
          '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险',
          '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电',
          '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你',
          'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极'
        ]
        let index = list.indexOf(word)
        return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`
      },
      emojifun() { //点击表情符号
        if (this.emojiFalg) {
          this.emojiFalg = false;
        } else {
          this.emojiFalg = true;
        }
      },
      afterRead(file) { //上传图片
        let that = this;
        let content = file.file;
        let data = new FormData();
        data.append('avatar', file.file);

        this.axios.post('/upload/uploadImg', data)
          .then(function (response) {
            if (response.data && response.data.code == 1) {
              let obj = { //每条消息的模板
                text: `<img style="width:100%;height:auto" src="${response.data.url}" align="middle">`,
                falg: that.userInfo.uid
              }
              let objOther = { //每条消息的模板
                text: response.data.url,
                falg: that.userInfo.uid
              }
              that.chatdata.textinfo.push(obj); //将每条消息加入总的数组中
              that.imgchatdata.textinfo.push(objOther); //存储地址
              //发送消息
              that.backText();
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

      },
      editnameSet(e) { //监控input数据
      },
      setText() { //点击发送消息
        if (this.content != '') {
          this.content = this.content.replace(/[\r\n]/g, " ");
          let obj = { //每条消息的模板
            text: this.content,
            falg: this.userInfo.uid
          }
          this.chatdata.textinfo.push(obj); //将每条消息加入总的数组中
          this.imgchatdata.textinfo.push(obj); //加入要上传的数据中去
          this.content = ''; //清空输入框内容
          //发送消息
          this.backText();
        }
      },
      //进行全双工通信,进行消息推送
      backText() {
        let that = this;
        if (window.WebSocket) {
          var ws = new WebSocket('ws://ylin:8001/chat');
          ws.onopen = function (e) {
            var Infos;
            Infos = that.imgchatdata;
            // 连接服务器成功
            console.log("服务器已连接");
            ws.send(JSON.stringify(Infos)); //向服务器发送数据
          }
          ws.onclose = function (e) {
            console.log("服务器已断开");
          }
          ws.onerror = function () {
            console.log("连接出错");
          }

          ws.onmessage = (e) => {
            let contents = JSON.parse(e.data);
            if (contents.code == 1) { //第一次发送
              contents.data[1][0].textinfo = eval("(" + contents.data[1][0].textinfo + ")");
              that.imgchatdata = JSON.parse(JSON.stringify(contents.data[1][0])); //存入要上传的文件中
              for (let i = 0, nums = contents.data[1][0].length; i < nums; i++) { //给图片加上标签
                let str = contents.data[1][0].textinfo[i].text.substr(0, 31);
                if (str == "http://192.168.43.73:88/uploads") {
                  contents.data[1][0].textinfo[i].text =
                    `<img style="width:100%;height:auto" src="${ contents.data[1][0].textinfo[i].text}" align="middle">`
                }
              }
              that.chatdata = contents.data[1][0];
              that.imgchatdata.oldInfo = JSON.parse(JSON.stringify(that.imgchatdata.textinfo)); //存下上一次的聊天数据
            } else if (contents.code == 2) { //第二次及以后发送
              contents.data = JSON.parse(contents.data);
              that.imgchatdata = JSON.parse(JSON.stringify(contents.data)); //存入要上传的文件中
              for (let i = 0, nums = contents.data.length; i < nums; i++) { //给图片加上标签
                let str = contents.data.textinfo[i].text.substr(0, 31);
                if (str == "http://192.168.43.73:88/uploads") {
                  contents.data.textinfo[i].text =
                    `<img style="width:100%;height:auto" src="${ contents.data.textinfo[i].text}" align="middle">`
                }
              }
              that.chatdata = contents.data;
              that.imgchatdata.oldInfo = JSON.parse(JSON.stringify(that.imgchatdata.textinfo)); //存下上一次的聊天数据
            } else {
              Toast({
                message: "发送信息失败!",
                duration: 1000
              })
            }
          }
        }

      },
      enlarge(value) { //点击图片消息放大
        var startnum = value.indexOf('src="'); //找不到对应字符返回-1
        var endnum = value.indexOf('align'); //找不到对应字符返回-1
        var imgaddress = value.substr(startnum + 5, endnum - startnum - 7); //拿到图片地址
        if (startnum != -1 && endnum != -1) {
          ImagePreview({ //预览图片
            images: [
              imgaddress
            ],
            showIndex: false //不显示图片数量
          });
        }
      },
      closeEmoji() { //点击聊天处隐藏表情框
        this.emojiFalg = false;
      },
      zanheight() { //获取占位符的实时高度
        this.footheight = document.querySelector(".input-box").offsetHeight + 'px';
      },
      getchatInfo() { //去拿聊天信息
        this.axios.post("/chat/getchatInfo", {
            myuid: this.userInfo.uid,
            otheruid: this.otherUid
          })
          .then(response => {
            if (response.data.code == 1) {
              if (response.data.data.length != 0) {
                let chatInfos = response.data.data[0];
                chatInfos.textinfo = JSON.parse(chatInfos.textinfo);
                this.imgchatdata = JSON.parse(JSON.stringify(chatInfos)); //保存新的数据，作为上传数据
                for (let i = 0, nums = chatInfos.textinfo.length; i < nums; i++) {
                  let str = chatInfos.textinfo[i].text.substr(0, 31);
                  if (str == "http://192.168.43.73:88/uploads") {
                    chatInfos.textinfo[i].text =
                      `<img style="width:100%;height:auto" src="${ chatInfos.textinfo[i].text}" align="middle">`
                  }
                }
                this.chatdata = chatInfos;
                this.imgchatdata.oldInfo = JSON.parse(JSON.stringify(this.imgchatdata.textinfo)); //存下上一次的聊天数据
                //建立全双工通信
                this.backText();
              } else {
                this.chatdata['cid'] = 0;
                this.chatdata.myuid = this.userInfo.uid;
                this.chatdata.otheruid = this.otherUid;
                this.chatdata.textinfo = [];
                this.chatdata.mavatar = this.userInfo.avatar;
                this.chatdata.yavatar = this.otheruser.avatar;
                this.chatdata.mname = this.userInfo.username;
                this.chatdata.yname = this.otheruser.username;
                this.imgchatdata['cid'] = 0;
                this.imgchatdata.myuid = this.userInfo.uid;
                this.imgchatdata.otheruid = this.otherUid;
                this.imgchatdata.textinfo = [];
                this.imgchatdata.mavatar = this.userInfo.avatar;
                this.imgchatdata.yavatar = this.otheruser.avatar;
                this.imgchatdata.mname = this.userInfo.username;
                this.imgchatdata.yname = this.otheruser.username;
                this.backText();//第一次建立通信，必须，因为第一次不传信息
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
      getOtherUserInfo() { //获取对方信息
        this.axios.get(`/user/getuserinfo?otherUid=${this.otherUid}`)
          .then(response => {
            if (response.data.code == 1 && response.data.data.length != 0) {
              this.otheruser = response.data.data[0];
            } else {
              Toast({
                message: `查询对方用户失败！${this.otherUid}`,
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
      // 获取传来的聊天人的uid
      this.otherUid = parseInt(this.$router.currentRoute.query.otherUid);
      //获取登陆人信息
      if (sessionStorage.getItem("userInfo")) {
        this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      }
      //当来聊天信息无缓存时，去数据库查询信息
      this.getOtherUserInfo();
      setTimeout(() => {
        this.getchatInfo();
      }, 0);
    },
    mounted: function () { //数据挂载好后
      setTimeout(() => {
        //计算对话框的高度，高度=信息发送框距离顶部的高度-顶部导航的高度
        this.chatHeight = (document.querySelector(".input-box").offsetTop - document.querySelector(".mynav")
          .clientHeight) + "px";
        //获取对话框下的占位框的高度=信息发送框的高度
        this.footheight = document.querySelector(".input-box").offsetHeight + 'px';
      }, 0)
    },
    updated: function () {},
  }
</script>
<style scoped>
  /* 使输入框获取焦点后无边框出现 */
  [contenteditable]:focus {
    outline: none;
  }

  html,
  body {
    font-size: 62.5%;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    overflow-y: hidden;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    padding: 0;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: #000;
  }

  li {
    list-style: none;
  }

  .container {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    background-color: rgb(246, 242, 242);
  }

  .text-place {
    height: 8rem;
    box-sizing: border-box;
    padding: 5px 10px;
    border-radius: 8px;
    /* background-color: rgb(246, 242, 242); */
  }

  .text-place p {
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    margin: 0;
  }

  .emoji-box {
    background-color: #fff;
    border: 0px;
  }

  .input-box {
    padding-top: 0.5rem;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: auto;
    background-color: rgb(245, 241, 241);
  }

  .topBox {
    width: 100%;
    display: flex;
    align-items: flex-end;
    margin-bottom: 0.5rem;
  }

  .topBox .text {
    margin: 0 auto;
    resize: none;
    box-sizing: border-box;
    padding: 5px 10px;
    width: 80%;
    min-height: 3rem;
    max-height: 8rem;
    border: 0px;
    border-radius: 10px;
    font-size: 1.4rem;
    background-color: #fff;
    overflow-x: hidden;
    /* 强制换行，以单词为分解。 */
    word-break: break-all;
    word-wrap: break-word;
  }

  .topBox .text>>>img {
    width: 2rem;
    height: 2rem;
    vertical-align: text-top;
  }

  .topBox .setbutton {
    margin: 0 auto;
  }

  .chatContent {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overflow-y: scroll;
    background-color: rgb(245, 241, 241);
    background-size: 100% 100%;
    padding-bottom: 1rem;
    box-sizing: border-box;
  }

  .otherword {
    margin-top: 1rem;
    font-size: 1.3rem;
    box-sizing: border-box;
    padding: 0 1rem;
    max-width: 80%;
  }

  .myword {
    max-width: 80%;
    margin-top: 1rem;
    font-size: 1.3rem;
    box-sizing: border-box;
    padding: 0 1rem;
    align-self: flex-end;
  }

  .chatText {
    display: inline-block;
    position: relative;
  }

  .myArrow {
    position: absolute;
    width: 0;
    height: 0;
    border: 0.5rem solid transparent;
    border-left: 0.8rem solid #fff;
    right: -1.2rem;
    top: 0.6rem;
  }

  .otherArrow {
    position: absolute;
    width: 0;
    height: 0;
    border: 0.5rem solid transparent;
    border-right: 0.8rem solid #fff;
    left: -1.2rem;
    top: 0.6rem;
  }

  .contentText {
    min-height: 3rem;
    min-width: 3rem;
    border-radius: 8px;
    align-items: center;
    box-sizing: border-box;
    padding: 0.6rem;
    display: inline-block;
    width: auto;
    background-color: #fff;
    line-height: 2.4rem;
    /* 强制换行，以单词为分解。 */
    word-break: break-all;
    word-wrap: break-word;
  }

  .contentText>>>img {
    vertical-align: bottom;
  }

  .myheader {
    display: inline-block;
    margin-left: 1rem;
  }

  .otherUserheader {
    display: inline-block;
    margin-right: 1rem;
  }

  .left,
  .right {
    display: flex;
  }
</style>