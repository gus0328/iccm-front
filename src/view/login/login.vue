<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form ref="loginForm" @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import LoginForm from '_c/login-form'
  import {
    mapActions
  } from 'vuex'
  export default {
    components: {
      LoginForm
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      handleSubmit({
        username,
        password,
        validateCode
      }) {
        this.handleLogin({
          username,
          password,
          validateCode
        }).then(res => {
          this.$refs.loginForm.queryEnd();
          this.getUserInfo().then(res => {
            this.$router.push({
              name: this.$config.homeName
            })
          })
        }, (reason, data) => {
          this.$refs.loginForm.queryEnd();
          this.$refs.loginForm.changeVaildCode();
        })
      }
    }
  }
</script>

<style>

</style>
