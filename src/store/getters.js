const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  userInfo: state => state.user.userInfo,
  menus: state => state.user.menus,
  permission_routes: state => state.permission.routes
}
export default getters
