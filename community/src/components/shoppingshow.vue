<template>
    <div>
        <div style="margin:0 auto"
            v-if="(keyNum == '1'&&List1.length==0)||(keyNum == '2'&&List2.length==0)||(keyNum == '3'&&List3.length==0)">
            <van-empty image="search" description="暂无商品~" />
        </div>
        <div v-if="keyNum == '1'">
            <van-card v-for="(value,index) in List1" :key="index" :num="value.num" :price="value.price"
                :desc="'日期：'+value.time" :title="value.title" :thumb="value.img" @click="tocli(value.cid)">
                <template #bottom>
                    <van-steps :active="value.active">
                        <van-step>下单</van-step>
                        <van-step>接单</van-step>
                        <van-step>发货</van-step>
                        <van-step>收货</van-step>
                        <van-step>完成</van-step>
                    </van-steps>
                </template>
                <template #footer v-if="value.active=='2'">
                    <van-button size="mini" @click.stop="confirmReceipt(value.oid)">确认收货</van-button>
                </template>
            </van-card>

        </div>
        <div v-if="keyNum == '2'">
            <van-card v-for="(value,index) in List2" :key="index" :num="value.num" :price="value.price"
                :desc="'日期：'+value.time" :title="value.title" :thumb="value.img" @click="tocli(value.cid)">
                <template #footer>
                    <van-button size="mini" @click.stop='todelete(value.sid)'>删除</van-button>
                    <van-button size="mini" @click.stop="tobuy(value.cid,value.sid,value.num)">购买</van-button>
                </template>
            </van-card>
        </div>
        <div v-if="keyNum == '3'">
            <van-card v-for="(value,index) in List3" :key="index" :price="value.price" :desc="'日期：'+value.time"
                :title="value.title" :thumb="value.img" @click="tocli(value.cid)">
            </van-card>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {
        Card,
        Empty,
        Step,
        Steps,
        Dialog,
        List,
        Toast
    } from 'vant';

    Vue.use(Card);
    Vue.use(Empty);
    Vue.use(Step);
    Vue.use(Steps);
    Vue.use(Dialog);
    Vue.use(Toast);
    export default {
        props: {
            keyNum: String
        },
        data() {
            return {
                List1: [], //已购订单
                List2: [], //购物车订单
                List3: [], //收藏订单
                uid: "",
            };
        },
        watch: {
            keyNum(newVal, oldVal) {
                if (newVal == "1") { //已购商品
                    this.getOrder();
                } else if (newVal == "2") { //购物车
                    this.getCartInfo();
                } else if (newVal == "3") { //收藏
                    this.axios
                        .get(`/shopping/getCollectionInfo?uid=${this.uid}`) //拿取用户信息
                        .then(response => {
                            if (response.data.code == 1) { //登陆成功后
                                for (let i = 0, num = response.data.data.length; i < num; i++) {
                                    var obj = {
                                        cid: response.data.data[i].cid,
                                        img: response.data.data[i].imgs,
                                        num: "",
                                        price: response.data.data[i].nowPrice,
                                        title: response.data.data[i].name,
                                        time: response.data.data[i].time
                                    }
                                    this.List3.push(obj);
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
            }
        },
        methods: {
            //去详情页面
            tocli(cid) {
                this.$router.push({
                    path: "/details",
                    query: {
                        cid: cid
                    }
                });
            },
            //确认收货
            confirmReceipt(oid) {
                Dialog.confirm({
                        message: '确认收货？',
                    })
                    .then(() => {
                        this.axios.post(`/business/confirmReceipt `, {
                                'oid': oid
                            }).then((response) => {
                                if (response.data.code == 1) {
                                    Toast({
                                        message: "确认收货成功！",
                                        duration: 1000
                                    })
                                    this.getOrder(); //刷新订单
                                } else {
                                    Toast({
                                        message: response.data.Msg,
                                        duration: 1000
                                    });
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    })
                    .catch(() => {
                        // on cancel
                    });
            },
            //购买后删除
            thisDelete(sid) {
                this.axios
                    .get(`/shopping/todelete?sid=${sid}`) //拿取用户信息
                    .then(response => {
                        if (response.data.code == 1) { //登陆成功后
                            for (let i = 0, nums = this.List2.length; i < nums; i++) {
                                if (this.List2[i].sid == sid) {
                                    this.List2.splice(i, 1);
                                }
                            }
                            this.getCartInfo(); //刷新购物车订单
                        } else {
                            Toast({
                                message: response.data.Msg,
                                duration: 1000
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            // 删除购物车某件商品
            todelete(sid) {
                let that = this;
                Dialog.confirm({
                        message: '确认删除？',
                    })
                    .then(() => {
                        this.axios
                            .get(`/shopping/todelete?sid=${sid}`) //拿取用户信息
                            .then(response => {
                                if (response.data.code == 1) { //登陆成功后
                                    for (let i = 0, nums = this.List.length; i < nums; i++) {
                                        if (this.List2[i].sid == sid) {
                                            this.List2.splice(i, 1);
                                        }
                                    }
                                } else {
                                    Toast({
                                        message: response.data.Msg,
                                        duration: 1000
                                    });
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    })
                    .catch(() => {
                        // on cancel
                    });
            },
            //购买
            tobuy(cid, sid, num) {
                this.getInfos(cid).then(response => {
                    this.axios
                        .post(`/shopping/purchase`, {
                            orderNum: response.uid + "" + response.cid + "" + JSON.parse(sessionStorage
                                .getItem("userInfo")).uid + "" + Math.floor(Math.random() * 10000),
                            suid: response.uid,
                            kuid: JSON.parse(sessionStorage.getItem("userInfo")).uid,
                            cid: response.cid,
                            kname: JSON.parse(sessionStorage.getItem("userInfo")).username,
                            address: JSON.parse(sessionStorage.getItem("userInfo")).area,
                            img: response.imgs,
                            price: response.nowPrice * num,
                            num: num,
                            title: response.name,
                            tel: JSON.parse(sessionStorage.getItem("userInfo")).tel,
                        })
                        .then(response => {
                            if (response.data.code == 1) {
                                Toast({
                                    message: response.data.Msg,
                                    duration: 1000
                                });
                                this.thisDelete(sid);
                            } else {
                                Toast({
                                    message: response.data.Msg,
                                    duration: 1000
                                });
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }).catch(error => {

                });
            },
            //查询商品信息
            getInfos(cid) {
                let that = this;
                return new Promise(function (resolve, reject) { //promise实现方法同步加载
                    that.axios
                        .get(`/shopping/commodityinfo?keywords=${cid}`) //拿取用户信息
                        .then(response => {
                            if (response.data.code == 1) { //获取成功后
                                if (response.data.data.length != 0) {
                                    resolve(response.data.data[0]);
                                } else {
                                    Toast({
                                        message: "商品不存在！",
                                        duration: 1000
                                    });
                                }
                            } else {
                                Toast({
                                    message: response.data.Msg,
                                    duration: 1000
                                });
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
            },
            getOrder() { //拿取已购商品订单
                let uid = JSON.parse(sessionStorage.getItem("userInfo")).uid;
                this.axios.get(`/shopping/getOrder?uid=${uid}`).then((response) => {
                        if (response.data.code == 1) {
                            this.List1 = [];
                            for (let i = 0, num = response.data.data.length; i < num; i++) {
                                var obj = {
                                    oid: response.data.data[i].oid,
                                    cid: response.data.data[i].cid,
                                    img: response.data.data[i].img,
                                    num: response.data.data[i].num,
                                    price: response.data.data[i].price,
                                    title: response.data.data[i].title,
                                    time: response.data.data[i].time,
                                    active: response.data.data[i].step
                                }
                                this.List1.push(obj);
                            }
                        } else {
                            Toast({
                                message: response.data.Msg,
                                duration: 1000
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            getCartInfo() { //拿取购物车订单
                this.axios
                    .get(`/shopping/getCartInfo?uid=${this.uid}`) //拿取用户信息
                    .then(response => {
                        if (response.data.code == 1) { //登陆成功后
                            this.List2 = [];
                            for (let i = 0, num = response.data.data.length; i < num; i++) {
                                var obj = {
                                    sid: response.data.data[i].sid,
                                    cid: response.data.data[i].cid,
                                    img: response.data.data[i].img,
                                    num: response.data.data[i].num,
                                    price: response.data.data[i].price,
                                    title: response.data.data[i].title,
                                    time: response.data.data[i].time
                                }
                                this.List2.push(obj);
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
        created: function () {
            this.uid = JSON.parse(sessionStorage.getItem("userInfo")).uid;
        },

        mounted: function () {},
    };
</script>

<style scoped>

</style>