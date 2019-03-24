<template>
  <div class="app-container">
    <div class="userCenter">
      <p class="infoTitle">账户信息</p>
      <el-card class="box-card">
        <ul class="info">
          <li><span>用户名：</span>{{ content.name }}</li>
          <li><span>邮箱：</span>{{ content.email }}</li>
          <li><span>手机号码：</span>{{ content.mobile }}</li>
          <li><span>注册时间：</span>{{ new Date(content.createdDate) | formatDate('YYYY-MM-DD hh:mm:ss') }}</li>
          <li><span>修改时间：</span>{{ new Date(content.modifiedDate) | formatDate('YYYY-MM-DD hh:mm:ss') }}</li>
        </ul>
        <p class="updateInfo" @click="$router.push({ name: 'EditInfo' })">修改信息</p>
      </el-card>
    </div>
  </div>
</template>

<script>

import { getUserById } from '@/api/person';

export default {
  name: 'UserCenter',
  data() {
    return {
      content: {}
    }
  },
  created() {
    getUserById(this.$store.getters.userId).then((response) => {
      this.content = response;
    }).catch((error) => {
      console.log(error);
    });
  }
}
</script>

<style lang='scss'>
  .userCenter{
    .infoTitle{
      padding-left: 15px;
      font-size: 18px;
    }
    .info{
      list-style: none;
      padding-left: 5px;
      li{
        line-height: 45px;
        span{
          width: 100px;
          display: inline-block;
          text-align: right;
        }
      }
    }
    .updateInfo{
      padding-left: 25px;
      color: #409eff;
      cursor: pointer;
    }
  }
</style>
