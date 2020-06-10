import Vue from 'vue'
import Router from 'vue-router'
import { pascalCaseToKebabCase } from '@/../utils'

Vue.use(Router)

const componentsRoutes = [
  'GetStarted',
  // 'CliInstall',
  'Theme',
  'Colors',
  'DarkMode',
  'MazBtnDoc',
  'MazBtnGroupDoc',
  'MazPhoneNumberInputDoc',
  'MazPickerDoc',
  'MazInputDoc',
  'MazInputTagsDoc',
  'MazSelectDoc',
  'MazSearchDoc',
  'MazSliderDoc',
  'MazSwitchDoc',
  'MazRadioDoc',
  'MazCheckboxDoc',
  'MazDropzoneDoc',
  'MazPlotlyDoc',
  'MazSidebarDoc',
  'MazDialogDoc',
  'MazAvatarDoc',
  'MazStepperDoc',
  'MazTabsLayoutDoc',
  'MazPaginationDoc',
  'MazLoaderDoc',
  'MazSpinnerDoc',
  'MazCollapseDoc',
  'MazListDoc',
  'MazDraggableListDoc',
  'MazReadMoreDoc',
  'MazResponsiveMenuDoc',
  'MazTransitionExpandDoc',
  'MazFlexDoc'
]

const isGeneralDoc = name => ['Install', 'GetStarted'].includes(name)
const isCliDoc = name => ['CliInstall'].includes(name)
const isThemeDoc = name => ['Theme', 'Colors', 'DarkMode'].includes(name)

const componentsRoutesBuild = componentsRoutes.map(route => {
  const kebabCaseRouteName =
    isGeneralDoc(route) || isCliDoc(route) || isThemeDoc(route)
      ? pascalCaseToKebabCase(route)
      : pascalCaseToKebabCase(route)
        .substring(4)
        .slice(0, -4)
  return {
    path: kebabCaseRouteName,
    name: route,
    component: () => {
      if (isGeneralDoc(route))
        return import(
          /* webpackChunkName: "[request]" */ `@/views/Documentation/views/general/${route}`
        )
      else if (isCliDoc(route))
        return import(
          /* webpackChunkName: "[request]" */ `@/views/Documentation/views/cli/${route}`
        )
      else if (isThemeDoc(route))
        return import(
          /* webpackChunkName: "[request]" */ `@/views/Documentation/views/theme/${route}`
        )
      else
        return import(
          /* webpackChunkName: "[request]" */ `@/views/Documentation/views/components/${route}`
        )
    }
  }
})

const router = new Router({
  // mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/maz-ui/' : '/',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home')
    },
    {
      path: '/documentation',
      name: 'Documentation',
      redirect: { name: 'GetStarted' },
      component: () =>
        import(/* webpackChunkName: "documentation" */ '@/views/Documentation'),
      children: [...componentsRoutesBuild]
    },
    {
      path: '/made-with-maz-ui',
      name: 'MadeWithMazUi',
      component: () =>
        import(/* webpackChunkName: "used-by" */ '@/views/MadeWithMazUi')
    },
    {
      path: '*',
      redirect: { name: 'Home' }
    }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

export default router
