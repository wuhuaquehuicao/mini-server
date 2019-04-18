<template>
  <div class="app-container">
    <el-collapse-transition>
      <el-card v-show="showCard">
        <div slot="header" class="clearfix">
          <span>站点名称：{{ stationInfo.name }}</span>
          <i class="el-icon-close" style="float: right; padding: 3px 0; cursor: pointer;" @click="closeCard"/>
        </div>
        <div class="detailStation">
          <div>站点描述：{{ stationInfo.description }}</div>
          <div>创建时间：{{ new Date(stationInfo.createdDate) | formatDate("YYYY-MM-DD hh:mm:ss") }}</div>
          <div>修改时间：{{ new Date(stationInfo.modifiedDate) | formatDate("YYYY-MM-DD hh:mm:ss") }}</div>
          <div class="location" @click="$router.push({name: 'Amap', query: {lat: stationInfo.lat, lng: stationInfo.lng}})">高德定位</div>
        </div>
      </el-card>
    </el-collapse-transition>

    <el-form ref="dispensersForm" :inline="true" :model="dispensersForm" :rules="rules" style="margin-top: 20px;">
      <el-form-item label="加油机名称" prop="name">
        <el-input v-model="dispensersForm.name" placeholder="请输入加油机名称"/>
      </el-form-item>
      <el-form-item label="加油机类型" prop="type">
        <el-select v-model="dispensersForm.type" clearable filterable placeholder="请选择加油机类型">
          <el-option label="064" value="064"/>
          <el-option label="096" value="096"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addDispensers">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :header-cell-style="{background:'#F5F7FA'}" :data="content" style="width: 100%" stripe border>
      <el-table-column fixed prop="uuid" label="名称" width="100"/>
      <el-table-column prop="setup" label="类型" width="50"/>
      <el-table-column prop="supplier.name" label="供应厂商" width="200"/>
      <el-table-column prop="station.name" label="站点名称" width="100"/>
      <el-table-column label="黑匣子">
        <template slot-scope="scope">
          <el-tag v-for="(value, index) in scope.row.blackBoxs" :key="index" type="primary" style="margin: 2px;">{{ value.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdDate" label="购买时间" width="150"/>
      <el-table-column prop="modifiedDate" label="修改时间" width="150"/>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" @click="updateDispenser(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="deleteDispenser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="0" :total="total" :page-size="pageSize" layout="prev, pager, next" background center style="margin-top: 15px" @current-change="currentChange"/>

    <el-dialog :visible.sync="dialogFormVisible" title="编辑加油机" width="40%">
      <el-form ref="updateForm" :model="updateForm" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="加油机名称" prop="name">
          <el-input v-model="updateForm.name" auto-complete="off" placeholder="请输入加油机名称"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="加油机类型" prop="type">
          <el-select v-model="updateForm.type" clearable filterable placeholder="请选择加油机类型">
            <el-option label="064" value="064"/>
            <el-option label="096" value="096"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="sureUpdate">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { getSiteById, getDispensers, createDispenser, deleteDispenser, getDispenserById, updateDispenser } from '@/api/stations';
import { emptyObject, formatDate } from '@/utils';

export default {
  name: 'Dispensers',
  data() {
    return {
      showCard: true,
      stationInfo: [],
      stationId: this.$route.params.stationId,
      dispensersForm: {
        name: '',
        type: ''
      },
      content: [],
      loading: true,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      rules: {
        name: [
          { required: true, message: '请输入加油机名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择加油机类型', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      updateForm: {
        name: '',
        type: '',
        id: ''
      }
    }
  },
  created() {
    getSiteById(this.stationId).then((response) => {
      this.stationInfo = response;
    }).catch((error) => {
      console.log(error);
    });
    this.getDispensers();
  },
  methods: {
    // 关闭卡片
    closeCard() {
      this.showCard = false;
    },
    // 查询加油机
    getDispensers() {
      this.loading = true;
      getDispensers(this.stationId, this.currentPage - 1, this.pageSize).then((response) => {
        this.content = response.content;
        this.total = response.total;
        this.loading = false;
        this.content.forEach((value, index) => {
          value.createdDate = formatDate(new Date(value.createdDate), 'YYYY-MM-DD hh:mm:ss');
          value.modifiedDate = formatDate(new Date(value.modifiedDate), 'YYYY-MM-DD hh:mm:ss');
        });
      }).catch((error) => {
        this.loading = false;
        console.log(error);
      });
    },
    currentChange(val) {
      this.currentPage = val;
      this.getDispensers();
    },
    // 添加加油机
    addDispensers() {
      this.$refs.dispensersForm.validate((valid) => {
        if (valid) {
          createDispenser(this.stationId, this.dispensersForm.name, this.dispensersForm.type).then((response) => {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.getDispensers();
            emptyObject(this.dispensersForm);
            console.log(response);
          }).catch((error) => {
            console.log(error);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 更新加油机
    updateDispenser(id) {
      emptyObject(this.updateForm);
      this.updateForm.id = id;
      this.dialogFormVisible = true;
      getDispenserById(this.stationId, id).then((response) => {
        this.updateForm.name = response.uuid;
        this.updateForm.type = response.setup;
      }).catch((error) => {
        console.log(error);
      });
    },
    // 删除加油机
    deleteDispenser(id) {
      this.$confirm('确定删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDispenser(this.stationId, id).then((response) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.total--;
          if (this.total % this.pageSize === 0) {
            this.currentPage--;
            this.getDispensers();
          } else {
            this.getDispensers();
          }
        }).catch((error) => {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 确认更新
    sureUpdate() {
      this.$refs.updateForm.validate((valid) => {
        if (valid) {
          updateDispenser(this.stationId, this.updateForm.id, this.updateForm.name, this.updateForm.type).then((response) => {
            this.dialogFormVisible = false;
            this.content.forEach((value, index) => {
              if (value.id === response.id) {
                value.setup = response.setup;
                value.uuid = response.uuid;
                return false;
              }
            });
          }).catch((error) => {
            console.log(error);
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

<style>
  .detailStation {
    font-size: 14px;
    overflow: hidden;
  }
  .detailStation div{
    float: left;
    width: 25%;
  }
  .detailStation .location{
    color: #409eff;
    cursor: pointer;
  }
</style>

