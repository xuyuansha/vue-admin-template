import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

export function getMenu() {
  return request({
    url: '/api/user/menus',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}

export function getUsers(data) {
  return request({
    url: '/api/system/user/v1',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/api/system/user/v1',
    method: 'post',
    data
  })
}

export function delUser(data) {
  const ids = data.map(item => item).join()
  return request({
    url: '/api/system/user/v1/' + ids,
    method: 'delete'
  })
}
