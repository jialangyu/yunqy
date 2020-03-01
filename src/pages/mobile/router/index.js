import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import LayoutH5 from '../views/layout/LayoutH5'

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
  { path: '/login', component: resolve => require(['../views/login'], resolve), hidden: true },
  { path: '/register', component: resolve => require(['../views/register'], resolve), hidden: true },
  // { path: '/404', component: resolve => require(['../views/404'], resolve), hidden: true },
  // { path: '/401', component: resolve => require(['../views/401'], resolve), hidden: true },
  {
    path: '/',
    component: LayoutH5,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: resolve => require(['../views/dashboard/index'], resolve)
    }]
  },
  {
    path: '',
    component: LayoutH5,
    children: [
      {
        path: '/home',
        name: 'home',
        redirect: { name: 'myGroups' },
        component: resolve => require(['../views/home/index'], resolve),
        meta: { active: 'home', title: '首页' },
        children: [
          {
            path: 'myGroups',
            name: 'myGroups',
            component: resolve => require(['../views/home/myGroups'], resolve),
            meta: { active: 'home', title: '所在群组' }
          },
          {
            path: 'oPay',
            name: 'ownerPay',
            component: resolve => require(['../views/home/ownerPay/index'], resolve),
            meta: { active: 'home', title: '个人缴费详情' }
          }
        ]
      },
      {
        path: 'gPay',
        name: 'groupPay',
        component: resolve => require(['../views/home/groupPay/index'], resolve),
        meta: { active: 'home', title: '群组缴费详情' }
      },
      {
        path: 'gPay/edit',
        name: 'editGroupPay',
        component: resolve => require(['../views/home/groupPay/edit'], resolve),
        meta: { active: 'home', title: '编辑群组缴费' }
      },
      {
        path: 'oPay/edit',
        name: 'editOwnerPay',
        component: resolve => require(['../views/home/ownerPay/edit'], resolve),
        meta: { active: 'home', title: '编辑个人缴费' }
      }
    ]
  },
  {
    path: '',
    component: LayoutH5,
    children: [
      {
        path: '/group',
        name: 'group',
        component: resolve => require(['../views/group/index'], resolve),
        meta: { active: 'group', title: '缴费群组' }
      },
      {
        path: '/group/edit',
        name: 'editGroup',
        component: resolve => require(['../views/group/edit'], resolve),
        meta: { active: 'group', title: '编辑群组' }
      },
      {
        path: '/group/members',
        name: 'groupM',
        component: resolve => require(['../views/group/members'], resolve),
        meta: { active: 'group', title: '群组成员' }
      }
    ]
  },
  {
    path: '',
    component: LayoutH5,
    children: [
      {
        path: '/type',
        name: 'type',
        component: resolve => require(['../views/type/index'], resolve),
        meta: { active: 'type', title: '缴费类型' }
      },
      {
        path: '/type/edit',
        name: 'editType',
        component: resolve => require(['../views/type/edit'], resolve),
        meta: { active: 'type', title: '编辑类型' }
      }
    ]
  },
  {
    path: '',
    component: LayoutH5,
    children: [
      {
        path: '/mine',
        name: 'mine',
        component: resolve => require(['../views/mine/index'], resolve),
        meta: { active: 'mine', title: '个人中心' }
      },
      {
        path: 'update',
        name: 'update',
        component: resolve => require(['../views/mine/update'], resolve),
        meta: { active: 'mine', title: '修改资料' }
      },
      {
        path: 'changePwd',
        name: 'changePwd',
        component: resolve => require(['../views/mine/changePwd'], resolve),
        meta: { active: 'mine', title: '修改密码' }
      }
    ]
  },
  {
    path: '',
    component: LayoutH5,
    children: [
      {
        path: '/user',
        name: 'user',
        component: resolve => require(['../views/user/index'], resolve),
        meta: { active: 'user', title: '缴费用户' }
      },
      {
        path: '/user/edit',
        name: 'editUser',
        component: resolve => require(['../views/user/edit'], resolve),
        meta: { active: 'user', title: '编辑用户' }
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
  // { path: '*', redirect: '/404', hidden: true }
]
