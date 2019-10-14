<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="username">
      <Input v-model="form.username" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="validateCode">
      <Input type="text" style="width:60%;float:left" v-model="form.validateCode" placeholder="请输入验证码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
      <div id="validCodeIMG" style="width:35%;float:right">
        <img :src="validImg" @click="changeVaildCode" style="width:100%;cursor:pointer;"/>
      </div>
      <Checkbox v-model="form.rememberMe">&nbsp;&nbsp;&nbsp;&nbsp;记住我</Checkbox>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" :loading="submitLoading" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export default {
  name: 'LoginForm',
  props: {
    usernameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    validCodeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    },
    rememberMeRules:{
      type:Boolean
    }
  },
  data () {
    return {
      form: {
        username: '10289781',
        password: 'admin123',
        validateCode:"",
        rememberMe:false
      },
      submitLoading:false,
      validImg:baseUrl+"/captcha/captchaImage?type=math"
    }
  },
  computed: {
    rules () {
      return {
        username: this.usernameRules,
        password: this.passwordRules,
        validateCode:this.validCodeRules,
        rememberMe:this.rememberMeRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          this.$emit('on-success-valid', {
            username: this.form.username,
            password: this.form.password,
            validateCode:this.form.validateCode
          })
        }
      })
    },
    queryEnd(){
      this.submitLoading = false;
    },
    changeVaildCode(){
      this.validImg = baseUrl+"/captcha/captchaImage?type=math&s="+Math.random();
    }
  }
}
</script>
