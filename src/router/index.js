import Vue from 'vue'
import Router from 'vue-router'
import { pascalCaseToKebabCase } from '@/utils'

Vue.use(Router)

const componentsRoutes = [
  'Install', 'GetStarted', 'MazBtnDoc', 'MazInputDoc', 'MazSwitchDoc', 'MazSidebarDoc',
  'MazLoaderDoc', 'MazSpinnerDoc', 'MazCheckboxDoc', 'MazTransitionExpandDoc', 'MazDialogDoc',
  'MazSelectDoc'
]

const componentsRoutesBuild = componentsRoutes.map((route) => {
  const kebabCaseRouteName = route === 'Install' || route === 'GetStarted'
    ? pascalCaseToKebabCase(route)
    : pascalCaseToKebabCase(route).substring(4).slice(0, -4)
  return {
    path: kebabCaseRouteName,
    name: route,
    component: () => import(/* webpackChunkName: "documentation" */ `@/views/Documentation/views/${route}`)
  }
})

const router = new Router({
  // mode: 'history',
  base: process.env.NODE_ENV === 'production'
    ? '/vue-mazel-ui/'
    : '/',
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home')
    },
    {
      path: '/documentation',
      name: 'Documentation',
      redirect: { name: 'Install' },
      component: () => import(/* webpackChunkName: "documentation" */ '@/views/Documentation'),
      children: [
        ...componentsRoutesBuild
      ]
    },
    {
      path: '*',
      redirect: { name: 'Documentation' }
    }
  ]
})

export default router
