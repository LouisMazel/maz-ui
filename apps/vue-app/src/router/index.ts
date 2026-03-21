import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/color',
    name: 'color',
    component: () => import('../views/ColorView.vue'),
  },
  {
    path: '/component',
    name: 'component',
    component: () => import('../views/ComponentView.vue'),
  },
]
export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
