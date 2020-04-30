<template>
  <el-dialog title="用户信息" :visible.sync="visible" width="650px" :close-on-click-modal="false">
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
      <el-button @click="visible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="visible = false" size="small">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserDialog',
  data() {
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
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
