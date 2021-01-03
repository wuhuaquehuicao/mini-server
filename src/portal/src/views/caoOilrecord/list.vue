<template>
  
  <div class="app-container">
    <div>
      <el-form ref="form" :inline="true" :model="form" :rules="rules" style="margin-top: 20px;">
        <el-form-item label="时间" prop="createdDate">
        <el-date-picker v-model="form.createdDate" type="date" placeholder="选择日期">
        </el-date-picker>
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
      <el-table-column prop="plateNumber" label="车牌号" width="80"/>
      <el-table-column prop="type" label="灰油类型" width="80"/>
      <el-table-column prop="count" label="包数" width="80"/>
      <el-table-column prop="netWeight" label="净重" width="80"/>
      <el-table-column prop="totalWeight" label="总重" width="80"/>
      <el-table-column prop="tareWeight" label="皮重" width="80"/>
      <el-table-column prop="price" label="总价" width="100"/>
      <el-table-column prop="cashpaid" label="现金支付" width="100"/>
      <el-table-column prop="wxpaid" label="微信支付" width="100"/>
      <el-table-column prop="unpaid" label="未支付" width="100"/>
      <el-table-column prop="createdDate" label="购买时间">
        <template slot-scope="scope">
            <span>{{ new Date(scope.row.createdDate) | formatDate('hh:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modifiedDate" label="修改时间"/>
      <el-table-column label="操作" width="80">
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

      <div>
        <div>
          <el-form ref="form" :inline="true" :model="form" :rules="rules" style="margin-top: 30px;">
            <el-form-item label="总计:">
            </el-form-item>
          </el-form>
        </div>
        <el-table
          v-loading="loading"
          :data="sumContent"
          :header-cell-style="{background:'#F5F7FA'}"
          style="width: 100%"
          stripe
          border
        >
        <el-table-column prop="sumNetWeight" label="总净重" width="120">
          <template slot-scope="scope">
          <span>{{scope.row.sumNetWeight | rounding}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sumCount" label="总包数" width="120">
          <template slot-scope="scope">
          <span>{{scope.row.sumCount | rounding}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sumPrice" label="总收入" width="120"/>
        <el-table-column prop="sumCashpaid" label="现金支付" width="120"/>
        <el-table-column prop="sumWxpaid" label="微信支付" width="120"/>
        <el-table-column prop="sumUnpaid" label="未支付" width="120"/>
      </el-table>
    </div>
  </div>
  
</template>
<script>
import request from "@/utils/request";
import { emptyObject} from "@/utils";

export default {
  name: "ListRecord",
  data() {
    return {
      content: [],
      sumContent:[],
      loading: true,
      total: 0,
      pageSize: 100,
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      oliCompanies: [],
      form: {
        createdDate: new Date(),
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
    this.search();
    
  },
  mounted() {
  },
  filters :{
    rounding (value) {
      if(value == null)
         return value;
      return value.toFixed(2);
    }
  },
  methods: {
    currentChange(val) {
      this.currentPage = val;
      this.search();
    },
    edit(id) {
      this.$router.push({ name: "EditCaoOilRecord", params: { id: id } });
    },
    search(){
      var date = this.form.createdDate;
      request({
        url: "/searchCaoOilRecords",
        method: "get",
        params: {
          size: this.pageSize,
          page: this.currentPage - 1,
          date: date,
        }
      })
        .then(response => {
          this.content = response.content;
          this.sumContent = response.sumContent;
          this.total = response.total;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    }
  }
};
</script>
