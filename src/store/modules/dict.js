import userApi from '@/api/user'
import typeApi from '@/api/type'
const dict = {
  state: {
    uListArrs: [],
    typeArrs: []
  },
  mutations: {
    uListDicts: (state, value) => {
      state.uListArrs = value
    },
    typeDicts: (state, value) => {
      state.typeArrs = value
    }
  },
  actions: {
    getDictuList({ commit, state }) {
      return new Promise((resolve, reject) => {
        userApi.getList().then(response => {
          commit('uListDicts', response.data)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDictType({ commit, state }) {
      return new Promise((resolve, reject) => {
        typeApi.getList().then(response => {
          commit('typeDicts', response.data)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
export default dict
