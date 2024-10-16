import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import { areParamsValid, adjustParamStore, isAllowedRoute } from './categoryParamHandlers.js'
import { useRouteParamsStore } from '@/store/routeParams.js'
let routeParamsStore = null;


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { 
        hasNavbar: true,
        hasFooter: true,
        floatingNavbar: false,
        floatingFooter: false,
        fullWidthPage: false
      }
    },
    {
      path: '/catalog',
      name: 'catalog',
      /*
        route level code-splitting with below arrow func
        this generates a separate chunk (CatalogView.[hash].js) for this route
        which is lazy-loaded when the route is visited. 
      */
      component: () => import('../views/CatalogView.vue'),
      meta: { 
        hasNavbar: false,
        hasFooter: false,
        floatingNavbar: false,
        floatingFooter: false,
        fullWidthPage: true
      }
    },
    {
      path: '/projects/:category/:subcategory',
      name: 'projects',
      component: () => import('../views/CategoryView.vue'),
      meta: { 
        hasNavbar: true,
        hasFooter: true,
        floatingNavbar: true,
        floatingFooter: true,
        fullWidthPage: true,
        showDropdownRouter: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})


router.beforeEach((to, from, next) => {
  try{
    console.log("ROUTE FROM:", from)
    console.log("ROUTE TO:", to, to.name, to.name === 'projects')
    if(!routeParamsStore){ // NOT NECESSARY, STORE IS INSTANTIATED ONCE AND CACHED, returned with lookup upon subsequent calls.
      routeParamsStore = useRouteParamsStore()
    }
    if(to.name === 'projects'){
      console.log("will check for allowed route")
      let parametersValidity = isAllowedRoute(to.params, to.query, routeParamsStore)
      console.log("areParamsValid", parametersValidity)
      // routeParamsStore.updateParams(structuredClone(to.params))
    }
    console.log("should go to next")
    next()
  } catch (e) {
    console.log("Failed attempt to route", e)
    next({name: ''})
  }
})

export default router
