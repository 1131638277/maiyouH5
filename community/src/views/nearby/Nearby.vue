<template>
  <div class="near">
    <div class="nearPage">
      <nav class="nearNav">
        <div class="nearTitle">
          <p>附近</p>
        </div>
      </nav>
      <div class="nearBody">
        <van-pull-refresh success-text="刷新成功" class="homeContents" style="height:100%" v-model="isLoading"
          @refresh="onRefresh">
          <note :childid='keyw' />
        </van-pull-refresh>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
  import Vue from 'vue';
  import {
    Lazyload,
    Toast,
    Icon,
    Overlay,
  } from 'vant';
  Vue.use(Overlay);
  export default {
    data() {
      return {
        keyw: '',
        count: 1, //刷新次数
        isLoading: false,
        zan: require("../../assets/xin.png")
      };
    },
    computed: {
      isActive() {
        // return this.$store.state.vueElementLoading;
      }
    },
    methods: {
      onRefresh() {
        setTimeout(() => {
          this.isLoading = false;
          this.count++;
        }, 500);
        if (JSON.parse(sessionStorage.getItem('userInfo'))) {
          this.keyw = JSON.parse(sessionStorage.getItem('userInfo')).position;
        }
      }
    },
    mounted() {},
    created: function () {
      var nowPosition
      if (JSON.parse(sessionStorage.getItem('userInfo'))) {
        nowPosition = JSON.parse(sessionStorage.getItem('userInfo')).position; //从session中拿到登陆人的位置
      } else {
        nowPosition = "未登录"
      }
      setTimeout(
        () => {
          this.keyw = nowPosition;
        }, 10)
    }
  };
</script>
<style lang="scss">
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

  .nearPage {
    width: 100%;
    height: auto;
  }

  .nearNav {
    width: 100%;
    height: 4rem;
    position: fixed;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-bottom: 3px solid rgba(243, 238, 238, 0.712);
  }

  .nearNav>.nearTitle {
    height: 3rem;
    text-align: center;

  }

  .nearNav>.nearTitle>p {
    font-size: 1.7rem;
    line-height: 3rem;
  }

  .nearNav>.search {
    width: 100%;
    height: 3.5rem;
  }

  .nearNav>.search>.srarchValue {
    width: 100%;
    height: 100%;
  }

  .nearNav>.search .van-search__content {
    border-radius: 1rem;
  }

  .nearBody {
    height: auto;
    margin-top: 5rem;
    margin-bottom: 5rem;
  }

  .contents {
    height: auto;
    margin: 0 0.5rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    // column-count: 2;
    // column-gap: 2rem;
    // column-width: 15rem;
  }

  .contents>.router-note {
    display: block;
    width: 48%;
    height: auto;
    margin-right: 0.5rem;
    height: auto;
    // float: left;
  }

  .contents .note-contents {
    border-radius: 0.5rem;
    width: 100%;
    height: auto;
    margin-bottom: 0.5rem;
    // break-inside: avoid;
    // box-sizing: border-box;
  }

  .note-contents .note-img {
    width: 100%;
    height: 20rem;
    min-height: 5rem;
    border-radius: 0.5rem;
  }

  .note-contents>.note-title {
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1.5rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.5rem;
  }

  .note-contents>.note-user {
    width: 100%;
    height: 3rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 1.2rem;
  }

  .note-contents>.note-user>.left {
    width: 50%;
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

  /* 加载遮罩层 */
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>