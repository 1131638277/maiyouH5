<template>
    <div>
        <van-sticky>
            <van-nav-bar class="title" left-arrow left-text="返回" title="管理商品" @click-left="toHome"></van-nav-bar>
        </van-sticky>
        <div>
            <van-tabs sticky>
                <van-tab title="我的商品">
                    <van-cell is-link @click="showPopup()">发布商品</van-cell>
                    <van-popup v-model="showedit" position="right" :style="{ height:'100%',width: '100%' }">
                        <van-nav-bar class="title" left-arrow left-text="返回" title="发布商品" @click-left="close">
                        </van-nav-bar>
                        <div class="contentBox">
                            <div>
                                <van-form validate-first @submit="onSubmit" @failed="onFailed" scroll-to-error>
                                    <!-- 商品封面 -->
                                    <van-field name="imgs" label="商品封面："
                                        :rules="publishMsg.cid?[]:[{validator: imgsTest, message: '封面必填' }]">
                                        <template #input>
                                            <!-- <van-uploader v-model="fileList" multiple :before-read="beforeRead"
                                                :after-read="afterRead" :max-count="1"> -->
                                            <van-uploader v-model="fileList" :before-read="beforeRead"
                                                :after-read="afterRead" :max-count="1">
                                                <van-image fit="cover" :width="publishMsg.imgs?'10rem':'3rem'"
                                                    :src="publishMsg.imgs?publishMsg.imgs:photo"></van-image>
                                            </van-uploader>
                                        </template>
                                    </van-field>
                                    <!-- 商品标题 -->
                                    <van-field v-model="publishMsg.name" name="name" label="商品标题：" placeholder="请输入商品标题"
                                        :rules="[{ validator: nameTest, message: '匹配中文，英文字母和数字及_,同时为1-30字符' }]" />
                                    <!-- 商品价格 -->
                                    <van-field v-model="publishMsg.nowPrice" name="nowPrice" label="商品价格："
                                        placeholder="请输入商品价格"
                                        :rules="[{ validator: priceTest, message: '小数点前6位，小数点后2位' }]" />
                                    <!-- 分类 -->
                                    <van-field readonly clickable name="category" :value="publishMsg.category"
                                        label="类别：" placeholder="点击选择种类" @click="showType = true"
                                        :rules="[{validator: categoryTest, message: '必填' }]" />
                                    <van-popup v-model="showType" position="bottom">
                                        <van-picker show-toolbar :columns="types" @confirm="onType"
                                            @cancel="showType = false" />
                                    </van-popup>
                                    <!-- 地区 -->
                                    <van-field readonly clickable name="address" :value="publishMsg.address" label="地区："
                                        placeholder="点击选择省市区" @click="showArea = true"
                                        :rules="[{validator: addressTest, message: '必填' }]" />
                                    <van-popup v-model="showArea" position="bottom">
                                        <van-area :area-list="areaList" @confirm="onArea" @cancel="showArea = false" />
                                    </van-popup>
                                    <!-- 关键字 -->
                                    <van-field label="关键字：" name="keywords" :value="publishMsg.keywords"
                                        v-model="publishMsg.keywords" placeholder="每个关键字用‘,’分开，最多20个字符" show-word-limit
                                        maxlength="20" :rules="[]" />
                                    <!-- 商家服务 -->
                                    <van-field label="商家服务：" name="service" :value="publishMsg.service"
                                        v-model="publishMsg.service" placeholder="最多30个字符" show-word-limit
                                        maxlength="30" :rules="[]" />

                                    <div style="margin: 16px;">
                                        <van-button round block type="info" native-type="submit">
                                            发布
                                        </van-button>
                                    </div>
                                </van-form>
                            </div>
                        </div>
                    </van-popup>
                    <van-empty v-if="commodityMsg.length==0" description="您还没有发布商品哦~" />
                    <div class="commodityBox" v-for="(value,index) in commodityMsg" :key="index"
                        @click="tocli(value.cid,'商品')">
                        <van-swipe-cell>
                            <template #left>
                                <van-button square type="primary" text="编辑" @click="toEdit(value.cid)"
                                    class="delete-button" />
                            </template>
                            <van-card
                                :desc="value.status==1?'种类：'+value.category+' | '+'状态：在架':(value.status==2?'种类：'+value.category+' | '+'状态：禁用':'种类：'+value.category+' | '+'状态：下架')"
                                :title="'商品名：'+value.name" class="goods-card" :thumb="value.imgs" />
                            <template #right>
                                <van-button v-if="value.status==0" square text="上架" type="primary" class="delete-button"
                                    @click="untie(value.cid)" />
                                <van-button v-if="value.status==1" square text="下架" type="danger" class="delete-button"
                                    @click="handle(value.cid)" />
                            </template>
                        </van-swipe-cell>
                    </div>
                </van-tab>
                <van-tab title="我的订单">
                    <div style="margin:1rem 0">
                        <van-empty v-if="orderMsg.length==0" description="还没有人下单，嘤嘤嘤~" />
                        <div class="orderBox" v-for="(value,index) in orderMsg" :key="index">
                            <div class="timeBox">
                                <p>订单号：{{value.orderNum}}</p>
                                <p>下单时间：{{value.time}}</p>
                            </div>
                            <div class="orderBox-top">
                                <div class="orderBox-left">
                                    <van-image width="8rem" height="8rem" fit="cover" lazy-load :src="value.img" />
                                </div>
                                <div class="orderBox-right">
                                    <p><span>商品名：</span>{{value.title}}</p>
                                    <p><span>数量：</span>{{value.num}}</p>
                                    <p><span>买家姓名：</span>{{value.kname}}</p>
                                    <p><span>买家电话：</span>{{value.tel}}</p>
                                    <p><span>买家地址：</span>{{value.address}}</p>
                                </div>
                            </div>
                            <div class="orderBox-bottom">
                                <div :class="Mbtnflag==index?'mystyle':'contact'" @click="tochat(value.kuid)"
                                    @touchstart="mousedown(1,index)" @touchend="mouseUp(1,-1)">
                                    联系买家
                                </div>
                                <div class="zhong"></div>
                                <div :class="Fbtnflag==index?'mystyle':'deliver'" @click="todeliver(value.oid)"
                                    @touchstart="mousedown(2,index)" @touchend="mouseUp(2,-1)">
                                    {{value.step==1?'发货':"已发货"}}
                                </div>
                            </div>
                        </div>

                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script>
    import areaList from "@/conment/js/area.js";
    import Vue from 'vue';
    import {
        Empty,
        SwipeCell,
        Sticky,
        Search,
        Toast,
        Form,
        Popup,
        Lazyload
    } from 'vant';

    Vue.use(Empty);
    Vue.use(SwipeCell);
    Vue.use(Sticky);
    Vue.use(Search);
    Vue.use(Form);
    Vue.use(Popup);
    Vue.use(Lazyload);
    export default {
        data() {
            return {
                commodityMsg: [], //我发布过的所有商品
                orderMsg: [], //我的订单信息
                radio: "1",
                showedit: false,
                oneMsg: "", //某个商品的全部信息
                fileList: [], //上传图片列表
                publishMsg: { //发布商品的信息
                    cid: "",
                    uid: "",
                    name: "",
                    nowPrice: "",
                    address: "",
                    category: "",
                    imgs: "",
                    keywords: "",
                    service: "",
                    // number: "",
                    // detailedImgs: "",
                    // showImgs: "",
                },
                thisFile: "",
                areaList: areaList, // 数据格式见 Area 组件文档
                showArea: false, //地图展示标志
                showType: false, //种类展示标志
                types: ["美妆", "服装", "鞋子", "生鲜", "家电", "食品", "其它"],
                nameteg: /^[a-zA-Z0-9_\u4E00-\u9FA5]{1,30}$/, //标题正则 匹配中文，英文字母和数字及_,同时为1-30字符
                priceteg: /^(?:0\.\d{0,1}[1-9]|(?!0)\d{1,6}(?:\.\d{0,1}[1-9])?)$/, //价格验证 小数点前6位，小数点后2位
                photo: require('@/assets/photo.png'),
                headersImg: "11", //商品封面图片
                Fbtnflag: -1, //发货按钮点击标志
                Mbtnflag: -1, //联系买家按钮点击标志
            }
        },
        watch: {
            // fileList:function(){
            //     console.log("变化：",this.fileList);
            // }
        },
        methods: {
            toHome() { //返回到个人主页
                this.$router.push({
                    path: "/about"
                });
            },
            //拿取商品信息
            getMsgInfo() {
                let uid = JSON.parse(sessionStorage.getItem("userInfo")).uid;
                this.axios
                    .get(`http://ylin:88/business/getMsgInfo?uid=${uid}`)
                    .then(response => {
                        if (response.data.code == 1) {
                            this.commodityMsg = response.data.data;
                        } else {
                            Toast({
                                message: response.data.Msg,
                                duration: 1000
                            })
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            //发布商品
            showPopup() {
                this.showedit = true;
                this.publishMsg = {
                        cid: "",
                        uid: "",
                        name: "",
                        nowPrice: "",
                        address: "",
                        category: "",
                        imgs: "",
                        keywords: "",
                        service: "",
                        // number: "",
                        // detailedImgs: "",
                        // showImgs: "",
                    },
                    this.fileList = [];

            },
            //退出发布页面
            close() {
                this.showedit = false;
            },
            //编辑商品信息
            toEdit(cid) {
                this.axios
                    .get(`/shopping/commodityinfo?keywords=${cid}`)
                    .then(response => {
                        if (response.data.code == 1) {
                            for (var key in response.data.data[0]) {
                                for (var key1 in this.publishMsg) {
                                    if (key == key1) {
                                        this.publishMsg[key1] = response.data.data[0][key];
                                    }
                                }
                            }
                            // this.publishMsg = Object.assign(response.data.data[0],this.publishMsg;
                            this.publishMsg.keywords = (this.publishMsg.keywords).join(',');
                            this.fileList = []; //清除上传过的图片
                            this.showedit = true;
                        } else {
                            Toast({
                                message: response.data.Msg,
                                duration: 1000
                            })
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            //跳转到商品详情页面
            tocli(num, typenum) {
                if (typenum == '1') {
                    this.$router.push({
                        path: "/notes",
                        query: {
                            nid: num
                        }
                    })
                } else if (typenum == '商品') {
                    this.$router.push({
                        path: "/details",
                        query: {
                            cid: num
                        }
                    });
                }

            },
            //下架商品
            handle(id) {
                this.axios.post('/business/handle', {
                    'cid': id,
                }).then(response => {
                    if (response.data.code == 1) {
                        Toast({
                            message: "下架成功！",
                            duration: 1000
                        })
                        this.getMsgInfo(JSON.parse(sessionStorage.getItem("userInfo")).uid); //刷新商品列表
                    } else {
                        console.log(response.data);
                        Toast({
                            message: response.data.Msg,
                            duration: 1000
                        })
                    }

                }).catch(function (error) {
                    console.log(error);
                })
            },
            //上架商品
            untie(id) {
                this.axios.post('/business/untie', {
                    cid: id
                }).then(response => {
                    if (response.data.code == 1) {
                        Toast({
                            message: "上架成功！",
                            duration: 1000
                        })
                        this.getMsgInfo(JSON.parse(sessionStorage.getItem("userInfo")).uid); //刷新商品列表
                    } else {
                        console.log(response.data);
                        Toast({
                            message: response.data.Msg,
                            duration: 1000
                        })
                    }

                }).catch(function (error) {
                    console.log(error);
                })
            },
            //上传前校验图片
            beforeRead(file) {
                if (file && file.length) { // 判断是否是多图上传 多图则循环添加进去
                    for (const el in file) {
                        if (file[el].type != 'image/jpeg' && file[el].type != 'image/jpg' && file[el].type !=
                            'image/png' && file[el].type != 'image/gif') { //或者所有图片格式 image/*
                            Toast('请上传 jpg/jpeg/png/gif 格式图片');
                            return false;
                        }
                    }
                } else {
                    if (file.type != 'image/jpeg' && file.type != 'image/jpg' && file.type !=
                        'image/png' && file.type != 'image/gif') { //或者所有图片格式 image/*
                        Toast('请上传 jpg/jpeg/png/gif 格式图片');
                        return false;
                    }
                }

                return true;
            },
            //上传后校验上传效果
            afterRead(file) {
                this.thisFile = file;
            },
            // 文件上传
            upload() {
                return new Promise((resolve, reject) => { //promise实现方法同步加载
                    if (this.thisFile) {
                        let file = this.thisFile; //拿去保留的图片文件格式
                        let that = this;
                        let content = file.file;
                        let data = new FormData();
                        if (file && file.length) { // 判断是否是多图上传 多图则循环添加进去
                            for (const el in file) {
                                data.append('avatar', file[el]);
                            }
                        } else {
                            data.append('avatar', file.file);
                        }
                        this.imgInfo = data;
                        this.axios.post('/upload/uploadImg', data)
                            .then(function (response) {
                                if (response.data && response.data.code == 1) {
                                    // that.publishMsg.imgs = response.data.url + ";";
                                    // that.headersImg = response.data.url + ";";
                                    resolve(response.data.url); //将新上传的封面返回
                                    file.status = 'done';
                                    file.message = '上传成功！';
                                } else {
                                    // file.status = 'failed';
                                    // file.message = '上传失败';
                                }
                            })
                            .catch(function (error) {
                                reject(error);
                                console.log(error);
                            });
                    } else {
                        resolve(this.publishMsg.imgs); //头像没有改变时
                    }
                })

            },
            //选择种类
            onType(value) {
                this.publishMsg.category = value;
                this.showType = false;
            },
            //选择地区
            onArea(values) {
                this.publishMsg.address = values.map(item => item.name).join('/');
                this.showArea = false;
            },
            //标题检测
            nameTest(val) {
                if (val) {
                    let thisval = this.blanking(val);
                    return this.nameteg.test(thisval);
                } else {
                    return false;
                }
            },
            //价格检测
            priceTest(val) {
                if (val) {
                    return this.priceteg.test(val);
                } else {
                    return false;
                }
            },
            //头像检测
            imgsTest(val) {
                if (val.length == 0) {
                    return false;
                }
            },
            // 地址检测
            addressTest(val) {
                if (!val) {
                    return false;
                }
            },
            //种类检测
            categoryTest(val) {
                if (!val) {
                    return false;
                }
            },
            //提交表单信息时，验证格式错误触发
            onFailed(errorInfo) {
                Toast({
                    message: "数据格式错误！",
                    duration: 1000
                })
            },
            //提交商品信息
            onSubmit(values) {
                let that = this;
                this.upload().then((returnValue) => {
                    this.publishMsg.imgs = returnValue; //将新的封面替换旧的封面
                    this.publishMsg.uid = JSON.parse(sessionStorage.getItem("userInfo")).uid; //拿取商家id
                    this.axios.post('/business/publishSP', { //发布商品
                            thisdata: this.publishMsg
                        }).then(function (response) {
                            if (response.data.code == 1) {
                                Toast({
                                    message: "发布成功！",
                                    duration: 1000
                                });
                                that.showedit = false;
                                that.getMsgInfo(JSON.parse(sessionStorage.getItem("userInfo"))
                                    .uid); //刷新商品列表

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
                }).catch((error) => {
                    console.log(error);
                });

            },
            //去空格处理
            blanking(value) {
                let data = value.replace(/\s+/g, ""); //去除数据的空格
                return data;
            },
            //拿去订单信息
            getOrder() {
                let uid = JSON.parse(sessionStorage.getItem("userInfo")).uid;
                this.axios.get(`/business/getOrder?uid=${uid}`).then((response) => {
                        if (response.data.code == 1) {
                            this.orderMsg = response.data.data;
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
            //联系买家
            tochat(kuid) {
                this.$router.push({
                    path: "/chat",
                    query: {
                        otherUid: kuid
                    }
                });
            },
            //发货
            todeliver(oid) {
                this.axios.post(`/business/deliverGoods`, {
                        'oid': oid
                    }).then((response) => {
                        if (response.data.code == 1) {
                            Toast({
                                message: "发货成功！",
                                duration: 1000
                            })
                            this.getOrder();
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
            //按钮点击效果
            mousedown(value, num) { //按下按钮
                if (value == 1) {
                    this.Mbtnflag = num;
                } else if (value == 2) {
                    this.Fbtnflag = num;

                }
            },
            mouseUp(value, num) { //松开按钮
                if (value == 1) {
                    this.Mbtnflag = num;
                } else if (value == 2) {
                    this.Fbtnflag = num;
                }
            },
        },
        created() {
            this.getMsgInfo();
            this.getOrder();
        }
    }
</script>
<style scoped>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .goods-card {
        margin: 0;
        background-color: #fff;
    }

    .delete-button {
        height: 100%;
    }

    .contentBox {
        padding: 1rem 0;
    }

    .orderBox {
        height: auto;
        width: 90%;
        margin: 0 auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 1.4rem;
        border: 1px solid #eee;
        box-shadow: 0 0 3px rgb(209, 207, 207);
        border-radius: 0.3rem;
        margin-bottom: 1rem;
    }

    .orderBox .timeBox {
        width: 100%;
        font-size: 1rem;
        display: flex;
        align-items: center;
        color: rgb(201, 196, 196);
        margin-bottom: 0.5rem;
    }

    .orderBox .timeBox>p:first-child {
        width: 50%;
        text-align: left;
    }

    .orderBox .timeBox>p:last-child {
        width: 50%;
        text-align: right;
    }

    .orderBox .orderBox-top {
        width: 100%;
        display: flex;
        align-items: center;
    }


    .orderBox .orderBox-left {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 35%;

    }

    .orderBox .orderBox-right {
        height: auto;
        width: 65%;
        font-size: 1.2rem;
    }

    .orderBox .orderBox-right span {
        color: rgb(165, 160, 160);
    }

    .orderBox .orderBox-bottom {
        margin-top: 1rem;
        width: 100%;
        height: auto;
        display: flex;
        align-items: center;
        border: 1px solid rgb(231, 226, 226);
    }

    .orderBox .orderBox-bottom .contact,
    .orderBox .orderBox-bottom .deliver {
        height: 3rem;
        line-height: 3rem;
        width: 49.5%;
        text-align: center;
    }

    .orderBox .orderBox-bottom .mystyle {
        height: 3rem;
        line-height: 3rem;
        width: 49.5%;
        text-align: center;
        background-color: rgb(243, 237, 237);
    }

    .orderBox .orderBox-bottom .zhong {
        width: 1px;
        height: 3rem;
        background-color: rgb(231, 226, 226);
    }
</style>