<template>
  
  <div class="app-container">
    <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="个人信息统计" name="1">
            <div>
            <el-form ref="form" :inline="true" :model="form" :rules="rules" style="margin-top: 20px;">
                <el-form-item label="时间" prop="createdDate">
                <el-date-picker v-model="form.createdDate" type="daterange" placeholder="选择日期" >
                </el-date-picker>
            </el-form-item>

            <el-form-item label="" prop="userName" >
                <el-select v-model="form.userName" size="small" placeholder="选择姓名" clearable>
                <el-option v-for="item in userOptions"
                :key="item.userName"
                :label="item.userName"
                :value="item.userName"
                >
                </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="" prop="plateNumber" >
                <el-select v-model="form.plateNumber" size="small" placeholder="选择车牌" clearable>
                <el-option v-for="item in plateNOptions"
                :key="item.plateNumber"
                :label="item.plateNumber"
                :value="item.plateNumber"
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
            :data="content"
            :header-cell-style="{background:'#F5F7FA'}"
            style="width: 100%"
            stripe
            border
            >
            <el-table-column prop="id" label="ID" width="50" v-if= "false"/>
            <el-table-column prop="name" label="姓名" width="150"/>
            <el-table-column prop="plateNumber" label="车牌号" width="80"/>
            <el-table-column prop="totalWeight" label="总重" width="80"/>
            <el-table-column prop="tareWeight" label="皮重" width="80"/>
            <el-table-column prop="netWeight" label="净重" width="80"/>
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
            <el-form ref="form" :inline="true" :model="sumContent" :rules="rules" style="margin-top: 40px;">
                <el-form-item label="总重量" prop="sumWeight11">
                    <el-input v-model="sumContent.sumWeight" auto-complete="off" v-bind:readonly="true"/>
                </el-form-item>
                <el-form-item label="总收入" prop="sumPrice">
                    <el-input v-model="sumContent.sumPrice" auto-complete="off" v-bind:readonly="true"/>
                </el-form-item>
            </el-form>
            </div>
        </el-collapse-item>

        <el-collapse-item title="全厂累计统计" name="2">
            <div>
            <el-form ref="form" :inline="true" :model="form" :rules="rules" style="margin-top: 20px;">
                <el-form-item label="时间" prop="createdDate">
                <el-date-picker v-model="form.createdDate" type="daterange" placeholder="选择日期" >
                </el-date-picker>
            </el-form-item>

            <el-form-item label="" prop="kilnName" >
                <el-select v-model="form.kilnName" size="small" clearable>
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
            :data="content"
            :header-cell-style="{background:'#F5F7FA'}"
            style="width: 100%"
            stripe
            border
            >
            <el-table-column prop="id" label="ID" width="50" v-if= "false"/>
            <el-table-column prop="name" label="姓名" width="150"/>
            <el-table-column prop="netWeight" label="净重" width="150"/>
            <el-table-column prop="price" label="总价" width="150"/>
            <el-table-column prop="cashpaid" label="现金支付" width="150"/>
            <el-table-column prop="wxpaid" label="微信支付" width="150"/>
            <el-table-column prop="unpaid" label="未支付" width="150"/>
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
            <el-form ref="form" :inline="true" :model="sumContent" :rules="rules" style="margin-top: 40px;">
                <el-form-item label="总重量" prop="sumWeight11">
                    <el-input v-model="sumContent.sumWeight" auto-complete="off" v-bind:readonly="true"/>
                </el-form-item>
                <el-form-item label="总收入" prop="sumPrice">
                    <el-input v-model="sumContent.sumPrice" auto-complete="off" v-bind:readonly="true"/>
                </el-form-item>
            </el-form>
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
      content: [],
      sumContent:[],
      activeName: '1',
      loading: false,
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
  },
  mounted() {
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
      this.$router.push({ name: "EditCaoRecord", params: { id: id } });
    },
    personSearch(){
      var date = this.form.createdDate;
      request({
        url: "/searchrecords",
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
    },
    historySearch(){
      var date = this.form.createdDate;
      request({
        url: "/searchrecords",
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
