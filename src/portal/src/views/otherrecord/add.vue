<template>
  <div class="app-container">
    <div style="margin-bottom: 20px; font-size:16px">
      <span>新增其他记录：</span>
    </div>

    <el-form ref="form" :inline="true" :model="form" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-select v-model="form.name" size="small" @change="selectedUser">
          <el-option v-for="item in usersOptions"
          :key="item.id"
          :label="item.name"
          :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" size="small">
          <el-option v-for="item in typeOptions"
          :key="item.type"
          :label="item.type"
          :value="item.type"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="price">
        <el-input v-model="form.price" auto-complete="off" placeholder="请输入金额"/>
      </el-form-item>
      <el-form-item label="数量" prop="count">
        <el-input v-model="form.count" auto-complete="off" placeholder="请输入数量"/>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input v-model="form.note" auto-complete="off" placeholder="请输入备注"/>
      </el-form-item>
      <el-form-item label="记录时间" prop="createdDate">
        <el-date-picker v-model="form.createdDate" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
    </el-form>

    <div>
      <el-form :inline="true" :rules="rules" style="margin-top: 20px;">
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
      usersOptions:[],
      typeOptions:[
        {type:"支款"},
        {type:"加油"},
        {type:"伙食"},
        {type:"维修"},
        {type:"设备工具"},
      ],
      form: {
        id: 0,
        name: "",
        createdDate: new Date(),
        type:"",
      },
      total: 0,
      pageSize: 100,
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      oliCompanies: [],
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        createdDate: [{ required: true, message: "请输入时间", trigger: "blur" }],
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
    this.getDealUsers();
  },
  methods: {
    selectedUser(obj)
    {
      var self = this;
      if(obj){
        for(var i=0; i < self.usersOptions.length; i++){
          var user = self.usersOptions[i];
          if(user.name == obj){
            var typeStr = user.type;
            self.form.type = "";
            }
            else{
              self.form.type = "";
            }
          }
        }
    },
    getDealUsers(){
      var self = this;
      request({
              url: "/alldealUsers",
              method: "get",
              params: {
              type: "其他"
            }
            })
              .then(response => {
                self.usersOptions = response;
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
          url: "/otherRecords/" + id,
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
              url: "/otherRecords/" + self.form.id,
              method: "put",
              data: self.form
            })
              .then(response => {
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
              url: "/otherRecords",
              method: "post",
              data: self.form
            })
              .then(response => {
                var defaultDate = this.form.createdDate;
                var time = defaultDate.getTime() + 60 * 1000 * 30;
                var newDate = new Date(time);

                this.form = {
                    id: 0,
                    name: "",
                    createdDate: newDate,
                    price: "",
                    count: "",
                    note: "",
                    type:""
                  },

                  
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
