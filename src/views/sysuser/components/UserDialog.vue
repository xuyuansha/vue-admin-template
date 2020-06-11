<template>
  <div v-if="visible">
    <el-dialog title="用户信息" :visible.sync="visible" width="700px" :close-on-click-modal="false">
      <el-form :model="form" status-icon :rules="rules" label-width="100px" label-position="right" ref="form">
        <el-container>
          <el-aside width="60%">
            <el-form-item label="用户名:" prop="username">
              <el-input type="text" v-model="form.username" autocomplete="off" placeholder="长度1-20位字符"></el-input>
            </el-form-item>
            <el-form-item label="昵称:" prop="nickName">
              <el-input type="text" v-model="form.nickName" autocomplete="off" placeholder="长度1-20位字符"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input type="password" v-model="form.password" autocomplete="off" placeholder="长度6位以上，含字母、数字、下划线"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="checkPass">
              <el-input type="password" v-model="form.checkPass" autocomplete="off" placeholder="长度6位以上，含字母、数字、下划线"></el-input>
            </el-form-item>
            <el-form-item label="角色:" prop="roles">
              <el-select v-model="form.roles" multiple placeholder="请选择">
                <el-option
                  v-for="r in allRoles"
                  :key="r.roleId"
                  :label="r.roleLabel"
                  :value="r.roleId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-aside>
          <el-main style="text-align: center">
            <el-upload
              class="avatar-uploader"
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="getFile"
              accept="image/jpeg,image/gif,image/png"
              >
              <el-image v-if="form.userPhoto && form.userPhoto!==''" :src="form.userPhoto" class="avatar"></el-image>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p>上传头像</p>
            <div>(3M以内，支持jpg,png,gif格式)</div>
          </el-main>
        </el-container>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" size="small">确 定</el-button>
      </div>
  </el-dialog>
  </div>
</template>

<script>
import { updateUser, getAllRoles } from '../../../api/user'
import { isvalidPass } from '../../../utils/validate'

export default {
  name: 'UserDialog',
  props: {
    userInfo: Object
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.userInfo) {
          this.form = JSON.parse(JSON.stringify(this.userInfo))
        } else {
          this.form = {
            username: '',
            nickName: '',
            password: '',
            checkPass: '',
            userPhoto: '',
            roles: []
          }
        }
      }
    }
  },
  mounted() {
    this.loadRoles()
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    async loadRoles() {
      const ret = await getAllRoles()
      this.allRoles = ret.data
    },
    getFile(file, fileList) {
      // console.log(file.raw.size, file.raw.type)
      if (file.raw.size / 1024 / 1024 > 3) {
        this.$message.error('不能超过3M')
        return
      }
      // image/jpeg,image/gif,image/png,image/jpg
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/jpg' && file.raw.type !== 'image/png' && file.raw.type !== 'image/gif') {
        this.$message.error('只支持.jpg, .png, .gif格式')
        return
      }

      this.getBase64(file.raw).then(res => {
        // console.log(res)
        this.$set(this.form, 'userPhoto', res)
      })
    },
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    },
    handleSubmit() {
      this.$refs.form.validate(bool => {
        if (bool) {
          console.log(this.form)
          updateUser(this.form)
        }
      })
    }
  },
  data() {
    const validatePwd = (rule, value, callback) => {
      if (!this.userInfo && value === '') {
        callback(new Error('请输入密码'))
      } else if (!isvalidPass(value)) {
        callback(
          new Error('长度6-18位 只能包含字母、数字和下划线')
        )
      } else {
        callback()
      }
    }
    const validatePwd2 = (rule, value, callback) => {
      if (!this.userInfo && value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
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
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        nickName: [
          { required: false, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePwd, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePwd2, trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
