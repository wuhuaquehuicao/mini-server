<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="content" :header-cell-style="{background:'#F5F7FA'}" style="width: 100%" stripe border>
      <el-table-column fixed prop="id" label="id" width="120"/>
      <el-table-column prop="name" label="名称" width="150"/>
      <el-table-column prop="company.name" label="石油公司" width="150"/>
      <el-table-column prop="province" label="省份" width="120"/>
      <el-table-column prop="city" label="城市" width="120"/>
      <el-table-column prop="address" label="地址"/>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="$router.push({ name: 'StationsDetails', params: {stationId: scope.row.id} })">详情</el-button>
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="0" :total="total" :page-size="pageSize" layout="prev, pager, next" background center style="margin-top: 15px" @current-change="currentChange"/>

    <el-dialog :visible.sync="dialogFormVisible" title="编辑站点信息" width="40%">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="站点名称" prop="name">
          <el-input v-model="form.name" auto-complete="off" placeholder="请输入站点名称"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="站点地址" prop="address">
          <el-input v-model="form.address" auto-complete="off" placeholder="请输入站点地址"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="石油公司" prop="oliCompany">
          <el-select v-model="form.oliCompany" placeholder="请选择石油公司">
            <el-option v-for="(value, index) in oliCompanies" :key="index" :label="value.name" :value="value.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateSite">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { getSite, companies, updateSite, getSiteById } from '@/api/stations';
import { emptyObject } from '@/utils';

export default {
  name: 'GetSite',
  data() {
    return {
      content: [],
      loading: true,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      oliCompanies: [],
      form: {
        name: '',
        address: '',
        oliCompany: '',
        id: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入站点名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请选择站点地址', trigger: 'blur' }
        ],
        oliCompany: [
          { required: true, message: '请选择公司', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getSite();
    companies().then((response) => {
      this.oliCompanies = response.content;
    }).catch((error) => {
      console.log(error);
    });
  },
  methods: {
    getSite() {
      // 获取站点数据
      this.loading = true;
      getSite(this.pageSize, this.currentPage - 1).then(response => {
        this.content = response.content;
        this.total = response.total;
        this.loading = false;
      }).catch(error => {
        console.log(error);
        this.loading = false;
      })
    },
    currentChange(val) {
      this.currentPage = val;
      this.getSite();
    },
    edit(id) {
      this.dialogFormVisible = true;
      getSiteById(id).then((response) => {
        emptyObject(this.form);
        this.form.id = response.id;
        this.form.name = response.name;
        this.form.address = response.address;
        this.form.oliCompany = response.company ? response.company.id : '';
      }).catch((error) => {
        console.log(error);
      });
    },
    // 更新站点
    updateSite() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          updateSite(this.form).then(response => {
            this.$message({
              message: '编辑成功',
              type: 'success'
            });
            console.log(response);
            console.log(this.content);
            // 更新页面数据
            this.content.forEach((value, index) => {
              if (value.id === this.form.id) {
                value.name = response.name;
                value.address = response.address;
                value.company.name = response.company.name;
                return false;
              }
            });
            // 清空数据
            emptyObject(this.form);
          }).catch(error => {
            console.log(error)
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>
