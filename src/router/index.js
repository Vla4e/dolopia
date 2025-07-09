import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { handleProjectRouteParameters } from './routeParameterHandler';
import { handleProjectRouteParameters as RPH } from './rph';

import { useProductStoreCleanup } from '@/store/productCleanup';
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
      // Route for /projects, now loading ProjectsView directly
      path: '/projects',
      name: 'projects-overview',
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
      // Route for /projects/:category
      path: '/projects/:category',
      name: 'category-overview',
      component: () => import('../views/AllProductsView.vue'),
      props: true,
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
      // Route for /projects/:category/:subcategory
      path: '/projects/:category/:subcategory',
      name: 'subcategory-overview',
      component: () => import('../views/AllProductsView.vue'),
      props: true,
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
      // Route for individual products
      path: '/projects/:category/:subcategory/:product',
      name: 'projects',
      component: () => import('../views/ProductView.vue'),
      props: (route) => ({
        category: route.params.category,
        subcategory: route.params.subcategory,
        product: route.params.product,
      }),
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
      component: () => import('../views/AboutViewReworked.vue'),
      meta: { 
        hasNavbar: false,
        hasFooter: false,
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
});

router.beforeEach(async (to, from, next) => {
  console.log("Trying to go to", to)
  try {
    // This guard now specifically targets the detailed product route
    if (to.name === 'projects') {
      console.log("awaiting res")
      let productStore = useProductStoreCleanup();
      let resolution;
      if(productStore.getFlowType === 'old'){
        resolution = await RPH(to.params);
      } else resolution = await handleProjectRouteParameters(to.params);
      console.log("RES", resolution)
      switch (resolution.status) {
        case 'VALID':
          next();
          break;
        case 'REDIRECT':
          next(resolution.payload);
          break;
        case 'NOT_FOUND':
        default:
          next({ name: 'home' });
          break;
      }
    } else {
      console.log("Just nexting")
      // For all other routes, including the new category and subcategory overviews, proceed without this specific logic.
      next();
    }
  } catch (e) {
    console.error("Failed during routing:", e);
    next({ name: 'home' });
  }
});

export default router;