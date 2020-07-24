<template>
  <div v-if="visible">
    <el-dialog title="角色信息" :visible.sync="visible" width="700px" :close-on-click-modal="false">
      <el-form :model="form" status-icon :rules="rules" label-width="100px" label-position="right" ref="form">
        <el-form-item label="角色名称:" prop="roleName">
          <el-input type="text" v-model="form.roleName" autocomplete="off" placeholder="长度1-20位字符"></el-input>
        </el-form-item>
        <el-form-item label="别名:" prop="roleLabel">
          <el-input type="text" v-model="form.roleLabel" autocomplete="off" placeholder="长度1-20位字符"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="roleDesc">
          <el-input type="text" v-model="form.roleDesc" autocomplete="off" placeholder="长度200位以内"></el-input>
        </el-form-item>
        <el-form-item label="可用菜单:" >
          <el-tree
            ref="menuTree"
            :default-expanded-keys="form.menus"
            :default-checked-keys="form.menus"
            :data="allMenus"
            node-key="menuId"
            :props="defaultProps"
            show-checkbox>
          </el-tree>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" size="small">确 定</el-button>
      </div>
  </el-dialog>
  </div>
</template>

<script>
import { updateRole, getAllMenus } from '../../../api/user'
import { validUsername } from '@/utils/validate'
import { deepClone } from '../../../utils'

export default {
  name: 'RoleDialog',
  props: {
    roleInfo: Object
  },
  watch: {
    visible(val) {
      if (val) {
        this.form = {
          roleName: '',
          roleLabel: '',
          roleDesc: '',
          menus: []
        }
        if (this.roleInfo) {
          this.form.roleId = this.roleInfo.roleId
          this.form.roleName = this.roleInfo.roleName
          this.form.roleLabel = this.roleInfo.roleLabel
          this.form.roleDesc = this.roleInfo.roleDesc
          this.form.menus = this.roleInfo.menus.map(x => { return x.menuId })
        }
      }
    }
  },
  mounted() {
    this.loadMenus()
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    async loadMenus() {
      const ret = await getAllMenus()
      this.allMenus = ret.data
    },
    handleSubmit() {
      this.$refs.form.validate(bool => {
        if (bool) {
          console.log(this.form)
          const option = deepClone(this.form)
          option.menus = this.$refs.menuTree.getCheckedKeys()
          updateRole(option).then(ret => {
            if (ret.code === 0) {
              this.hide()
              this.$parent.getRoleList()
            }
          })
        }
      })
    }
  },
  data() {
    const validateRoleName = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('3-20个字符，字母开头，只能包含字母数字下划线'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      form: {
        roleName: '',
        roleLabel: '',
        roleDesc: '',
        menus: []
      },
      allMenus: null,
      defaultProps: {
        children: 'subMenu',
        label: 'menuName'
      },
      rules: {
        roleName: [
          { required: true, trigger: 'blur', validator: validateRoleName }
        ],
        roleLabel: [
          { required: false, message: '请输入别名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
