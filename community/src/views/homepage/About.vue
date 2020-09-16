<template>
  <div>
    <div class="header">
      <van-sticky>
        <nav>
          <van-nav-bar class="usertitle"
            :left-text="userMassage.identity==0?'':(userMassage.identity==1?'商家管理':'管理员管理')"
            :title="userMassage.username" @click-left="tomanage(userMassage.identity)"></van-nav-bar>
          <!-- 切换账号弹出层 -->
          <div class="tuchu" @click="getout"></div>
          <van-action-sheet v-model="tanshow" lazy-render :actions="actions" @select="onSelect" />
        </nav>
      </van-sticky>
    </div>

    <div class="user">
      <!-- 用户头像 -->
      <div class="headImg-box">
        <van-image round fit="cover" :src="userMassage.avatar" @click="toLogin">
        </van-image>
      </div>
      <div class="synopsisBox">
        <p>{{userMassage.synopsis}}</p>
      </div>
      <!-- 关注/粉丝/获赞 -->
      <div class="info">
        <div>
          <span class="infodata">{{userMassage.follow}}</span>
          <span>关注</span>
        </div>
        <div>
          <span class="infodata">{{userMassage.fans}}</span>
          <span>粉丝</span>
        </div>
        <div>
          <span class="infodata">{{userMassage.support}}</span>
          <span>获赞</span>
        </div>
      </div>
      <!-- 其它信息编辑 -->
      <div class="routers">
        <span @click="todata">编辑信息> |</span>
        <span @click="tovip">
          <van-icon name="manager-o" />成为会员>
        </span>
      </div>

    </div>

    <van-divider />

    <div style="margin-bottom:5rem;">
      <van-tabs v-model="active" animated>
        <van-tab title="笔记" name="a">
          <van-tabs animated swipeable @rendered="getdata">
            <van-tab title="我的" name="d">
              <div style="margin-top:0.5rem">
                <note1 :personalUid="myself"></note1>
              </div>
            </van-tab>
            <van-tab title="收藏" name="e">
              <div style="margin-top:0.5rem">
                <note2 :personalUid="myCollection"></note2>
              </div>
            </van-tab>
            <van-tab title="点赞" name="f">
              <div style="margin-top:0.5rem">
                <note3 :personalUid="mySupport"></note3>
              </div>
            </van-tab>
            <van-divider />
          </van-tabs>
        </van-tab>
        <van-tab title="商品" name="b">
          <van-tabs animated swipeable @rendered="getShoppingData">
            <van-tab title="已购" name="g">
              <div style="margin-top:0.5rem">
                <shoppingshow :keyNum="buy" />
              </div>
            </van-tab>
            <van-tab title="购物车" name="h">
              <div style="margin-top:0.5rem">
                <shoppingshow :keyNum="cart" />
              </div>
            </van-tab>
            <van-tab title="收藏" name="i">
              <div style="margin-top:0.5rem">
                <shoppingshow :keyNum="shoppingCollection" />
              </div>
            </van-tab>
            <van-divider />
          </van-tabs>
        </van-tab>
      </van-tabs>
    </div>
    <Footer />
  </div>
</template>

