import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/401', component: () => import('@/views/401'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/paymoney',
    component: Layout,
    // alwaysShow: true,
    meta: { title: '缴费详情', icon: 'table' },
    children: [
      {
        path: 'groupPay',
        name: 'groupPay',
        component: () => import('@/views/table/groupPay'),
        meta: { title: '群组缴费' }
      },
      {
        path: 'groupItem',
        name: 'groupItem',
        hidden: true,
        component: () => import('@/views/table/groupItem')
      },
      {
        path: 'ownerPay',
        name: 'ownerPay',
        component: () => import('@/views/table/ownerPay'),
        meta: { title: '个人缴费' }
      }
    ]
  },
  {
    path: '/group',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'group',
        component: () => import('@/views/table/group'),
        meta: { title: '缴费群组', icon: 'group' }
      }
    ]
  },
  {
    path: '/type',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Type',
        component: () => import('@/views/table/type'),
        meta: { title: '缴费类型', icon: 'form' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/table/user'),
        meta: { title: '缴费用户', icon: 'peoples' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/personal',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '个人中心',
      icon: 'user',
      roles: ['0']
    },
    children: [
      {
        path: 'index',
        name: 'update',
        component: () => import('@/views/personal/update'),
        meta: { title: '修改资料' }
      },
      {
        path: 'pwd',
        name: 'changePwd',
        component: () => import('@/views/personal/changePwd'),
        meta: { title: '修改密码' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
