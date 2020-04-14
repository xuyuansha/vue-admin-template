<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ userInfo.nickName }}</div>
    <div class="dashboard-text">menus: <span v-for="menu in menus" :key="menu.id">{{ menu.menuName }}</span></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'userInfo',
      'menus'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
