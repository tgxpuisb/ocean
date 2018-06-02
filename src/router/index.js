import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import Index from '@/pages/Index'
import Ocean from '@/pages/Ocean'
import Meteorology from '@/pages/Meteorology'
import Fleet from '@/pages/Fleet'
import Shoals from '@/pages/Shoals'
import Login from '@/pages/Login'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {
          path: '',
          name: 'default',
          component: Ocean
        },
        {
          path: '/ocean',
          name: 'Ocean',
          component: Ocean
        },
        {
          path: 'meteorology',
          name: 'Meteorology',
          component: Meteorology
        },
        {
          path: 'fleet',
          name: 'Fleet',
          component: Fleet
        },
        {
          path: 'shoals',
          name: 'Shoals',
          component: Shoals
        },
        {
          path: 'info',
          name: 'Info',
          component: Shoals
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
