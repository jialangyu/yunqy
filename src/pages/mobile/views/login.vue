<template>
    <div class="log-show">
      <div class="log-body">
        <p class="log-tit">e缴费管理系统</p>
        <group class="log-form">
          <div class="log-item">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <x-input title="账" type="text" v-model="loginForm.username" placeholder="请输入您的账号" required></x-input>
          </div>
          <div class="log-item">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <x-input title="密" :type="pwdType" @keyup.enter.native="handleLogin" :min="5" v-model="loginForm.password" placeholder="请输入您的登录密码" required></x-input>
            <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
          </div>
        </group>
        <div class="log-btn">
          <x-button type="primary" :disabled="sureDisable()" :show-loading="loading" @click.native.prevent="handleLogin">登录</x-button>
          <div class="tips">
            <span>没有账号？ <router-link class="links" to="/register">立即注册</router-link></span>
          </div>
        </div>
      </div>
      <footer-bar></footer-bar>
    </div>
</template>
<script>
import { XInput, Cell } from 'vux'
import { FooterBar } from '@/pages/index/views/layout/components'

export default {
  components: {
    XInput,
    Cell,
    FooterBar
  },
  data () {
    return {
      falg: false,
      loginForm: {
        username: '',
        password: ''
      },
      loading: false,
      pwdType: 'password'
    }
  },
  // computed: {
  //   sureDisable() {
  //     return !this.checkIsPass() || false
  //   }
  // },
  created() {
    this.sureDisable()
  },
  methods: {
    sureDisable() {
      return !this.checkIsPass() || false
    },
    checkIsPass() {
      if (this.loginForm.username
        && this.loginForm.password) {
          return true
      }
      return false
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      if (this.checkIsPass()) {
        this.loading = true
        this.$store.dispatch('Login', this.loginForm).then((response) => {
          this.$router.push({ path: '/' })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>
<style lang="scss">
.log-show{
  height: 100%;
  display: flex;
  flex-direction: column;
  background: -webkit-linear-gradient(bottom right,#ae56e1,  #6e84f1,#6ef1ab);
  .log-body{
    margin: 8em 0;
    .log-tit{
      color: #ffffff;
      text-align: center;
      font-size: 2.2em;
      line-height: 3em;
    }
    .log-form{
      margin: 2em;
      .weui-cells{
        background: none;
        &::before, &::after{
          content: none;
        }
      }
      .log-item{
        position: relative;
        margin: 1em 0;
        border-radius: 40px;
        overflow: hidden;
        background: rgba(256,256,256,.4);
        color: #ffffff;
        line-height: 2.4;
        font-size: 1.1em;
        .weui-label{
          color: transparent;
        }
        input.weui-input:-webkit-autofill {
          box-shadow: 0 0 0px 1000px rgba(256,256,256,.1) inset !important;
          -webkit-text-fill-color: #666 !important;
        }
        .weui-icon-clear{
          color: #ffffff;
        }
        .svg-container{
          position: absolute;
          left: 1em;
          top: 50%;
          transform: translateY(-50%)
        }
        .show-pwd{
          position: absolute;
          right: 2em;
          top: 50%;
          transform: translateY(-50%)
        }
      }
    }
    .log-btn{
      margin: 0.5em 2em;
      .weui-btn_primary{
        background: rgba(256,256,256,1);
        border-radius: 40px;
        line-height: 3.2;
        font-size: 1.5em;
        color: #6e84f1;
      }
      .weui-btn_disabled {
        color: rgba(110, 132, 241, 0.6);
      }
    }
  }
  .footer-wrapper{
    bottom: 0.5em;
  }
  .tips {
    font-size: 1.5em;
    color: #ccc;
    text-align: right;
    line-height: 3.2;
    .links{
      color:#fff;
      &:hover{
        text-decoration: underline;
      }
    }
  }
}
</style>