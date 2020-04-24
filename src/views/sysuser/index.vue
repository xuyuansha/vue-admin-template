<template>
  <div class="app-container">
    <el-dialog title="确定删除"></el-dialog>

    <el-table :data="list" v-if="list">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column
        label="编号"
        align="center"
        type="index"
        width="180"
      />
      <el-table-column
        label="用户名"
        prop="username"
        width="180"
      />
      <el-table-column
        label="头像"
        align="center">
        <template slot-scope="{row}">
          <el-avatar :src="row.userPhoto" shape="square"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        :formatter="formatStatus"
        width="180"
        :filters="[{ text: '可用', value: 'true'}, { text: '禁用', value: 'false'}]"
        >
        <template slot-scope="{row}">
          <el-tag v-if="row.enabled" type="success">可用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" icon="el-icon-edit"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)"></el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-button size="mini" type="danger" style="margin: 10px" disabled>批量删除</el-button>
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUserList" align="center"></Pagination>
  </div>
</template>

<script>
import { getUsers } from '../../api/user'
import Pagination from '../../components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      centerDialogVisible: false,
      total: 1,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: ''
      }
    }
  },
  watch: {
  },
  mounted() {
    // this.listLoading = true
    this.getUserList()
  },

  methods: {
    getUserList() {
      getUsers(this.listQuery).then(res => {
        console.log(res)
        this.list = Array.from(res.data)
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    formatStatus(row, column, cellValue, index) {
      return row.enabled ? '可用' : '禁用'
    },
    handleDelete(row) {
      console.log(row)
      this.centerDialogVisible = true
    }
  }
}
</script>

