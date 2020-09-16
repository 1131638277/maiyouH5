<template>
<div class="foot">
  <van-tabbar route>
    <van-tabbar-item replace to="/" icon="home-o">友说</van-tabbar-item>
    <van-tabbar-item replace to="/nearby" icon="friends-o">附近</van-tabbar-item>
    <van-tabbar-item replace to="/shopping" icon="shopping-cart-o">商城</van-tabbar-item>
    <van-tabbar-item replace to="/message" icon="chat-o" info="">友聊</van-tabbar-item>
    <van-tabbar-item replace to="/about" icon="user-o">个人主页</van-tabbar-item>
  </van-tabbar>
</div>
</template>
<script>
export default {};
</script>

<style scoped>
.foot>>>.van-tabbar--fixed{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
}

</style>
