import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home')
    },
    {
      path: '/documentation',
      name: 'Documentation',
      component: () => import(/* webpackChunkName: "documentation" */ '@/views/Documentation'),
      children: [
        {
          path: 'install',
          name: 'Install',
          component: () => import(/* webpackChunkName: "documentation~install" */ '@/views/Documentation/views/Install')
        },
        {
          path: 'get-started',
          name: 'GetStarted',
          component: () => import(/* webpackChunkName: "documentation~get-started" */ '@/views/Documentation/views/GetStarted')
        },
        {
          path: 'maz-input',
          name: 'MazInputDoc',
          component: () => import(/* webpackChunkName: "documentation~maz-input" */ '@/views/Documentation/views/MazInputDoc')
        },
        {
          path: 'maz-switch',
          name: 'MazSwitchDoc',
          component: () => import(/* webpackChunkName: "documentation~maz-switch" */ '@/views/Documentation/views/MazSwitchDoc')
        },
        {
          path: 'maz-sidebar',
          name: 'MazSidebarDoc',
          component: () => import(/* webpackChunkName: "documentation~maz-sidebar" */ '@/views/Documentation/views/MazSidebarDoc')
        },
        {
          path: 'maz-loader',
          name: 'MazLoaderDoc',
          component: () => import(/* webpackChunkName: "documentation~maz-loader" */ '@/views/Documentation/views/MazLoaderDoc')
        }
      ]
    },
    {
      path: '*',
      redirect: { name: 'Home' }
    }
  ]
})

export default router
