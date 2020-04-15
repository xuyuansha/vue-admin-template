import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'
import Layout from '@/layout/index'

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
// {
//   path: '/example',
//     component: Layout,
//   redirect: '/example/table',
//   name: 'Example',
//   meta: { title: 'Example', icon: 'example' },
//   children: [
//     {
//       path: 'table',
//       name: 'Table',
//       component: () => import('@/views/table/index'),
//       meta: { title: 'Table', icon: 'table' }
//     },
//     {
//       path: 'tree',
//       name: 'Tree',
//       component: () => import('@/views/tree/index'),
//       meta: { title: 'Tree', icon: 'tree' }
//     }
//   ]
// },
export const formatRoutes = (routes) => {
  const fmRoutes = []
  routes.forEach(router => {
    console.log(router)
    const fmRouter = {
    }
    fmRouter.path = router.path
    fmRouter.component = Layout
    fmRouter.name = router.menuName
    fmRouter.redirect = '/example/table'
    fmRouter.meta = { title: router.menuName, icon: router.menuIcon }
    const children = router.subMenu
    const childrenRoutes = []
    if (children) {
      children.forEach(child => {
        const childRoute = {
        }
        // childRoute.path = child.path
        childRoute.component = () => import('@/views/nested/menu1/index')
        childRoute.path = 'tree'
        childRoute.name = child.menuName
        childRoute.meta = { title: child.menuName, icon: child.menuIcon }
        childrenRoutes.push(childRoute)
      })
      fmRouter.children = childrenRoutes
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
