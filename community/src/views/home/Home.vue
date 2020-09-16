<template>
  <div class="home">
    <div class="homePage">
      <nav class="homeNav">
        <div class="homeTitle">
          <p @click="totest">首页</p>
        </div>
        <div class="search">
          <van-search class="srarchValue" style="height:3rem" placeholder="请输入搜索关键词" @focus="searchPage"
            :v-model="value" />
          <div class="add" @click="toAdd"></div>
        </div>
      </nav>
      <div class="homeBody">
        <van-pull-refresh success-text="刷新成功" class="homeContents" v-model="isLoading" @refresh="onRefresh">
          <div class="type-box">
            <div class="type-content" @click="toType(num.tname,index,$event)" v-for="(num,index) in types" :key="index"
              :falgC="index">
              <div class="bgc-mo" v-if="falgType!=index"></div>
              <img class="type-bgc" :src="num.imgs" alt="种类背景图" />
              <div :class="falgType!=index?'type-title':'type-title1'">{{num.tname}}</div>
            </div>
          </div>
          <note :childid="typeNum" />
        </van-pull-refresh>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
  import note1 from "@/components/note.vue"
  export default {
    data() {
      return {
        falgType: "",
        value: "",
        count: 0, //刷新次数
        that: this,
        isLoading: false,
        typeNum: "",
        zan: require("@/assets/xin.png"),
        types: [{
          tid: 0,
          imgs: require("@/assets/all.jpg"),
          tname: "全部"
        }]
      };
    },
    methods: {
      totest(){
        this.$router.push({
          path:"/deviceControl"
        })
      },
      onRefresh() { //下拉刷新
        setTimeout(() => {
          this.isLoading = false;
          this.count++;
        }, 500);
        if (sessionStorage.getItem('noteType')) {
          this.typeNum = sessionStorage.getItem('noteType');
        } else {
          this.typeNum = "全部";
        }
      },
      searchPage: function () { //跳转到搜索页面
        this.$router.push({
          path: "/search"
        });
      },
      toType: function (value, num, e) { //选择类别
        this.falgType = num;
        this.typeNum = value;
        sessionStorage.setItem('noteType', value);
      },
      toAdd() { //跳转到发表笔记页面
        this.loginTest.loginTesting().then((value) => {
          if (value) {
            this.$router.push({
              path: "/add"
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
    mounted() {},
    created: function () {
      if (sessionStorage.getItem('notestypes')) {
        this.types = JSON.parse(sessionStorage.getItem('notestypes'));
      } else {
        var that = this;
        (function typeInfo() {
          that.axios
            .get("http://ylin:88/note/types", { //查询所有的笔记种类
              params: {}
            })
            .then(response => {
              that.types = (that.types).concat(response.data);
              sessionStorage.setItem('notestypes', JSON.stringify(that.types));
            })
            .catch(function (error) {
              console.log(error);
            });
        })();

      }
    }
  };
</script>
<style lang="scss">
  html {
    font-size: 62.5%;
  }

  @media only screen and (min-width: 400px) {
    html {
      font-size: 12px !important;
    }
  }

  @media only screen and (min-width: 450px) {
    html {
      font-size: 13px !important;
    }
  }

  @media only screen and (min-width: 569px) {
    html {
      font-size: 18px !important;
    }
  }

  @media only screen and (min-width: 641px) {
    html {
      font-size: 20px !important;
    }
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

  .homePage {
    width: 100%;
    height: auto;
  }

  .homeNav {
    width: 100%;
    height: 7rem;
    position: fixed;
    top: 0;
    z-index: 100;
    background-color: #fff;
    border-bottom: 1px solid rgba(247, 246, 246, 0.712);
  }

  .homeNav>.homeTitle {
    height: 3rem;
    text-align: center;
  }

  .homeNav>.homeTitle>p {
    font-size: 1.7rem;
    line-height: 3rem;
    width: auto;
  }

  .homeNav>.search {
    width: 100%;
    height: 3.5rem;
    position: relative;
  }

  .homeNav>.search>.srarchValue {
    width: 90%;
    height: 100%;
  }

  .homeNav>.search .van-search__content {
    border-radius: 1rem;
  }

  .homeNav .add {
    width: 2rem;
    height: 2rem;
    background: url('../../assets/add.png');
    background-size: 100% 100%;
    z-index: 100;
    position: absolute;
    right: 1rem;
    top: 0.7rem;
  }


  .homeBody {
    height: auto;
    margin-top: 7rem;
    margin-bottom: 5rem;
  }

  .type-box {
    width: 100%;
    height: 5rem;
    overflow: hidden;
    overflow: auto;
    white-space: nowrap;
  }

  .type-box::-webkit-scrollbar {
    display: none;
  }

  .type-box>.type-content {
    width: 8rem;
    height: 4rem;
    margin-top: 0.55rem;
    border-radius: 0.5rem;
    margin-left: 0.5rem;
    display: inline-block;
    position: relative;
  }

  .type-box>.type-content>.bgc-mo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
    background-color: rgba(117, 116, 116, 0.37);
  }

  .type-box>.type-content>.type-title {
    position: absolute;
    width: auto;
    height: 1.2rem;
    text-align: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    font-size: 1.2rem;
    color: rgb(243, 236, 236);
    font-weight: bold;
  }

  .type-box>.type-content>.type-title1 {
    position: absolute;
    width: auto;
    height: 1.2rem;
    text-align: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    font-size: 1.2rem;
    color: #fff;
    font-weight: bold;
  }

  .type-box>.type-content:last-child {
    margin-right: 0.5rem;
  }

  .type-box>.type-content>.type-bgc {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
  }
</style>