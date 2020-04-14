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
