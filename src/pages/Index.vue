<template>
  <el-container>
    <el-header class="banner-header" height="42px">海洋渔业生产卫星综合应用服务系统</el-header>
    <el-container>
      <el-aside class="app-aside-left">
        <el-menu
          :router="true"
          :default-active="$route.name"
        >
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
        <router-view class="map-container" />
      </el-container>
    </el-container>
  </el-container>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
    }
  },
  mounted () {
    console.log(this.$route)
  }
}
</script>

<style lang="less">
  .app-aside-left {
    align-self: stretch;
    width: 200px !important;
  }
  .banner-header {
    color: #2d5979;
    background-color: #54cbfb;
    line-height: 42px;
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
</style>
