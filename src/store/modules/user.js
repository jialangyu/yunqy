import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userid: sessionStorage.getItem('USERID') || '',
    name: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, id) => {
      state.userid = id
      sessionStorage.setItem('USERID', id)
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
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password).then(response => {
          const dataS = response.data
          if (response.flag) {
            if (dataS.id === '1138680837106176000') {
              commit('SET_ROLES', ['1'])
            } else {
              commit('SET_ROLES', ['0'])
            }
            commit('SET_USERID', dataS.id)
            commit('SET_NAME', dataS.username)
            setToken(dataS.token)
            commit('SET_TOKEN', dataS.token)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.userid).then(response => {
          const dataS = response.data
          if (dataS.id === '1138680837106176000') {
            commit('SET_ROLES', ['1'])
          } else {
            commit('SET_ROLES', ['0'])
          }
          commit('SET_USERID', dataS.id)
          commit('SET_NAME', dataS.username)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_USERID', '')
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_USERID', '')
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        sessionStorage.removeItem('GROUPName')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
