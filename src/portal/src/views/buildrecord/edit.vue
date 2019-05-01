<template>
  <div class="app-container">
      <div style="margin-bottom: 20px; font-size:16px">
      <span>新增加窑记录：</span>
    </div>

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
        <el-date-picker v-model="form.createdDate" type="datetime" placeholder="选择日期时间" :clearable = "false">
        </el-date-picker>
      </el-form-item>

      </el-form>
    </div>
    <el-form ref="form" :inline="true" :model="form" :rules="rules">
      <el-form-item label="加窑序号" prop="buildIndex">
        <el-input v-model="form.buildIndex" auto-complete="off" placeholder="加窑序号"/>
      </el-form-item>
      <el-form-item label="煤炭重量" prop="coalWeight">
        <el-input v-model="form.coalWeight" auto-complete="off" placeholder="煤炭重量"/>
      </el-form-item>
      <el-form-item label="预计石头重量" prop="preStoneWeight">
        <el-input v-model="form.preStoneWeight" auto-complete="off" placeholder="预计石头重量" @input="inputPreStoneWeight"/>
      </el-form-item>

      <el-form-item label="预计比例" prop="preRatio">
        <el-input v-model="form.preRatio" auto-complete="off" placeholder="预计比例" />
      </el-form-item>
      
      <el-form-item label="实际石头重量" prop="reaStoneWeight">
        <el-input v-model="form.reaStoneWeight" auto-complete="off" placeholder="实际石头重量" @input="inputReaStoneWeight"/>
      </el-form-item>
      <el-form-item label="实际比例" prop="reaRatio">
        <el-input v-model="form.reaRatio" auto-complete="off" placeholder="实际比例"/>
      </el-form-item>
    </el-form>

    <div>
      <el-form :rules="rules" style="margin-top: 20px;">
        <el-form-item>
        <el-button type="primary" @click="add" v-if="form.id>0">更新</el-button>
        <el-button type="primary" @click="add" v-if="form.id==0">添加</el-button>
      </el-form-item>
      </el-form>
      <el-form :rules="rules" style="margin-top: 20px;">
          <el-form-item>
          <el-button type="primary" @click="deleteBuildRecord" v-if="(form.id>0&&this.$store.getters.roles == 0)">删除</el-button>
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
        buildIndex:1,
      },
      total: 0,
      pageSize: 100,
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      oliCompanies: [],
      rules: {
        coalWeight: [{ required: true, message: "请输入煤重量", trigger: "blur" }],
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
    rounding (value) {
      return value.toFixed(2);
    },
    refresh() {
      var self = this;
      var id = this.$route.params.id;
      if (id != null && id > 0) {
        this.form.id = id;
        request({
          url: "/buildrecord/" + id,
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
    deleteBuildRecord(){
      this.$confirm('你确定要删除该加窑数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var self = this;
          this.$refs.form.validate(valid => {
          if (valid) {
            if (self.form.id != null && self.form.id > 0) {
              request({
                url: "/buildrecord/" + self.form.id,
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
              url: "/buildrecord/" + self.form.id,
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
              url: "/buildrecord",
              method: "post",
              data: self.form
            })
              .then(response => {
                var defaultKilnName = this.form.kilnName;
                var defaultBuildIndex = this.form.buildIndex++;
                this.form = {
                     id: 0,
                     createdDate: new Date(),
                     kilnName:defaultKilnName,
                     buildIndex:defaultBuildIndex,
                };

                this.loading = false;
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
    },
    inputPreStoneWeight(){
        this.form.preRatio = this.rounding(this.form.preStoneWeight / this.form.coalWeight);
    },
    inputReaStoneWeight(){
        this.form.reaRatio = this.rounding(this.form.reaStoneWeight / this.form.coalWeight);
    }
  }
};
</script>
