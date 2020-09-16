<template>
  <div class="details-box" id="commodity">
    <van-sticky>
      <nav>
        <span style="color:#1989fa;" @click="returnTo">&lt;返回</span>
        <div ref="positiontype">
          <span class="choose" @click="choose($event)">商品</span>
          <span class="nochoose" style="margin:0 15px" @click="choose($event)">详情</span>
          <span class="nochoose" @click="choose($event)">相似</span>
        </div>
        <van-icon name="search" color="#5a5959" size="20" @click="search" />
      </nav>
    </van-sticky>
    <div>
      <!-- 加载动画 -->
      <ElementLoading :active="this.$store.state.vueElementLoading" color="#c1c2c2" background-color="#fff"
        text="加载中..." />

      <!-- 商品轮播图 -->
      <div class="swipe-box" style="position:relative;">
        <van-swipe @change="onChange" id="vanSwipe" style="width:100%;height:auto;" indicator-color="red"
          show-indicators>
          <van-swipe-item v-for="(value,index) in commodityMsg.showImgs" :key="index">
            <!-- <img v-lazy="value" style="width:100%;height:100%;" /> -->
            <van-image fit="cover" style="width:100%;height:23rem;" :src="value" />
          </van-swipe-item>
          <div class="custom-indicator" slot="indicator">
            {{ current + 1 }}/{{commodityMsg.showImgs.length}}
          </div>
        </van-swipe>
      </div>
      <!-- 商品标题 -->
      <div>
        <div :class="commodityTitle">
          <h2 class="price" style="color:red">{{commodityMsg.nowPrice}}</h2>
          <span id="titleText" @click="open">{{commodityMsg.name}}</span>
          <i @click="shou" ref="retract" style="color:#ee3535;display:none;">收起</i>
        </div>
      </div>
      <div class="other-info">
        <!-- 商家服务 -->
        <div style="margin-top: 1rem;margin-bottom: 1rem;">
          <van-collapse v-model="activeNames">
            <van-collapse-item title="商家服务" name="1" icon="shop-collect">
              {{commodityMsg.service}}
            </van-collapse-item>
          </van-collapse>
        </div>
        <!-- 评论盒子 -->
        <div class="comment-box">
          <p class="commentAll"><span>有{{commentsNum}}条评论</span> <span @click="toCommentList"
              style="color:#fa5b3e">查看全部>></span></p>
          <div>
            <div class="commentUser">
              <div>
                <van-image width="30" height="30" lazy-load round :src="comments.avatar" />
              </div>
              <div class="userMsg">
                <p>{{comments.username}}</p>
                <span>{{comments.time}}</span>
              </div>
            </div>
            <div class="commentContent">
              <span style="line-height:15px;">{{comments.contents}}</span>
            </div>
          </div>
        </div>
        <!-- 产品详情 -->
        <div id="details">
          <h3 class="canping">产品详情</h3>
          <div class="pictures">
            <img v-for="(img,index) in commodityMsg.detailedImgs" :key="index" v-lazy="img">
          </div>
        </div>
        <!-- 产品说明 -->
        <div class="explain">
          <h3>产品说明</h3>
          <div>
            <p style="margin-bottom:5px;"><span
                style="font-weight: 600">价格说明：</span>划线价格：指商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过的销售价等，并非原价，仅供参考。未划线价格：指商品的实时标价，不因表述的差异改变性质。具体成交价格根据商品参加活动，或会员使用优惠券、积分等发生变化，最终以订单结算页价格为准。
            </p>
            <p><span
                style="font-weight: 600">告知书：</span>商家详情页（含主图）以图片或文字形式标注的一口价、促销价、优惠价等价格可能是在使用优惠券、满减或特定优惠活动和时段等情形下的价格，具体请以结算页面的标价、优惠条件或活动规则为准。
            </p>
          </div>
        </div>
      </div>
      <!-- 推荐商品 -->
      <div id="recommendI">
        <h3 id="recommend">为您推荐:</h3>
        <div style="margin-bottom: 5rem;">
          <commodity :childid="thiskeyw" />
        </div>
      </div>


      <!-- 底部购买栏 -->
      <div class="goodsAction">
        <van-goods-action>
          <van-goods-action-icon icon="chat-o" text="客服" color="#07c160" @click="tochat(commodityMsg.uid)" />
          <!-- <van-goods-action-icon icon="cart-o" text="购物车" /> -->
          <van-goods-action-icon icon="star" :text="collFlag?'已收藏':'收藏'" :color="collFlag?'#ff5000':'#b9bebe'"
            @click="toCollection($event)" />
          <van-goods-action-button type="warning" text="加入购物车" @click="putCart()" />
          <van-goods-action-button type="danger" text="立即购买" @click="directPurchase()" />
        </van-goods-action>

        <van-popup v-model="detailsShow" round closeable position="bottom" :style="{ height: '60%' }">
          <div class="contentBox">
            <div class="content">
              <div class="topLfet">
                <img :src="commodityMsg.imgs" alt="商品封面" style="width:6rem;height:auto;border-radius:0.3rem">
              </div>
              <div class="topRight">
                <p>{{commodityMsg.name}}</p>
                <p class="numBox">商品数量：{{commodityMsg.number}}</p>
              </div>
            </div>
            <div class="chooseNums">
              <van-stepper v-model="nums" min="0" :max="commodityMsg.number" />
            </div>
            <van-button round type="primary" size="large" @click="getCommodity(goflag)">确定</van-button>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {
    Swipe,
    SwipeItem,
    Toast,
    GoodsAction,
    GoodsActionIcon,
    GoodsActionButton,
    CouponCell,
    CouponList,
    Collapse,
    CollapseItem,
    Image,
    Lazyload,
    Icon,
    Sticky,
    Sku,
    Stepper,
    Button
  } from 'vant';
  Vue.use(Swipe);
  Vue.use(SwipeItem);
  Vue.use(GoodsAction);
  Vue.use(GoodsActionButton);
  Vue.use(GoodsActionIcon);
  Vue.use(CouponCell);
  Vue.use(CouponList);
  Vue.use(Collapse);
  Vue.use(CollapseItem);
  Vue.use(Image);
  Vue.use(Lazyload);
  Vue.use(Icon);
  Vue.use(Sticky);
  Vue.use(Sku);
  Vue.use(Stepper);
  Vue.use(Button);
  export default {
    data() {
      return {
        nums: 1,
        detailsShow: false,
        thiskeyw: "全部",
        current: 0,
        commentsNum: 0,
        commodityTitle: "normal",
        activeNames: ['0'],
        commodityMsg: {
          showImgs: [
            '@/assets/moren.png'
          ],
          imgs: "@/assets/moren.png",
          detailedImgs: [],
          nowPrice: "￥20",
          originalPrice: "￥1000",
          name: "这是款好东西这是款好东西这是款好东西这是款好东西这是款好东西",
          service: "买一送一了哈！清仓大甩卖！",
          details: "详情",
          address: "上海",
          collectionNum: 34, //收藏人数
          number: 1, //购买人数
          keywords: ["美妆", "女人", "富人"] //商品标签
        },
        comments: {
          avatar: require("@/assets/headimg.png"),
          contents: "",
          username: "暂无评论",
          time: "",
          support: ""
        },
        collFlag: false, //收藏标志
        goflag: 0, //加入购物车或者购买标志 1表示加入购物车 2表示直接购买
      };
    },
    methods: {
      onChange(index) {
        this.current = index;
      },
      returnTo() { //返回上一级
        this.$router.go(-1);
      },
      search() { //跳转到搜索页面
        this.$router.push({
          path: "/search"
        });
      },
      open() { //点击标题
        this.commodityTitle = "open"; //换样式为展开
        this.$refs.retract.style.display = "block"; //展示收起
      },
      shou() { //点击收起
        this.commodityTitle = "normal"; //换样式为收起
        this.$refs.retract.style.display = "none"; //隐藏收起
      },
      choose(e) { //导航条点击滚动
        e.target.parentElement.childNodes.forEach(element => {
          element.className = "nochoose";
        });
        e.target.className = "choose";
        switch (e.target.innerText) {
          case "商品":
            commodity.scrollIntoView({ //可视区滚到商品区
              block: "start",
              behavior: "smooth"
            });
            break;
          case "详情":
            details.scrollIntoView({ //可视区滚到详情区
              block: "start",
              behavior: "smooth"
            });
            break;
          case "相似":
            recommendI.scrollIntoView({ //可视区滚到相似商品区
              block: "start",
              behavior: "smooth"
            });
            break;
        }

      },
      toCommentList() { //评论列表
        this.$router.push({
          path: `/commentList?cid=${this.$route.query.cid}`
        });
      },
      //沟通卖家
      tochat(uid) {
        this.loginTest.loginTesting().then((value) => { //解析检测是否登录的方法的返回值，then为调用成功触发的方法
          if (value) {
            this.$router.push({
              path: "/chat",
              query: {
                otherUid: uid
              }
            })
          } else {
            this.$router.push({
              path: "/Login"
            });
          }
        }).catch((value) => { //调用时报触发的方法
          Toast("检测登录失败！")
        });
      },
      //收藏商品
      toCollection() {
        let that = this
        if (!that.collFlag) {
          this.loginTest.loginTesting().then((value) => { //解析检测是否登录的方法的返回值，then为调用成功触发的方法
            if (value) {
              this.axios
                .post(`/shopping/collection`, {
                  uid: JSON.parse(sessionStorage.getItem("userInfo")).uid,
                  coid: this.commodityMsg.cid
                })
                .then(response => {
                  if (response.data.code == 1) {
                    that.collFlag = true;
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
            } else {
              this.$router.push({
                path: "/Login"
              });
            }
          }).catch((value) => { //调用时报触发的方法
            Toast("检测登录失败！")
          });
        } else {
          this.loginTest.loginTesting().then((value) => { //解析检测是否登录的方法的返回值，then为调用成功触发的方法
            if (value) {
              this.axios
                .post(`/shopping/cancelCollection`, {
                  uid: JSON.parse(sessionStorage.getItem("userInfo")).uid,
                  coid: this.commodityMsg.cid
                })
                .then(response => {
                  if (response.data.code == 1) {
                    Toast({
                      message: response.data.Msg,
                      duration: 1000
                    });
                    that.collFlag = false;
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
            } else {
              this.$router.push({
                path: "/Login"
              });
            }
          }).catch((value) => { //调用时报触发的方法
            Toast("检测登录失败！")
          });
        }
      },
      //加入购物车
      putCart() {
        this.loginTest.loginTesting().then((value) => { //解析检测是否登录的方法的返回值，then为调用成功触发的方法
          if (value) {
            this.detailsShow = true;
            this.goflag = 1;
          } else {
            this.$router.push({
              path: "/Login"
            });
          }
        }).catch((value) => { //调用时报触发的方法
          Toast("检测登录失败！")
        });
      },
      //直接购买
      directPurchase() {
        this.loginTest.loginTesting().then((value) => { //解析检测是否登录的方法的返回值，then为调用成功触发的方法
          if (value) {
            this.detailsShow = true;
            this.goflag = 2;
          } else {
            this.$router.push({
              path: "/Login"
            });
          }
        }).catch((value) => { //调用时报触发的方法
          Toast("检测登录失败！")
        });
      },
      //判断是否已有物品在购物车中
      getcardflag() {
        let that = this;
        return new Promise(function (resolve, reject) { //promise实现方法同步加载
          that.axios
            .post(`/shopping/getcardflag`, {
              uid: JSON.parse(sessionStorage.getItem("userInfo")).uid,
              cid: that.commodityMsg.cid,
            })
            .then(response => {
              if (response.data.code == 1) {
                if (response.data.data.length != 0) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              } else if (response.data.code == -1) {
                Toast({
                  message: response.data.Msg,
                  durationL: 1000
                })
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        })

      },
      // 选好规格后确定
      getCommodity(flag) {
        let that = this;
        if(this.nums==0){
          Toast({
                    message: "数量不能为0",
                    duration: 1000
                  });
          return
        }
        if (flag == 1) {
          let nowPrice = this.commodityMsg.nowPrice.substr(1, this.commodityMsg.nowPrice.length);
          this.getcardflag().then((value) => {
            this.axios
              .post(`/shopping/addtoCart`, {
                uid: JSON.parse(sessionStorage.getItem("userInfo")).uid,
                cid: this.commodityMsg.cid,
                title: this.commodityMsg.name,
                img: this.commodityMsg.imgs,
                num: this.nums,
                price: nowPrice*this.nums,
                flag: value
              })
              .then(response => {
                if (response.data.code == 1) {
                  Toast({
                    message: response.data.Msg,
                    duration: 1000
                  });
                  that.detailsShow = false;
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

          }).catch((err) => {
            console.log(err);
          })
        } else if (flag == 2) {
          let nowPrice1 = this.commodityMsg.nowPrice.substr(1, this.commodityMsg.nowPrice.length);
           this.axios
              .post(`/shopping/purchase`, {
                orderNum:this.commodityMsg.uid+""+this.commodityMsg.cid+""+JSON.parse(sessionStorage.getItem("userInfo")).uid+""+Math.floor(Math.random()*10000),
                suid:this.commodityMsg.uid,
                kuid: JSON.parse(sessionStorage.getItem("userInfo")).uid,
                cid: this.commodityMsg.cid,
                kname:JSON.parse(sessionStorage.getItem("userInfo")).username,
                address:JSON.parse(sessionStorage.getItem("userInfo")).area,
                img: this.commodityMsg.imgs,
                price: nowPrice1,
                num: this.nums,
                title: this.commodityMsg.name,
                tel:JSON.parse(sessionStorage.getItem("userInfo")).tel,
              })
              .then(response => {
                if (response.data.code == 1) {
                  Toast({
                    message: response.data.Msg,
                    duration: 1000
                  });
                  that.detailsShow = false;
                } else{
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
      // 拿取是否收藏此商品
      getconInfo(uid, cid) {
        this.axios
          .post(`/shopping/getconInfo`, {
            'uid': uid,
            'cid': cid
          }) //拿取用户信息
          .then(response => {
            if (response.data.code == 1) {
              if (response.data.data.length != 0) {
                this.collFlag = true;
              }
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
    },
    mounted() {

    },
    created: function () {
      if (this.$route.query.cid) {
        var that = this;
        this.$store.commit('updateLoading', true); //打开加载动画
        function getCommodityinfo() { //获取一种商品的详情信息
          return that.axios.get(`/shopping/commodityinfo?keywords=${that.$route.query.cid}`);
        }

        function getComments() { //拿评论信息
          return that.axios.get(`/shopping/getcomments?cid=${that.$route.query.cid}`);
        }
        this.axios.all([getCommodityinfo(), getComments()]).then(
          that.axios.spread((acct, perms) => {
            this.$store.commit('updateLoading', false); //关闭加载动画
            // 两个请求现在都执行完成，隐藏加载模态框
            this.show = false;
            //详情
            if (acct.data.code == 1) {
              if (acct.data.data.length != 0) {
                if (acct.data.data[0].showImgs.length == 0) { //如果展示图片不存在，则将封面放入展示
                  acct.data.data[0].showImgs.push(acct.data.data[0].imgs);
                }
                that.commodityMsg = acct.data.data[0];
                that.commodityMsg.nowPrice = "￥" + that.commodityMsg.nowPrice; //给金额加上￥
                that.commodityMsg.originalPrice = "￥" + that.commodityMsg.originalPrice;
                that.thiskeyw = that.commodityMsg.category; //将种类传给推荐关键字

                // 判断是否已经收藏此商品
                that.getconInfo(JSON.parse(sessionStorage.getItem("userInfo")).uid, that.$route.query.cid);
              }
            } else {
              console.log(acct.data.Msg)
              Toast(acct.data.Msg);
            }

            //评论
            if (perms.data.code == 1) {
              if (perms.data.data.length != 0) {
                that.comments = perms.data.data[0];
                that.commentsNum = perms.data.data.length;
              }
            } else {
              console.log(perms.data.Msg)
              Toast(perms.data.Msg);
            }
          })
        ).catch(function (error) {
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
    color: rgb(90, 89, 89);
  }

  li {
    list-style: none;
  }

  .block {
    width: 120px;
    height: 120px;
    background-color: #fff;
  }

  /* 顶部栏 */
  nav {
    height: 4rem;
    line-height: 3rem;
    font-size: 1.3rem;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
    background-color: rgb(255, 255, 255, 0.8);
  }

  .nochoose {
    color: #000;
    border: 0;
  }

  .choose {
    color: #ee3535;
    border-bottom: 2px solid #ee3535;
  }

  .details-box {
    height: auto;
    background-color: #f7f7f7;
  }

  /* 轮播图 */
  .swipe-box>>>.van-swipe__track {
    display: flex;
    align-items: center;
  }

  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 2rem;
    line-height: 20rem;
    text-align: center;
    background-color: #39a9ed;
  }

  .custom-indicator {
    width: auto;
    height: 1.5rem;
    position: absolute;
    right: 0.5rem;
    bottom: 1rem;
    font-size: 1.4rem;
    background: rgba(0, 0, 0, 0.1);
    padding: 2px 5px;
    color: #fff;
    font-size: 12px;
  }

  .normal {
    height: 5.6rem;
    background-color: #fff;
    padding: 0rem 1rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .open {
    height: auto;
    background-color: #fff;
    padding: 0 1rem;
  }

  #titleText {
    font-size: 1.3rem;
    font-weight: 550;
  }

  /* 评论区 */
  .comment-box {
    height: auto;
    background-color: rgb(255, 255, 255);
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .comment-box>.commentAll {
    font-size: 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .comment-box .commentUser {
    display: flex;
    align-items: center;
  }

  .comment-box .commentUser>.userMsg {
    margin-left: 0.5rem;
  }

  .comment-box .commentUser>.userMsg>span {
    font-size: 0.8rem;
    color: rgb(138, 136, 136);
  }

  .comment-box .commentContent {
    margin-left: 3.5rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }

  #details {
    padding: 0.5rem 1rem;
    background-color: #fff;
    margin-bottom: 1rem;
  }

  #details>h3 {
    margin-bottom: 0.5rem;
  }

  .canping {
    margin-top: 4rem;
  }

  #details>.pictures {
    width: 100%;
    height: auto;

  }

  #details>.pictures>img {
    width: 100%;
    height: 100%;
  }



  .explain {
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    background-color: #fff;
  }

  .explain>h3 {
    margin-bottom: 0.5rem;
  }

  #recommend {
    background-color: #fff;
    padding: 0.5rem 1rem;
  }

  .contentBox {
    margin-top: 3rem;
    width: 100%;
    padding: 2rem;
    box-sizing: border-box;
  }

  .content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    box-sizing: border-box;
    margin-bottom: 2rem;
  }

  .content .topLfet {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content .topRight {
    width: 75%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1.3rem;
  }

  .content .topRight .numBox {
    font-size: 1.2rem;
    color: rgb(121, 118, 118);
    margin-top: 1rem;
  }

  .chooseNums {
    margin-bottom: 2rem;
  }
</style>