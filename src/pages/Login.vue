<template>
  <el-form :model="form" label-width="80px" :rules="rules" class="login-container" ref="login">
    <el-form-item label="账号:" prop="loginName">
      <el-input v-model="form.loginName" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item label="密码:" prop="passWord">
      <el-input v-model="form.passWord" placeholder="请输入密码" type="password"></el-input>
    </el-form-item>
    <el-form-item class="login-button">
      <el-button type="primary" @click="login('login')">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        loginName: '',
        passWord: ''
      },
      rules: {
        loginName: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login (form) {
      this.$refs[form].validate(validate => {
        if (validate) {
          this
            .$http
            .post('/login/login', this.form)
            .then(res => {
              console.log(res)
              if (res.data.code == 0) {
                alert('登录成功')
                this.$router.replace({
                  name: 'Index'
                })
              }
            })
        }
      })
    }
  }
}
</script>

<style lang="less">
  .login-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 320px;
  }
  .login-button {
    text-align: center;
  }
</style>
