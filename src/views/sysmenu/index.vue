<template>
  <div class="app-container">
    <delete-dialog :show.sync="dialogDeleteVisible" :title="deleteTitle" :content="deleteContent" @on-result-change="changeIsShowDialog" @child-operation="operation"></delete-dialog>
    <menu-dialog ref="addDialog" :menuInfo="menuInfo"></menu-dialog>
    <div class="search-div">
      <el-input placeholder="请输入菜单名搜索" max-length="20" size="small" v-model="listQuery.keyword">
        <el-button slot="append" icon="el-icon-search" @click="getMenuList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" size="small" v-if="showOperator" @click="handleAddMenu">添加菜单</el-button>
    </div>
    <el-table :data="list" v-if="list" @selection-change="handleSelect" :tree-props="{children: 'subMenu'}"  row-key="menuId" default-expand-all>
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column
        label="编号"
        align="center"
        type="index"
        width="60"
      />
      <el-table-column
        label="菜单名称"
        align="center"
        prop="menuName"/>
      <el-table-column
        label="图标"
        align="center"
        >
        <template slot-scope="{row}">
          <svg-icon  :icon-class="row.menuIcon"> </svg-icon>
        </template>
      </el-table-column>
      <el-table-column
        label="序号"
        align="center"
        prop="menuNumber"/>
      <el-table-column
        label="菜单级别"
        align="center">
      <template slot-scope="{row}">
        <span  v-if="row.parentMenuId === 0"> 一级菜单 </span>
        <span  v-else> 二级菜单 </span>
      </template>
      </el-table-column>
      <el-table-column
        v-if="showOperator"
        label="操作"
        align="center"
        width="180">
        <template slot-scope="{row}" v-if="row.menuName != 'ADMIN'">
          <el-button size="mini" type="success" icon="el-icon-edit" @click="handleEdit(row)"/>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)"/>
        </template>
      </el-table-column>
    </el-table>

    <el-button size="mini" type="danger" style="margin: 10px" :disabled="batDelDisable" icon="el-icon-delete" @click="handleBatDelete">批量删除</el-button>
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" align="center" @pagination="getMenuList" />
  </div>
</template>

<script>
import { getMenus, delMenu } from '../../api/user'
import DeleteDialog from '../../components/DeleteDialog/index'
import Pagination from '../../components/Pagination'
import MenuDialog from './component/MenuDialog'
export default {
  components: { MenuDialog, Pagination, DeleteDialog },
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
      deleteIds: [],
      menuInfo: null
    }
  },
  watch: {
  },
  mounted() {
    this.getMenuList()
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
    getMenuList() {
      getMenus(this.listQuery).then((res) => {
        this.list = Array.from(res.data.list)
        this.total = res.data.total
      })
    },
    handleEdit(row) {
      this.menuInfo = row
      this.$refs.addDialog.show()
    },
    handleAddMenu() {
      this.menuInfo = null
      this.$refs.addDialog.show()
    },
    handleSelect(selections) {
      console.log(selections)
      this.deleteIds = []
      selections.forEach((item, selections) => {
        this.deleteIds.push(item.menuId)
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
      this.deleteIds.push(row.menuId)
      this.deleteTitle = '删除菜单'
      this.deleteContent = '确定要删除菜单 ' + row.menuName + ' 吗？'
      this.dialogDeleteVisible = true
    },
    handleBatDelete() {
      this.deleteTitle = '删除菜单'
      this.deleteContent = '确定要删除选中的所有菜单吗？'
      this.dialogDeleteVisible = true
    },
    operation(type) {
      if (type === 'confirm') {
        this.dialogDeleteVisible = false
        delMenu(this.deleteIds).then(res => {
          console.log(res)
          this.$message({
            showClose: true,
            message: '删除成功！',
            type: 'success'
          })
          this.getMenuList()
        })
      } else if (type === 'cancel') {
        this.dialogDeleteVisible = false
      }
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
</style>

