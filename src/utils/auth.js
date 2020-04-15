import Cookies from 'js-cookie'

const userKey = 'user_info'

export function getUserInfo() {
  return Cookies.get(userKey)
}

export function setUserInfo(user) {
  return Cookies.set(userKey, user)
}

export function removeUserInfo() {
  return Cookies.remove(userKey)
}

const userKey = 'user'

export function getUser() {
  return Cookies.get(userKey)
}

export function setUser(user) {
  return Cookies.set(userKey, user)
}

export function removeUser() {
  return Cookies.remove(userKey)
}
