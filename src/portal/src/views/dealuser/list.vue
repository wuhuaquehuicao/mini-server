<template>
  <div class="app-container">
    <div>
      <el-form ref="form" :inline="true" :model="form" :rules="rules" style="margin-top: 20px;">
        <el-form-item label="" prop="type" >
          <el-select v-model="form.type" size="small">
            <el-option v-for="item in userTypeOptions"
            :key="item.type"
            :label="item.type"
            :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
        </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="content"
      :header-cell-style="{background:'#F5F7FA'}"
      style="width: 100%"
      stripe
      border
    >
      <el-table-column type="index" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
       </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="150"/>
      <el-table-column prop="phone" label="电话" width="120"/>
      <el-table-column prop="plateNumber" label="车牌" width="200"/>
      <el-table-column prop="carowner" label="车主" width="200"/>
      <el-table-column prop="source" label="货物来源" width="200"/>
      <el-table-column prop="address" label="地址" width="200"/>
      <el-table-column prop="modifiedDate" label="修改时间" width="200"/>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <!-- <el-button @click="$router.push({ name: 'Detail', params: {id: scope.row.id} })">详情</el-button> -->
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="0"
      :total="total"
      :page-size="pageSize"
      layout="prev, pager, next"
      background
      center
      style="margin-top: 15px"
      @current-change="currentChange"
    />
  </div>
</template>
<script>
import request from "@/utils/request";
import { emptyObject } from "@/utils";

export default {
  name: "ListRecord",
  data() {
    return {
      content: [],
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
      loading: true,
      total: 0,
      pageSize: 100,
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      oliCompanies: [],
      form: {
        name: "",
        type:"石灰"
      },
      rules: {
        name: [{ required: true, message: "请输入站点名称", trigger: "blur" }],
        address: [
          { required: true, message: "请选择站点地址", trigger: "blur" }
        ],
        oliCompany: [{ required: true, message: "请选择公司", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getDealUsers();
  },
  methods: {
    currentChange(val) {
      this.currentPage = val;
      this.getDealUsers();
    },
    search(){
      this.getDealUsers();
    },
    getDealUsers() {
      request({
        url: "/dealUsers",
        method: "get",
        params: {
          size: this.pageSize,
          page: this.currentPage - 1,
          type: this.form.type
        }
      })
        .then(response => {
          this.content = response.content;
          this.total = response.total;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    edit(id) {
      this.$router.push({ name: "EditUser", params: { id: id } });
    }
  }
};
</script>
