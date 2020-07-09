<template>
  <div class="app-container">

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
        label="角色级别"
        prop="roleLevel"
      />
      <el-table-column
        label="角色别名"
        prop="roleLabel"
      />
      <el-table-column
        label="角色描述"
        prop="roleDesc"
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
        <template slot-scope="{row}">
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
import { getRoles } from '../../api/user'
import Pagination from '../../components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        keyword: ''
      },
      total: 1,
      batDelDisable: true,
      user: this.$store.getters.user,
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
    getRoleList() {
      getRoles(this.listQuery).then((res) => {
        this.list = Array.from(res.data.list)
        this.total = res.data.total
      })
    },
    handleAddRole() {
    },
    handleSelect() {
    },
    selectable() {
    },
    handleBatDelete() {
    }
  }
}
</script>

