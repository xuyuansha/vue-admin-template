<template>
  <div class="app-container">
    <div class="search-div">
      <el-input placeholder="请输入关键字搜索" max-length="20" size="small" v-model="listQuery.keyword">
        <el-button slot="append" icon="el-icon-search" @click="getLogList" />
      </el-input>
<!--      <el-button type="primary" icon="el-icon-plus" size="small" v-if="showOperator" @click="handleAddUser">添加用户</el-button>-->
    </div>
    <el-table :data="list" v-if="list" >
      <el-table-column  width="55" align="center"/>
      <el-table-column
        label="编号"
        align="center"
        type="index"
        width="60"
      />
      <el-table-column
        label="操作摘要"
        align="center"
        prop="operateSummary">
      </el-table-column>
      <el-table-column
        label="操作描述"
        prop="operateDesc"
      />
      <el-table-column
        label="操作状态"
        align="center"
        width="180"
        >
        <template slot-scope="{row}">
         <el-tag v-if="row.operateState==='Y'"  type="success">成功</el-tag>
          <el-tag v-else  type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作时间时间"
        prop="operateDate"
        align="center"
      />

    </el-table>
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" align="center" @pagination="getLogList" />
  </div>
</template>

<script>
import { getLogs } from '../../api/user'
import Pagination from '../../components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 1,
      userInfo: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        keyword: ''
      },
      user: this.$store.getters.user
    }
  },
  mounted() {
    // this.listLoading = true
    this.getLogList()
  },

  methods: {
    getLogList() {
      getLogs(this.listQuery).then(res => {
        console.log(res)
        this.total = res.data.total
        this.list = Array.from(res.data.list)
      })
    }
  }
}
</script>

<style>
  .search-div{
    text-align: right;
    margin: 10px;
  }
  .search-div .el-input {
    width: 280px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

