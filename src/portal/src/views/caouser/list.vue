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
      <el-table-column prop="id" label="ID" width="50"/>
      <el-table-column prop="name" label="姓名" width="150"/>
      <el-table-column prop="phone" label="电话" width="100"/>
      <el-table-column prop="plateNumber" label="车牌" width="200"/>
      <el-table-column prop="address" label="地址" width="60"/>
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
        {"type":"石灰",
        },{
          "type":"石头",
        },{
          "type":"煤碳",
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
    this.getCaoUsers();
  },
  methods: {
    currentChange(val) {
      this.currentPage = val;
      this.getCaoUsers();
    },
    getCaoUsers() {
      request({
        url: "/caousers",
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
