<template>
  <div class="shopping-bgc">


    <div class="shopping-content">
      <nav class="shoppingNav">
        <div class="shoppingTitle">
          <p>商城</p>
        </div>
        <!-- 搜索框 -->
        <van-sticky>
          <div style="background-color: #fff;">
            <van-search v-model="value" show-action placeholder="快来找寻你想要的商品吧~" @search="onSearch" shape="round"
              background="" maxlength=12 clearable @focus="searchPage">
              <div slot="action" @click="onSearch">搜索</div>
            </van-search>
          </div>
        </van-sticky>
      </nav>
      <div class="shopping-box">
        <!-- 加载动画 -->
        <ElementLoading :active="this.$store.state.vueElementLoading" background-color='#fff' color="#c6c9c9"
          text="玩命加载中...">
          <img src="@/assets/zhuantou.gif" width="150px" height="120px">
        </ElementLoading>
        <van-pull-refresh success-text="刷新成功" v-model="isLoading" @refresh="onRefresh">
          <!-- 轮播图 -->
          <div class="swipe-box">
            <van-swipe :autoplay="2000" touchable style="width:100%;" indicator-color="red">
              <van-swipe-item v-for="image in images" :key="image.cid">
                <!-- <img @click="toDetails(image.cid)" v-lazy="image.imgs" width=60 style="width:100%;height:auto;" /> -->
                <van-image fit="cover" @click="toDetails(image.cid)" style="width:100%;height:23rem;"
                  :src="image.imgs" />
              </van-swipe-item>
            </van-swipe>
          </div>
          <!-- 种类 -->
          <div class="typeBox">
            <van-grid :column-num="3" :gutter="5" icon-size="50" style="padding:0">
              <div class="typeContent" v-for="(value,index) in category" :key="index"
                @click="toCommodityList(value.name)">
                <div class="typeImg">
                  <div style="width:100%;height:100%;">
                    <van-image lazy-load :src="value.img" fit="cover">
                      <template v-slot:loading>
                        <van-loading type="spinner" size="30" />
                      </template>
                      <template v-slot:error>加载失败</template>
                    </van-image>
                  </div>
                </div>
                <div class="typerText">
                  <span>{{value.name}}</span>
                </div>
              </div>
            </van-grid>
          </div>
          <div class="other">
            <commodity childid="全部" />
          </div>
        </van-pull-refresh>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {
    Notify,
    Lazyload,
    Grid,
    GridItem,
    Image,
    Sticky,
  } from 'vant';
  Vue.use(Notify);
  Vue.use(Lazyload);
  Vue.use(Grid);
  Vue.use(GridItem);
  Vue.use(Lazyload);
  Vue.use(Sticky);
  Vue.use(Image);
  export default {
    data() {
      return {
        isLoading: false,
        value: "",
        images: [],
        category: [{
            cid: 1,
            img: "photo-o",
            name: "未加载",
          },
          {
            cid: 2,
            img: "photo-o",
            name: "未加载",
          },
          {
            cid: 3,
            img: "photo-o",
            name: "未加载",
          },
          {
            cid: 4,
            img: "photo-o",
            name: "未加载",
          },
          {
            cid: 5,
            img: "photo-o",
            name: "未加载",
          },
          {
            cid: 6,
            img: "photo-o",
            name: "未加载",
          }
        ]
      };
    },
    methods: {
      onSearch() { //跳转达到搜索页面
        this.$router.push({
          path: "/searchcom"
        });
      },
      searchPage() {
        this.$router.push({ //跳转达到搜索页面
          path: "/searchcom"
        });
      },
      onRefresh() { //下拉刷新
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
        this.getInfos();
      },
      toCommodityList(value) { //跳转到种类页面
        this.$router.push({
          path: "/commodityList?" + `keywords=${value}`
        })
      },
      toDetails(value) { //跳转到详情页面
        this.$router.push({
          path: "/details?cid=" + value,
          params: {
            nid: "value"
          }
        })
      },
      //获取商品和种类信息
      getInfos() {
        var that = this;

        function getAllType() { //获取种类信息
          return that.axios.get('/shopping/types');
        }

        function getRecommend() { //拿评论信息
          return that.axios.get('/shopping/getrecommend');
        }
        this.axios.all([getAllType(), getRecommend()]).then(
          that.axios.spread((acct, perms) => {
            this.$store.commit('updateLoading', false); //关闭加载动画
            // 两个请求现在都执行完成
            //种类信息
            if (acct.data.code == 1) {
              if (acct.data.data.length != 0) {
                that.category = acct.data.data;
                sessionStorage.setItem('category', JSON.stringify(that.category));
              }
            } else {
              console.log(acct.data.Msg)
              Toast(acct.data.Msg);
            }

            //轮播图推荐商品
            if (perms.data.code == 1) {
              if (perms.data.data.length != 0) {
                that.images = perms.data.data;
                sessionStorage.setItem('images', JSON.stringify(that.images));
              }
            } else {
              console.log(perms.data.Msg)
              Toast(perms.data.Msg);
            }
          })
        ).catch((error) =>{
          this.$store.commit('updateLoading', false); //关闭加载动画
          console.log(error);
        });
      }
    },
    mounted() {},
    created: function () {
      if (JSON.parse(sessionStorage.getItem('category')) && JSON.parse(sessionStorage.getItem('images'))) {
        this.category = JSON.parse(sessionStorage.getItem('category'));
        this.images = JSON.parse(sessionStorage.getItem('images'));
        this.$store.commit('updateLoading', false); //关闭加载动画

      } else {
        this.$store.commit('updateLoading', true); //打开加载动画
        //获取商品和种类信息
        this.getInfos();

      }
    }
  };
</script>
<style scoped>
  html,
  body {
    width: 100%;
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

  nav {
    background-color: #fff;
  }

  .shoppingNav>.shoppingTitle {
    height: 3rem;
    text-align: center;
  }

  .shoppingNav>.shoppingTitle>p {
    font-size: 1.7rem;
    line-height: 3rem;
  }

  .swipe-box>>>.van-swipe__track {
    display: flex;
    align-items: center;
  }

  .other {
    height: auto;
    margin-bottom: 5rem;
  }

  .typeBox {
    width: 100%;
    margin: 0.5rem 0;
  }

  .typeContent {
    margin: 0 auto;
    height: auto;
    width: 29%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 0.5rem 0.5rem;
  }

  .typeContent>.typeImg {
    height: auto;
    width: 100%;
  }

  .typeContent>.typeImg .van-image {
    overflow: hidden;
    border-radius: 0.5rem;
  }


  .typeContent>.typerText {
    font-size: 1.2rem;
  }
</style>