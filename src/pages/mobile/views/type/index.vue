<template>
  <div class="main-con">
    <v-scroll :onLoadMore="onLoadMore" :dataList="scrollData" :topVal="'46'">
      <group-title v-if="roles.indexOf('1')>-1">试试向左滑动，可以编辑该类型</group-title>
      <div class="vux-1px-t">
        <swipeout class="vux-1px-tb">
          <swipeout-item v-for="item in list" :key="item.index" :disabled="roles.indexOf('0')>-1">
            <div slot="right-menu">
              <swipeout-button @click.native="$router.push({name:'editType', query: { id:item.id } })" background-color="#09BB07">编辑</swipeout-button>
              <swipeout-button @click.native="deleteById(item.id)" background-color="#D23934">删除</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-tb">
              <cell :title="item.typename" :value="item.createtime" :inline-desc="item.remark"></cell>
            </div>
          </swipeout-item>
        </swipeout>
      </div>
    </v-scroll>
    <div class="add-group" @click="$router.push({name:'editType'})">
      <svg-icon icon-class="add" />
    </div>
  </div>
</template>

<script>
import { GroupTitle, Swipeout, SwipeoutItem, SwipeoutButton, Badge } from 'vux'
import typeApi from "@/api/type"
import VScroll from "@/components/ScrollMore";
import { messageFun } from '@/utils/msg'
export default {
  data() {
    return {
      scrollData:{
        noFlag: false,
        loading: false
      },
      page: 1,
      size: 20,
      list: []
    }
  },
  components: {
    GroupTitle,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Badge,
    VScroll
  },
  computed: {
    roles(){
      return this.$store.getters.roles
    }
  },
  created() {
    this.search()
  },
  methods: {
     onLoadMore(done) {
      var that = this
      if (!that.scrollData.noFlag) {
        setTimeout(() => {
          that.page++;
          that.search()
          done();
        }, 10);
      }
    },
    search() {
      this.$vux.loading.show()
      typeApi.search(this.page,this.size).then( response => {
        setTimeout(() => {
          this.$vux.loading.hide()
        }, 1000)
        if (response.flag && response.data) {
          var arr = []
          const obj = response.data.rows
          if (obj.length > 0) {
            for (let i = 0; i < obj.length; ++i) {
              arr.push(obj[i])
            }
            this.$nextTick(() => {
              this.list = this.list.concat(arr)
            })
            if (obj.length < this.size) {
              this.scrollData.noFlag = true
            }
          }
        }
        this.scrollData.loading = false
      })
    },
    deleteById(id) {
      this.$vux.confirm.show({
        title: '提示',
        content: '确定要删除吗?',
        onConfirm : () => {
          typeApi.deleteById(id).then(response => {
            messageFun(response)
            if (response.flag) {
              this.search();
              this.$store.dispatch('getDictType')
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.lyout-show{
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
}
</style>
