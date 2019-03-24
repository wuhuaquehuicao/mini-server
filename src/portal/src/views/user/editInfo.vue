<template>
  <div class="app-container">
    <el-form ref="editInfo" :model="content" :rules="rules" label-width="80px" style="width:400px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="content.name"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="content.email"/>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="content.mobile"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="content.password" type="password"/>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="updateInfo">确定</el-button>
        <el-button @click="cancelInfo">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { getUserById, updateUser } from '@/api/person';
import { isvalidUsername } from '@/utils/validate';
import { emptyObject } from '@/utils';

export default {
  name: 'EditInfo',
  data() {
    // 邮箱或手机号验证
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的邮箱'));
      } else {
        callback()
      }
    }
    // 手机号验证
    const validateMobile = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback()
      }
    }
    // 密码验证
    const validatePass = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      content: {
        name: '',
        email: '',
        mobile: '',
        password: ''
      },
      loading: false,
      rules: {
        name: [{ required: true, message: '请选择活动区域', trigger: 'blur' }],
        email: [{ required: true, trigger: 'blur', validator: validateUsername }],
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      }
    }
  },
  created() {
    getUserById(this.$store.getters.userId).then((response) => {
      this.content.name = response.name;
      this.content.email = response.email;
      this.content.mobile = response.mobile;
    }).catch((error) => {
      console.log(error);
    });
  },
  methods: {
    updateInfo() {
      this.$refs.editInfo.validate(valid => {
        if (valid) {
          this.loading = true;
          updateUser(this.$store.getters.userId, this.content).then((response) => {
            this.loading = false;
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            // 设置用户名
            this.$store.dispatch('setUserName', response.name);
          }).catch((error) => {
            console.log(error);
          });
        } else {
          this.loading = false;
          return false
        }
      })
    },
    cancelInfo() {
      emptyObject(this.content);
    }
  }
}
</script>

<style lang='scss'>

</style>
