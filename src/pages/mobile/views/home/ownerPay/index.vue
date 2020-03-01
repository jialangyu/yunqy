<template>
  <div>
    <box gap="10px 0">
      <button-tab v-model="curTab">
        <button-tab-item>统计</button-tab-item>
        <button-tab-item>记录</button-tab-item>
      </button-tab>
    </box>
    <template v-if="curTab===0">
      <div class="chart-wrapper" v-if ="sumCount">
        <group>
          <popup-picker title="按月份统计" :data="[yearsOptions]" v-model="selectedYear" show-name
            @on-change="changedYear" placeholder="请选择"></popup-picker>
          <bar-chart :barData="barDataOwner" height="260px" :channel="true"></bar-chart>
        </group>
        <group>
          <cell title="按分类统计"></cell>
          <pie-chart :pieData="pieDataOwner" height="400px" :channel="true"></pie-chart>
        </group>
      </div>
      <div v-else class="nodata">
        暂无缴费记录
      </div>
    </template>
    <v-scroll v-if="curTab===1" :onLoadMore="onLoadMore" :dataList="scrollData" :topVal="'140'">
      <div v-if="pojo && pojo.length">
        <div v-for="item in pojo" :key="item.index">
          <form-preview
            header-label="缴费金额"
            :header-value="'￥'+item.paycount"
            :body-items="[
              {
                label: '缴费类型',
                value: item.typeName || item.typeid
              },
              {
                label: '缴费日期',
                value: item.paytime
              },
              {
                label: '备注',
                value: item.remark
              }
            ]"
            :footer-buttons="[
              {
                style: 'default',
                text: '删除',
                onButtonClick: () => {
                  deleteById(item.id)
                }
              },
              {
                style: 'primary',
                text: '修改',
                onButtonClick: () => {
                  $router.push({name:'editOwnerPay',query:{id:item.id}})
                }
              }
            ]">
            </form-preview>
            <br/>
        </div>
      </div>
      <div v-else class="nodata">
        暂无缴费记录
      </div>
    </v-scroll>
    <div class="add-group" @click="$router.push({name:'editOwnerPay'})">
      <svg-icon icon-class="add" />
    </div>
  </div>
</template>

<script>
import queryBase from '@/utils/queryBase'
import { FormPreview, ButtonTab, ButtonTabItem, PopupPicker } from "vux";
import paymoneyApi from "@/api/paymoney";
import { messageFun } from "@/utils/msg";
import VScroll from "@/components/ScrollMore";
import PieChart from '@/components/ECharts/PieChart'
import BarChart from '@/components/ECharts/BarChart'
export default {
  components: {
    FormPreview,
    ButtonTab,
    ButtonTabItem,
    PopupPicker,
    VScroll,
    PieChart,
    BarChart
  },
  data() {
    return {
      curTab: 0,
      scrollData:{
        noFlag: false,
        loading: false
      },
      pojo: [],
      searchTypeid: '',
      rangeTime: '',
      startTime: '',
      endTime: '',
      page: 1,
      size: 10,
      pieDataOwner: {
          topic: '个人缴费',
          sum: 0,
          tit: [],
          sData: []
      },
      barDataOwner: {
          topic: '年度总消费统计',
          xData: [],
          yData: []
      },
      sumCount:0,
      selectedYear: [],
      yearsOptions: []
    };
  },
  computed: {
    typeList() {
      return this.$store.getters.typeArrs
    },
    UID() {
      return this.$store.getters.userid;
    }
  },
  created() {
    this.selectedYear.push((new Date().getFullYear()).toString())
    this.setYearsOptions()
    this.getSumCountOwner()
    this.search();
    this.getOwnerAllCosts()
  },
  methods: {
    setYearsOptions() {
      let years = []
      const curYear = Number(this.selectedYear[0])
      for (let i = curYear; i >= 1990; i--) {
        years.push({
          name: i + '年',
          value: i + ''
        })
      }
      this.yearsOptions = years
    },
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
      paymoneyApi.searchOwner({
        userid: this.UID,
        typeid: this.searchTypeid,
        startTime: this.startTime,
        endTime: this.endTime,
        page: this.page,
        size: this.size
      }).then( response => {
        if(response.flag && response.data) {
          const oj = response.data.rows
          if(oj.length > 0) {
            for (let i = 0; i < oj.length; ++i) {
            if (oj[i].typeid) {
              queryBase.getType(oj[i].typeid, function(sc, value) {
                if (sc) {
                  oj[i].typeName = value.typename
                }
              })
            }
          }
            this.$nextTick(() => {
              this.pojo = this.pojo.concat(oj)
            })
            if (oj.length < this.size) {
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
          paymoneyApi.deleteByIdOwner(id).then(response => {
            messageFun(response)
            if (response.flag) {
              this.search();
            }
          })
        }
      })
    },
    changedYear(val) {
        this.getSumCountOwner()
    },
    getSumCountOwner() {
        const year = this.selectedYear[0]
        paymoneyApi.findSumByYearOwner(this.UID, year).then(response => {
            if (response.flag && response.data) {
                this.barDataOwner.xData = Object.keys(response.data)
                this.barDataOwner.yData = Object.values(response.data)
            } 
        })
    },
    async getOwnerAllCosts() {
        var titArr = []
        var arrObjOwner = []
        paymoneyApi.findSumCountOwner(this.UID).then( response => {
            if (response.flag && response.data) {
                this.pieDataOwner.sum = response.data
                this.sumCount = response.data
            }
        })
        var typeList = this.typeList
        for (let i = 0; i < typeList.length; ++i) {
            let typeResultOwner = await paymoneyApi.findSumCountByTypeOwner(this.UID, typeList[i].id)
            if (typeResultOwner.flag && typeResultOwner.data) {
                titArr.push(typeList[i].typename)
                let curO = {
                    value: typeResultOwner.data || 0,
                    name: typeList[i].typename
                }
                arrObjOwner.push(curO)
            }
        }
        this.$nextTick(() => {
          this.pieDataOwner.tit = titArr
          this.pieDataOwner.sData = arrObjOwner
        })
    }
  }
};
</script>
