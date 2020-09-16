<template>
  <div>
    <van-nav-bar class="publishtitle" title="评论" left-text="取消" right-text="提交" @click-left="onClickLeft"
      @click-right="onClickRight" />
    <div class="text-box">
      <van-field id="commentText" v-model="value" :autosize='textHeight' type="textarea" maxlength="200"
        placeholder="发表你的评论~" show-word-limit border clearable />
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {
    Toast,
    Field
  } from "vant";

  Vue.use(Field);
  export default {
    data() {
      return {
        textHeight: {
          maxHeight: 300,
          minHeight: 100
        },
        value: "",
      };
    },
    methods: {
      onClickLeft() { //返回上一级
        this.$router.go(-1);
      },
      onClickRight() {
        if (this.value == "") {
          Toast("请先输入你要发表的内容");
        } else if (this.value.length > 200) {
          Toast("字数超出限制");
        } else {
          this.axios
            .post("http://ylin:88/note/comments", {
              uid:JSON.parse(sessionStorage.getItem("userInfo")).uid,
              content: this.value,
              nid: this.$route.query.nid
            })
            .then(response => {
              if (response.data.code == 1) {
                Toast({
                  message: response.data.Msg,
                  icon: "success"
                });
                this.$router.push({
                  path: "./notes",
                  query: {
                    nid: this.$route.query.nid
                  }
                });
              } else {
                Toast({
                  message: response.data.Msg,
                  icon: "cross"
                });
              }
            })
            .catch(function (error) {
              console.log(error);
              Toast({
                message: "发表失败",
                icon: "cross"
              });
            });
        }
      }
    },
    mounted:function(){
      document.querySelector(".van-field__control").focus();
    },
    created:function(){
    }
  };
</script>
<style scoped>
  #commentText {
    height: auto;
    font-size: 1.4rem;
  }

  .publishtitle>>>.van-nav-bar__title{
    font-size: 1.5rem;
  }
  .publishtitle>>>span{
    font-size: 1.5rem;
  }
</style>