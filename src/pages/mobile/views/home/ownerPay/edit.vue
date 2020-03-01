<template>
  <box class="main-con">
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
      <datetime title="缴费日期" v-model="pojo.paytime" placeholder="请选择缴费日期"></datetime>
      <x-input title="缴费金额" v-model="pojo.paycount" placeholder="请输入缴费金额" text-align="right" required></x-input>
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
import paymoneyApi from "@/api/paymoney";
import { arrToStr, strToArr } from '@/utils'
import { messageFun } from '@/utils/msg'
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
      payid: '',
      pojo: {
        typeid: [],
        paytime: '',
        paycount: '',
        remark: '',
        typeListArr: []
      }
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
    if (this.$route.query.id) {
      this.payid = this.$route.query.id
      this.findById()
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
      this.pojo.typeid = arrToStr(this.pojo.typeid)
      this.pojo.userid = this.UID
      paymoneyApi.saveOrUpdateOwner(this.payid,this.pojo).then( response => {
        messageFun(response)
        if (response.flag) {
          this.$router.back(-1)
        }
      });
    },
    findById() {
      paymoneyApi.findByIdOwner(this.payid).then(response => {
        if (response.flag && response.data) {
          response.data.typeid = strToArr(response.data.typeid)
          this.$nextTick(() => {
            this.pojo = response.data
          })
        }
      })
    }
  }
};
</script>
<style scoped>
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
