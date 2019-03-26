<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" style="margin-top: 20px;">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="姓名"/>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" auto-complete="off" placeholder="电话"/>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" auto-complete="off" placeholder="地址"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add" v-if="form.id>0">更新</el-button>
        <el-button type="primary" @click="add" v-if="form.id==0">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import request from "@/utils/request";
import { emptyObject } from "@/utils";

export default {
  name: "Record",
  data() {
    return {
      content: [],
      loading: true,
      form: {
        id: 0,
        name: "limin",
        phone: "15912223",
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      oliCompanies: [],
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入电话号码", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入地址", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    $route: function(to, from) {
      this.refresh();
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      var self = this;
      var id = this.$route.params.id;
      if (id != null && id > 0) {
        this.form.id = id;
        request({
          url: "/caousers/" + id,
          method: "get"
        })
          .then(response => {
            self.form = response;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log(error);
          });
      } else {
        this.form.id = 0;
      }
    },
    add() {
      var self = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (self.form.id != null && self.form.id > 0) {
            request({
              url: "/caousers/" + self.form.id,
              method: "put",
              data: self.form
            })
              .then(response => {
                self.form.totalWeight = Math.ceil(100 + Math.random() * 10000);
                this.$message({
                  message: "更新成功",
                  type: "success"
                });
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            request({
              url: "/caousers",
              method: "post",
              data: self.form
            })
              .then(response => {
                self.form.totalWeight = Math.ceil(100 + Math.random() * 10000);
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
              })
              .catch(error => {
                console.log(error);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
