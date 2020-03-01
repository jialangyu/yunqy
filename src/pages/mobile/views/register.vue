<template>
    <div class="log-show">
      <div class="log-body">
        <p class="log-tit">注 册</p>
        <group class="log-form">
          <div class="log-item">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <x-input title="账" type="text" v-model="regForm.username" placeholder="请输入您的账号" required></x-input>
          </div>
          <div class="log-item">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <x-input title="密" :type="pwdType" :min="5" v-model="regForm.password" placeholder="请输入您的登录密码" required></x-input>
            <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
          </div>
          <div class="log-item">
            <span class="svg-container">
              <svg-icon icon-class="example" />
            </span>
            <x-input title="验" type="text" @keyup.enter.native="handleReg" :min="4" :max="4" v-model="regForm.gVerify" placeholder="请输入验证码" required></x-input>
            <div class="v-code" @click="refreshCode">
              <Identify :identifyCode="identifyCode"></Identify>
            </div>
          </div>
        </group>
        <div class="log-btn">
          <x-button type="primary" :disabled="sureDisable()" :show-loading="loading" @click.native.prevent="handleReg">注册</x-button>
          <div class="tips">
            <span>已有账号，现在 <router-link class="links" to="/login">去登录</router-link></span>
          </div>
        </div>
      </div>
      <footer-bar></footer-bar>
    </div>
</template>
<script>
import { register } from '@/api/login'
import { XInput, Cell } from 'vux'
import { FooterBar } from '@/pages/index/views/layout/components'
import Identify from '@/components/identify'
import { messageFun } from '@/utils/msg'

export default {
  components: {
    XInput,
    Cell,
    FooterBar,
    Identify
  },
  data () {
    return {
      falg: false,
      regForm: {
        username: '',
        password: '',
        gVerify: ''
      },
      identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
      identifyCode: '',
      loading: false,
      pwdType: 'password'
    }
  },
  // computed: {
  //   sureDisable() {
  //     return !this.checkIsPass() || false
  //   }
  // },
  mounted () {
    // 初始化验证码
    this.refreshCode()
  },
  created() {
    this.sureDisable()
  },
  methods: {
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
    sureDisable() {
      return !this.checkIsPass() || false
    },
    checkIsPass() {
      if (this.regForm.username
        && this.regForm.password) {
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
    handleReg() {
      if (this.regForm.gVerify.toLowerCase() !== this.identifyCode.toLowerCase()) {
        this.$vux.toast.show({
          text: '请填写正确验证码',
          type: 'warn'
        })
        this.refreshCode()
        return
      }
      if (this.checkIsPass()) {
        this.loading = true
        register(this.regForm.username, this.regForm.password).then( response => {
            messageFun(response);
            if(response.flag){
              this.loading = false
              this.$store.dispatch('Login', this.regForm).then((response) => {
                this.$router.push({ path: '/' })
                this.$store.dispatch('getDictuList')
                this.loading = false
              })
            }
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
        .v-code {
          position: absolute;
          right: 2em;
          top: 50%;
          transform: translateY(-50%);
          width: 90px;
          height: 40px;
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