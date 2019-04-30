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
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/register', component: () => import('@/views/register/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

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

  // 客户
  {
    path: '/dealUser',
    component: Layout,
    redirect: '/dealuser/list',
    name: 'Dealuser',
    meta: { title: '客户', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/dealuser/list'),
        meta: { title: '查看', icon: 'table' }
      },
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/views/dealuser/add'),
        meta: { title: '新增', icon: 'table' }
      },
      {
        path: 'edit/:id',
        name: 'EditUser',
        component: () => import('@/views/dealuser/edit'),
        meta: { title: '编辑', icon: 'table' },
        hidden: true
      }
    ]
  },
  // 石灰记录
  {
    path: '/record',
    component: Layout,
    redirect: '/record/list',
    name: 'Record',
    meta: { title: '石灰记录', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/record/list'),
        meta: { title: '查看', icon: 'table' }
      },
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/views/record/add'),
        meta: { title: '新增', icon: 'table' }
      },
      {
        path: 'edit/:id',
        name: 'EditCaoRecord',
        component: () => import('@/views/record/edit'),
        meta: { title: '编辑', icon: 'table' },
        hidden: true
      },
      {
        path: 'statistics',
        name: 'StatisticsCaoRecord',
        component: () => import('@/views/record/statistics'),
        meta: { title: '统计', icon: 'table' }
      }
    ]
  },
  // 石头记录
  {
    path: '/stonerecord',
    component: Layout,
    redirect: '/stonerecord/list',
    name: 'StoneRecord',
    meta: { title: '石头记录', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/stonerecord/list'),
        meta: { title: '查看', icon: 'table' }
      },
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/views/stonerecord/add'),
        meta: { title: '新增', icon: 'table' }
      },
      {
        path: 'edit/:id',
        name: 'EditStoneRecord',
        component: () => import('@/views/stonerecord/edit'),
        meta: { title: '编辑', icon: 'table' },
        hidden: true
      },
      {
        path: 'statistics',
        name: 'StatisticsStoneRecord',
        component: () => import('@/views/stonerecord/statistics'),
        meta: { title: '统计', icon: 'table' }
      }
    ]
  },
  // 煤炭记录
  {
    path: '/coalrecord',
    component: Layout,
    redirect: '/coalrecord/list',
    name: 'CoalRecord',
    meta: { title: '煤炭记录', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/coalrecord/list'),
        meta: { title: '查看', icon: 'table' }
      },
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/views/coalrecord/add'),
        meta: { title: '新增', icon: 'table' }
      },
      {
        path: 'edit/:id',
        name: 'EditCoalRecord',
        component: () => import('@/views/coalrecord/edit'),
        meta: { title: '编辑', icon: 'table' },
        hidden: true
      },
      {
        path: 'statistics',
        name: 'StatisticsCoalRecord',
        component: () => import('@/views/coalrecord/statistics'),
        meta: { title: '统计', icon: 'table' }
      }
    ]
  },
  // 加窑记录
  {
    path: '/buildrecord',
    component: Layout,
    redirect: '/buildrecord/list',
    name: 'BuildRecord',
    meta: { title: '加窑记录', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/buildrecord/list'),
        meta: { title: '查看', icon: 'table' }
      },
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/views/buildrecord/add'),
        meta: { title: '新增', icon: 'table' }
      },
      {
        path: 'edit/:id',
        name: 'EditBuildRecord',
        component: () => import('@/views/buildrecord/edit'),
        meta: { title: '编辑', icon: 'table' },
        hidden: true
      },
      {
        path: 'statistics',
        name: 'StatisticsBuildRecord',
        component: () => import('@/views/buildrecord/statistics'),
        meta: { title: '统计', icon: 'table' }
      }
    ]
  },
  // 个人中心
  {
    path: '/user',
    component: Layout,
    redirect: '/user/me',
    name: 'User',
    meta: { title: '用户中心', icon: 'example' },
    children: [
      {
        path: 'me',
        name: 'Me',
        component: () => import('@/views/user/index'),
        meta: { title: '个人中心', icon: 'form' }
      },
      {
        path: 'edit',
        name: 'Edit',
        component: () => import('@/views/user/editInfo'),
        meta: { title: '修改资料', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
