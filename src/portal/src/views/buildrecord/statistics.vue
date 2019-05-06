<template>
  
  <div class="app-container">
    <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="累计统计" name="1">
            <div>
            <el-form ref="factoryForm" :inline="true" :model="factoryForm" :rules="rules" style="margin-top: 20px;">
                <el-form-item label="时间" prop="searchDate">
                <el-date-picker v-model="factoryForm.searchDate" type="daterange" placeholder="选择日期" unlink-panels>
                </el-date-picker>
            </el-form-item>

            <el-form-item label="" prop="kilnName" >
                <el-select v-model="factoryForm.kilnName" size="small" clearable placeholder="选择窑名">
                <el-option v-for="item in kilnsOptions"
                :key="item.id"
                :label="item.kilnName"
                :value="item.kilnName"
                >
                </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="factorySearch()">查询</el-button>
            </el-form-item>
            </el-form>
            </div>
            <el-table
            v-loading="loading"
            :data="factoryContent"
            :header-cell-style="{background:'#F5F7FA'}"
            style="width: 100%"
            stripe
            border
            >
            <el-table-column prop="buildIndex" label="加窑序号" width="80"/>
            <el-table-column prop="coalWeight" label="煤重量" width="120">
            <template slot-scope="scope">
                <span>{{scope.row.coalWeight | rounding}}</span>
                </template>    
            </el-table-column>
            <el-table-column prop="preStoneWeight" label="预计石头重量" width="120">
            <template slot-scope="scope">
                <span>{{scope.row.preStoneWeight | rounding}}</span>
                </template>    
            </el-table-column>
            <el-table-column prop="preRatio" label="预计比例" width="120">
            <template slot-scope="scope">
                <span>{{scope.row.preRatio | rounding}}</span>
                </template>    
            </el-table-column>
            
            <el-table-column prop="reaStoneWeight" label="实际石头重量" width="120">
            <template slot-scope="scope">
                <span>{{scope.row.reaStoneWeight | rounding}}</span>
                </template>    
            </el-table-column>
            <el-table-column prop="reaRatio" label="实际比例" width="120">
            <template slot-scope="scope">
                <span>{{scope.row.reaRatio | rounding}}</span>
                </template>    
            </el-table-column>
            </el-table>
            <el-pagination
            :current-page="0"
            :total="factoryTotal"
            :page-size="factoryPageSize"
            layout="prev, pager, next"
            background
            center
            style="margin-top: 15px"
            @current-change="factoryCurrentChange"
            />
            <div>
               <div>
                    <el-form ref="form" :inline="true" :model="form" style="margin-top: 30px;">
                        <el-form-item label="总计:">
                        </el-form-item>
                    </el-form>
                    </div>
                    <el-table
                    v-loading="loading"
                    :data="sumFactoryContent"
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
        </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import request from "@/utils/request";
import { emptyObject} from "@/utils";

export default {
  name: "ListRecord",
  data() {
    return {
      personContent: [],
      sumPersonContent:[],
      factoryContent: [],
      sumFactoryContent:[],
      activeName: '1',
      loading: false,
      personTotal: 0,
      personPageSize: 100,
      personCurrentPage: 1,

      factoryTotal:0,
      factoryPageSize: 100,
      factoryCurrentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      oliCompanies: [],
      usersOptions: [
      ],
      kilnsOptions:[
        {id:1, kilnName:"新窑"},
        {id:2, kilnName:"老窑"},
      ],
      personForm: {
        plateNumber: "",
        userName : ""
      },
      factoryForm: {
          kilnName:""
      },
      rules: {
          searchDate: [{ required: true, message: "请选择时间", trigger: "blur" }],
      }
    };
  },
  created() {
  },
  mounted() {
  },
  filters :{
    rounding (value) {
      return value.toFixed(2);
    }
  },
  methods: {
    factoryCurrentChange(val) {
      this.factoryCurrentPage = val;
      this.factorySearch();
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
    
    factorySearch(){
      var fromDate = this.factoryForm.searchDate[0];
      var toDate = this.factoryForm.searchDate[1];
      var params = {
          size: this.factoryPageSize,
          page: this.factoryCurrentPage - 1,
          fromDate:fromDate,
          toDate:toDate
      };
      
      var kilnName = this.factoryForm.kilnName;
      var type = this.personForm.type;
      if(kilnName){
          params["kilnName"] = kilnName;
      }

      request({
        url: "/searchFactoryBuildRecord",
        method: "get",
        params: params
      })
        .then(response => {
          this.factoryContent = response.content;
          this.sumFactoryContent = response.sumContent;
          this.factoryTotal = response.total;
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
