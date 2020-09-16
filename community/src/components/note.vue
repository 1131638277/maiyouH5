<template>
  <div class="contents">
    <ElementLoading :active="this.$store.state.vueElementLoading" color="#c1c2c2" background-color="#fff"
      text="加载中..." />
    <!-- <div :class="falgdata?'have':'none'">暂无笔记~</div> -->
    <div style="margin:0 auto" v-if="!falgdata">
    <van-empty image="search" description="暂无笔记~" />
    </div>
    <router-link :to="{path:'/notes',query:{nid:num.nid}}" class="router-note"
      v-for="(num,index) in note" :key="index">
      <div class="note-contents" style="margin-right:0">
        <img class="note-img" :src="num.imgs[0]" alt="笔记封面" />
        <div>
          <p class="note-title">{{num.title}}</p>
        </div>
        <div class="note-user">
          <div class="left">
            <van-image style="vertical-align: middle;margin-right: 0.5rem;" width="2.5rem" height="2.5rem" round
              fit="cover" :src="num.avatar" />
            <!-- <img class="user-header" :src="num.avatar" alt="用户头像" /> -->
            <span>{{num.username}}</span>
          </div>
          <div class="right">
            <img class="note-support" :src="zan" alt="赞" />
            <span>{{num.support}}</span>
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
      personalUid: String,
      supportuid: String
    },
    data() {
      return {
        tpyeFlag: "",
        falgdata: false,
        zan: require("../assets/xin.png"),
        note: []
      };
    },
    watch: {
      childid(newVal, oldVal) { //按关键字查询
        this.axios
          .get("http://ylin:88/note/keyNotes", {
            params: {
              keyw: newVal
            }
          })
          .then(response => {
            this.$store.commit('updateLoading', false); //关闭加载动画
            this.note = response.data;
            if (response.data.length != 0) {
              this.falgdata = true;
            } else {
              this.falgdata = false;
            }
          })
          .catch((error) =>{
            this.$store.commit('updateLoading', false); //关闭加载动画
            console.log(error);
          });
      },
      personalUid(newVal, oldVal) {
        if (newVal) {
          let thisdata = newVal.split(';')[0];
          let thisflag = newVal.split(';')[1];
          this.axios
            .get("http://ylin:88/note/allNotes", {
              params: {
                uid: thisdata,
                flag: thisflag
              }
            })
            .then(response => {
              this.$store.commit('updateLoading', false); //关闭加载动画
              this.note = response.data;
              if (response.data.length != 0) {
                this.falgdata = true;
              } else {
                this.falgdata = false;
              }
            })
            .catch((error)=> {
              this.$store.commit('updateLoading', false); //关闭加载动画
              console.log(error);
            });
        }
      }
    },
    created: function () {
      if (sessionStorage.getItem("notesInfo") && (this.tpyeFlag == sessionStorage.getItem(
          'noteType'))) { //如果本地保存有数据，就从本地拿
        this.note = JSON.parse(sessionStorage.getItem("notesInfo"));
        this.$store.commit('updateLoading', false); //关闭加载动画
        this.falgdata = true; //隐藏占位字符
      } else {
        this.$store.commit('updateLoading', true); //开启加载动画
        this.tpyeFlag = sessionStorage.getItem('noteType');
        this.getdata(); //获取笔记数据
      }

    },
    mounted: function () {},
    methods: {
      // toNotes: function (value) {
      //   this.$router.push({
      //     path: "/notes",
      //     params: {
      //       nid: value
      //     }
      //   });
      // },
      getdata() {
        var thisNoteType;
        if (sessionStorage.getItem('noteType')) { //从session中拿去种类
          thisNoteType = sessionStorage.getItem('noteType');
        } else {
          thisNoteType = "全部"
        }
        
        this.axios.get("http://ylin:88/note/keyNotes", { //根据种类去选择笔记
            params: {
              keyw: thisNoteType
            }
          }).then(response => {
            this.$store.commit('updateLoading', false); //关闭加载动画
            sessionStorage.setItem('notesInfo', JSON.stringify(response.data)); //将数据临时存放到本地
            if (response.data.length != 0) {
              this.note = response.data;
              this.falgdata = true;
            } else {
              this.falgdata = false;
            }
          }).catch((error)=> {
            this.$store.commit('updateLoading', false); //关闭加载动画
            console.log("反参数据：",error);
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

  .contents {
    height: auto;
    margin: 0 0.5rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    border: 0 solid;
  }

  /* 有数据时 */
  .have {
    display: none;
  }

  /*无数据时数据 */
  .none {
    display: block;
    width: 100%;
    height: 10rem;
    line-height: 10rem;
    text-align: center;
    font-size: 16px;
    color: #a8a7a7;
  }

  .contents>.router-note {
    display: block;
    width: 49%;
    height: auto;
    box-sizing: border-box;
    margin-right: 0 !important;
  }

  .contents .note-contents {
    border-radius: 0.5rem;
    width: 100%;
    height: auto;
    margin-bottom: 0.5rem;
  }

  .note-contents .note-img {
    width: 100%;
    height: 100%;
    min-height: 5rem;
    border-radius: 0.5rem;
  }

  .note-contents .note-title {
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
    /* height: 3rem; */
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    box-sizing: border-box;
  }

  .note-contents>.note-user>.left {
    width: 50%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

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