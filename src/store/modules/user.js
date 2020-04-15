import { login, logout, getInfo, getMenu } from '@/api/user'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    user: getUser(),
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    menus: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        console.log('---->', response)
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_USER', data)
        setToken(data.token)
        setUser(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getMenu({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenu().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        console.log(data)
        const menus = data

        // roles must be a non-empty array
        if (!menus || menus.length <= 0) {
          reject('getInfo: menus must be a non-null array!')
        }

        commit('SET_MENUS', menus)
        // commit('SET_NAME', nickName)
        // commit('SET_AVATAR', userPhoto)
        resolve(menus)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, nickName, userPhoto } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', nickName)
        commit('SET_AVATAR', userPhoto)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        removeUser()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeUser()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

