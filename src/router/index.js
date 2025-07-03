import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { toRaw } from 'vue';

import { handleProjectRouteParameters } from './routeParameterHandler';

import { productMapByPath } from '@/assets/products/productMapByPath';
import { productMapByCode } from '@/assets/products/productMapByCode';
import { subcategoryToProductsMap } from '@/assets/products/subcategoryToProducts';
import { areParamsValid, adjustParamStore, isAllowedRoute } from './routeParameterHandlers.js';

import { useRouteParamsStore } from '@/store/routeParams.js';
import { useProductStore } from '@/store/product.js';
import { useProductStoreCleanup } from '@/store/productCleanup';
let routeParamsStore = null;
let productStore = null;
let productStoreCleanup = null;

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
        floatingNavbar: true,
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
      path: '/projects',
      redirect: { name: 'catalog' } // Redirects to the 'catalog' named route
    },
    { // projects/tomato/ketchup?product=CODE
      path: '/projects/:category/:subcategory/:product',
      name: 'projects',
      component: () => import('../views/ProductView.vue'),
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
      },
      props: (route) => ({
        category: route.params.category,
        subcategory: route.params.subcategory,
        product: route.params.product,
        // product: route.query.product
      })
    },
    {
      path: '/all-products', // Catches any /projects/anything that doesn't match above
      name: 'all-products',
      component: () => import('../views/AllProductsView.vue'), // Remove the redirect, use a component instead
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
      component: () => import('../views/AboutView.vue'),
      meta: { 
        hasNavbar: true,
        hasFooter: true,
        hasNavbarMobile: true,
        floatingNavbarMobile: true,
        floatingNavbar: true,
        floatingFooter: true,
        fullWidthPage: true,
        showRouterArrow: false,
        showDropdown: false
      }
    },
    {
      path: '/awards',
      name: 'awards',
      component: () => import('../views/AwardsView.vue'),
      meta: { 
        hasNavbar: true,
        hasFooter: true,
        hasNavbarMobile: true,
        floatingNavbarMobile: true,
        floatingNavbar: true,
        floatingFooter: true,
        fullWidthPage: true,
        showRouterArrow: false,
        showDropdown: false
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'home' }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  console.log("============= Beforeeach ==============", to)
  console.log("atm ->", to.path)
  try {
    console.log("Trying", to.name)
    if (to.name === 'projects' || to.name === 'projects-not-found'){
      console.log("IS to projects")
      // 1. Get the resolution from the handler.
      const resolution = await handleProjectRouteParameters(to.params);
      console.log("resolution -> ", resolution)
      // 2. Act based on the status. The handler deals with the store.
      switch (resolution.status) {
        case 'VALID':
          // The URL is correct and the store has been updated. Proceed.
          next();
          break;
        case 'REDIRECT':
          // The URL was invalid, redirect to the corrected one.
          next(resolution.payload);
          break;
        case 'NOT_FOUND':
        default:
          // A non-recoverable parameter was found, go home.
          next({ name: 'home' });
          break;
      }
    } else if (to.name === 'catalog') {
      console.log("NEXTING FOR CATALOG")
      next();
    } else {
      console.log("NEXTING FOR FOR ALL OTHER")
      // For all other routes, just proceed.
      next();
    }
  } catch (e) {
    console.error("Failed during routing:", e);
    next({ name: 'home' });
  }
});

export default router
