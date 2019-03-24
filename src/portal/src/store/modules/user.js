import { getToken, setToken, removeToken, getUserId, setUserId, removeUserId } from '@/utils/auth'
import request from "@/utils/request";

const user = {
  state: {
    token: getToken(),
    userId: getUserId(),
    name: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        request({
          url: '/users/login',
          method: 'post',
          data: {
            email: username,
            mobile: username,
            password: userInfo.password
          }
        }).then(response => {
          // 存储token，id
          setToken(response.token)
          setUserId(response.id);
          commit('SET_TOKEN', response.token)
          commit('SET_USERID', response.id)
          resolve()
        }).catch(error => {
          reject(error)
        })
      });
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/users/' + state.userId,
          method: 'get'
        }).then(response => {
          commit('SET_NAME', response.name)
          // commit('SET_ROLES', response.roles)     // 用户权限
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_USERID', '')
        commit('SET_NAME', '')
        commit('SET_ROLES', [])
        // 清除token,userid
        removeToken()
        removeUserId();
        resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USERID', '')
        commit('SET_NAME', '')
        commit('SET_ROLES', [])
        // 清除token,userid
        removeToken()
        removeUserId();
        resolve()
      })
    },

    // 设置用户名
    setUserName({ commit, state }, username) {
      commit('SET_NAME', username);
    }
  }
}

export default user
