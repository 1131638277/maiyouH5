<template>
    <div>
        <nav>
            <van-nav-bar :title="typeWord" left-text="返回" right-text="" fixed left-arrow @click-left="onClickLeft" />
        </nav>
        <ElementLoading :active="this.$store.state.vueElementLoading" color="#c6c9c9" background-color="#fff"
            text="疯狂加载中..." />
        <div class="commodityList-box">
            <van-empty v-if="commodityMsgs.length==0" image="search" description="暂无商品..." />
            <div class="content-box" v-for="(value,index) in commodityMsgs" :key="index">
                <van-card :price="value.nowPrice" @click="toDetails(value.cid)" :origin-price="value.originalPrice"
                    width='100%' lazy-load :desc="value.address+' | 已被'+value.collectionNum+'人收藏'" :title="value.name"
                    :thumb="value.imgs">
                    <div slot="tags">
                        <van-tag plain type="danger" style="margin-left:0.5rem;" v-for="(lable,index) in value.keywords"
                            :key="index">{{lable}}</van-tag>
                    </div>
                </van-card>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {
        Empty,
        Card,
        Lazyload
    } from 'vant';

    Vue.use(Card);
    Vue.use(Lazyload);
    export default {
        data() {
            return {
                typeWord: "加载中...",
                commodityMsgs: [{
                    showImgs: [{
                            img: 'https://img.yzcdn.cn/vant/apple-1.jpg',
                        },
                        {
                            img: 'https://img.yzcdn.cn/vant/apple-1.jpg',
                        },
                        {
                            img: 'https://img.yzcdn.cn/vant/apple-1.jpg',
                        }
                    ],
                    imgs: "https://img.yzcdn.cn/vant/apple-1.jpg",
                    detailedImgs: [
                        'https://img.yzcdn.cn/vant/apple-1.jpg',
                        'https://img.yzcdn.cn/vant/apple-2.jpg'
                    ],
                    nowPrice: "20",
                    originalPrice: "1000",
                    name: "这是款好东西这是款好东西这是款好东西这是款好东西这是款好东西",
                    service: "买一送一了哈！清仓大甩卖！",
                    details: "详情",
                    address: "上海",
                    collectionNum: 34, //收藏人数
                    number: 1, //购买人数
                    keywords: ["美妆", "女人", "富人"] //商品标签
                }]

            }
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1);
            },
            toDetails(value) {
                this.$router.push({
                    path: `/details?cid=${value}`,
                    params: {}
                });
            }
        },
        created: function () {
            this.typeWord = this.$route.query.keywords;
            var that = this;
            this.$store.commit('updateLoading', true); //开启加载动画
            function getCommodityinfo() { //获取一类商品的所有信息
                return that.axios.get(`/shopping/commodityinfo?keywords=${that.$route.query.keywords}`);
            }

            function getUserPermissions() { 
                // return that.axios.get(`/note/getcomments?nid=${that.$route.query.nid}`);
            }
            this.axios.all([getCommodityinfo(), getUserPermissions()]).then(
                that.axios.spread((acct, perms) => {
                    this.$store.commit('updateLoading', false); //关闭加载动画
                    // 两个请求现在都执行完成
                    for(let i=0,num=acct.data.data.length;i<num;i++){
                        acct.data.data[i].address=acct.data.data[i].address.split("/")[0];
                    }
                    that.commodityMsgs = acct.data.data;
                })
            ).catch(function (error) {
                console.log(error);
            });
        }
    }
</script>
<style lang="scss" scoped>
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

    .commodityList-box {
        // width: 100%;
        margin-top: 5rem;
        padding: 0 1rem;

    }

    .commodityList-box>.content-box {
        margin: 0 auto;
        margin-bottom: 0.5rem;
    }
</style>