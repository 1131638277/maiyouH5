<template>
  <div>
    
    <div>
      <van-nav-bar
        title="新建专辑"
        left-text="返回"
        right-text="确定"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      />
    </div>

    <div>
      <van-cell-group>
        <van-field label="标题" placeholder="为你的专辑添加一个标题" />
        <van-cell-group>
          <van-field
            v-model="message"
            rows="1"
            autosize
            label="简介"
            type="textarea"
            placeholder="简单介绍一下你的简介吧"
            maxlength="50"
          />
        </van-cell-group>
      </van-cell-group>
    </div>

    <div class="choose">
      <div>仅自己可见</div>
      <van-switch v-model="checked" size="1rem" />
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: true
    };
  },
  methods: {
    onClickLeft() {
      window.location.href = "http://localhost:8080/about";
    },
    onClickRight() {
      window.location.href = "http://localhost:8080/about";
    }
  }
};
</script>
<style  scoped>
.choose {
  display: flex;
  justify-content: space-around;
}
</style>