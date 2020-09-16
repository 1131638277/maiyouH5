<template>
  <div>
    <van-tabs animated swipeable>
      <van-tab :title="value.title" name="a" class="userLogin" v-for="(value,index) in loginData" :key="index">
        <div class="kuang">
          <div class="loginBox">
            <div class="loginName">
              <div class="up">
                <label for="nameInput"><span>账号:</span></label>
                <input :id="value.nameInput" class="loginInput1" @focus="showtips('name')" type="text"
                  v-model="Lusername" />
              </div>
              <p v-show="tipsName==true&&value.title=='注册'">({{value.nameTips}})</p>
            </div>
            <div class="loginPasswd">
              <div class="up">
                <label for="passwdInput"><span>密码:</span></label>
                <input :id="value.passwdInput" class="loginInput2" @focus="showtips('passwd')" type="password"
                  v-model="Lpasswd" />
              </div>
              <p v-show="tipsPasswd==true&&value.title=='注册'">({{value.passwdTips}})</p>
            </div>
            <div class="tel" v-if="value.title=='注册'">
              <div class="up">
                <label for="telInput"><span>电话:</span></label>
                <input id="telInput" class="loginInput3" @focus="showtips('tel')" type="text" maxlength="11"
                  oninput="value=value.replace(/[^\d]/g,'')" v-model="Ltel" />
              </div>
            </div>
          </div>

          <div>
            <div class="rememberBox">
              <van-checkbox v-if="value.title=='登录'" v-model="checked" @click="remember">记住密码</van-checkbox>
            </div>
            <div class="thisbutton">
              <button @click="logins(value.title)" @touchstart="mousedown(1)" @touchend="mouseUp(1)"
                :class="Lbtnflag?'butn':'Lbutn'">{{value.title}}</button>
              <button @click="cancels" :class="Rbtnflag?'butn':'Lbutn'" @touchstart="mousedown(2)"
                @touchend="mouseUp(2)">取消</button>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
  import Vue from 'vue';
  import CryptoJS from "crypto-js";
  import {
    Toast,
    Checkbox,
    CheckboxGroup
  } from "vant";
  Vue.use(Checkbox);
  Vue.use(CheckboxGroup);
  export default {
    data() {
      return {
        checked: false,
        Lbtnflag: false,
        Rbtnflag: false,
        loginData: [{
          title: "登录",
          nameTips: "",
          passwdTips: "",
          nameInput: "nameInput",
          passwdInput: "passwdInput"
        }, {
          title: "注册",
          nameTips: "中文、字母、数字及_的自由组合,只能为1-6个字符",
          passwdTips: "数字、字母的自由组合,只能为3-12个字符",
          nameInput: "nameInput",
          passwdInput: "passwdInput"
        }],
        tipsName: false,
        tipsPasswd: false,
        username: "",
        passwd: "",
        Lusername: "",
        Lpasswd: "",
        Ltel: ""
      };
    },
    watch: {},
    methods: {
      cancels: function () { //返回上一页
        this.$router.go(-1);
      },
      // 记住密码
      remember() {
        console.log(this.checked);
      },
      mousedown(value) { //按下按钮
        if (value == 1) {
          this.Lbtnflag = true;
        } else if (value == 2) {
          this.Rbtnflag = true;

        }
      },
      mouseUp(value) { //松开按钮
        if (value == 1) {
          this.Lbtnflag = false;
        } else if (value == 2) {
          this.Rbtnflag = false;

        }
      },
      showtips(value) { //获取焦点
        if (value == "name") {
          this.tipsName = true;
        }
        if (value == "passwd") {
          this.tipsPasswd = true;
        }
        if (value == "tel") {
          this.tipsTel = true;
        }
      },
      logins: function (keyword) {
        var userInfos = this.Verification(this.Lusername, this.Lpasswd);
        if (userInfos.flag == -1) {
          Toast({
            message: userInfos.text,
            duration: 1000
          });
        } else {
          if (keyword == "登录") { //登录
            if (this.checked) {
              var obj = {
                username: userInfos.finalName,
                password: userInfos.finalPasswd
              }
              localStorage.setItem("loginInfo", JSON.stringify(obj));
            } else {
              var obj = {
                username: userInfos.finalName,
                password: ""
              }
              localStorage.setItem("loginInfo", JSON.stringify(obj));
            }
            // 给密码加密
            let passwdX = CryptoJS.AES.encrypt(userInfos.finalPasswd, 'mypasswd123').toString();
            this.axios
              .post("/user/login", {
                username: userInfos.finalName,
                password: passwdX
              })
              .then(response => {
                if ((response.data.code == 1)) {
                  Toast({
                    message: "登录成功",
                    icon: "passed",
                    duration: 1000
                  });
                  sessionStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
                  this.$router.go(-1);
                } else if ((response.data.code == 0)) {
                  Toast({
                    message: "密码错误",
                    icon: "close",
                    duration: 1000
                  });
                } else if ((response.data.code == -1)) {
                  Toast({
                    message: "用户不存在",
                    icon: "close",
                    duration: 1000
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          } else if (keyword == "注册") { //注册
            this.tipsName = false; //关闭提示
            this.tipsPasswd = false; //关闭提示
            var telinfo = this.VerificationTel(this.Ltel); //验证手机号格式
            if (telinfo.flag == -1) {
              Toast({
                message: telinfo.text,
                duration: 1000
              });
            } else {
              this.testingUsername(userInfos.finalName).then((value) => { //先 验证账号是否已经存在
                if (value) {
                  let passwdY = CryptoJS.AES.encrypt(userInfos.finalPasswd, 'mypasswd123').toString();
                  this.axios
                    .post("/user/register", {
                      'registerInfo': {
                        username: userInfos.finalName,
                        passwd: passwdY,
                        tel: telinfo.finalTel
                      }
                    })
                    .then(response => {
                      if (response.data.code == 1) {
                        Toast({
                          message: response.data.Msg,
                          icon: "passed",
                          duration: 1000
                        });
                        this.$router.go(0);
                        let obj = {
                          username: userInfos.finalName,
                          password: userInfos.finalPasswd
                        }
                        localStorage.setItem("loginInfo", JSON.stringify(obj));
                      } else if (response.data.code == -1) {
                        Toast({
                          message: response.data.Msg,
                          icon: "close",
                          duration: 1000
                        });
                      } else if (response.data.code == 0) {
                        Toast({
                          message: response.data.Msg,
                          icon: "close",
                          duration: 1000
                        });
                      }
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                } else {
                  Toast({
                    message: "用户名已存在！",
                    icon: "close",
                    duration: 1000
                  });
                }

              }).catch((err) => {
                console.log(error);

              })
            }
          }
        }
      },
      Verification(name, passwd) { //账号密码验证
        var finalName = name.replace(/\s+/g, ""); //去除用户名的空格
        var finalPasswd = passwd.replace(/\s+/g, ""); //去除密码的空格
        var regName = /^[a-zA-Z0-9_\u4E00-\u9FA5]{1,6}$/; //匹配中文，英文字母和数字及_,同时为1-6字符
        var regPasswd = /^[a-zA-Z0-9]{3,12}$/; //匹配由数字、26个英文字母组成的字符串,同时为3-12字符 

        var data = {
          'flag': 1,
          'finalName': finalName,
          'finalPasswd': finalPasswd,
          "text": "验证通过"
        }
        if (!finalName) {
          data.flag = -1;
          data.text = "账号不能为空！";
          return data;
        }
        if (!finalPasswd) {
          data.flag = -1;
          data.text = "密码不能为空！";
          return data;
        }

        if (!regName.test(finalName)) {
          data.flag = -1;
          data.text = "账号格式不正确！";
          return data;
        }
        if (!regPasswd.test(finalPasswd)) {
          data.flag = -1;
          data.text = "密码格式不正确！";
          return data;
        }

        return data;
      },
      VerificationTel(tel) { //验证手机号格式
        var finalTel = tel.replace(/\s+/g, ""); //去除手机的空格
        var telTest = /^1[3456789]\d{9}$/; //11位的手机号
        var data = {
          'flag': 1,
          'finalTel': tel,
          "text": "验证通过"
        }
        if (!finalTel) {
          data.flag = -1;
          data.text = "手机号不能为空！";
          return data;
        }

        if (!telTest.test(finalTel)) {
          data.flag = -1;
          data.text = "手机号格式不正确！";
          return data;
        }
        return data;

      },
      testingUsername(username) { //验证用户名 是否重名
        var that = this;
        return new Promise(function (resolve, reject) {
          that.axios.get(`/user/testingUsername?username=${username}`)
            .then(response => {
              if (response.data.code == 1) {
                if (response.data.data.length) {
                  resolve(false);
                } else {
                  resolve(true);
                }
              } else {
                Toast({
                  message: response.data.Msg,
                  icon: "close",
                  duration: 1000
                });
              }

            })
            .catch(function (error) {
              console.log(error);
            });
        })
      }
    },
    created: function () {
      if (localStorage.getItem("loginInfo")) {
        let loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
        this.Lusername = loginInfo.username;
        this.Lpasswd = loginInfo.password;
        this.checked = true;
      }
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

  .userLogin .van-field__control {
    padding-left: 0;
    width: 5rem;
  }

  .userLogin .kuang {
    width: 90%;
    height: auto;
    margin: 3rem auto;
    font-size: 1.4rem;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid rgb(235, 231, 231);
    box-shadow: 0px 0px 3px rgb(221, 219, 219);
    border-radius: 0.5rem;
  }

  .loginBox {
    margin: 0 auto;
    width: 90%;
    padding: 1rem 0;
  }

  .loginBox .loginName,
  .loginBox .loginPasswd {
    margin-bottom: 1rem;
  }

  .loginBox .loginName .up,
  .loginBox .loginPasswd .up,
  .loginBox .tel .up {
    width: 95%;
    margin: 0 auto;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }


  .loginBox .loginInput1,
  .loginBox .loginInput2,
  .loginBox .loginInput3 {
    border: 1px solid #eee;
    border-radius: 0.5rem;
    height: 2.5rem;
    width: 75%;
    margin-left: 0.5rem;
    padding: 0 0.5rem;
  }

  .loginBox p {
    font-size: 1.0rem;
    display: inline-block;
    text-align: left;
    width: 90%;
    color: rgb(161, 161, 161);
  }

  .thisbutton {
    width: 60%;
    margin: 1rem auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .thisbutton>.butn {
    width: 6rem;
    height: 3rem;
    border-radius: 0.4rem;
    font-size: 1.3rem;
    background-color: #fff;
    border: 1px solid rgb(240, 240, 240);
    box-shadow: 0px 0px 5px rgb(187, 185, 185);
  }

  .thisbutton>.Lbutn {
    width: 6rem;
    height: 3rem;
    border-radius: 0.4rem;
    font-size: 1.3rem;
    background-color: #fff;
    border: 1px solid rgb(246, 245, 245);
    box-shadow: 0px 0px 5px rgb(235, 234, 234);
  }

  .rememberBox {
    padding: 0rem 2rem;
    box-sizing: border-box;
  }
</style>