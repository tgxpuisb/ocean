<template>
  <div class="meteorology">
    <div class="button-group">
      <el-button type="default" icon="el-icon-d-arrow-left" size="mini"></el-button>
      <el-button type="default" icon="el-icon-arrow-left" size="mini"></el-button>
      <span class="current-time">2018-05-06 20:00</span>
      <el-button type="default" icon="el-icon-arrow-right" size="mini"></el-button>
      <el-button type="default" icon="el-icon-d-arrow-right" size="mini"></el-button>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scope>
  .meteorology {
    width: 100%;
  }
  .button-group {
    width: 80%;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .current-time {
    padding: 0 10px;
    color: #FFF;
  }
</style>
