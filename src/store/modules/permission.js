import { constantRoutes } from '@/router'
import store from '@/store'
import Layout from '@/layout/index'
import el from 'element-ui/src/locale/lang/el'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      // const accessedRoutes = asyncRoutes
      const accessedRoutes = formatRoutes(store.getters.menus)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export const formatRoutes = (routes) => {
  const fmRoutes = []
  routes.forEach(router => {
    console.log(router)
    const fmRouter = {
    }
    fmRouter.path = router.path
    if (router.component === 'Layout') {
      fmRouter.component = Layout
    } else {
      fmRouter.component = () => import(`../../views/${router.path}/index`)
    }
    fmRouter.name = router.component
    fmRouter.meta = { title: router.menuName, icon: router.menuIcon }

    if (router.subMenu && router.subMenu.length) {
      fmRouter.children = formatRoutes(router.subMenu)
    }
    fmRoutes.push(fmRouter)
  })
  console.log(fmRoutes)
  return fmRoutes
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
