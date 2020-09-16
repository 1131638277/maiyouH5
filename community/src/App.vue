<template>
  <div id="app">
    <div id="nav">
      <router-link to="/"></router-link>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
  html {
    font-size: 62.5%;
  }

  @media only screen and (max-width: 400px) {
    html {
      font-size: 8px !important;
    }
  }

  @media only screen and (min-width: 400px) {
    html {
      font-size: 10px !important;
    }
  }

  @media only screen and (min-width: 450px) {
    html {
      font-size: 12px !important;
    }
  }

  @media only screen and (min-width: 569px) {
    html {
      font-size: 18px !important;
    }
  }

  @media only screen and (min-width: 641px) {
    html {
      font-size: 20px !important;
    }
  }
</style>