import Cookies from 'js-cookie'

const TokenKey = 'myToken'
const UserId = 'userId'
const Roles = 'roles'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserId() {
  return Cookies.get(UserId)
}

export function setUserId(userId) {
  return Cookies.set(UserId, userId)
}

export function removeUserId() {
  return Cookies.remove(UserId)
}

export function getRoles() {
  return Cookies.get(Roles)
}

export function setRoles(roles) {
  return Cookies.set(Roles, roles)
}

export function removeRoles() {
  return Cookies.remove(Roles)
}
