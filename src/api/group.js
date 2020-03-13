import request from '@/utils/request'

export default {
  search: function(data) {
    return request({
      url: `/group/search/`,
      method: 'post',
      data: data
    })
  },
  findById: function(id) {
    return request({
      url: `/group/${id}`,
      method: 'get'
    })
  },
  save: function(pojo) {
    return request({
      url: '/group',
      method: 'post',
      data: pojo
    })
  },
  update: function(id, pojo) {
    return request({
      url: `/group/${id}`,
      method: 'put',
      data: pojo
    })
  },
  // 新增和修改合并为一个方法
  saveOrUpdate: function(id, pojo) {
    if (id !== undefined && id !== null && id !== '') {
      return this.update(id, pojo) // 有id修改
    } else {
      return this.save(pojo) // 没有id,保存
    }
  },
  deleteById: function(id) {
    return request({
      url: `/group/${id}`,
      method: 'delete'
    })
  },
  joinGroup: function(dataS) {
    return request({
      url: `/group/addusertogroup`,
      method: 'post',
      data: dataS
    })
  },
  outGroup: function(userid, groupid) {
    return request({
      url: `/group/userSignOutGroup/${userid}/${groupid}`,
      method: 'get'
    })
  },
  findAllUserById: function (groupid) {
    return request({
      url: `/group/findAllUserById/${groupid}`,
      method: 'post'
    })
  }
}
