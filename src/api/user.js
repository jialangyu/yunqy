//缴费类型的api接口
import request from '@/utils/request'

export default {
  getList: function () {
    return request({
      url: '/user',
      method: 'get',
    })
  },
  save: function (pojo) {
    return request({
      url: '/user',
      method: 'post',
      data: pojo
    })
  },
  findById: function (id) {
    return request({
      url: `/user/${id}`,
      method: 'get'
    })
  },
  update: function (id, pojo) {
    return request({
      url: `/user/${id}`,
      method: 'put',
      data: pojo
    })
  },
  //新增和修改合并为一个方法
  saveOrUpdate: function (id, pojo) {
    if (id != undefined && id != null && id != '') {
      return this.update(id, pojo);  //有id修改
    } else {
      return this.save(pojo);  //没有id,保存
    }
  },
  deleteById: function (id) {
    return request({
      url: `/user/${id}`,
      method: 'delete'
    })
  },
  search: function (page, size) {  //根据条件查询,需要查询的条件是js对象
    return request({
      //请求后台的地址,使用ES6里的模板字符串
      url: `/user/search/${page}/${size}`,
      method: 'post'
    })
  },
  changePwd: function (id,oldPassword,newPassword) {
    return request({
      url: `/user/updatepwd/${id}`,
      method: 'put',
      data: {
        oldPassword,
        newPassword
      }
    })
  },
  resetById: function (id) {
    return request({
      url: `/user/resetpwd/${id}`,
      method: 'put'
    })
  }
  // findAllGroup: function (userid) {
  //   return request({
  //     url: `/user/findAllGroup/${userid}`,
  //     method: 'post'
  //   })
  // }
}