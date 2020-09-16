<template>
  <div class="contents">
    <div style="margin:0 auto" v-if="falgdata">
      <van-empty image="search" description="暂无笔记~" />
    </div>
    <router-link :to="{path:'/details',query:{cid:num.cid}}" class="router-note" v-for="(num,index) in note"
      :key="index" style="margin-right:0px">
      <div class="note-contents">
        <img class="note-img" :src="num.imgs" alt="商品封面" />
        <p class="note-title">{{num.name}}</p>
        <div class="note-user" style="display:block;color:red">
          <div class="left">
            <span>{{num.nowPrice}}</span>
          </div>
          <div class="right">
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {
    Empty
  } from 'vant';
  Vue.use(Empty);
  export default {
    props: {
      childid: String,
      personalUid: Number
    },
    data() {
      return {
        falgdata: true,
        zan: require("../assets/xin.png"),
        note: []
      };
    },
    watch: {
      childid(newVal, oldVal) {
        var keyword = newVal;
        this.axios
          .get("http://ylin:88/shopping/getcommodity", {
            params: {
              keyw: keyword
            }
          })
          .then(response => {
            //推荐商品信息
            if (response.data.code == 1) {
              if (response.data.data.length != 0) {
                this.falgdata = false;
                this.note = response.data.data;
                for (var i = 0; i < this.note.length; i++) {
                  this.note[i].nowPrice = "￥" + this.note[i].nowPrice;
                }
              } else {
                this.falgdata = true;
                this.note = response.data.data;
              }
            } else {
              this.falgdata = true;
              console.log(response.data.Msg)
              Toast(response.data.Msg);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      personalUid(newVal, oldVal) {
        this.axios
          .get("http://ylin:88/note/allNotes", {
            params: {
              uid: newVal
            }
          })
          .then(response => {
            this.note = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    created: function () {
      var keyword = "全部";
      this.axios
        .get("http://ylin:88/shopping/getcommodity", {
          params: {
            keyw: keyword
          }
        })
        .then(response => {
          //推荐商品信息
          if (response.data.code == 1) {
            if (response.data.data.length != 0) {
              this.falgdata = false;
              this.note = response.data.data;
              for (var i = 0; i < this.note.length; i++) {
                this.note[i].nowPrice = "￥" + this.note[i].nowPrice;
              }
            } else {
              this.falgdata = true;
              this.note = response.data.data;
            }
          } else {
            this.falgdata = true;
            console.log(response.data.Msg)
            Toast(response.data.Msg);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    mounted: function () {},
    methods: {
      toDetails: function (value) {
        this.$router.push({
          path: "/details",
          params: {
            nid: value
          }
        });
      }
    }
  };
</script>

<style scoped>
  .contents {
    height: auto;
    margin: 0 0.5rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .contents>.router-note {
    display: block;
    width: 49%;
    height: auto;
    box-sizing: border-box;
  }

  .contents .note-contents {
    border-radius: 0.5rem;
    width: 100%;
    height: auto;
    margin-bottom: 0.5rem;
  }

  .note-contents .note-img {
    width: 100%;
    height: auto;
    min-height: 5rem;
    border-radius: 0.5rem;
  }

  .note-contents>.note-title {
    font-size: 1.5rem;
    font-weight: 500;
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
    /* display: flex;
  justify-content: space-around; */
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
</style>