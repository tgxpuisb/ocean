<template>
  <el-container class="h-full">
    <el-header class="banner-header">
      <h3 class="banner-title">海洋渔业生产卫星综合应用服务系统</h3>
      <el-menu
        :router="true"
        mode="horizontal"
        background-color="#409eff"
        text-color="#fff"
        class="banner-box"
        active-text-color="#ffd04b"
        :default-active="$route.name">
        <el-menu-item index="Ocean" :route="{path: '/ocean'}">
          <!--<i class="el-icon-document"></i>-->
          <span slot="title">海洋情况</span>
        </el-menu-item>
        <el-menu-item index="Fleet" :route="{path: '/fleet'}">
          <!--<i class="el-icon-setting"></i>-->
          <span slot="title">舰队信息展示</span>
        </el-menu-item>
        <!--<el-menu-item index="Shoals" :route="{path: '/shoals'}">
          <i class="el-icon-document"></i>
          <span slot="title">智能鱼群预测</span>
        </el-menu-item>-->
        <el-submenu index="2" style="float: right;">
          <template slot="title">
            <i class="el-icon-setting" style="color:#fff;"></i>个人中心
          </template>
          <el-menu-item index="2-1">修改密码</el-menu-item>
          <el-menu-item index="2-2">登出</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>
    <el-container>
      <router-view ref="route"/>
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
  .banner-title{
    line-height: 60px;
    margin: 0 5em 0 2em;
  }
  .banner-header {
    font-size: 18px;
    padding:0;
    color:#fff;
    background-color:#409eff;
    display: flex;
  }
  .banner-box{
    flex: 1;
    // float:left;
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
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
  }
  .ol-overlaycontainer-stopevent{
    display:none;
  }
  .btn-control{
    background-color:#e6effb;
    border-bottom:1px solid #b9b9b9;
    padding:10px 20px;
  }
  .m-b-0{
    margin-bottom:0;
  }
  .m-l-0{
    margin-left:0 !important;
  }
  .m-t{
    margin-top:20px;
  }
  .m-b{
    margin-bottom: 10px;
  }
  .more-btn{
    position:absolute;
    right: 0.5em;
    top: 50%;
  }
  .look-more{
    position:absolute;
    right: 0;
    top: 0;
    bottom:0;
    background-color: rgba(255, 255, 255, 0.5);
    width: 120px;
    text-align:center;
    padding:15px 0;
    p{
      font-size:12px;
      padding-top:5px;
    }
  }
  .header-date-picker {
    float: right;
    border: 0 none;
    border-radius: 0;
  }
</style>
