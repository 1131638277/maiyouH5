<template>
  <div>
    <!-- 导航 -->
    <van-sticky>
      <nav>
        <van-nav-bar title="编辑资料" left-text="返回" left-arrow @click-left="onClickLeft" />
      </nav>
    </van-sticky>

    <!-- 表单 -->
    <van-form validate-first @submit="onSubmit" @failed="onFailed" scroll-to-error>
      <!-- 切换头像 -->
      <div class="avatarBox">
        <van-field name="avatar" v-model="userinfo.avatar" label="头像" :rules="[]">
          <template #input>
            <van-uploader v-model="fileList" :before-read="beforeRead" :after-read="afterRead" :max-count="1">
              <img id="icon-photo" style="width:2rem;height:2rem" src="@/assets/camera.png" alt="">
              <van-image round fit="cover" width="6rem" height="6rem" :src="userinfo.avatar">
              </van-image>
            </van-uploader>
          </template>
        </van-field>
      </div>
      <!-- 用户名 通过 validator 进行函数校验-->
      <van-field v-model="userinfo.username" label="用户名:" name="username" placeholder=""
        :rules="[{ validator:usernameTest, message: '必填！格式中文、字母、数字及_的自由组合,只能为1-6个字符' }]" />
      <!-- 性别 -->
      <van-field readonly clickable name="gender" :value="userinfo.gender" label="性别:" placeholder=""
        @click="showGender = true" :rules="[]" />
      <van-popup v-model="showGender" position="bottom">
        <van-picker show-toolbar :columns="sex" @confirm="onGender" @cancel="showGender = false" />
      </van-popup>
      <!-- 个性签名 -->
      <div class="synopsisBox">
        <van-field v-model="userinfo.synopsis" maxlength="50" show-word-limit rows="1" label="签名:" name="synopsis"
          placeholder="编辑个性签名" :rules="[]" />
      </div>
      <!-- 生日 -->
      <van-field readonly clickable name="birthday" :value="userinfo.birthday" label="生日:" placeholder="点击选择时间"
        @click="showDate = true" :rules="[]" />
      <van-popup v-model="showDate" position="bottom">
        <van-datetime-picker type="date" v-model="currentDate" :min-date="minDate" :max-date="maxDate"
          @confirm="onBirthday" @cancel="showDate = false" />
      </van-popup>
      <!-- 职业 -->
      <van-field readonly clickable name="work" :value="userinfo.work" label="职业:" placeholder="点击选择职业"
        @click="showWork = true" :rules="[]" />
      <van-popup v-model="showWork" position="bottom">
        <van-picker show-toolbar :columns="work" @confirm="onWork" @cancel="showWork = false" />
      </van-popup>
      <!-- 地区 -->
      <van-field readonly clickable name="area" :value="userinfo.area" label="地区" placeholder="点击选择省市区"
        @click="showArea = true" :rules="[]" />
      <van-popup v-model="showArea" position="bottom">
        <van-area :area-list="areaList" @confirm="onArea" @cancel="showArea = false" />
      </van-popup>
      <!-- 邮箱   通过 email 进行正则校验 -->
      <van-field v-model="userinfo.email" label="邮箱:" name="email" placeholder="请输入正确的邮箱格式"
        :rules="[{ validator:emailTest, message: '邮箱格式不正确' }]" />
      <!-- 手机号   通过 phone 进行正则校验 -->
      <van-field v-model="userinfo.tel" label="手机号:" name="tel" placeholder="请输入正确的手机号格式"
        :rules="[{ validator:telTest, message: '手机号格式不正确' }]" />


      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          保存
        </van-button>
      </div>
    </van-form>

  </div>
</template>

