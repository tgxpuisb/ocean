<template>
  <div class="button-group">
    <el-button type="default" icon="el-icon-d-arrow-left" size="mini" @click="update('prev', 'day')"></el-button>
    <el-button type="default" icon="el-icon-arrow-left" size="mini" @click="update('prev', 'hour')"></el-button>
    <el-date-picker
      v-model="curTime"
      type="datetime"
      placeholder="选择日期"
      format="yyyy-MM-dd hh:mm"
      value-format="timestamp"
      size="mini"
    >
    </el-date-picker>
    <el-button type="default" icon="el-icon-arrow-right" size="mini" @click="update('next', 'hour')"></el-button>
    <el-button type="default" icon="el-icon-d-arrow-right" size="mini" @click="update('next', 'day')"></el-button>
  </div>
</template>

<script>
const TIME_DIS_ENUM = {
  prev: {
    hour: -1000 * 60 * 60,
    day: -1000 * 60 * 60 * 24
  },
  next: {
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24
  }
}
export default {
  props: {
    time: {
      type: Number, // 时间戳
      default: Date.now()
    }
  },
  data () {
    return {
      curTime: this.time
    }
  },
  methods: {
    update(dis, type) {
      this.curTime += TIME_DIS_ENUM[dis][type]
      this.$emit('on-time-change', this.curTime)
    }
  }
}
</script>

<style>
  .button-group {
    padding: 10px 5px;
    width: 80%;
    text-align: center;
    //background-color: rgba(0, 0, 0, 0.3);
  }
  .current-time {
    padding: 0 10px;
    color: #FFF;
  }
</style>
