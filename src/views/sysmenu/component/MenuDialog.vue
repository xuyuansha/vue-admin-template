<template>
  <div v-if="visible">
    <el-dialog title="菜单信息" :visible.sync="visible" width="700px" :close-on-click-modal="false">
      <el-form :model="form" status-icon :rules="rules" label-width="100px" label-position="right" ref="form">
        <el-form-item label="菜单名称:" prop="menuName">
          <el-input type="text" v-model="form.menuName" autocomplete="off" placeholder="长度1-20位字符"></el-input>
        </el-form-item>
        <el-form-item label="父菜单:" prop="parentMenuId">
          <el-select v-model="form.parentMenuId"  placeholder="请选择">
            <el-option
              v-for="menu in allMenus"
              :key="menu.menuId"
              :label="menu.menuName"
              :value="menu.menuId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标:" prop="menuIcon">
          <el-input type="text" v-model="form.menuIcon" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="序号:" prop="menuNumber">
          <el-input type="text" v-model="form.menuNumber" autocomplete="off" placeholder="整数"></el-input>
        </el-form-item>
        <el-form-item label="对应链接:" prop="menuUrl">
          <el-input type="text" v-model="form.menuUrl" autocomplete="off" placeholder="长度1-20位字符"></el-input>
        </el-form-item>
        <el-form-item label="组件名称:" prop="component">
          <el-input type="text" v-model="form.component" autocomplete="off" placeholder="长度1-20位字符"></el-input>
        </el-form-item>
        <el-form-item label="组件路径:" prop="path">
          <el-input type="text" v-model="form.path" autocomplete="off" placeholder="长度1-20位字符"></el-input>
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
import { updateMenu, loadOneLevelMenus } from '../../../api/user'
import { deepClone } from '../../../utils'

export default {
  name: 'MenuDialog',
  props: {
    menuInfo: Object
  },
  watch: {
    visible(val) {
      this.loadOneLevelMenus()

      if (val) {
        this.form = {
          menuName: '',
          menuNumber: '',
          menuIcon: '',
          menuUrl: '',
          parentMenuId: null,
          component: '',
          path: ''
        }
        if (this.menuInfo) {
          this.form.menuId = this.menuInfo.menuId
          this.form.menuName = this.menuInfo.menuName
          this.form.menuNumber = this.menuInfo.menuNumber
          this.form.menuIcon = this.menuInfo.menuIcon
          this.form.menuUrl = this.menuInfo.menuUrl
          this.form.parentMenuId = this.menuInfo.parentMenuId
          this.form.component = this.menuInfo.component
          this.form.path = this.menuInfo.path
        }
      }
    }
  },
  mounted() {
    // this.loadOneLevelMenus()
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    async loadOneLevelMenus() {
      const ret = await loadOneLevelMenus()
      this.allMenus = ret.data
    },
    handleSubmit() {
      this.$refs.form.validate(bool => {
        if (bool) {
          console.log(this.form)
          const option = deepClone(this.form)
          updateMenu(option).then(ret => {
            if (ret.code === 0) {
              this.hide()
              this.$parent.getMenuList()
            }
          })
        }
      })
    }
  },
  data() {
    const numberPass = (rule, value, callback) => {
      console.log(value, rule)
      const re = /^\d+$/
      if (!re.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      form: {
        menuName: '',
        menuNumber: '',
        menuIcon: '',
        menuUrl: '',
        parentMenuId: null,
        component: '',
        path: ''
      },
      allMenus: null,
      rules: {
        parentMenuId: [
          { required: true, message: '请选择父菜单', trigger: 'change' }
        ],
        menuNumber: [
          { required: true, validator: numberPass, trigger: 'blur' }
        ],
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
