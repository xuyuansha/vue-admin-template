const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  user: state => state.user.user,
  menus: state => state.user.menus,
  permission_routes: state => state.permission.routes
}
export default getters
