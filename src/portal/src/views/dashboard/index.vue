<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <line-chart :chart-data="lineChartData"/>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12"><div class="grid-content bg-purple">&nbsp;</div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">&nbsp;</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="8"><div class="grid-content bg-purple">&nbsp;</div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple-light">&nbsp;</div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple">&nbsp;</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6"><div class="grid-content bg-purple">&nbsp;</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">&nbsp;</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">&nbsp;</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">&nbsp;</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div class="grid-content bg-purple">&nbsp;</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light">&nbsp;</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">&nbsp;</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light">&nbsp;</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">&nbsp;</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light">&nbsp;</div></el-col>
    </el-row>
  </div>
</template>

<script>

import LineChart from './LineChart';
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

// 按需引入 引入 ECharts 主模块
// var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

export default {
  name: 'Dashboard',
  components: {
    LineChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  mounted() {
    // this.initCharts();
  },
  methods: {
    // initCharts() {
    //   this.chart = echarts.init(document.getElementById('main'));
    //   this.setOptions();
    // },
    // setOptions() {
    //   this.chart.setOption({
    //     title: {
    //       text: 'ECharts测试',
    //       show: true,
    //       left: 'center',
    //       target: 'blank',
    //       link: 'www.baidu.com',
    //       textStyle: {
    //         color: 'red',
    //         width: 500,
    //         align: 'center'
    //       },
    //       subText: '555'
    //     },
    //     tooltip: {},
    //     xAxis: {
    //       data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    //     },
    //     yAxis: {},
    //     series: [{
    //       name: '销量',
    //       type: 'bar',
    //       data: [5, 20, 36, 10, 10, 20]
    //     }]
    //   })
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
