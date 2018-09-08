<template>
  <el-container class="h-full">
    <el-header class="banner-header">
      海洋渔业生产卫星综合应用服务系统
      <el-date-picker
          class="header-date-picker"
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :editable="false"
          align="right"
          @change="timeChange">
        </el-date-picker>
    </el-header>
    <el-container>
      <el-aside class="app-aside-left">
        <el-menu
          :router="true"
          :default-active="$route.name">
          <el-menu-item index="Ocean" :route="{path: '/ocean'}">
            <i class="el-icon-document"></i>
            <span slot="title">海洋情况</span>
          </el-menu-item>
          <el-menu-item index="Fleet" :route="{path: '/fleet'}">
            <i class="el-icon-setting"></i>
            <span slot="title">舰队信息展示</span>
          </el-menu-item>
          <el-menu-item index="Shoals" :route="{path: '/shoals'}">
            <i class="el-icon-document"></i>
            <span slot="title">智能鱼群预测</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <router-view class="map-container" ref="route"/>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>

export default {
  data () {
    let today = new Date()
    let yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return {
      time: [
        new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
      ] // 查询日期
    }
  },
  mounted () {
    console.log(this.$refs)
  },
  methods: {
    timeChange () {
      if (this.$refs.route.globalTimeChange) {
        this.$refs.route.globalTimeChange(this.time)
      }
    }
  }
}
</script>

<style lang="less">
  .h-full{
    height:100%;
  }
  .app-aside-left {
    align-self: stretch;
    width: 200px !important;
  }
  .banner-header {
    color: #2d5979;
    background-color: #54cbfb;
    line-height: 40px;
    height: 40px !important;
    font-size: 18px;
  }
  .el-menu-item {
    color: #FFFFFF;
    &.is-active {
      background-color: #27506c;
      color: #2dfefe;
    }
    &:hover {
      background-color: #27506c;
      color: #2dfefe;
      > i {
        color: #2dfefe;
      }
    }
  }
  .el-menu {
    height: 100%;
    background-color: #316487;
  }
  .map-container {
    position: relative;
    width: 100%;
  }
  .header-date-picker {
    float: right;
    border: 0 none;
    border-radius: 0;
  }
</style>
