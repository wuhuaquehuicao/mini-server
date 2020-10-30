<template>
  
  <div class="app-container">
    <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="个人信息统计" name="1">
            <div>
            <el-form ref="personForm" :inline="true" :model="personForm" :rules="rules" style="margin-top: 20px;">
                <el-form-item label="时间" prop="searchDate">
                <el-date-picker v-model="personForm.searchDate" type="daterange" placeholder="选择日期" :clearable = "false" unlink-panels>
                </el-date-picker>
            </el-form-item>

            <el-form-item label="" prop="userName" >
                <el-select v-model="personForm.userName" size="small" placeholder="选择姓名" clearable @change="selectedUser">
                <el-option v-for="item in usersOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                >
                </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="" prop="plateNumber" >
                <el-select v-model="personForm.plateNumber" size="small" placeholder="选择车牌" clearable="true">
                <el-option v-for="item in plateNOptions"
                :key="item.plateNumber"
                :label="item.plateNumber"
                :value="item.plateNumber"
                >
                </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="" prop="type" >
                <el-select v-model="personForm.type" size="small" :clearable="true" placeholder="选择产地">
                <el-option v-for="item in coalTypeOptions"
                :key="item.type"
                :label="item.type"
                :value="item.type"
                >
                </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="personSearch()">查询</el-button>
            </el-form-item>
            </el-form>
            </div>
            <el-table
            v-loading="loading"
            :data="personContent"
            :header-cell-style="{background:'#F5F7FA'}"
            style="width: 100%"
            stripe
            border
            >
            <el-table-column type="index" label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{(personCurrentPage - 1) * personPageSize + scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="150"/>
            <el-table-column prop="plateNumber" label="车牌号" width="80"/>
            <el-table-column prop="type" label="产地" width="80"/>
            <el-table-column prop="totalWeight" label="总重" width="80"/>
            <el-table-column prop="tareWeight" label="皮重" width="80"/>
            <el-table-column prop="netWeight" label="净重" width="80"/>
            <el-table-column prop="price" label="总价" width="80"/>
            <el-table-column prop="paid" label="已支付" width="80"/>
            <el-table-column prop="unpaid" label="未支付" width="80"/>
            <el-table-column prop="createdDate" label="购买时间">
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
            :total="personTotal"
            :page-size="personPageSize"
            layout="prev, pager, next"
            background
            center
            style="margin-top: 15px"
            @current-change="personCurrentChange"
            />

            <div>
            <div style="margin-top: 30px">
            <el-form :inline="true" >
                <el-form-item label="总计:">
                </el-form-item>
            </el-form>
            </div>
            <el-table
            v-loading="loading"
            :data="sumPersonContent"
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
            <el-table-column prop="sumPrice" label="总价格" width="120"/>
            <el-table-column prop="sumPaid" label="已支付" width="120"/>
            <el-table-column prop="sumUnpaid" label="未支付" width="120"/>
            </el-table>
        </div>
        </el-collapse-item>

        <el-collapse-item title="全厂累计统计" name="2">
            <div>
            <el-form ref="factoryForm" :inline="true" :model="factoryForm" :rules="rules" style="margin-top: 20px;">
                <el-form-item label="时间" prop="searchDate">
                <el-date-picker v-model="factoryForm.searchDate" type="daterange" placeholder="选择日期" unlink-panels>
                </el-date-picker>
            </el-form-item>

            <el-form-item label="" prop="type" >
                <el-select v-model="factoryForm.type" size="small" :clearable="true" placeholder="选择产地">
                <el-option v-for="item in coalTypeOptions"
                :key="item.type"
                :label="item.type"
                :value="item.type"
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
            <el-table-column type="index" label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{(factoryCurrentPage - 1) * factoryPageSize + scope.$index + 1}}</span>
                 </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="150"/>
            <el-table-column prop="netWeight" label="净重" width="150">
              <template slot-scope="scope">
                <span>{{scope.row.netWeight | rounding}}</span>        
              </template>    
            </el-table-column>
            <el-table-column prop="price" label="总价" width="150"/>
            <el-table-column prop="paid" label="已支付" width="150"/>
            <el-table-column prop="unpaid" label="未支付" width="150"/>
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
                    <el-table-column prop="sumNetWeight" label="总净重" width="120">
                      <template slot-scope="scope">
                          <span>{{scope.row.sumNetWeight | rounding}}</span>
                          </template>    
                    </el-table-column>
                    <el-table-column prop="sumPrice" label="总价格" width="120"/>
                    <el-table-column prop="sumPaid" label="已支付" width="120"/>
                    <el-table-column prop="sumUnpaid" label="未支付" width="120"/>
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
      coalTypeOptions:[
        {type:"福建"},
        {type:"山西"},
        {type:"湖南"},
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
          userName: [{ required: true, message: "请选择姓名", trigger: "blur" }],
          plateNumber: [{ required: true, message: "请选择车牌", trigger: "blur"}],
      }
    };
  },
  created() {
  },
  mounted() {
      this.getDealUsers();
  },
  filters :{
    rounding (value) {
      if(value == null)
         return value;
      return value.toFixed(2);
    }
  },
  methods: {
    personCurrentChange(val) {
      this.personCurrentPage = val;
      this.personSearch();
    },  
    factoryCurrentChange(val) {
      this.factoryCurrentPage = val;
      this.factorySearch();
    },
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
                self.personForm.plateNumber = self.plateNOptions[0].plateNumber;
              }
              else{
                self.plateNOptions = [];
                self.personForm.plateNumber = "";
              }
            }
            else{
              self.plateNOptions = [];
              self.personForm.plateNumber = "";
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
              type: "煤炭"
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
      this.$router.push({ name: "EditCoalRecord", params: { id: id } });
    },
    personSearch(){
      var fromDate = this.personForm.searchDate[0];
      var toDate = this.personForm.searchDate[1];
      var params = {
          size: this.personPageSize,
          page: this.personCurrentPage - 1,
          fromDate:fromDate,
          toDate:toDate
      };
      
      var userName = this.personForm.userName;
      var plateNumber = this.personForm.plateNumber;
      var coalType = this.personForm.type;
      if(userName){
          params["userName"] = userName;
      }
      if(plateNumber){
          params["plateNumber"] = plateNumber;
      }
      if(coalType){
          params["type"] = coalType;
      }

      request({
        url: "/searchPersonCoalRecords",
        method: "get",
        params: params
      })
        .then(response => {
          this.personContent = response.content;
          this.sumPersonContent = response.sumContent;
          this.personTotal = response.total;
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
      
      var coalType = this.factoryForm.type;
      if(coalType){
          params["type"] = coalType;
      }

      request({
        url: "/searchFactoryCoalRecords",
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
