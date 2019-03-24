<template>
  <div class="login-container">
    <el-form ref="registerForm" :model="registerForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">用户注册</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="registerForm.username" name="username" type="text" auto-complete="on" placeholder="请输入邮箱或手机号码" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="registerForm.password"
          name="password"
          auto-complete="on"
          placeholder="请输入密码" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="comfirmPwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="showComfirmPwd"
          v-model="registerForm.comfirmPwd"
          name="comfirmPwd"
          auto-complete="on"
          placeholder="请确认密码"
          @keyup.enter.native="handleRegister" />
        <span class="show-pwd" @click="showPwd1">
          <svg-icon :icon-class="showComfirmPwd === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" size="default" @click.native.prevent="handleRegister">
          注册
        </el-button>
      </el-form-item>
      <div class="tips">
        <span>已有账号?</span>
        <router-link to="/login">立即登陆</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { register } from '@/api/register'

export default {
  name: 'Register',
  data() {
    // 邮箱或手机号码验证规则
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的邮箱或手机号码'))
      } else {
        callback()
      }
    }
    // 密码验证规则
    const validatePass = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    // 确认密码验证
    const validateComPass = (rule, value, callback) => {
      if (this.registerForm.password !== this.registerForm.comfirmPwd) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        comfirmPwd: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        comfirmPwd: [{ required: true, trigger: 'blur', validator: validateComPass }]
      },
      loading: false,
      pwdType: 'password',
      showComfirmPwd: 'password',
      redirect: undefined
    }
  },
  methods: {
    // 密码可见
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // 确认密码可见
    showPwd1() {
      if (this.showComfirmPwd === 'password') {
        this.showComfirmPwd = ''
      } else {
        this.showComfirmPwd = 'password'
      }
    },
    // 注册
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          register(this.registerForm.username, this.registerForm.password).then(response => {
            this.loading = false
            this.$message({
              message: '注册成功',
              type: 'success'
            })
            this.$router.push('/login')
          }).catch(error => {
            this.loading = false
            console.log(error)
            this.$message.error('注册失败')
          })
        } else {
          this.$message.error('请按提示填写用户名或密码')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
