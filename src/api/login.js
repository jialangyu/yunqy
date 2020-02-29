import request from '@/utils/request'
export function login(telno, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      telno,
      password
    }
  })
}

export function getInfo(id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function register(telno, password) {
  return request({
    url: '/user/register',
    method: 'post',
    data: {
      telno,
      password
    }
  })
}
