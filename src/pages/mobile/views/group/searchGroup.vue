<template>
  <div class="main-con">
    <div class="search-bar">
      <i class="weui-icon-search search-icon"></i>
      <input
        v-model="searchGroupGid"
        ref="input"
        class="form-control"
        autocomplete="off"
        placeholder="搜索群组号"
        @keydown.enter="queryGroupByGid"
        @focus="isFocus=true"
        @blur="isFocus=false"
      />
      <a class="search-clear" @click="clear" v-if="isFocus">取消</a>
    </div>
    <div class="search-results">
      <div v-if="groupResults && groupResults.length">
        <group v-for="item in groupResults" :key="item.index">
          <cell title="群组号" :value="item.gid" class="big-font"></cell>
          <cell title="群组名称" :value="item.groupname" class="big-font"></cell>
          <cell title="创建人" :value="item.createuname"></cell>
          <cell title="备注" :value="item.remark"></cell>
          <cell title="创建时间" :value="item.createtime"></cell>
          <flexbox class="group-btn">
            <template v-if="UID===item.createuserid">
              <flexbox-item><x-button plain type="warn" @click.native="deleteById(item.id)">删除</x-button></flexbox-item>
              <flexbox-item><x-button plain type="primary" @click.native="$router.push({name:'editGroup', query: { id:item.id } })">修改</x-button></flexbox-item>
            </template>
            <template v-else>
              <flexbox-item v-if="ifBeyondGroup(item)"><x-button plain type="warn" @click="outById(UID,item.id)">退群</x-button></flexbox-item>
              <flexbox-item><x-button plain type="primary" @click.native="joinGroup(item.id)" :disabled="ifBeyondGroup(item)">{{ifBeyondGroup(item)?'已加入':'加群'}}</x-button></flexbox-item>
            </template>
            <template v-if="UID===item.createuserid || ifBeyondGroup(item)">
              <flexbox-item><x-button plain type="primary" @click.native="showGroupMemners(item)">查看成员</x-button></flexbox-item>
            </template>
          </flexbox>
        </group>
      </div>
      <div v-else class="nodata">暂无符合条件的群组</div>
    </div>
  </div>
</template>


<script>
import { Flexbox, FlexboxItem } from "vux";
import groupApi from "@/api/group";
import { strToArr, arrToStr } from "@/utils";
export default {
  components: {
    Flexbox,
    FlexboxItem
  },
  data() {
    return {
      searchGroupGid: '',
      groupResults: [],
      isFocus: false
    }
  },
  computed: {
    name() {
      return this.$store.getters.name;
    },
    UID() {
      return this.$store.getters.userid;
    }
  },
  methods: {
    // 根据群组号查找群组
    queryGroupByGid() {
      groupApi.searchGroupByGid(this.searchGroupGid).then(response => {
        if (response.flag && response.data) {
          this.groupResults = response.data
        } else {
          this.groupResults = []
        }
      })
    },
    clear() {
      this.searchGroupGid = ''
      this.isFocus = true
      this.groupResults = []
    },
    deleteById(id) {
      this.$vux.confirm.show({
        title: '提示',
        content: '确定要删除吗?',
        onConfirm : () => {
          groupApi.deleteById(id).then(response => {
            messageFun(response)
            if (response.flag) {
              this.search();
            }
          })
        }
      })
    },
    joinGroup(id) {
      const _this = this
      this.$vux.confirm.prompt('请输入群组密钥',{
        title: '提示',
        onConfirm: (value) => {
          groupApi.joinGroup({
            userid: this.UID,
            groupid: id,
            grouppwd: value
          }).then(response => {
            messageFun(response)
            if (response.flag) {
              this.search();
            }
          })
        }
      })
    },
    outById(id, gid) {
      this.$vux.confirm.show({
        title: '提示',
        content: '确定退群?',
        onConfirm : () => {
          groupApi.outGroup(id, gid).then(response => {
            messageFun(response)
            if (response.flag) {
              this.search();
            }
          })
        }
      })
    },
    ifBeyondGroup(row) {
      if (row.groupmembersid) {
        const uarr = strToArr(row.groupmembersid);
        return uarr.indexOf(this.UID) > -1 || false;
      }
    }
  }
}
</script>
<style scoped>
.search-bar {
  display: flex;
  margin-top: 6px;
  justify-content: space-between;
  position: relative;
  background: #eee;
  color: #666;
  overflow: hidden;
  padding: 6px 10px;
}
.search-bar input.form-control {
  border: none;
  background: #ffffff;
  vertical-align: middle;
  text-align: left;
  padding-left: 32px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  font-size: 12px;
}
.search-bar input.form-control:focus {
  outline: none;
  box-shadow: none;
  border: none;
}
.search-icon{
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}
.search-clear{
  display: block;
  width: 40px;
  text-align: center;
  padding: 12px 10px;
  font-size: 14px;
  color: #09BB07;
}

</style>
