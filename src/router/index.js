import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import { areParamsValid, adjustParamStore, isAllowedRoute } from './categoryParamHandlers.js'
import { useRouteParamsStore } from '@/store/routeParams.js'
import { useProductStore } from '@/store/product.js';
let routeParamsStore = null;
let productStore = null
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
        hasNavbarMobile: true,
        floatingNavbarMobile: false,
        floatingNavbar: false,
        floatingFooter: false,
        fullWidthPage: false,
        showRouterArrow: true
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
      component: () => import('../views/ProjectsView.vue'),
      meta: { 
        hasNavbar: false,
        hasFooter: false,
        hasNavbarMobile: true,
        floatingNavbarMobile: true,
        floatingNavbar: false,
        floatingFooter: false,
        fullWidthPage: true
      }
    },
    {
      path: '/projects/:category/:subcategory',
      name: 'projects',
      component: () => import('../views/SubcategoryProductView.vue'),
      meta: { 
        hasNavbar: true,
        hasFooter: true,
        hasNavbarMobile: true,
        floatingNavbarMobile: true,
        floatingNavbar: true,
        floatingFooter: true,
        fullWidthPage: true,
        showRouterArrow: false,
        showDropdown: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'home' }
    }
  ]
})
function catalogProductStore(query){
  console.log("QUERY")
  if(query?.category){
    productStore.categoryByIdentifier = query.category
    if(query?.subcategory){
      productStore.subcategoryByIdentifier = query.subcategory
    }
  } else {
    productStore.categoryByIdentifier = "tomato-project"
    productStore.subcategoryByIdentifier = "pasta-sauces"
  }

}
function adjustProductStore(params, query) {
  console.log("adjusting productstore", params, query)
  console.log("cat", productStore.categoryByIdentifier)
  console.log("subcat", productStore.subcategoryByIdentifier)
  console.log("product", productStore.productName)
  if(productStore.categoryByIdentifier !== params.category){
    console.log("adjusting categoryIdentifier: ", params.category)
    productStore.categoryByIdentifier = params.category
  }
  if(productStore.subcategoryByIdentifier !== params.subcategory){
    console.log("adjusting subcategoryIdentifier: ", params.subcategory)
    productStore.subcategoryByIdentifier = params.subcategory
  }
  if(query.productCode && (productStore.code !== query.productCode)){
    console.log("adjusting productName: ", query.productCode)
    productStore.productCodeByIdentifier = query.productCode
    
  }
}

router.beforeEach((to, from, next) => {
  try {
    console.log("ROUTE FROM:", from)
    console.log("ROUTE TO:", to, to.name, to.name === 'projects')

    // Singletons by design - no worry about reinstancing
    routeParamsStore = useRouteParamsStore()
    productStore = useProductStore()
    console.log("productstore", productStore)

    if (to.name === 'projects') {
      console.log("will check for allowed route")
      let parametersValidity = isAllowedRoute(to.params, to.query, routeParamsStore)
      console.log("areParamsValid", parametersValidity)
      if (!parametersValidity) {
        next({ name: 'projects', params: { category: "tomato-project", subcategory: "pasta-sauces" } })
      } else {
        adjustProductStore(to.params, to.query)
        productStore.selectedCategory = to.params.category
        next()
      }
    } else if (to.name === 'catalog'){ 
      catalogProductStore(to.query)
      next()
    } else if (to.name === 'not-found') {
      // If the route doesn't exist, redirect to home
      next({ name: 'home' })
    } else {
      next()
    }
  } catch (e) {
    console.log("Failed attempt to route", e)
    next({ name: 'home' })
  }
})

export default router
