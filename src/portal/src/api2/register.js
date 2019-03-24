import request from '@/utils/request'


export function register(email_or_mobile, password) {
  return request({
    url: '/users',
    method: 'post',
    data: {
      email: email_or_mobile,
      password: password,
      count: 'noSure',
      name: 'noSure'
    }
  })
}
