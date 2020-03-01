<template>
  <div class="lyout-show">
    <view-box ref="viewBox">
      <x-header slot="header" :left-options="{backText: ''}" class="lay-header">{{$route.meta.title}}
        <a slot="right" @click="logout" v-if="roles.indexOf('1')>-1">退出登录</a>
      </x-header>
      <router-view></router-view>
      <tabbar slot="bottom">
        <tabbar-item v-for="tab in roles.indexOf('1')>-1?tabListAdmin:tabList" :key="tab.index" :selected="$route.path && $route.meta.active===tab.rname" :link="{name: tab.rname}">
          <svg-icon slot="icon" :icon-class="tab.icon" />
          <span slot="label">{{tab.name}}</span>
        </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
import { ViewBox, XHeader, Tabbar, TabbarItem } from 'vux'
export default {
  name: 'layoutH5',
  data() {
    return {
      levelName: null,
      tabList: [
        {
          name: '群组',
          icon: 'group',
          rname: 'group'
        },
        {
          name: '账单',
          icon: 'example',
          rname: 'home'
        },
        {
          name: '我',
          icon: 'user',
          rname: 'mine'
        }
      ],
      tabListAdmin: [
        {
          name: '用户',
          icon: 'user',
          rname: 'user'
        },
        {
          name: '类型',
          icon: 'form',
          rname: 'type'
        }
      ]
    }
  },
  computed: {
    roles() {
      return this.$store.getters.roles
    }
  },
  watch: {
    $route() {
      this.metaTitle()
    }
  },
  created() {
    this.metaTitle()
  },
  components: {
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem
  },
  methods: {
    metaTitle() {
      const groupName = sessionStorage.getItem('GROUPName')
      let matched = this.$route.matched.filter(item => {
        if (groupName && item.name === 'groupPay') {
          item.meta.title = groupName
        }
        return item.name
      })
      this.levelName = matched
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload()
      })
    }
  }
}
</script>
<style lang="scss">
.lyout-show{
  height:100%;
  .lay-header{
    width:100%;
    position:absolute;
    left:0;
    top:0;
    z-index:100;  
  }
  .weui-tabbar__icon{
    width:auto;
    height: auto;
  }
  .weui-tabbar__label{
    margin: 2px 0;
  }
  .svg-icon{
    font-size: 16px;
  }
  .main-con{
    padding:40px 0 10px;
    .weui-btn_plain-default{
      border: none;
      background: #ffffff;
      border-radius: 0;
    }
    .nodata {
      font-size: 13px;
      text-align: center;
      line-height: 24px;
      margin: 10em 0;
      color: #999;
    }
  }
  .add-group{
    position: fixed;
    bottom: 80px;
    right: 15px;
    z-index: 800;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 1px 1px 10px #6e84f1;
    opacity: .8;
    &:hover{
      opacity: 1;
    }
    .svg-icon{
      font-size: 3em;
      color: #6e84f1;
    }
  }
}

.weui-form-preview{
  font-size: 15px;
}

.chart-wrapper{
  margin: 1em 0;
  // background: #ffffff;
}
.main-con{
  .group-btn{
    border-top: 1px solid #dcdcdc;
    .weui-btn{
      font-size: .9em;
      border-radius: 0;
      border:none;
    }
  }
}
</style>
