<template>
  <div class="login-container">
    <el-form :model="regForm" :rules="regRules" ref="regForm" class="card-box login-form">
      <h3 class="title">注 册</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="regForm.username" size="small" autoComplete="on" placeholder="请输入您的账号" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" v-model="regForm.password" size="small" autoComplete="on"
          placeholder="请设置您的登录密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item prop="gVerify">
        <span class="svg-container">
          <svg-icon icon-class="user"></svg-icon>
        </span>
        <el-input type="text" v-model="regForm.gVerify" placeholder="请输入验证码"></el-input>
        <div class="v-code" @click="refreshCode">
          <Identify :identifyCode="identifyCode"></Identify>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleReg">
          注册
        </el-button>
      </el-form-item>
      <div class="tips">
        <span>已有账号，现在 <router-link class="links" to="/login">去登录</router-link></span>
      </div>
    </el-form>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
import { register } from '@/api/login'
import { FooterBar } from '@/pages/index/views/layout/components'
import Identify from '@/components/identify'
export default {
  name: 'register',
  components: {
    FooterBar,
    Identify
  },
  data() {
    // TODO 登录注册的展现形式
    // TODO 纯前端实现验证码功能
    return {
      falg: false,
      regForm: {
        username: '',
        password: '',
        gVerify: ''
      },
      regRules: {
        username: [{ required: true, message: '请输入您的账号', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入您的登录密码', trigger: 'blur' },
          { min: 5, message: '密码不少于5位', trigger: 'blur' }
        ],
        gVerify: [{ required: true, message: "请输入验证码", trigger: 'blur' }]
      },
      identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
      identifyCode: '',
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // 重置验证码
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    },
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    handleReg() {
      var that = this
      if (this.regForm.gVerify.toLowerCase() !== this.identifyCode.toLowerCase()) {
        this.$message.error('请填写正确验证码')
        this.refreshCode()
        return
      }
      this.$refs.regForm.validate(valid => {
        if (valid) {
          that.loading = true
          register(that.regForm.username, that.regForm.password).then( response => {
              this.$message({
                  showClose: true,
                  message: response.message,
                  type: response.flag?'success':'error'
              });
              if(response.flag){
                that.loading = false
                that.$store.dispatch('Login', that.regForm).then((response) => {
                  var roles = that.$store.getters.roles
                  that.$store.dispatch('GenerateRoutes', { roles }).then(() => {
                    that.$router.addRoutes(that.$store.getters.addRouters)
                    that.$router.push({ path: '/' })
                  })
                })
              }
          }).catch(() => {
            that.loading = false
          })
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    // 初始化验证码
    this.refreshCode()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    position: fixed;
    height: 100%;
    width:100%;
    background-color: $bg;
    background-color: -webkit-linear-gradient(#ae56e1, #6e84f1);
    input:-webkit-autofill {
      box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .tips {
      font-size: 12px;
      color: #fff;
      margin-bottom: 10px;
      text-align: right;
      .links{
        color:#409eff;
        &:hover{
          text-decoration: underline;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select:none;
    }
    .v-code {
      position: absolute;
      right: 10px;
      top: 7px;
      display: block;
      width: 90px;
      height: 40px;
    }
  }
</style>
