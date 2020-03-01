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
    barData: {
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
    barData: {
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
    setOptions(barData) {
      this.chart.setOption({
        title: {
          text: barData.topic,
          textStyle: {
            color: '#333',
            fontSize: 14
          },
          right: 10,
          top: 10
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{a} <br/>{b}月 : ￥{c}'
        },
        xAxis: [
          {
            type: 'category',
            data: barData.xData,
            axisLabel: {
              formatter: '{value}月'
            }  
          }
        ],
        grid: {
          left: this.channel ? '15%' : '10%',
          right: this.channel ? '5%' : '5%'
        },
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: '人民币/元'
          }
        ],
        series: [
          {
            name: '消费金额',
            type: 'bar',
            data: barData.yData
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.showLoading({
          text: 'loading',
          color: '#4cbbff',
          textColor: '#4cbbff',
          maskColor: 'rgba(255, 255, 255, 0.8)'
      })
      this.setOptions(this.barData)
      setTimeout(() =>{
        this.chart.hideLoading()
      }, 2000)
    }
  }
}
</script>
