<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" style="margin-top: 20px;">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="姓名"/>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" size="small">
            <el-option v-for="item in userTypeOptions"
            :key="item.type"
            :label="item.type"
            :value="item.type"
            >
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车牌" prop="plateNumber">
        <el-input v-model="form.plateNumber" auto-complete="off" placeholder="车牌(用英文逗号分开)"/>
      </el-form-item>

      <el-form-item label="车主" prop="carowner">
        <el-input v-model="form.carowner" auto-complete="off" placeholder="车主(用英文逗号分开)"/>
      </el-form-item>

      <el-form-item label="货物来源" prop="source">
        <el-input v-model="form.source" auto-complete="off" placeholder="来源(用英文逗号分开)"/>
      </el-form-item>

      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" auto-complete="off" placeholder="电话"/>
      </el-form-item>
  
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" auto-complete="off" placeholder="地址"/>
      </el-form-item>
    </el-form>

    <div>
      <el-form :rules="rules" style="margin-top: 20px;">
        <el-form-item>
        <el-button type="primary" @click="add" v-if="form.id>0">更新</el-button>
        <el-button type="primary" @click="add" v-if="form.id==0">添加</el-button>
      </el-form-item>
      </el-form>
    </div>
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
      userTypeOptions:[
        {"type":"外调",
        },
        {"type":"石灰",
        },
        {"type":"灰油",
        },
        {
          "type":"石头",
        },{
          "type":"煤炭",
        }
        ,{
          "type":"其他",
        }
      ],
      form: {
        id: 0,
        name: "",
        phone: "",
        plateNumber:"",
        source:"",
        carowner:""
      },
      total: 0,
      pageSize: 100,
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      oliCompanies: [],
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
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
          url: "/dealUsers/" + id,
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
              url: "/dealUsers/" + self.form.id,
              method: "put",
              data: self.form
            })
              .then(response => {
                var errorMsg = response.error;
                if(errorMsg){
                  this.$message({
                  message: errorMsg,
                  type: "failed"
                });
                }
                else{
                  this.$message({
                  message: "更新成功",
                  type: "success"
                });
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            request({
              url: "/dealUsers",
              method: "post",
              data: self.form
            })
              .then(response => {
                var errorMsg = response.error;
                if(errorMsg){
                  this.$message({
                  message: errorMsg,
                  type: "failed"
                });
                }
                else{
                  this.form = {
                    id: 0,
                    name: "",
                    phone: "",
                    plateNumber:"",
                    source:"",
                    carowner:""
                   };
                  this.$message({
                  message: "添加成功",
                  type: "success"
                });
                }
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
