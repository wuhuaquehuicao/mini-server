<template>
  <div class="app-container">
    <div style="margin-bottom: 20px; font-size:16px">
      <span>更新购灰记录：</span>
    </div>
    <div>
      <el-form ref="form" :inline="true" :model="form" :rules="rules" style="margin-top: 20px;">

        <el-form-item label="" prop="type" >
          <el-select v-model="form.type" size="small">
            <el-option v-for="item in typeOptions"
            :key="item.type"
            :label="item.type"
            :value="item.type"
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
        <el-select v-model="form.name" size="small" @change="selectedUser" filterable>
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

      <el-form-item label="车主" prop="carowner">
        <el-select v-model="form.carowner" size="small" clearable>
          <el-option v-for="item in carownerOptions"
          :key="item.carowner"
          :label="item.carowner"
          :value="item.carowner"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="货物来源" prop="source">
        <el-select v-model="form.source" size="small" clearable>
          <el-option v-for="item in sourceOptions"
          :key="item.source"
          :label="item.source"
          :value="item.source"
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
      <el-form-item label="灰粉" prop="ashWeight">
        <el-input v-model="form.ashWeight" auto-complete="off" placeholder="灰粉净重"/>
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
        <el-button type="primary" @click="add" v-if="form.id==0">添加</el-button>
      </el-form-item>
      <el-form  style="margin-top: 20px;">
          <el-form-item>
          <el-button type="primary" @click="deleteRecord" v-if="(form.id>0&&this.$store.getters.roles == 0)">删除</el-button>
        </el-form-item>
        </el-form>
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
      sourceOptions:[],
      kilnsOptions:[
        {id:1, kilnName:"新窑"},
        {id:2, kilnName:"老窑"},
      ],
      typeOptions:[
        {type:"零灰"},
        {type:"统灰"},
        {type:"零灰打包"},
        {type:"统灰打包"},
        {type:"灰粉"},
        {type:"灰渣"},
      ],
      form: {
        id: 0,
        name: "",
        createdDate: new Date(),
        plateNumber: "",
        tareWeight: "",
        source:"",
        carowner:"",
        kilnName:"新窑"
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
        type: [
          { required: true, message: "请选择灰类", trigger: "blur" }
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

            //split source
            var sourceStr = user.source;
            if(sourceStr){
              var sourceArray = sourceStr.split(",");
              var sourceOptions = [];
              var value;
              if(sourceArray.length > 0){
                for(var j=0; j< sourceArray.length;j++){
                value = sourceArray[j];
                sourceOptions.push({"source":value});
                
                }
                self.sourceOptions = sourceOptions;
                self.form.source = self.sourceOptions[0].source;
              }
              else{
                self.sourceOptions = [];
                self.form.source = "";
              }
            }

             //split carowner
            var carownerStr = user.carowner;
            if(carownerStr){
              var carownerArray = carownerStr.split(",");
              var carownerOptions = [];
              var value;
              if(carownerArray.length > 0){
                for(var j=0; j< carownerArray.length;j++){
                value = carownerArray[j];
                carownerOptions.push({"carowner":value});
                
                }
                self.carownerOptions = carownerOptions;
                self.form.carowner = self.carownerOptions[0].carowner;
              }
              else{
                self.carownerOptions = [];
                self.form.carowner = "";
              }
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
              type: "外调"
            }
            })
              .then(response => {
                self.usersOptions = response;
                self.selectedUser(self.form.name);
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
          url: "/buycaorecords/" + id,
          method: "get"
        })
          .then(response => {
            self.form = response;
            self.selectedUser(self.form.name);
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
    deleteRecord(){
      this.$confirm('你确定要删除该购灰记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var self = this;
          this.$refs.form.validate(valid => {
          if (valid) {
            if (self.form.id != null && self.form.id > 0) {
              request({
                url: "/buycaorecords/" + self.form.id,
                method: "post",
                data: self.form
              })
                .then(response => {
                  this.form = {
                    };
                    this.$message({
                    message: "删除成功",
                    type: "success"
                  });
                  
                })
                .catch(error => {
                  console.log(error);
                });
            }
          }});
        }).catch(() => {       
        });
    },
    add() {
      var self = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (self.form.id != null && self.form.id > 0) {
            request({
              url: "/buycaorecords/" + self.form.id,
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
              url: "/buycaorecords",
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
