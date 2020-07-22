<template>
  <div class="app-container">
    <delete-dialog :show.sync="dialogDeleteVisible" :title="deleteTitle" :content="deleteContent" @on-result-change="changeIsShowDialog" @child-operation="operation"></delete-dialog>
    <div class="search-div">
      <el-input placeholder="请输入角色名搜索" max-length="20" size="small" v-model="listQuery.keyword">
        <el-button slot="append" icon="el-icon-search" @click="getRoleList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" size="small" v-if="showOperator" @click="handleAddRole">添加角色</el-button>
    </div>
    <el-table :data="list" v-if="list" @selection-change="handleSelect">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column
        label="编号"
        align="center"
        type="index"
        width="60"
      />
      <el-table-column
        label="角色"
        align="center"
        prop="roleName"
        width="180">
      </el-table-column>

      <el-table-column
        label="别名"
        prop="roleLabel"
        width="180"
      />
      <el-table-column
        label="权限"
        max-width="200"
      >
        <template slot-scope="{row}">
          <span v-for="menu in row.menus" :key="menu.menuId"> {{ menu.menuName }} </span>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        prop="roleDesc"
        max-width="200"
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="addTime"
        align="center"
        width="240"
      />
      <el-table-column
        v-if="showOperator"
        label="操作"
        align="center"
        width="180">
        <template slot-scope="{row}" v-if="row.roleName != 'ADMIN'">
          <el-button size="mini" type="success" icon="el-icon-edit" @click="handleEdit(row)"/>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)"/>
        </template>
      </el-table-column>
    </el-table>

    <el-button size="mini" type="danger" style="margin: 10px" :disabled="batDelDisable" icon="el-icon-delete" @click="handleBatDelete">批量删除</el-button>
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" align="center" @pagination="getRoleList" />
  </div>
</template>

<script>
import { getRoles, delRole } from '../../api/user'
import DeleteDialog from '../../components/DeleteDialog/index'
import Pagination from '../../components/Pagination'
export default {
  components: { Pagination, DeleteDialog },
  data() {
    return {
      list: null,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        keyword: ''
      },
      total: 1,
      dialogDeleteVisible: false,
      deleteTitle: '',
      deleteContent: '',
      batDelDisable: true,
      user: this.$store.getters.user,
      deleteIds: []
    }
  },
  watch: {
  },
  mounted() {
    this.getRoleList()
  },
  computed: {
    showOperator() {
      return this.user.authorities && this.user.authorities.some(item => {
        if (item.authority === 'ROLE_ADMIN') {
          return true
        }
      })
    }
  },
  methods: {
    changeIsShowDialog(val) {
      this.dialogDeleteVisible = val
    },
    getRoleList() {
      getRoles(this.listQuery).then((res) => {
        this.list = Array.from(res.data.list)
        this.total = res.data.total
      })
    },
    handleAddRole() {
    },
    handleSelect(selections) {
      console.log(selections)
      this.deleteIds = []
      selections.forEach((item, selections) => {
        this.deleteIds.push(item.userId)
      })
      if (selections && selections.length > 0) {
        this.batDelDisable = false
      } else {
        this.batDelDisable = true
      }
    },
    selectable(row, index) {
      return row.roleName !== 'ADMIN'
    },
    handleDelete(row) {
      console.log(row)
      this.deleteIds = []
      this.deleteIds.push(row.roleId)
      this.deleteTitle = '删除角色'
      this.deleteContent = '确定要删除角色 ' + row.roleName + ' 吗？'
      this.dialogDeleteVisible = true
    },
    handleBatDelete() {
      this.deleteTitle = '删除角色'
      this.deleteContent = '确定要删除选中的所有角色吗？'
      this.dialogDeleteVisible = true
    },
    operation(type) {
      if (type === 'confirm') {
        this.dialogDeleteVisible = false
        delRole(this.deleteIds).then(res => {
          console.log(res)
          this.$message({
            showClose: true,
            message: '删除成功！',
            type: 'success'
          })
          this.getUserList()
        })
      } else if (type === 'cancel') {
        this.dialogDeleteVisible = false
      }
    },
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
</style>