<script>
  import Vue from 'vue';
  import areaList from "@/conment/js/area.js";
  import {
    Toast,
    Form,
    DatetimePicker,
    Picker,
    Sticky
  } from 'vant';

  Vue.use(Form);
  Vue.use(Toast);
  Vue.use(DatetimePicker);
  Vue.use(Picker);
  Vue.use(Sticky);
  export default {
    data() {
      return {
        userinfo: {
          avatar: "",
          username: "",
          gender: "",
          synopsis: "",
          birthday: "",
          area: "",
          email: "",
          tel: "",
        },
        fileList: [],
        usernameteg: /^[a-zA-Z0-9_\u4E00-\u9FA5]{1,6}$/, //匹配中文，英文字母和数字及_,同时为1-6字符
        emailteg: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, //匹配正确的邮箱格式
        phoneteg: /^1[3456789]\d{9}$/, //匹配正确的手机号
        minDate: new Date(1900, 1, 1),
        maxDate: new Date(),
        currentDate: new Date(),
        showDate: false,
        showGender: false,
        showWork: false,
        showArea: false,
        sex: ["男", "女"],
        work: ["计算机/IT/网络", "生产/工艺/制造", "医疗/护理/制药", "金融/银行/投资/保险", "商业/服务业/个体经营", "娱乐/艺术/表演", "运动员/健身教练/训练师", "学生",
          "教育/培训", "其它职业"
        ],
        areaList: areaList, // 数据格式见 Area 组件文档
      };
    },
    methods: {
      //取消修改
      onClickLeft() {
        this.$router.go(-1);
      },
      //头像上传前
      beforeRead(file) {
        if (file.type != 'image/jpeg' && file.type != 'image/jpg' && file.type !=
          'image/png') { //或者所有图片格式 image/*
          Toast({
            message: '图片格式不正确',
            duration: 1000
          });
          return false;
        }
        return true;
      },
      //头像上传时
      afterRead(file) {
        let that = this;
        let content = file.file;
        let data = new FormData();
        data.append('avatar', file.file);

        this.axios.post('/upload/uploadImg', data)
          .then(function (response) {
            if (response.data && response.data.code == 1) {
              that.userinfo.avatar = response.data.url;
              file.status = 'done';
              file.message = '上传成功！';
            } else {
              file.status = 'failed';
              file.message = '上传失败';
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //选择性别
      onGender(value) {
        this.userinfo.gender = value;
        this.showGender = false;
      },
      // 选择日期
      onBirthday(time) {
        this.userinfo.birthday = time.toLocaleString(); //将日期转化为字符串
        this.userinfo.birthday = this.userinfo.birthday.split(" ").shift(); //截取年月日
        this.showDate = false; //隐藏选择框
      },
      //选择职业
      onWork(value) {
        this.userinfo.work = value;
        this.showWork = false;
      },
      //选择地区
      onArea(values) {
        this.userinfo.area = values.map(item => item.name).join('/');
        this.showArea = false;
      },
      //检验用户名格式
      usernameTest(val) {
        if (val) {
        let thisval = this.blanking(val);
        return this.usernameteg.test(thisval);
        } else {
          return true;
        }
      },
      //检验邮箱格式
      emailTest(val) {
        if (val) {
          let thisval = this.blanking(val);
          return this.emailteg.test(thisval);
        } else {
          return true;
        }
      },
      //检验手机号格式
      telTest(val) {
        if (val) {
          let thisval = this.blanking(val);
          return this.phoneteg.test(thisval);
        } else {
          return true;
        }
      },
      //去空格处理
      blanking(value) {
        let data = value.replace(/\s+/g, ""); //去除数据的空格
        return data;
      },
      //提交表单信息时，验证通过触发
      onSubmit(values) {
        values.avatar = this.userinfo.avatar;
        values.uid = JSON.parse(sessionStorage.getItem("userInfo")).uid; //将代表指定用户的uid字段放在最后
        this.axios
          .post("/user/updatauserinfo", {
            'userinfo': values
          })
          .then(response => {
            if (response.data.code == 1) {
              Toast({
                message: response.data.Msg,
                duration: 1000
              });
              this.$router.go(-1);
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
      onFailed(errorInfo) { //提交表单信息时，验证格式错误触发
        Toast({
          message: "数据格式错误！",
          duration: 1000
        })
      }
    },
    created: function () {
      if (sessionStorage.getItem("userInfo")) {
        this.userinfo = JSON.parse(sessionStorage.getItem("userInfo"));
      } else {
        Toast({
          message: "请先登陆！",
          duration: 1000
        })
        this.$router.push({
          path: "/Login"
        })
      }

    }
  };
</script>
<style scoped>
  html {
    font-size: 62.5%;
    /* font-size: calc(100vw/62.5);  */

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

  .avatarBox>>>.van-cell__title {
    display: flex;
    align-items: center;
  }

  .avatarBox>>>.van-uploader__input-wrapper {
    position: relative;
  }

  .avatarBox>>>#icon-photo {
    position: absolute;
    right: -0.5rem;
    bottom: 0.5rem;
    z-index: 1;
  }

  .avatarBox>>>.van-image {
    border-radius: 50%;
    width: 6rem;
    height: 6rem;
  }

  .synopsisBox>>>.van-cell__value {
    display: flex;
    justify-content: space-between;
  }
</style>