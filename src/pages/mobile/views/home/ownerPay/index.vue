<template>
  <div>
    <box gap="10px 0">
      <button-tab v-model="curTab">
        <button-tab-item>账单明细</button-tab-item>
        <button-tab-item>统计</button-tab-item>
      </button-tab>
    </box>
    <v-scroll v-if="curTab===0" :onLoadMore="onLoadMore" :dataList="scrollData" :topVal="'140'">
      <div v-if="pojo && pojo.length">
        <div v-for="item in pojo" :key="item.index">
          <form-preview
            header-label="缴费金额"
            :header-value="'￥'+item.paycount"
            :body-items="[
              {
                label: '缴费类型',
                value: item.typename
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
    <template v-if="curTab===1">
      <div class="chart-wrapper">
        <group>
          <popup-picker :title="`年度总消费 ${sumCount} 元`" :data="[yearsOptions]" v-model="selectedYear" show-name
            @on-change="changedYear" placeholder="请选择"></popup-picker>
        </group>
        <group>
          <cell title="按月份统计"></cell>
          <bar-chart :barData="barDataOwner" v-if="barDataOwner && sumCount" height="260px" :channel="true"></bar-chart>
          <div v-else class="nodata">本年度无消费，暂无统计信息……</div>
        </group>
        <group>
          <cell title="按分类统计"></cell>
          <pie-chart :pieData="pieDataOwner" v-if="pieDataOwner && sumCount" height="400px" :channel="true"></pie-chart>
          <div v-else class="nodata">本年度无消费，暂无统计信息……</div>
        </group>
      </div>
    </template>
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
          tit: [],
          sData: []
      },
      barDataOwner: {
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
    this.getSumCountTypeOwner()
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
        pageIndex: this.page,
        pageSize: this.size
      }).then( response => {
        if(response.flag && response.data) {
          if (response.data.total === 0) {
            this.pojo = []
          }
          const oj = response.data.rows
          if(oj.length > 0) {
            this.$nextTick(() => {
              this.pojo = (response.data.total / this.size > 1) ? this.pojo.concat(oj) : oj
            })
            if (oj.length < this.size) {
              this.scrollData.noFlag = true
            }
          }
        } else {
          this.pojo = []
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
              this.getSumCountOwner()
              this.getSumCountTypeOwner()
              this.search();
              this.getOwnerAllCosts()
            }
          })
        }
      })
    },
    changedYear(val) {
        this.getSumCountOwner()
        this.getSumCountTypeOwner()
        this.getOwnerAllCosts()
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
    getSumCountTypeOwner() {
        const year = this.selectedYear[0]
        paymoneyApi.findListTypeTotalCountByYearOwner(this.UID, year).then(response => {
            if (response.flag && response.data) {
                let types = []
                let totalPays = []
                response.data.map(item => {
                    types.push(item.typename)
                    totalPays.push({
                        value: item.totalpay || 0,
                        name: item.typename
                    })
                })
                this.pieDataOwner.tit = types
                this.pieDataOwner.sData = totalPays
            }
        })
    },
    getOwnerAllCosts() {
        // var titArr = []
        // var arrObjOwner = []
        const year = this.selectedYear[0]
        paymoneyApi.findSumCountAllCostOwner(this.UID, year).then( response => {
            if (response.flag && response.data) {
                this.sumCount = response.data
            } else {
                this.sumCount = 0
            }
        })
        // var typeList = this.typeList
        // for (let i = 0; i < typeList.length; ++i) {
        //     let typeResultOwner = await paymoneyApi.findSumCountByTypeOwner(this.UID, typeList[i].id)
        //     if (typeResultOwner.flag && typeResultOwner.data) {
        //         titArr.push(typeList[i].typename)
        //         let curO = {
        //             value: typeResultOwner.data || 0,
        //             name: typeList[i].typename
        //         }
        //         arrObjOwner.push(curO)
        //     }
        // }
        // this.$nextTick(() => {
        //   this.pieDataOwner.tit = titArr
        //   this.pieDataOwner.sData = arrObjOwner
        // })
    }
  }
};
</script>
