<template>
  <div>
    <div>
      <div>
        <van-nav-bar title="买友会员" left-text="返回" left-arrow @click-left="onClickLeft" />
      </div>

      <div>
        <van-card thumb="" price="199.00" desc="按去年用户消费，计算开卡后一年预计可省￥3685" title="友卡" />
      </div>

      <div>
        <van-field readonly clickable label="支付方式" :value="value" placeholder="微信" @click="showPicker = true" />

        <van-popup v-model="showPicker" position="bottom">
          <van-picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
        </van-popup>
      </div>

      <div>
        <van-submit-bar :price="19900" button-text="立即购买" @submit="onSubmit" />

        <div id="img" v-if="flag">
          <van-image width="100" height="100" :src="maimg" />
          <div style="margin:1rem 0rem">
            <van-count-down :time="time">
              <template v-slot="timeData">
                <span class="block">{{ timeData.hours }}</span>
                <span class="colon">:</span>
                <span class="block">{{ timeData.minutes }}</span>
                <span class="colon">:</span>
                <span class="block">{{ timeData.seconds }}</span>
                <span class="text">后消失</span>
              </template>
            </van-count-down>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
  export default {
    data() {
      return {
        flag: false,
        value: "",
        showPicker: false,
        columns: ["微信"],
        time: 60 * 1000,
        maimg: require('@/assets/erweima.png')
      };
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      onConfirm(value) {
        this.value = value;
        this.showPicker = false;
      },
      onSubmit() {
        console.log("出现");
        var that = this;
        this.flag = true;
        setTimeout(function () {
          that.flag = false;
        }, 60000);
      }
    }
  };
</script>
<style scoped>
  #img {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .colon {
    display: inline-block;
    margin: 0 0.4rem;
    color: #ee0a24;
  }

  .block {
    display: inline-block;
    width: 2.2rem;
    color: #fff;
    font-size: 1.2rem;
    text-align: center;
    background-color: #ee0a24;
  }

  .text {
    margin: 0 1rem;
    display: inline-block;
    width: 4rem;
    color: #fff;
    font-size: 1.2rem;
    text-align: center;
    background-color: #ee0a24;
  }
</style>