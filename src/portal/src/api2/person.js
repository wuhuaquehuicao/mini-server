import request from '@/utils/request'

// 根据id获取用户
export function getUserById(id) {
  return request({
    url: '/users/' + id,
    method: 'get'
  })
}

// 更新用户
export function updateUser(id, params) {
  return request({
    url: '/users/' + id,
    method: 'put',
    data: params
  })
}
