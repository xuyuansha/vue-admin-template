<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    @close="$emit('update:show', false)"
    width="350px"
    :close-on-click-modal="false"
  >{{content}}
    <div slot="footer" class="dialog-footer">
      <el-button @click="childOperation('cancel')" size="small">取 消</el-button>
      <el-button type="primary" @click="childOperation('confirm')" size="small">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DeleteDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '确定删除'
    },
    content: {
      type: String,
      default: '确定要删除记录吗？'
    }
  },
  data() {
    return {
      visible: this.show
    }
  },
  watch: {
    show(val) {
      this.visible = val
    },
    visible(val) {
      this.$emit('on-result-change', val)
    }
  },
  methods: {
    childOperation(value) {
      this.$emit('child-operation', value)
    }
  }
}
</script>

<style scoped>

</style>
