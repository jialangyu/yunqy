<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '320px'
    },
    pieData: {
      type: Object
    },
    channel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    pieData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setOptions(pieData) {
      var setSeries = []
      if (this.channel) {
        setSeries = [{
          name: '消费金额',
          type: 'pie',
          radius: [15, 95],
          center: ['50%', '46%'],
          data: pieData.sData
        }]
      } else {
        setSeries = [{
          name: '消费金额',
          type: 'pie',
          roseType: 'radius',
          radius: [15, 95],
          center: ['50%', '46%'],
          data: pieData.sData,
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{b} ￥{c} ({d}%)'
              }
            }
          }
        }]
      }
      this.chart.setOption({
        title: {
          // text: pieData.topic + '：￥' + pieData.sum,
          // subtext: pieData.subTopic ? pieData.subTopic : '',
          textStyle: {
            color: '#333',
            fontSize: 14
          },
          right: 10,
          top: 10
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : ￥{c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: pieData.tit
        },
        series: setSeries
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      // if (this.chart) {
      //   this.chart.showLoading({
      //       text: 'loading',
      //       color: '#4cbbff',
      //       textColor: '#4cbbff',
      //       maskColor: 'rgba(255, 255, 255, 0.8)'
      //   })
      // }
      this.setOptions(this.pieData)
      // if (this.chart) {
      //   setTimeout(() =>{
      //     this.chart.hideLoading()
      //   }, 1000)
      // }
    }
  }
}
</script>