<script>
  import Vue from 'vue';
  import {
    Dialog,
    Image,
    Lazyload,
    ImagePreview,
    Popup,
    ActionSheet,
    Toast,
    Sticky
  } from "vant";

  Vue.use(Image);
  Vue.use(ImagePreview);
  Vue.use(Popup);
  Vue.use(ActionSheet);
  Vue.use(Toast);
  Vue.use(Sticky);

  import note1 from "@/components/personnotes.vue"
  import note2 from "@/components/personnotes.vue"
  import note3 from "@/components/personnotes.vue"

  export default {
    components: {
      "note1": note1,
      "note2": note2,
      "note3": note3
    },
    data() {
      return {
        myself: "",
        myCollection: "", //收藏传参
        mySupport: "", //点赞传参
        buy: "", //购买传参
        cart: "", //购物车传参
        shoppingCollection: "", //商品收藏传参
        tanshow: false,
        actions: [{
            name: '切换账户'
          },
          {
            name: '退出'
          },
          {
            name: '取消'
          }
        ],
        show: false,
        activeName: "a",
        active: "",
        userMassage: {
          uid: "",
          identity: 0,
          username: "未登录",
          avatar: require("../../assets/touxiang.png"),
          follow: 0,
          fans: 0,
          support: 0
        }
      };
    },

    methods: {
      //跳转到商家或管理员界面
      tomanage(num) {
        if (num == 1) {
          this.$router.push({
            path: "/businessManage"
          })
        } else if ((num == 2)) {
          this.$router.push({
            path: "/adimManage"
          })
        }
      },
      showPopup() { //分享
        this.show = true;
      },
      toLogin(e) {
        if (sessionStorage.getItem("userInfo")) { //已登录时放大头像
          ImagePreview({
            images: [
              this.userMassage.avatar
            ],
            showIndex: false,
          });
        } else { //未登录跳转到登录页面
          this.$router.push({
            path: "/Login"
          });
        }
      },
      getout() { //弹出账号切换框
        this.tanshow = true;
      },
      onSelect(item) { //点击弹出层
        this.tanshow = false;
        if (item.name == "切换账户") {
          this.$router.push({
            path: "/Login"
          });
        } else if (item.name == "退出") {
          if (!sessionStorage.getItem("userInfo")) {
            Toast({
              message: "您还未登录",
              duration: 1000
            });
          } else {
            Dialog.confirm({
              message: '确认退出？'
            }).then(() => {
              this.axios.get(`http://ylin:88/user/getsession?uid=${this.userMassage.uid}`)
                .then(response => {
                  if (response.data.code == 1) {
                    console.log("获取道的id", response);
                    this.axios
                      .get(`http://ylin:88/user/signOut?thisdata=${response.data.data}`) //退出删除数据库的session
                      .then(response => {
                        if (response.data.code == 1) {
                          location.reload();
                          sessionStorage.removeItem("userInfo"); //清除浏览器的sessionStorage中的用户信息
                        }
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                  } else {
                    Toast({
                      message: response.data.Msg,
                      duration: 2000
                    })
                  }

                }).catch(function (error) {
                  console.log(error);
                });
            }).catch(() => {
              // Toast("我取消了")
            });
          }
        }
      },
      todata() { //跳转到编辑个人信息页面
        if (sessionStorage.getItem("userInfo")) {
          this.$router.push({
            path: "/data"
          })
        } else {
          Toast({
            message: "请先登陆！",
            duration: 1000
          })
          this.$router.push({
            path: "/Login"
          })
        }
      },
      tovip() { //跳转到会员页面
        if (sessionStorage.getItem("userInfo")) {
          this.$router.push({
            path: "/vip"
          })
        } else {
          Toast({
            message: "请先登陆！",
            duration: 1000
          })
          this.$router.push({
            path: "/Login"
          })
        }
      },
      //获取笔记的所i有信息
      getdata(name) {
        if (name == 'e') {
          if (sessionStorage.getItem("userInfo")) { //加载我的收藏
            this.myCollection = JSON.parse(sessionStorage.getItem("userInfo")).uid + ";2";
          } else {
            this.myCollection = '0;';
          }
        } else if (name == 'f') {
          if (sessionStorage.getItem("userInfo")) { //加载我的点赞
            this.mySupport = JSON.parse(sessionStorage.getItem("userInfo")).uid + ";3";
          } else {
            this.mySupport = '0;';
          }
        } else {
          if (sessionStorage.getItem("userInfo")) { //我的信息
            setTimeout(() => {
              this.myself = JSON.parse(sessionStorage.getItem("userInfo")).uid + ";1";
            }, 10);
          } else {
            setTimeout(() => {
              this.myself = '0;';
            }, 10);
          }
        }
      },
      //获取商品的所有信息
      getShoppingData(name) {
        if (name == 'g') {
          if (sessionStorage.getItem("userInfo")) { //加载我的购买
            this.buy = "1";
          } else {
            this.buy = "0";
          }
        } else if (name == 'h') {
          if (sessionStorage.getItem("userInfo")) { //加载我的购买
            this.cart = "2";
          } else {
            this.cart = "0";
          }
        } else if (name == 'i') {
          if (sessionStorage.getItem("userInfo")) { //加载我的购买
            this.shoppingCollection = "3";
          } else {
            this.shoppingCollection = "0";
          }
        }
      }
    },
    created: function () {
      if (!sessionStorage.getItem('userInfo')) {
        this.getdata("d"); //初次加载我的笔记
      } else {
        let userid = JSON.parse(sessionStorage.getItem('userInfo')).uid
        let that = this;
        this.axios
          .get(`http://ylin:88/user/userinfo?uid=${userid}`) //拿取用户信息
          .then(response => {
            if (response.data.code == 1) { //登陆成功后
              response.data.data[0].birthday = this.format.dateFormat("YYYY/m/d", new Date(response.data.data[0]
                .birthday)); //将生日的日期格式化
              this.userMassage = response.data.data[0];
              sessionStorage.setItem('userInfo', JSON.stringify(response.data.data[0]));
            } else if (response.data.code == -1) {
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
    }
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

  .name {
    font-weight: 900;
  }

  van-popup {
    text-align: center;
  }

  .usertitle>>>.van-nav-bar__title {
    max-width: 100%;
    font-size: 1.5rem;
  }

  .tuchu {
    width: 2rem;
    height: 2rem;
    position: absolute;
    top: 1rem;
    right: 1rem;
    border: 1px solid #eee;
    border-radius: 0.5rem;
    text-align: center;
    line-height: 3rem;
    z-index: 100;
    background-image: url("../../assets/jiaohuan.png");
    background-size: 100% 100%;
  }

  .user {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem 0rem;
    box-sizing: border-box;
  }

  .headImg-box {
    margin: 0 auto;
    text-align: center;
  }

  .headImg-box>>>.van-image {
    width: 8rem;
    height: 8rem;
  }

  .synopsisBox {
    width: 50%;
    text-align: center;
  }

  .synopsisBox p {
    padding-top: 0.5rem;
    word-wrap: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .info {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0rem;
    font-size: 1.2rem;
  }

  .info span {
    margin: 0.5rem;
  }

  .info .infodata {
    font-weight: 550;
  }

  .routers {
    font-size: 1.0rem;
  }

  a {
    text-decoration: none;
    outline: none;
    color: black;
  }
</style>