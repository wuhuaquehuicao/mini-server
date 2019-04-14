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

  // 石灰客户
  {
    path: '/caouser',
    component: Layout,
    redirect: '/caouser/list',
    name: 'Caouser',
    meta: { title: '石灰用户', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/caouser/list'),
        meta: { title: '查看', icon: 'table' }
      },
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/views/caouser/edit'),
        meta: { title: '新增', icon: 'table' }
      },
      {
        path: 'edit/:id',
        name: 'EditUser',
        component: () => import('@/views/caouser/edit'),
        meta: { title: '编辑', icon: 'table' },
        hidden: true
      }
    ]
  },
  // 记录
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
        component: () => import('@/views/record/edit'),
        meta: { title: '新增', icon: 'table' }
      },
      {
        path: 'edit/:id',
        name: 'EditCaoRecord',
        component: () => import('@/views/record/edit'),
        meta: { title: '编辑', icon: 'table' },
        hidden: true
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
