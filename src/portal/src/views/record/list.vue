<template>
  <div class="app-container">
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
      <el-table-column prop="plateNumber" label="车牌号" width="100"/>
      <el-table-column prop="totalWeight" label="总重" width="60"/>
      <el-table-column prop="tareWeight" label="皮重" width="60"/>
      <el-table-column prop="netWeight" label="净重" width="60"/>
      <el-table-column prop="price" label="价格" width="60"/>
      <el-table-column prop="paid" label="已支付" width="60"/>
      <el-table-column prop="unpaid" label="未支付" width="60"/>
      <el-table-column prop="createdDate" label="创建时间"/>
      <el-table-column prop="modifiedDate" label="修改时间"/>
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
      loading: true,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      oliCompanies: [],
      form: {
        name: "",
        address: "",
        oliCompany: "",
        id: ""
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
    this.getRecords();
  },
  methods: {
    currentChange(val) {
      this.currentPage = val;
      this.getRecords();
    },
    getRecords() {
      request({
        url: "/records",
        method: "get",
        params: {
          size: this.pageSize,
          page: this.currentPage - 1
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
      this.$router.push({ name: "Edit", params: { id: id } });
    }
  }
};
</script>
