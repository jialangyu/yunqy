<template>
  <box class="main-con">
    <group>
      <x-input title="缴费人" :value="UName" text-align="right" readonly></x-input>
    </group>
    <group>
      <group-title><span class="geoup-title">缴费类型</span> (点击下列类别选择所属分类)</group-title>
      <cell-box>
        <checker
          v-if="typeListArr.length>0"
          v-model="pojo.typeid"
          type="radio" :radio-required="true"
          default-item-class="demo4-item"
          selected-item-class="demo4-item-selected"
          disabled-item-class="demo4-item-disabled">
            <checker-item v-for="item in typeListArr" :key="item.value"
              :value="item.value"> {{ item.name }} </checker-item>
          </checker>
        </cell-box>
    </group>
    <group>
      <!-- <popup-picker title="缴费类型" show-name :data="typeListArr?[typeListArr]:[]" v-model="pojo.typeid" placeholder="请选择缴费类型" required></popup-picker> -->
      <datetime title="缴费日期" v-model="pojo.paytime" placeholder="请选择缴费日期"></datetime>
      <x-input title="缴费金额" v-model="pojo.paycount" placeholder="请输入缴费金额" text-align="right" required @on-change="changePtAllCostFun"></x-input>
    </group>
    <group>
      <group-title><span class="geoup-title">平摊人</span> (点击下列组员平摊费用)</group-title>
      <cell-box>
        <checker
        v-model="ptUserArr"
        type="checkbox"
        default-item-class="demo4-item"
        selected-item-class="demo4-item-selected"
        disabled-item-class="demo4-item-disabled" @on-change="changePtUserFun">
          <checker-item v-for="item in userListGroup" :key="item.index"
            :value="item.key"
            :disabled="UID===item.key"> {{ item.value }} </checker-item>
        </checker>
      </cell-box>
    </group>
    <group>
      <x-input title="平摊金额" v-model="pojo.sharemoney" placeholder="0.00" text-align="right" readonly></x-input>
    </group>
    <group>
      <x-input title="备注" v-model="pojo.remark" placeholder="请输入备注信息" text-align="right"></x-input>
    </group>

    <box gap="60px 0">
      <x-button plain :disabled="sureDisable" @click.native="onSubmit">保存</x-button>
    </box>
  </box>
</template>

<script>
import { PopupPicker, Datetime, Checker, CheckerItem, GroupTitle, CellBox } from "vux";
import paymoneyApi from "@/api/paymoney"
import groupApi from "@/api/group"
import { messageFun } from '@/utils/msg'
import { arrToStr, strToArr } from '@/utils'
export default {
  components: {
    PopupPicker,
    Datetime,
    Checker,
    CheckerItem,
    GroupTitle,
    CellBox
  },
  data() {
    return {
      groupid: '',
      payid: '',
      pojo: {},
      userListGroup: [],
      ptUserArr: [],
      typeListArr: []
    };
  },
  computed: {
    UID() {
      return this.$store.getters.userid;
    },
    UName() {
      return this.$store.getters.name;
    },
    sureDisable() {
      return !this.checkIsRequired() || false;
    }
  },
  created() {
    this.typeListArr = this.typeList()
    if(this.$route.query.gid) {
      this.groupid = this.$route.query.gid
      this.findAllUserById()
      if (this.$route.query.id) {
        this.payid = this.$route.query.id
        this.findById()
      }
    }
  },
  methods: {
    typeList() {
      let arr = []
      const oj = this.$store.getters.typeArrs
      if (oj.length) {
        for(let i = 0; i < oj.length; ++i) {
          arr.push({
            value: oj[i].id,
            name: oj[i].typename
          })
        }
      }
      return arr
    },
    checkIsRequired() {
      if (this.pojo.typeid && this.pojo.paycount) {
        return true;
      }
      return false;
    },
    onSubmit() {
      this.pojo.payuserid = this.UID
      this.pojo.typeid = arrToStr(this.pojo.typeid)
      this.pojo.groupid = this.groupid
      this.pojo.shareuserid = arrToStr(this.ptUserArr)
      paymoneyApi.saveOrUpdate(this.payid,this.pojo).then( response => {
        messageFun(response)
        if (response.flag) {
          this.$router.back(-1)
        }
      });
    },
    findById() {
      paymoneyApi.findById(this.payid).then(response => {
        response.data.typeid = strToArr(response.data.typeid)
        response.data.payuserid = strToArr(response.data.payuserid)
        this.$nextTick(() => {
          this.pojo = response.data
        })
      })
    },
    findAllUserById() {
      groupApi.findAllUserById(this.groupid).then(response => {
        var userArr = []
        if (response.flag && response.data) {
          response.data.map(item => {
            userArr.push({
              key: item.id,
              value: item.username
            })
          })
          this.ptUserArr.push(this.UID)
          this.userListGroup = userArr
        }
      })
    },
    changePtAllCostFun(val) {
        this.countPtpay()
    },
    changePtUserFun(val) {
        this.countPtpay()
    },
    countPtpay() {
      this.pojo.sharemoney = this.pojo.paycount
      if (this.ptUserArr.length > 1 && this.pojo.paycount) {
        this.pojo.sharemoney = Number(this.pojo.paycount) / this.ptUserArr.length
      }
      this.$forceUpdate()
    }
  }
};
</script>

<style lang="scss">
.demo4-item {
  background-color: #eee;
  color: #222;
  font-size: 14px;
  padding: 5px 10px;
  margin:5px;
  line-height: 18px;
  border-radius: 15px;
}
.demo4-item-selected {
  background-color: rgba(0, 209, 146, 1);
  color: #fff;
}
.demo4-item-disabled {
  background-color: rgba(0, 209, 146, 0.7);
  color: rgba(256,256,256,.8);
}
.geoup-title{
  font-size: 17px;
  color: #666666;
}
</style>
