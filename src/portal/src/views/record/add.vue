<template>
  <div class="app-container">
    <div>
      <el-form ref="form" :inline="true" :model="form" :rules="rules" style="margin-top: 20px;">
        <el-form-item label="" prop="kilnName" >
          <el-select v-model="form.kilnName" size="small">
            <el-option v-for="item in kilnsOptions"
            :key="item.id"
            :label="item.kilnName"
            :value="item.kilnName"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间" prop="createdDate">
        <el-date-picker v-model="form.createdDate" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>

      </el-form>
    </div>
    <el-form ref="form" :inline="true" :model="form" :rules="rules">
      <el-form-item label="姓名" prop="name">
        <el-select v-model="form.name" size="small" @change="selectedUser">
          <el-option v-for="item in usersOptions"
          :key="item.id"
          :label="item.name"
          :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车牌" prop="plateNumber">
        <el-select v-model="form.plateNumber" size="small" clearable>
          <el-option v-for="item in plateNOptions"
          :key="item.plateNumber"
          :label="item.plateNumber"
          :value="item.plateNumber"
          >
          </el-option>
        </el-select>
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
      <el-form-item label="总价" prop="price">
        <el-input v-model="form.price" auto-complete="off" placeholder="总价"/>
      </el-form-item>
      <el-form-item label="现金付款" prop="cashpaid">
        <el-input v-model="form.cashpaid" auto-complete="off" placeholder="现金付款"/>
      </el-form-item>
      <el-form-item label="微信付款" prop="wxpaid">
        <el-input v-model="form.wxpaid" auto-complete="off" placeholder="微信付款"/>
      </el-form-item>
      <el-form-item label="未付款" prop="unpaid">
        <el-input v-model="form.unpaid" auto-complete="off" placeholder="未付款"/>
      </el-form-item>
    </el-form>

    <div>
      <el-form ref="form" :inline="true" :model="form" :rules="rules" style="margin-top: 20px;">
        <el-form-item>
        <el-button type="primary" @click="add" v-if="form.id>0">更新</el-button>
        <el-button type="primary" @click="add" v-if="form.id==0" :disabled="form.name == NULL || form.plateNumber == NULL || form.tareWeight <= 0 || form.tareWeight == NULL">添加</el-button>
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
      plateNOptions:[],
      kilnsOptions:[
        {id:1, kilnName:"新窑"},
        {id:2, kilnName:"老窑"},
      ],
      form: {
        id: 0,
        createdDate: new Date(),
        kilnName:"新窑",
        plateNumber:""
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
            var plateStr = user.plateNumber;
            if(plateStr){
              var plateNArray = plateStr.split(",");
              var plateNOptions = [];
              var value;
              if(plateNArray.length > 0){
                for(var j=0; j< plateNArray.length;j++){
                value = plateNArray[j];
                plateNOptions.push({"plateNumber":value});
                
                }
                self.plateNOptions = plateNOptions;
                self.form.plateNumber = self.plateNOptions[0].plateNumber;
              }
              else{
                self.plateNOptions = [];
                self.form.plateNumber = "";
              }
            }
            else{
              self.plateNOptions = [];
              self.form.plateNumber = "";
            }
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
              type: "石灰"
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
