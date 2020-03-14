// 缴费管理的api接口
import request from '@/utils/request'

export default {
  save: function(pojo) {
    return request({
      url: '/paymoney',
      method: 'post',
      data: pojo
    })
  },
  findById: function(id) {
    return request({
      url: `/paymoney/${id}`,
      method: 'get'
    })
  },
  update: function(id, pojo) {
    return request({
      url: `/paymoney/${id}`,
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
      url: `/paymoney/${id}`,
      method: 'delete'
    })
  },
  findSearch: function(data) {
    return request({
      url: `/paymoney/search`,
      method: 'post',
      data: data
    })
  },
  findSumCount: function(groupid) {
    return request({
      url: `paymoney/sumPayMoneyByGroupid/${groupid}`,
      method: 'get'
    })
  },
  findSumCountByType: function(groupid, typeid) {
    return request({
      url: `/paymoney/sumPayMoneyByGroupidAndTypeid/${groupid}/${typeid}`,
      method: 'get'
    })
  },
  // 查询某用户在某群组中分摊的总金额
  findSumCountShareByUser: function(groupid, userid, year) {
    return request({
      url: `paymoney/shareSumPayMoney/${groupid}/${userid}/${year}`,
      method: 'get'
    })
  },
  findSumCountShareByTypeUser: function(groupid, typeid, userid) {
    return request({
      url: `/paymoney/sumPayMoneyByGroupidAndTypeidAndUserid/${groupid}/${typeid}/${userid}`,
      method: 'get'
    })
  },
  // 按年份统计分类消费
  findListTypeTotalCountByYear: function(groupid, year) {
    return request({
      url: `/paymoney/findListTypeTotalCountByYear/${groupid}/${year}`,
      method: 'get'
    })
  },
  // 按照年份统计消费
  findSumByYear: function(groupid, year) {
    return request({
      url: `/paymoney/findListSumCountByYear/${groupid}/${year}`,
      method: 'get'
    })
  },
  // 年度总消费
  findSumCountAllCost: function(groupid, year) {
    return request({
      url: `/paymoney/sumPayMoney/${groupid}/${year}`,
      method: 'get'
    })
  },

  searchOwner: function(data) {
    return request({
      url: `/indivpaymoney/search`,
      method: 'post',
      data: data
    })
  },
  // findSearchOwner: function(data) {
  //   return request({
  //     url: `/indivpaymoney/findSearch`,
  //     method: 'post',
  //     data: data
  //   })
  // },
  saveOwner: function(pojo) {
    return request({
      url: '/indivpaymoney',
      method: 'post',
      data: pojo
    })
  },
  findByIdOwner: function(id) {
    return request({
      url: `/indivpaymoney/${id}`,
      method: 'get'
    })
  },
  updateOwner: function(id, pojo) {
    return request({
      url: `/indivpaymoney/${id}`,
      method: 'put',
      data: pojo
    })
  },
  // 新增和修改合并为一个方法
  saveOrUpdateOwner: function(id, pojo) {
    if (id !== undefined && id !== null && id !== '') {
      return this.updateOwner(id, pojo) // 有id修改
    } else {
      return this.saveOwner(pojo) // 没有id,保存
    }
  },
  deleteByIdOwner: function(id) {
    return request({
      url: `/indivpaymoney/${id}`,
      method: 'delete'
    })
  },
  findSumCountOwner: function(userid) {
    return request({
      url: `/indivpaymoney/sum/${userid}`,
      method: 'get'
    })
  },

  // 按年份统计分类消费
  findListTypeTotalCountByYearOwner: function(userid, typeid) {
    return request({
      url: `/indivpaymoney/findListTypeTotalCountByYear/${userid}/${typeid}`,
      method: 'get'
    })
  },

  // 按照年份统计消费
  findSumByYearOwner: function(userid, year) {
    return request({
      url: `/indivpaymoney/findListSumCountByYear/${userid}/${year}`,
      method: 'get'
    })
  },

  // 年度总消费
  findSumCountAllCostOwner: function(userid, year) {
    return request({
      url: `/indivpaymoney/sumPayMoney/${userid}/${year}`,
      method: 'get'
    })
  }
}
