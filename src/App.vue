<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
export default {
  name: 'App',
  beforeCreate() {
   
  }
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
