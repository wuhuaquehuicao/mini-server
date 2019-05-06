<template>
  
  <div class="app-container">
    <div>
      <el-form ref="form" :inline="true" :model="form" :rules="rules" style="margin-top: 20px;">
        <el-form-item label="时间" prop="createdDate">
        <el-date-picker v-model="form.createdDate" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

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
      <el-table-column prop="buildIndex" label="加窑序号" width="80"/>
      <el-table-column prop="coalWeight" label="煤重量" width="120"/>
      <el-table-column prop="preStoneWeight" label="预计石头重量" width="120"/>
      <el-table-column prop="preRatio" label="预计比例" width="120"/>
      <el-table-column prop="reaStoneWeight" label="实际石头重量" width="120"/>
      <el-table-column prop="reaRatio" label="实际比例" width="120"/>
      <el-table-column prop="createdDate" label="加窑时间">
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
        
        <el-table-column prop="sumCoalWeight" label="煤炭总重量" width="120">
          <template slot-scope="scope">
          <span>{{scope.row.sumCoalWeight | rounding}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sumPreStoneWeight" label="预计石头总重量" width="120">
          <template slot-scope="scope">
          <span>{{scope.row.sumPreStoneWeight | rounding}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="avgPreRatio" label="预计平均比例" width="120">
          <template slot-scope="scope">
          <span>{{scope.row.avgPreRatio | rounding}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sumReaStoneWeight" label="实际石头总重量" width="120">
          <template slot-scope="scope">
          <span>{{scope.row.sumReaStoneWeight | rounding}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="avgReaRatio" label="实际平均比例" width="120">
          <template slot-scope="scope">
          <span>{{scope.row.avgReaRatio | rounding}}</span>
          </template>
        </el-table-column>
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
      kilnsOptions:[
        {id:1, kilnName:"新窑"},
        {id:2, kilnName:"老窑"},
      ],
      form: {
        createdDate: new Date(),
        kilnName: "新窑"
      },
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
    getKilns(){
      request({
        url: "/kilns",
        method: "get"
      })
        .then(response => {
          this.kilnsOptions = response;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    edit(id) {
      this.$router.push({ name: "EditBuildRecord", params: { id: id } });
    },
    search(){
      var date = this.form.createdDate;
      request({
        url: "/searchBuildRecord",
        method: "get",
        params: {
          size: this.pageSize,
          page: this.currentPage - 1,
          date: date,
          kilnName: this.form.kilnName
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
