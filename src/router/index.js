import Vue from 'vue'
import Router from 'vue-router'
import { pascalCaseToKebabCase } from '@/utils'

Vue.use(Router)

const componentsRoutes = [
  'Install', 'GetStarted', 'MazInputDoc', 'MazSelectDoc', 'MazPhoneNumberInputDoc', 'MazDropzoneDoc', 'MazBtnDoc', 'MazBtnGroupDoc', 'MazSwitchDoc', 'MazCheckboxDoc', 'MazSidebarDoc',
  'MazPaginationDoc', 'MazLoaderDoc', 'MazSpinnerDoc', 'MazCollapseDoc', 'MazReadMoreDoc', 'MazResponsiveMenuDoc', 'MazTransitionExpandDoc', 'MazDialogDoc', 'MazFlexDoc'
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
    ? '/maz-ui/'
    : '/',
  routes: [
    {
      path: '/',
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
      path: '/made-with-maz-ui',
      name: 'MadeWithMazUi',
      component: () => import(/* webpackChunkName: "used-by" */ '@/views/MadeWithMazUi')
    },
    {
      path: '*',
      redirect: { name: 'Home' }
    }
  ]
})

export default router
