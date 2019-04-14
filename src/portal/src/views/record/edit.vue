<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" style="margin-top: 20px;">
      <el-form-item label="时间" prop="createdDate">
        <el-date-picker v-model="form.createdDate" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-select v-model="form.name" size="small">
          <el-option v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车牌" prop="plateNumber">
        <el-input v-model="form.plateNumber" auto-complete="off" placeholder="车牌"/>
      </el-form-item>
      <el-form-item label="皮重" prop="tareWeight">
        <el-input v-model="form.tareWeight" auto-complete="off" placeholder="皮重"/>
      </el-form-item>
      <el-form-item label="总重" prop="totalWeight">
        <el-input v-model="form.totalWeight" auto-complete="off" placeholder="总重"/>
      </el-form-item>
      <el-form-item label="净重" prop="netWeight">
        <el-input v-model="form.netWeight" auto-complete="off" placeholder="净重"/>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="form.price" auto-complete="off" placeholder="价格"/>
      </el-form-item>
      <el-form-item label="已付款" prop="paid">
        <el-input v-model="form.paid" auto-complete="off" placeholder="已付款"/>
      </el-form-item>
      <el-form-item label="未付款" prop="unpaid">
        <el-input v-model="form.unpaid" auto-complete="off" placeholder="未付款"/>
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
      options:[
        ],
      form: {
        id: 0,
        name: "",
        plateNumber: "",
        tareWeight: "",
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      oliCompanies: [],
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        createdDate: [{ required: true, message: "请输入时间", trigger: "blur" }],
        plateNumber: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
        ],
        tareWeight: [
          { required: true, message: "请输入皮重", trigger: "blur" }
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
    this.getCaoUsers();
  },
  methods: {
    getCaoUsers(){
      var self = this;
      request({
              url: "/allcaousers",
              method: "get",
            })
              .then(response => {
                self.options = response;
                this.loading = false;
              })
              .catch(error => {
                console.log(error);
              });
    },
    refresh() {
      var self = this;
      var id = this.$route.params.id;
      if (id != null && id > 0) {
        this.form.id = id;
        request({
          url: "/records/" + id,
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
              url: "/records/" + self.form.id,
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
              url: "/records",
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
