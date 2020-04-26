<template>
  <div class="app-container">
    <delete-dialog :show.sync="dialogDeleteVisible" :title="deleteTitle" :content="deleteContent" @on-result-change="changeIsShowDialog" @child-operation="operation"></delete-dialog>
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="650px" :close-on-click-modal="false">
      <el-form :model="form" status-icon :rules="rules" label-width="80px" label-position="right">
        <el-container>
          <el-aside width="60%">
            <el-form-item label="用户名:" prop="username">
              <el-input type="text" v-model="form.username" autocomplete="off" placeholder="长度3-20位字符"></el-input>
            </el-form-item>
            <el-form-item label="昵称:" prop="nickName">
              <el-input type="text" v-model="form.nickName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="checkPass">
              <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色:" prop="roles">
              <el-select v-model="form.roles" multiple placeholder="请选择">
                <el-option
                  v-for="(r,indexk) in allRoles"
                  :key="indexk"
                  :label="r.roleName"
                  :value="r.roleId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-aside>
          <el-main style="text-align: center">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="form.userPhoto" :src="form.userPhoto" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span>上传头像</span>
          </el-main>
        </el-container>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <div class="search-div">
      <el-input placeholder="请输入用户名或昵称搜索" max-length="20" size="small" v-model="listQuery.keyword">
        <el-button slot="append" icon="el-icon-search" @click="getUserList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" size="small" v-if="showOperator" @click="dialogFormVisible = true, form={}">添加用户</el-button>
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
        label="头像"
        align="center"
        width="180">
        <template slot-scope="{row}">
          <el-avatar :src="row.userPhoto" shape="square" />
        </template>
      </el-table-column>
      <el-table-column
        label="用户名"
        prop="username"
      />
      <el-table-column
        label="昵称"
        prop="nickName"
      />
      <el-table-column
        label="角色"
      >
        <template slot-scope="{row}">
          <span v-for="(role, index) in row.roles" :key="index"> {{ role.roleName }} </span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        :formatter="formatStatus"
        width="180"
        :filters="[{ text: '可用', value: 'true'}, { text: '禁用', value: 'false'}]">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="可用"
            inactive-text="禁用">
          </el-switch>
        </template>
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
        <template slot-scope="{row}" v-if="row.username != 'admin'">
          <el-button size="mini" type="success" icon="el-icon-edit" @click="handleEdit(row)"/>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)"/>
        </template>
      </el-table-column>
    </el-table>

    <el-button size="mini" type="danger" style="margin: 10px" :disabled="batDelDisable" icon="el-icon-delete" @click="handleBatDelete">批量删除</el-button>
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" align="center" @pagination="getUserList" />
  </div>
</template>

<script>
import { getUsers } from '../../api/user'
import Pagination from '../../components/Pagination'
import DeleteDialog from '../../components/DeleteDialog/index'

export default {
  components: { DeleteDialog, Pagination },
  data() {
    return {
      list: null,
      dialogFormVisible: false,
      dialogDeleteVisible: false,
      total: 1,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        keyword: ''
      },
      batDelDisable: true,
      user: this.$store.getters.user,
      form: {
        username: '',
        nickName: '',
        password: '',
        checkPass: '',
        roles: []
      },
      allRoles: [
        {
          roleName: 'ADMIN',
          roleId: 1
        },
        {
          roleName: 'USER',
          roleId: 2
        }
      ],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      deleteTitle: '',
      deleteContent: '',
      deleteIds: []
    }
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
        this.total = res.data.total
        this.list = Array.from(res.data.list)
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    formatStatus(row, column, cellValue, index) {
      return row.enabled ? '可用' : '禁用'
    },
    handleEdit(row) {
      this.dialogFormVisible = true
      this.form = row
    },
    handleDelete(row) {
      console.log(row)
      this.deleteIds = []
      this.deleteIds.push(row.userId)
      this.deleteTitle = '删除用户'
      this.deleteContent = '确定要删除用户 ' + row.username + ' 吗？'
      this.dialogDeleteVisible = true
    },
    handleBatDelete() {
      this.deleteTitle = '删除用户'
      this.deleteContent = '确定要删除选中的所有用户吗？'
      this.dialogDeleteVisible = true
    },
    selectable(row, index) {
      return row.username !== 'admin'
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
    operation(type) {
      if (type === 'confirm') {
        this.dialogDeleteVisible = false
      } else if (type === 'cancel') {
        this.dialogDeleteVisible = false
      }
    },
    changeIsShowDialog(val) {
      this.dialogDeleteVisible = val
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

