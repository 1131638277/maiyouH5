<template>
  <div>
    <nav class="search-nav">
      <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" class="comeback" />
      <van-search class="search-input" v-model="contentText" placeholder="请输入搜索关键词" show-action shape="round"
        @search="onSearch" maxlength=15>
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
    </nav>
    <div class="history">
      <p>历史记录：{{arr.length!=0?'':'暂无记录'}}</p>
      <div class="history-box" @click="history(items)" v-for="(items,index) in arr" :key="index">
        <van-tag class="history-text" type="success" closeable size="medium" @close="close(index)">{{items}}</van-tag>
      </div>
    </div>
    <commodity :childid="typeNum" />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        typeNum: "",
        contentText: "",
        show: {
          primary: true,
          success: true
        },
        arr: []
      };
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      onSearch() { //点击搜索
        if (this.contentText) {
          this.typeNum = this.contentText; //传去关键字
          for (let i = 0; i < this.arr.length; i++) {
            if (this.arr[i] == this.contentText) {
              this.arr.splice(i, 1);
            }
          }
          this.arr.unshift(this.contentText); //加入历史记录
          sessionStorage.setItem('hisArrs', JSON.stringify(this.arr));
          sessionStorage.setItem('searchKeyword', this.contentText);

        }
      },
      close(type) { //点击关闭
        this.arr.splice(type, 1);
        sessionStorage.setItem('hisArrs', JSON.stringify(this.arr));
      },
      history(el) { //点击历史记录标签时，进行收索且反绑输入框
        this.typeNum = el;
        this.contentText = el;
        sessionStorage.setItem('searchKeyword', this.contentText);
      }
    },
    created: function () {
      if (sessionStorage.getItem("hisArrs")) {
        this.arr = JSON.parse(sessionStorage.getItem("hisArrs"));
        setTimeout(() => {
          if(sessionStorage.getItem("searchKeyword")){
            this.typeNum = sessionStorage.getItem("searchKeyword");
          this.contentText =sessionStorage.getItem("searchKeyword");
          }
        }, 0)
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

  .search-nav {
    width: 100%;
    height: auto;
    margin-top: 0.5rem;
  }

  .search {
    width: 100%;
    height: 3.5rem;
  }

  .search>.srarchValue {
    width: 100%;
    height: 100%;
  }

  .search-nav>.comeback {
    height: 4rem;
    line-height: 3rem;
    width: 20%;
    float: left;
  }

  .search-nav>.comeback>.van-nav-bar__left span {
    line-height: 4rem;
  }

  nav>>>.van-nav-bar__left {
    padding: 0 !important;
    left: 0.8rem;
  }

  .search-nav>.search-input {
    float: right;
    width: 80%;
    height: 4rem;
    padding: 0;
  }

  .search-nav::after {
    content: "";
    display: block;
    clear: both;
  }

  .history {
    width: 100%;
    max-height: 8.3rem;
    overflow: hidden;
    padding: 0 0.5rem;
    box-sizing: border-box;
    margin-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }

  .history>p {
    font-size: 1.4rem;
    line-height: 3rem;
    color: rgb(131, 128, 128);
  }

  .history>.history-box {
    float: left;
    margin-top: 0.5rem;
    margin-right: 0.5rem;
  }

  .history> ::after {
    content: "";
    display: block;
    clear: both;
  }

  .history>.history-box>.history-table {
    line-height: 2rem;
  }
</style>